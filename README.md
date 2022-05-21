# MXquickconnect

MXquickconnect is a sample application which anyone can clone and use their MX client credentials to interface with common MX use cases. It is meant to help a developer see a sample of what MX has to offer while at the same time providing some frontend and backend code which can be extracted into any application.

First, create a .env file at the same level as the `.env.example`. Add your `CLIENT_ID` and `API_KEY`. You can find these values in your [MX Client Dashboard](https://dashboard.mx.com)

Open two terminals, one for the [frontend](#frontend) and one for the backend. You can choose to run **one** of the following backend implementations:
* [Ruby](#backend-ruby)
* [Node.js](#backend-nodejs)
* [Python3](#backend-python)
* [DotNet-Core](#backend-aspnet)
---
#### Backend (Python)
```bash
cd python
pip3 install -r requirements.txt
./start.sh
```
This app listens on port 8000.

---
#### Backend (Ruby)

```bash
cd ruby
bundle install
./start.sh
```
This app listens on port 8000.

---
#### Backend (Node.js)
```bash
cd mx-platform-node
npm install
npm start
```
This app listens on port 8000.

---
#### Backend (AspNet)

_Make sure you have `dotnet sdk 6` or later installed._

```bash
cd mx-platform-aspnet-core
dotnet add package MX.Platform.CSharp
dotnet run
```
This app listens on port 8000.

---
#### Frontend

_Make sure you have `npm version 7` or later installed._

```bash
cd frontend
npm install
npm start
```
This app listens on port 3000 and sends api requests to localhost port 8000.

---
