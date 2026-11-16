# ☕ Java Maven App

![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1-6DB33F?logo=springboot&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-3.10-C71A36?logo=apachemaven&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-pipeline-D24939?logo=jenkins&logoColor=white)

A Spring Boot web app built with **Maven**. It serves a static welcome page and comes with a
`Jenkinsfile` that outlines a CI/CD pipeline for it.

---

## 📁 Project structure

```
java-maven-app/
├── pom.xml                       # Spring Boot parent, Java version, dependencies
├── Jenkinsfile                   # pipeline stages: build jar → build image → deploy
├── script.groovy                 # helper functions loaded by the Jenkinsfile
└── src/main/
    ├── java/com/example/Application.java
    └── resources/static/index.html   # served at http://localhost:8080
```

## 🚀 Quick start

```bash
mvn package
java -jar target/java-maven-app-1.1.0-SNAPSHOT.jar
```

Then open **http://localhost:8080**.

| Command | What it does |
|---|---|
| `mvn package` | Compile, test and package the fat jar into `target/` |
| `mvn test` | Run the tests only |
| `mvn install` | Package and copy the jar into the local repository (`~/.m2`) |
| `mvn dependency:tree` | Print the dependency tree |
| `mvn clean` | Delete the `target/` folder |

📦 **Artifact:** `target/java-maven-app-1.1.0-SNAPSHOT.jar` (~19.5 MB fat jar)

## 🔁 CI/CD pipeline

The [`Jenkinsfile`](Jenkinsfile) defines the stages a CI server runs on every change:

```
init  ──►  build jar  ──►  build image  ──►  deploy
```

The steps call functions from [`script.groovy`](script.groovy), which keeps the pipeline file short.
For now the stages only print what they would do. I'll fill them in when I get to the CI/CD module.

## 🔧 What I changed

| | Before | After |
|---|---|---|
| Java | 8 | **21 (LTS)** |
| Spring Boot | 2.x | **4.1** |
| Version management | each version pinned by hand | **`spring-boot-starter-parent`** manages them |
| Tests | JUnit 4 | **JUnit 5 (Jupiter)** |

## 💡 What I learned

- With the **parent POM**, most dependencies don't need a `<version>` because Spring Boot already knows
  which versions work together.
- Maven's lifecycle phases run in order: `mvn package` also runs `compile` and `test` first.
- `mvn install` puts the artifact in `~/.m2/repository`, where other local projects can use it as a dependency.

See the [module notes](../README.md) for the full write-up.
