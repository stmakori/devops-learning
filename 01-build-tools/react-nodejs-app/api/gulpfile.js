const { src, dest, series, parallel } = require('gulp');
const fs   = require('fs');
const log = require('fancy-log');
const webpack = require('webpack');
const webpack_stream = require('webpack-stream');
const webpack_config = require('./webpack.config.js');
var exec = require('child_process').exec;

const paths = {
  prod_build: '../prod-build',
  server_file_name: 'server.bundle.js',
  react_src: '../my-app/build/**/*',
  react_dist: '../prod-build/my-app/build',
  zipped_file_name: 'react-nodejs.zip'
};

function clean()  {
  log('removing the old files in the directory')
  fs.rmSync(paths.prod_build, { recursive: true, force: true });
  return Promise.resolve();
}

function createProdBuildFolder() {

  const dir = paths.prod_build;
  log(`Creating the folder if not exist  ${dir}`)
  if(!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    log('📁  folder created:', dir);
  }

  return Promise.resolve('the value is ignored');
}

function buildReactCodeTask(cb) {
  log('building React code into the directory')
  return exec('cd ../my-app && npm run build', function (err, stdout, stderr) {
    log(stdout);
    log(stderr);
    cb(err);
  })
}

function copyReactCodeTask() {
  log('copying React code into the directory')
  // encoding: false keeps images and other binary files intact (gulp 5 reads files as text by default)
  return src(`${paths.react_src}`, { encoding: false })
        .pipe(dest(`${paths.react_dist}`));
}

function copyNodeJSCodeTask() {
  log('building and copying server code into the directory')
  return webpack_stream(webpack_config, webpack)
        .pipe(dest(`${paths.prod_build}`))
}

async function zippingTask() {
  log('zipping the code ')
  // gulp-zip 6 is an ES module, so it has to be loaded with import()
  const { default: zip } = await import('gulp-zip');
  const stream = src(`${paths.prod_build}/**`, { encoding: false })
      .pipe(zip(`${paths.zipped_file_name}`))
      .pipe(dest(`${paths.prod_build}`));
  // wait for the zip to be fully written before gulp marks the task done
  await require('stream/promises').finished(stream);
}

exports.default = series(
  clean,
  createProdBuildFolder,
  buildReactCodeTask,
  parallel(copyReactCodeTask, copyNodeJSCodeTask),
  zippingTask
);