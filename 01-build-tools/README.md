# Module 01 – Build & Package Manager Tools

Hands-on work for the build tools module: building artifacts, managing dependencies, and running
Java (Gradle + Maven) and JavaScript (npm) applications.

## Projects

Each project has its own README with commands, structure and what I changed.

| Project | Build tool | Stack |
|---|---|---|
| [`java-gradle-app`](java-gradle-app) | Gradle 9.9 (wrapper) | Spring Boot 4.1, Java 21 |
| [`java-maven-app`](java-maven-app) | Maven | Spring Boot 4.1, Java 21 |
| [`react-nodejs-app`](react-nodejs-app) | npm (+ webpack, gulp, Vite) | React 19, Express 5, Node 24 |

## Modernizing the projects

These projects started out on ~2020–2021 tooling and no longer installed or built cleanly.
Upgrading them was a lesson in itself:

| Area | Original version | Updated to | Why / what changed |
|---|---|---|---|
| Java | 8 | **21 (LTS)** | Spring Boot 3+ requires Java 17+ |
| Spring Boot | 2.2 / 2.3 | **4.1** | `javax.*` → `jakarta.*` imports, `starter-web` → `starter-webmvc` |
| Gradle | 7.0 | **9.9** | Upgraded with `./gradlew wrapper --gradle-version 9.9.1` |
| Maven POM | versions pinned by hand | **`spring-boot-starter-parent`** | Parent POM manages dependency & plugin versions |
| JUnit | 4 | **5 (Jupiter)** | via `spring-boot-starter-test` |
| React | 16 (Create React App) | **19 (Vite)** | CRA is deprecated; 1,666 → 129 packages, 60+ → 0 vulnerabilities |
| Express API | 4 + nodemon | **5**, `node --watch` | 62 → 0 vulnerabilities; nodemon replaced by Node's built-in watcher |
| webpack / gulp | 4 / 4 | **5 / 5** | gulp 5 needs `{ encoding: false }` for binary files |
| Docker base images | `openjdk:8`, `node:10` | `eclipse-temurin:21-jre-alpine`, `node:24` | `openjdk` images are deprecated |

## Build Artifact

An **artifact** is the packaged, ready-to-run output of a build – the thing that gets deployed,
instead of the source code. Build once, then deploy the same artifact to every environment.

Artifacts I built from this module's projects:

| Project | Command | Artifact | Size |
|---|---|---|---|
| java-gradle-app | `./gradlew build` | `build/libs/java-app-1.0-SNAPSHOT.jar` | 19.5 MB |
| java-maven-app | `mvn package` | `target/java-maven-app-1.1.0-SNAPSHOT.jar` | 19.5 MB |
| react-nodejs-app (frontend) | `npm run build` | `my-app/build/` (static HTML/CSS/JS) | 0.5 MB |
| react-nodejs-app (API) | `npm run build` (webpack) | `api/server.bundle.js` | 0.6 MB |
| react-nodejs-app (full app) | `npx gulp` | `prod-build/react-nodejs.zip` | 0.3 MB |

What I learned:
- **Spring Boot jars are "fat jars"** – the app plus all its dependencies (Spring, embedded Tomcat) in one
  file, which is why they are ~19 MB and run with just `java -jar`. A `.jar` is a zip file: the compiled
  code is in `BOOT-INF/classes`, the dependencies in `BOOT-INF/lib`.
- **Gradle also produces a `-plain.jar`** – only my compiled classes, without dependencies. It can't run on
  its own; the fat jar is the one to deploy.
- **Gradle vs Maven:** same result, different conventions – Gradle outputs to `build/libs/`, Maven to `target/`.
- **JavaScript has no single standard artifact.** The React app compiles to static files, webpack bundles
  the Node server and its `node_modules` into one file, and gulp zips both into a deployable package.
- **webpack warning `Critical dependency: the request of a dependency is an expression`** comes from Express
  loading template engines by a name only known at runtime. This app doesn't use template engines, so the
  warning is harmless.
- **Artifacts are not committed to Git** (see `.gitignore`) – they are rebuilt from source and belong in
  an artifact repository, not in version control.

## Build Tools for Development

Every build tool pairs a **dependency file** with a **repository** it downloads from and a **local cache**:

| Tool | Dependency file | Repository | Local cache |
|---|---|---|---|
| Gradle | `build.gradle` | Maven Central | `~/.gradle/caches` |
| Maven | `pom.xml` | Maven Central | `~/.m2/repository` |
| npm | `package.json` (+ `package-lock.json`) | npm registry | `node_modules/` |

Adding a dependency – e.g. the `logstash-logback-encoder` used for JSON logging in `logback.xml`:
- **Gradle:** `implementation 'net.logstash.logback:logstash-logback-encoder:9.0'` in `build.gradle`, then `./gradlew build`
- **Maven:** a `<dependency>` block in `pom.xml`, then `mvn package` (or `mvn install`)
- **npm:** `npm install <package>` updates `package.json` and the lockfile; `--save-dev` for build-only tools like webpack

Versions managed by the Spring Boot parent / dependency-management plugin don't need a version number.

## Run the application

```bash
java -jar build/libs/java-app-1.0-SNAPSHOT.jar        # Gradle artifact
java -jar target/java-maven-app-1.1.0-SNAPSHOT.jar    # Maven artifact
npm start                                             # runs the "start" script from package.json
```
- A Java artifact only needs a **JRE** to run – Gradle/Maven are needed to build, not to run.
- `npm start`, `npm run build`, `npm run dev` just run the commands defined under `scripts` in `package.json`.
- Spring Boot apps start on port 8080 by default; the Express API listens on 3080.

## Build JavaScript applications

- **npm vs yarn** – both are package managers for the same registry; they install dependencies and run scripts,
  but they are not build tools on their own.
- **The lockfile** (`package-lock.json`) pins exact versions so every machine installs the same tree – commit it.
  `npm ci` installs strictly from it, which is what a CI server should use.
- **Bundlers** (webpack, Vite) do the actual build: transpile JSX, minify and bundle code into a few files.
- **Frontend and backend** can be packaged separately or together – here gulp zips both into one artifact.
- `npm pack` creates a `.tgz` of a package – the format that gets published to an npm registry.

## Other Programming Languages

The same pattern repeats everywhere – a dependency file, a central repository, and a tool to install and build:

| Language | Tool | Dependency file | Repository |
|---|---|---|---|
| Python | pip / Poetry / uv | `requirements.txt` / `pyproject.toml` | PyPI |
| Go | go modules | `go.mod` | module proxy |
| C# / .NET | dotnet / NuGet | `*.csproj` | nuget.org |
| Ruby | Bundler | `Gemfile` | RubyGems |
| Rust | Cargo | `Cargo.toml` | crates.io |

Learning one build tool well makes the others easy to pick up.

## Publish Artifact

After building, the artifact is **pushed to an artifact repository** so every environment pulls the same file:
- Repositories: Nexus, JFrog Artifactory, GitHub Packages, cloud registries (AWS CodeArtifact, Azure Artifacts)
- Commands: `./gradlew publish` (with the `maven-publish` plugin), `mvn deploy` (with `distributionManagement` in the POM), `npm publish`
- Credentials for the repository live in `~/.gradle/gradle.properties`, `~/.m2/settings.xml` or `.npmrc` – never in Git.

## Build Tools & Docker

With Docker, the **Docker image becomes the artifact** – no more separate jar/zip to copy to servers:
- [`java-gradle-app/Dockerfile`](java-gradle-app/Dockerfile) copies a jar that was built beforehand into a JRE-only image.
- [`react-nodejs-app/Dockerfile`](react-nodejs-app/Dockerfile) is a **multi-stage build**: `npm install` and
  `npm run build` run inside the image, so the build machine only needs Docker, not Node.
- Images are pushed to a Docker registry (Docker Hub, ECR, Nexus) instead of an artifact repository.
- Base images matter: `eclipse-temurin:21-jre-alpine` is much smaller than a full JDK image.

## Build Tools & DevOps

Developers use build tools locally; a DevOps engineer automates the same commands in a **CI/CD pipeline**:
1. Install dependencies and run tests (`./gradlew test`, `mvn test`, `npm test`)
2. Build the artifact / Docker image and give it a version
3. Push it to an artifact repository or Docker registry
4. Deploy it to the target environment

The [`Jenkinsfile`](java-maven-app/Jenkinsfile) in `java-maven-app` sketches these stages
(build jar → build image → deploy). So a DevOps engineer needs to know which build tool a project uses,
how to run its tests, and how to configure it – but not how to write the application code.

## Build & run

**Prerequisites:** JDK 21+, Maven, Node.js 24 (npm included). Gradle is not needed – the wrapper downloads it.

### Java – Gradle
```bash
cd java-gradle-app
./gradlew build                          # Windows: gradlew.bat build
java -jar build/libs/java-app-1.0-SNAPSHOT.jar
```
Artifact: `build/libs/java-app-1.0-SNAPSHOT.jar`

### Java – Maven
```bash
cd java-maven-app
mvn package
java -jar target/java-maven-app-1.1.0-SNAPSHOT.jar   # http://localhost:8080
```
Artifact: `target/java-maven-app-1.1.0-SNAPSHOT.jar`

### React + Node.js
```bash
# terminal 1 – API on port 3080 (auto-restarts on save)
cd react-nodejs-app/api && npm install && npm run dev

# terminal 2 – React dev server (proxies /api to 3080)
cd react-nodejs-app/my-app && npm install && npm start
```

Production build:
```bash
cd react-nodejs-app/my-app && npm run build   # React → my-app/build/
cd ../api && npm run build && npm start        # webpack bundles server.js → server.bundle.js
npx gulp                                       # full pipeline → ../prod-build/react-nodejs.zip
```

## Troubleshooting notes

- **`npm install` fails with `ECONNRESET`** – a network drop, not a project problem. Retry with
  `npm install --fetch-retries=6 --fetch-retry-mintimeout=5000 --maxsockets=4`.
- **`EPERM ... rmdir` during `npm install`** – another program (IDE indexer, antivirus) has a file in
  `node_modules` open. Close the IDE and retry.
- **"old lockfile" warning** – the lockfile was created by an older npm; it is upgraded automatically on install.
- **Running `npm install` in the wrong folder** creates an empty `package-lock.json` – always run it
  next to a `package.json`.
- **Port already in use** – Vite automatically picks the next free port and prints it.
