# ⚛️ my-app (React frontend)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-5-6E9F18?logo=vitest&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white)

The frontend for the [React + Node.js app](../README.md). It started out on Create React App and
I moved it to **Vite** because CRA is deprecated.

| Command | What it does |
|---|---|
| `npm install` | Install dependencies from `package.json` / `package-lock.json` |
| `npm start` | Dev server with hot reload; `/api` calls are proxied to the API on port 3080 |
| `npm test` | Run tests with Vitest |
| `npm run build` | Production build into `build/` (served by `../api/server.js`) |
| `npm run preview` | Serve the production build locally |
