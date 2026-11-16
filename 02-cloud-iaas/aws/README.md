# ☁️ Deploying on AWS

![AWS](https://img.shields.io/badge/AWS-EC2-FF9900?logo=amazonwebservices&logoColor=white)
![Ubuntu](https://img.shields.io/badge/Ubuntu-26.04_LTS-E95420?logo=ubuntu&logoColor=white)
![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk&logoColor=white)

How I launched an Ubuntu EC2 instance, locked it down with a Security Group, deployed
[java-react-app](../java-react-app) on it.

> 🔒 Screenshots have my account ID, email and home IP address blacked out.

---

## 1. Launch the EC2 instance

**AWS Console → EC2 → Launch instance**

| Setting | Value | Why |
|---|---|---|
| Name | `devops-learning` | Easy to find in the list |
| AMI | Ubuntu Server 26.04 LTS | Current long-term-support Ubuntu |
| Instance type | `t3.micro` (2 vCPU, 1 GiB) | Free-tier eligible; enough for one Java app |
| Key pair | new key pair `devops-aws`, type ED25519, `.pem` | Used to log in over SSH |
| Network settings | Allow SSH traffic from **My IP** | Only I can reach port 22 |

![Instance launched successfully](screenshots/01-launch-instance-summary.png)

![EC2 instance running with its public IPv4 address](screenshots/02-instance-running.png)

## 2. Allow SSH only from my IP

The launch wizard creates a Security Group. I checked that its SSH rule only allows my IP:

**EC2 → Instances → the instance → Security → Security group → Inbound rules**

![Security Group inbound rule: SSH (22) only from my IP](screenshots/03-sg-ssh-my-ip.png)

## 3. Connect over SSH

```bash
ssh -i ~/.ssh/devops-aws.pem ubuntu@<public-ip>
```

> **Windows tip:** if SSH refuses the key with `UNPROTECTED PRIVATE KEY FILE`, remove access for other
> users in PowerShell:
> `icacls devops-aws.pem /inheritance:r /grant:r "$($env:USERNAME):R"`

![Logged in to the instance over SSH](screenshots/04-ssh-connected.png)

## 4. Install Java

```bash
sudo apt update
sudo apt install -y openjdk-21-jre-headless
java -version
```

![Java 21 installed on the instance](screenshots/05-java-installed.png)

## 5. Build the jar and copy it to the server

On my machine:

```bash
cd 02-cloud-iaas/java-react-app
./gradlew build
scp -i ~/.ssh/devops-aws.pem build/libs/java-react-app-1.0.0.jar ubuntu@<public-ip>:~
```

![Copying the jar to the instance with scp](screenshots/06-scp-jar.png)

## 6. Run the app

> In the screenshot I ran the jar in the foreground with `sudo` from `/root`. That works, but the app then
> runs as **root**, and it stops when the SSH session closes. Running it as the normal `ubuntu` user with
> `nohup` (below) is the safer way.

```bash
nohup java -jar java-react-app-1.0.0.jar > app.log 2>&1 &
tail -f app.log            # Ctrl+C to stop watching; the app keeps running
```

![Spring Boot started on port 7071](screenshots/07-app-started.png)

## 7. Open port 7071 and view the app in the browser

**Security group → Edit inbound rules → Add rule**: type Custom TCP, port `7071`, source `0.0.0.0/0`
(or My IP to keep it private).

![Inbound rule for port 7071](screenshots/08-sg-port-7071.png)

Then open `http://<public-ip>:7071` for the React page, or `http://<public-ip>:7071/api/countries` for the raw API response:

![API response from the app running on EC2](screenshots/09-app-in-browser.png)

## 8. Clean up 💸

**EC2 → Instances → Instance state → Terminate instance.** Then check **Elastic IPs** and **Volumes** for
anything left over. A stopped instance still pays for its disk.

✅ I terminated the instance once the app was working, so it's no longer running or costing anything.

## 💡 What I learned

**Cloud servers**
- **IaaS gives me the server, not the setup.** AWS runs the hardware, but installing Java, opening ports
  and starting the app were all my job.
- A server only costs money while it exists, so I can launch one, use it, and terminate it the same day.
- **Stop ≠ terminate.** A stopped instance keeps its disk and still costs money. Terminating deletes it all.

**Security**
- **A Security Group is a firewall in front of the instance.** Nothing gets in unless an inbound rule
  allows it.
- **Port 22 should only be open to my own IP** (`x.x.x.x/32`). Port 7071 can be open to `0.0.0.0/0`
  because it's meant to be public.
- **Only open the ports you use.** The launch wizard also opened 80 and 443, which this app doesn't need.
- **The `.pem` key is the only way in.** Windows `ssh` refuses it until other users' access to the file
  is removed.
- **Don't run apps as root.** I first started the jar with `sudo` from `/root`. It worked, but if the app
  were compromised, the attacker would get root access.
- **Screenshots can leak data.** The AWS account ID shows in the instance ARN and as the Security Group
  "Owner", and my home IP shows in the SSH rule, so I blacked them out before publishing.

**Deploying the app**
- **One artifact, one copy.** Because Gradle builds the React frontend into the jar, deploying meant
  copying a single file with `scp`.
- **The server only needs a JRE** (`openjdk-21-jre-headless`). Gradle, Node and the JDK stay on my
  machine.
- **A process started over SSH stops when the session closes**, unless it runs with `nohup ... &`. For
  real deployments this is what systemd services or containers are for.
- **Use the full `http://` address.** The app has no TLS, so an `https://` address won't load. Browsers
  sometimes add `https://` automatically.

