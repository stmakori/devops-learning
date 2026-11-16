# 🌍 Java + React App

![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1-6DB33F?logo=springboot&logoColor=white)
![Gradle](https://img.shields.io/badge/Gradle-9.9-02303A?logo=gradle&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)

A Spring Boot API with a React frontend, packaged into **one runnable jar**. This is the app I deploy to
a cloud server on [AWS EC2](../aws) in this module.

The page loads a list of European countries from the Java API and lets you filter it as you type.

---

## 🏗️ How it fits together

```
 ./gradlew build
   ├── npmInstall      Gradle downloads Node 24 and runs `npm ci` in frontend/
   ├── buildFrontend   Vite builds React → frontend/dist/
   ├── processResources  copies frontend/dist → static/ inside the jar
   ├── test            JUnit 5 + MockMvc test for the API
   └── bootJar         → build/libs/java-react-app-1.0.0.jar
```

At runtime, Spring Boot on port **7071** serves both parts:

| Path | What it is |
|---|---|
| `/` | React app (static files from the jar) |
| `/api/countries` | `GET` – `{ "countries": ["Albania", ...] }` |

## 📁 Project structure

```
java-react-app/
├── build.gradle              # Spring Boot + node-gradle plugin
├── src/main/java/com/example/
│   ├── Application.java
│   └── country/CountriesController.java   # GET /api/countries
├── src/main/resources/application.yml     # port 7071, gzip compression
├── src/test/java/...                      # API test
└── frontend/                 # React 19 + Vite
    ├── index.html
    └── src/
        ├── App.jsx                       # fetches the countries
        └── components/FilterableList.jsx
```

## 🚀 Quick start

The only requirement is **JDK 21+**. Gradle and Node are downloaded automatically.

```bash
./gradlew build                                   # Windows: gradlew.bat build
java -jar build/libs/java-react-app-1.0.0.jar
```

Open **http://localhost:7071**.

📦 **Artifact:** `build/libs/java-react-app-1.0.0.jar` (~20 MB, frontend included)

### Frontend development with hot reload

```bash
java -jar build/libs/java-react-app-1.0.0.jar     # API on 7071
cd frontend && npm run dev                        # Vite on 5173, proxies /api to 7071
```

## 🔧 What I changed

This app's original version was from around 2017–2022 and could no longer be built or run in a current browser.

| | Before | After | Why |
|---|---|---|---|
| Java | 8 | **21 (LTS)** | Spring Boot 4 needs Java 17+ |
| Spring Boot | 2.6 | **4.1** | `starter-web` → `starter-webmvc` |
| Gradle | 7.4, `buildscript {}` | **9.9**, `plugins {}` | Gradle 9 removed the old `sourceCompatibility` syntax |
| React | 15, loaded from a CDN and compiled **in the browser** by Babel + SystemJS | **19, built with Vite** | Compiling in the browser is slow, and those libraries aren't maintained any more |
| State | Redux + redux-thunk | **React hooks** (`useState`, `useEffect`) | One list and one filter don't need a global store |
| Frontend build | none | **Gradle runs npm** (node-gradle plugin) | One command builds the whole app |
| Tests | Spock (Groovy) | **JUnit 5 + MockMvc** | Same check, no extra Groovy dependency |
| Jars | fat jar + `-plain` jar | **fat jar only** | Only one jar in `build/libs`, so you can't copy the wrong one to the server |
| Data | `Arrays.asList` in a class | Java **record** + `List.of` | Less code, and the list can't be changed |

## 💡 What I learned

- **Gradle can build a JavaScript frontend too.** The node-gradle plugin downloads its own Node, so the
  build machine (or CI server) only needs a JDK.
- **Spring Boot serves anything in `static/`**, so packaging the built React files into the jar
  gives you one artifact to deploy, instead of two apps.
- `npm ci` (not `npm install`) in a build installs exactly what's in `package-lock.json`, so every
  build uses the same versions.
