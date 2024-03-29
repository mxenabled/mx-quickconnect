# MXquickconnect

MXquickconnect is a sample application which anyone can clone and use their MX
client credentials to interface with common MX use cases using Platform API 
and the javascript widget. It is meant to help a developer see a sample of 
what MX has to offer while at the same time providing some frontend and backend 
code which can be extracted into any application.

:warning: **This is only for Platform API users**

## Table of contents

<!-- toc -->
- [1. Clone the repository](#1-clone-the-repository)
- [2. Set up development environment](#2-set-up-development-environment)
- [3. Run the MXquickconnect](#3-run-the-mxquickconnect)
  - [Run without Docker](#run-without-docker)
    - [1. Running the backend](#1-running-the-backend)
      * [Ruby](#backend-ruby)
      * [Node.js](#backend-nodejs)
      * [Python3](#backend-python)
      * [DotNet-Core](#backend-aspnet)
    - [2. Running the frontend](#2-running-the-frontend)
  - [Run with Docker](#run-with-docker)
<!-- tocstop -->

## 1. Clone the repository

Using ssh (recommended):
```bash
git clone git@github.com:mxenabled/mx-quickconnect.git
```

Using GibHub CLI:
```bash
gh repo clone mxenabled/mx-quickconnect
```

Using HTTPS:
```bash
git clone https://github.com/mxenabled/mx-quickconnect
```

## 2. Set up development environment

```bash
cp .env.example .env
```

Create a .env file at the same level as the `.env.example`.
Add your `CLIENT_ID` and `API_KEY`.
You can find these values in your [MX Client Dashboard][]

## 3. Run the MXquickconnect app

There are two ways of running this app: with or without Docker.
If you would like to orchestrate with Docker, skip to the
[Run with Docker](#run-with-docker) section below.

### Run without Docker

#### 1. Running the backend

You can choose to run **one** of the following backend implementations. Once
started the backend will be running on http://localhost:8000

---
#### Backend (Ruby)

```bash
cd ruby
bundle install
./start.sh
```

---
#### Backend (Node.js)
```bash
cd mx-platform-node
npm install
npm start
```

---
##### Backend (Python)
```bash
cd python
pip3 install -r requirements.txt
./start.sh
```

---
#### Backend (AspNet)

_Make sure you have `dotnet sdk 6` or later installed._

```bash
cd mx-platform-aspnet-core
dotnet add package MX.Platform.CSharp
dotnet run
```

---
#### 2. Running the frontend

The frontend will run on http://localhost:3000 and will send api requests to
http://localhost:8000.

_Make sure you have `npm version 7` or later installed._

```bash
cd frontend
npm install
npm start
```

---

### Run with Docker

_Make sure you have `docker comunity 20.10.13 ` and `docker compose 2.3.4`
or later installed._

Edit your `docker-compose.yml` file:
  1. Remove or comment out backends you would not like to run
  2. Uncomment the DOCKER_PROXY_URL that corresponds to the backend you're using
  3. Make sure you have at least one backend, one DOCKER_PROXY_URL, and the frontend

```bash
docker-compose up
```
Open your browser on http://localhost:3000 and enjoy!

  [MX Client Dashboard]: https://dashboard.mx.com "MX Client Dashboard"
