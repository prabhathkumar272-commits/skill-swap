# SkillSwap Campus

A student peer-learning prototype: students list skills they can teach and want to learn, discover complementary matches, send exchange requests, and arrange sessions.

## Stack

- Angular 17 frontend
- Express 4 API
- MongoDB with Mongoose
- JWT authentication and bcrypt password hashing

## Run locally

Requirements: Node.js 18+ and MongoDB.

1. Configure the API:
   - `cd skillswap-backend`
   - `npm install`
   - Copy `.env.example` to `.env` and set a private `JWT_SECRET` and `MONGO_URI`.
   - `npm run dev`
2. Run the frontend in a second terminal:
   - `cd skillswap-frontend`
   - `npm install`
   - `npm start`
3. Open http://localhost:4200. The API listens on port 5000 by default.

Never commit `.env` files or real credentials. Demo credentials in the seeder are for local development only. This is a portfolio prototype; payment processing and production deployment are not implemented.

## Current scope

Registration and sign-in, editable skill profiles, complementary skill matching, swap requests, and session scheduling. Matching requires a two-way skill overlap; it does not provide paid tutor search or payment handling.
