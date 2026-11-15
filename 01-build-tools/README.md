# Module 01 – Build & Package Manager Tools

Hands-on work for the build tools module: building artifacts, managing dependencies, and running
Java (Gradle + Maven) and JavaScript (npm) applications.

## Projects

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
