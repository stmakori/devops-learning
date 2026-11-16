# ⚛️ React + Node.js App

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-24-5FA04E?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![webpack](https://img.shields.io/badge/webpack-5-8DD6F9?logo=webpack&logoColor=black)
![gulp](https://img.shields.io/badge/gulp-5-CF4647?logo=gulp&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-multi--stage-2496ED?logo=docker&logoColor=white)

A full-stack user manager: a **React** frontend where you add users and list them, and an
**Express** API that stores them in memory. In production the API also serves the built React app,
so everything runs from a single Node process on port **3080**.

---

## 🏗️ How it fits together

```
 ┌──────────────────────┐        /api/users  (GET)        ┌──────────────────────┐
 │  my-app  (React 19)  │  ───────────────────────────►   │  api  (Express 5)    │
 │  Vite dev server     │        /api/user   (POST)       │  port 3080           │
 └──────────────────────┘  ◄───────────────────────────   │  serves my-app/build │
                                                          └──────────────────────┘
```

| Endpoint | Method | Description |
|---|---|---|
| `/api/users` | `GET` | Return all users |
| `/api/user` | `POST` | Add a user – body: `{ "user": { ... } }` |
| `/` | `GET` | The built React app |

## 📁 Project structure

```
react-nodejs-app/
├── Dockerfile            # multi-stage: build React, then install the API
├── api/                  # Express backend
│   ├── server.js
│   ├── webpack.config.js # bundles the server + node_modules into server.bundle.js
│   └── gulpfile.js       # full build pipeline → prod-build/react-nodejs.zip
└── my-app/               # React frontend (Vite)
    └── src/
        ├── components/   # Header, CreateUser, Users, DisplayBoard
        └── services/UserService.js   # fetch calls to the API
```

## 🚀 Quick start (development)

```bash
# terminal 1 – API with auto-restart on save
cd api && npm install && npm run dev

# terminal 2 – React with hot reload (proxies /api to port 3080)
cd my-app && npm install && npm start
```

## 📦 Production build

```bash
cd my-app && npm run build      # React → my-app/build/
cd ../api && npm run build      # webpack → api/server.bundle.js
npm start                       # http://localhost:3080
npx gulp                        # everything zipped → ../prod-build/react-nodejs.zip
```

| Artifact | Built with | Size |
|---|---|---|
| `my-app/build/` | Vite | 0.5 MB |
| `api/server.bundle.js` | webpack | 0.6 MB |
| `prod-build/react-nodejs.zip` | gulp | 0.3 MB |

## 🐳 Docker

```bash
docker build -t stmakori/react-nodejs-app .
docker run -p 3080:3080 stmakori/react-nodejs-app
```

The build runs in two stages. The first builds the React app inside a `node:24` image. The second copies
only the built files and the API into the final image, so you don't need Node installed to build it.

## 🔧 What I changed

| | Before | After | Result |
|---|---|---|---|
| Frontend | React 16, Create React App | **React 19, Vite** | 1,666 → 129 packages, 60+ → 0 vulnerabilities |
| API | Express 4 + nodemon | **Express 5**, `node --watch` | 62 → 0 vulnerabilities |
| Bundling | webpack 4, gulp 4 | **webpack 5, gulp 5** | gulp 5 needs `{ encoding: false }` for images |
| Tests | Jest | **Vitest** | |
| Base image | `node:10` | **`node:24`** | |

See the [module notes](../README.md) for the full write-up and troubleshooting tips.
