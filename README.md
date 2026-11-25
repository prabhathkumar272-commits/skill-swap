# SkillSwap Campus

<div align="center">

**Learn together. Teach what you know.**

A campus skill exchange for students to discover complementary skills, connect with peers, and schedule learning sessions.

<br />

![Angular 21](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-API-339933?logo=nodedotjs&logoColor=white)
![Express 4](https://img.shields.io/badge/Express-4-111111?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Auth](https://img.shields.io/badge/Auth-JWT%20%2B%20bcrypt-6B46C1)

</div>

---

## Overview

SkillSwap Campus helps students trade knowledge without payment. Create a profile with skills you can teach and want to learn, find peers with complementary interests, send swap requests, and coordinate sessions.

The application is split into an Angular single-page frontend and a Node.js/Express REST API backed by MongoDB.

## What you can do

- **Build a skill profile** with a bio, skills offered, skills wanted, and availability.
- **Find complementary matches** based on overlapping teach-and-learn interests.
- **Manage swap requests** by sending, accepting, or rejecting exchanges.
- **Schedule learning sessions** with a topic, date, time, meeting link, and notes.
- **Use protected pages and API routes** with JWT-based authentication.

## Stack

| Layer | Technologies |
| --- | --- |
| Frontend | Angular 21, TypeScript, RxJS, Angular Router |
| API | Node.js, Express 4 |
| Data | MongoDB, Mongoose 8 |
| Authentication | JWT, bcryptjs |
| Tooling | Angular CLI, npm, Nodemon |

## Get started

### Requirements

- Node.js **20.19+**, **22.12+**, or **24+**
- npm
- MongoDB running locally or a MongoDB connection string

### 1. Configure and start the API

In a terminal:

```bash
cd skillswap-backend
npm ci
```

Create `skillswap-backend/.env` from the example. In PowerShell:

```powershell
Copy-Item .env.example .env
```

Set a private `JWT_SECRET` in `.env`. The example uses a local MongoDB database at `mongodb://127.0.0.1:27017/skillswap`.

Start the API in development mode:

```bash
npm run dev
```

The API waits for MongoDB before listening at `http://localhost:5000`.

### 2. Start the frontend

Open a second terminal:

```bash
cd skillswap-frontend
npm ci
npm start
```

Open [http://localhost:4200](http://localhost:4200). The frontend sends API requests to `http://localhost:5000/api`.

### 3. Build the frontend

From `skillswap-frontend`:

```bash
npm run build
```

The production bundle is written to `skillswap-frontend/dist/`.

## Configuration

Set these variables in `skillswap-backend/.env`:

| Variable | Example | Purpose |
| --- | --- | --- |
| `PORT` | `5000` | API port |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/skillswap` | MongoDB connection string |
| `JWT_SECRET` | Generate a long random value | Signs authentication tokens |
| `CLIENT_ORIGIN` | `http://localhost:4200,http://127.0.0.1:4200` | Comma-separated origins permitted by CORS |

Keep real credentials in `.env`; do not commit them. The repository ignores local environment files and includes `.env.example` as a template.

## API reference

Base URL: `http://localhost:5000`

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `GET` | `/` | API health message | No |
| `POST` | `/api/register` | Create an account | No |
| `POST` | `/api/login` | Sign in | No |
| `GET` | `/api/users` | List users | Yes |
| `GET` | `/api/users/:id` | Get a user profile | Yes |
| `PUT` | `/api/users/:id` | Update your profile | Yes |
| `POST` | `/api/match` | Find complementary matches | Yes |
| `GET` | `/api/requests` | List your swap requests | Yes |
| `POST` | `/api/requests` | Send a swap request | Yes |
| `PUT` | `/api/requests/:id` | Accept or reject a request | Yes |
| `GET` | `/api/sessions` | List your sessions | Yes |
| `POST` | `/api/sessions` | Schedule a session | Yes |
| `PUT` | `/api/sessions/:id` | Update a session status | Yes |

Protected endpoints require a bearer token:

```http
Authorization: Bearer <token>
```

## Project layout

```text
.
├── skillswap-backend/
│   ├── config/       # Database connection
│   ├── middleware/   # JWT authentication
│   ├── models/       # User, request, and session schemas
│   ├── routes/       # Authentication and application endpoints
│   └── server.js
└── skillswap-frontend/
    └── src/app/
        ├── guards/   # Protected-route guard
        ├── pages/    # Home, auth, dashboard, profile, matches, requests, sessions
        └── services/ # API and authentication clients
```

## Scope and security

This repository is a portfolio prototype for peer learning and session coordination. It does not provide payments, paid tutor search, or a production deployment workflow. Review `skillswap-backend/seeder.js` before running seed data, and do not reuse demo credentials in real environments.

## License

No license file is included. Contact the project maintainers before reusing or redistributing this project.
