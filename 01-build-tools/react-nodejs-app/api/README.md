# 🟢 api (Express backend)

![Node.js](https://img.shields.io/badge/Node.js-24-5FA04E?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)

The REST API for the [React + Node.js app](../README.md). It keeps users in memory and, in production,
also serves the built React frontend from `../my-app/build`.

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Run `server.js` and restart on every save (`node --watch`) |
| `npm run build` | Bundle the server and its dependencies into `server.bundle.js` with webpack |
| `npm start` | Run the bundle on **http://localhost:3080** |
| `npx gulp` | Build everything and zip it into `../prod-build/react-nodejs.zip` |

| Endpoint | Method | Description |
|---|---|---|
| `/api/users` | `GET` | List all users |
| `/api/user` | `POST` | Add a user – body: `{ "user": { ... } }` |
