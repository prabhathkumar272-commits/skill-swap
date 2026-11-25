<div align="center">

# SkillSwap Campus

### Learn together. Teach what you know.

A campus peer-learning prototype that helps students find skill exchange partners, send swap requests, and arrange learning sessions.

<p>
  <img src="https://img.shields.io/badge/Angular-17-DD0031?logo=angular&logoColor=white" alt="Angular 17" />
  <img src="https://img.shields.io/badge/Node.js-API-339933?logo=nodedotjs&logoColor=white" alt="Node.js API" />
  <img src="https://img.shields.io/badge/Express-4-111111?logo=express&logoColor=white" alt="Express 4" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white" alt="MongoDB with Mongoose" />
  <img src="https://img.shields.io/badge/Auth-JWT%20%2B%20bcrypt-6B46C1" alt="JWT authentication with bcrypt" />
</p>

</div>

---

## Overview

SkillSwap Campus connects students who want to learn with peers who can teach. Members create profiles with skills they offer and want to learn, explore suggested matches, exchange requests, and schedule sessions.

The project has an Angular single-page frontend and a separate Express API backed by MongoDB. It is a portfolio prototype for peer-to-peer learning workflows.

## Features

- **Skill profiles** — manage a bio, skills offered, skills wanted, and availability.
- **Complementary matches** — compare offered and wanted skills, then rank people by the number of overlapping exchange opportunities.
- **Swap requests** — send a request with the skills being offered and requested, then accept or reject incoming requests.
- **Session scheduling** — create sessions with a topic, date, time slot, meeting link, and notes; update their status as scheduled, completed, or cancelled.
- **Protected pages** — dashboard, profile, matches, requests, and sessions are guarded by frontend authentication.
- **API authentication** — issue JWTs at registration and login, with passwords hashed using bcryptjs.

## Screenshots

No application screenshots are currently included in the repository. Add screenshots here when current captures are available.

## Technology stack

| Area | Technologies |
| --- | --- |
| Frontend | Angular 17, TypeScript, RxJS, Angular Router |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose 8 |
| Authentication | JSON Web Tokens, bcryptjs |
| Development | Angular CLI, Nodemon |

## Getting started

### Prerequisites

- Node.js 18.13+ or 20.9+
- npm
- MongoDB running locally or a MongoDB connection string

### 1. Configure and start the API

```bash
cd skillswap-backend
npm install
```

Copy `.env.example` to `.env`, then set a private `JWT_SECRET` and the desired `MONGO_URI`. For PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Start the API in development mode:

```bash
npm run dev
```

The API connects to MongoDB before listening. It uses port `5000` by default.

### 2. Start the frontend

In a second terminal, from the repository root:

```bash
cd skillswap-frontend
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200). The frontend calls the API at `http://localhost:5000/api` by default.

### 3. Build the frontend

From `skillswap-frontend`:

```bash
npm run build
```

## Environment variables

Configure these in `skillswap-backend/.env`:

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `5000` | API port |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/skillswap` | MongoDB connection string |
| `JWT_SECRET` | No production default | Secret used to sign authentication tokens; set a long, random value |
| `CLIENT_ORIGIN` | `http://localhost:4200` | Allowed frontend origin for CORS |

Never commit `.env` files or real credentials. The repository includes `.env.example` with local-development defaults.

## API overview

Base URL: `http://localhost:5000`

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/` | API status message |
| `POST` | `/api/register` | Create an account and return a token |
| `POST` | `/api/login` | Authenticate and return a token |
| `GET` | `/api/users` | List users (authentication required) |
| `GET` | `/api/users/:id` | Retrieve a user profile |
| `PUT` | `/api/users/:id` | Update the signed-in user's profile |
| `POST` | `/api/match` | Find users with overlapping offer/wanted skills |
| `GET` | `/api/requests` | List requests involving the signed-in user |
| `POST` | `/api/requests` | Send a skill swap request |
| `PUT` | `/api/requests/:id` | Accept or reject a request |
| `GET` | `/api/sessions` | List sessions for the signed-in user |
| `POST` | `/api/sessions` | Schedule a session |
| `PUT` | `/api/sessions/:id` | Update a session status |

Protected API routes expect a bearer token in the `Authorization` header:

```http
Authorization: Bearer <token>
```

## Repository structure

```text
.
├── skillswap-backend/
│   ├── config/       # MongoDB connection
│   ├── middleware/   # JWT authentication
│   ├── models/       # User, request, and session schemas
│   ├── routes/       # Auth, users, matches, requests, and sessions
│   └── server.js
└── skillswap-frontend/
    └── src/app/
        ├── guards/   # Route authentication guard
        ├── pages/    # Home, auth, dashboard, profile, matches, requests, sessions
        └── services/ # API and authentication services
```

## Project scope

SkillSwap Campus demonstrates peer skill discovery and session coordination. It does not implement payments, paid tutor search, or a production deployment workflow. Review the seeded demo accounts in `skillswap-backend/seeder.js` before sharing a running instance, and never reuse demo credentials in a real environment.

## License

No license file is currently included. Contact the project maintainers before reusing or redistributing this work.
