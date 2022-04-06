# mx-quickstart

First, create a .env file at the same level as the `.env.example`. Add your `CLIENT_ID` and `API_KEY`. You can find these values in your [MX Client Dashboard](https://dashboard.mx.com)

Open two terminals, one for the frontend and one for the backend. You can choose to run **one** of the following backend implementations:
* Ruby
* Node.js

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
#### Frontend
```bash
cd frontend
npm install
npm start
```
This app listens on port 3000 and sends api requests to localhost port 8000.

---
#### Testing
```bash
rspec
```
