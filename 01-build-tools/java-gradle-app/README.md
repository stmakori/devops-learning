# ☕ Java Gradle App

![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1-6DB33F?logo=springboot&logoColor=white)
![Gradle](https://img.shields.io/badge/Gradle-9.9-02303A?logo=gradle&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-manifest-326CE5?logo=kubernetes&logoColor=white)

A minimal Spring Boot service built with the **Gradle wrapper**. It writes structured JSON logs
and is packaged three ways: as a fat jar, as a Docker image, and as a Kubernetes Deployment.

---

## 📁 Project structure

```
java-gradle-app/
├── build.gradle                  # plugins, Java version, dependencies
├── settings.gradle               # project name
├── gradlew / gradlew.bat         # Gradle wrapper – no local Gradle install needed
├── Dockerfile                    # JRE-only runtime image
├── deployment.yaml               # Kubernetes Deployment
└── src/main/
    ├── java/com/example/App.java
    └── resources/
        ├── application.properties
        └── logback.xml           # JSON logging via logstash-logback-encoder
```

## 🚀 Quick start

```bash
./gradlew build                                   # Windows: gradlew.bat build
java -jar build/libs/java-app-1.0-SNAPSHOT.jar    # starts on port 8080
```

| Command | What it does |
|---|---|
| `./gradlew build` | Compile, test and package the fat jar |
| `./gradlew test` | Run the unit tests only |
| `./gradlew dependencies` | Print the dependency tree |
| `./gradlew clean` | Delete the `build/` folder |

📦 **Artifact:** `build/libs/java-app-1.0-SNAPSHOT.jar` (~19.5 MB fat jar)

## 🐳 Docker

```bash
./gradlew build                                   # the Dockerfile copies the jar that was built beforehand
docker build -t stmakori/demo-app:java-1.0 .
docker run -p 8080:8080 stmakori/demo-app:java-1.0
docker push stmakori/demo-app:java-1.0
```

The image is based on `eclipse-temurin:21-jre-alpine`, which only contains a Java runtime and is much
smaller than a full JDK image.

## ☸️ Kubernetes

[`deployment.yaml`](deployment.yaml) runs one replica of the image on port 8080 and pulls it from a
private registry using the `myregistrysecret` image-pull secret.

```bash
kubectl apply -f deployment.yaml
```

## 🔧 What I changed

| | Before | After |
|---|---|---|
| Java | 8 | **21 (LTS)** |
| Spring Boot | 2.x | **4.1** (`javax.*` → `jakarta.*`, `starter-web` → `starter-webmvc`) |
| Gradle wrapper | 7.0 | **9.9** (`./gradlew wrapper --gradle-version 9.9.1`) |
| Plugin syntax | `buildscript {}` + `apply plugin` | **`plugins {}` block** |
| Dependencies | `compile` / `testCompile` | **`implementation` / `testImplementation`** |
| Base image | `openjdk:8` (deprecated) | **`eclipse-temurin:21-jre-alpine`** |

## 💡 What I learned

- The **wrapper** pins the Gradle version in `gradle/wrapper/gradle-wrapper.properties`, so every
  machine and CI server builds with the same version.
- Gradle produces two jars: the runnable **fat jar** and a `-plain.jar` that holds only my classes.
- To run the jar you only need a **JRE**. Gradle is needed only for the build.

See the [module notes](../README.md) for the full write-up.
