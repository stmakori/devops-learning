# Module 02 – Cloud & Infrastructure as a Service

Creating a Linux server in the cloud, securing it with firewall rules, deploying a Java application
on it, all on **AWS EC2**.

| Guide | What's inside |
|---|---|
| [☁️ AWS walkthrough](aws) | EC2 instance, Security Group, deployment |
| [🌍 java-react-app](java-react-app) | The app I deploy: Spring Boot API + React frontend in one jar, port 7071 |

## Cloud & IaaS in a nutshell

**Infrastructure as a Service (IaaS)** means renting virtual servers, storage and networks from a cloud
provider instead of buying and running physical hardware. You get a server in a minute, pay only while it
exists, and delete it when you no longer need it. The provider handles the hardware. You still handle the
operating system, security updates, firewall and the apps running on the server.

| | On-premises | IaaS | PaaS | SaaS |
|---|---|---|---|---|
| Hardware | **You** | Provider | Provider | Provider |
| Operating system | **You** | **You** | Provider | Provider |
| Runtime (Java, Node) | **You** | **You** | Provider | Provider |
| Application | **You** | **You** | **You** | Provider |

## Key AWS terms

| Concept | AWS name |
|---|---|
| Virtual server | EC2 instance |
| Server size | Instance type (e.g. `t3.micro`) |
| OS image | AMI (Amazon Machine Image), e.g. Ubuntu Server 26.04 LTS |
| Firewall | Security Group |
| Firewall rule | Inbound rule |
| Private network | VPC (Virtual Private Cloud) |
| Default SSH user (Ubuntu) | `ubuntu` |
| Login key | Key pair (`.pem`) |

## Progress

**Introduction to Cloud & IaaS**
- [x] Learned the concepts (notes above)

**Set up a server**
- [x] Created an AWS account (free tier)
- [x] Launched a Linux server (EC2 instance)
- [x] Added a firewall rule that opens port 22 only for my IP
- [x] Connected to the server over SSH
- [x] Installed Java on the server

**Deploy the application**
- [x] Built the jar with Gradle ([java-react-app](java-react-app))
- [x] Copied the jar to the server with `scp`
- [x] Ran the app on the server
- [x] Added a firewall rule for port 7071 and opened the app in the browser
