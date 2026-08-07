# FarmConnect

FarmConnect is a full stack web app that connects livestock owners with feed suppliers. Owners can
register their livestock and request feed, and suppliers can list feed products and approve or
reject incoming requests.

Built with the MERN stack — MongoDB, Express, React, Node.js — written entirely in **TypeScript**.

## Project structure

```
farmconnect-mern/
├── backend/     Express REST API + MongoDB models (TypeScript, compiled with tsc)
└── frontend/    React app (Vite + TypeScript, .tsx components)
```

## Features

- Signup/login with JWT authentication
- Two roles: Owner and Supplier, each with their own dashboard
- Owners can add/edit/delete livestock records with a photo/document attachment
- Owners can browse available feed and submit a request against their livestock
- Owners can track their requests (pending / approved / rejected)
- Suppliers can add/edit/delete feed listings
- Suppliers can view all incoming requests and approve or reject them (with a reason)
- Forgot password flow (verify email, then reset)

## Getting started

### Prerequisites

- Node.js 18+
- A MongoDB database (local `mongod` or a free MongoDB Atlas cluster)

### 1. Backend

```bash
cd backend
npm install
```

Update `backend/.env` with your own values if needed:

```
FRONT_END_URL=http://localhost:5173
SERVER_PORT=8080
SECRET_KEY=change-this-secret
```

Run the server (uses `ts-node` + `nodemon`, no manual build step needed in dev):

```bash
npm run dev
```

The API starts on `http://localhost:8080`.

Other useful scripts:

```bash
npm run typecheck   # run tsc --noEmit to check types without building
npm run build        # compile TypeScript to backend/dist
npm start            # run the compiled backend/dist/index.js (after build)
```

### 2. Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173`. It talks to the API at `http://localhost:8080` by default —
override with a `VITE_API_URL` env variable if your backend runs elsewhere.

Run `npm run typecheck` any time to run the TypeScript project-references check (`tsc -b --noEmit`)
without producing a build.

### 3. Try it out

1. Go to `http://localhost:5173`
2. Sign up, choosing either **Owner** or **Supplier** as your role
3. Log in and you'll land on the dashboard for that role

## Tech stack

**Frontend:** React, TypeScript, React Router, Axios, React Toastify, Bootstrap 5, Bootstrap Icons, Vite

**Backend:** Node.js, TypeScript, Express, MongoDB, Mongoose, JWT, bcrypt, Multer

## Build for production

```bash
cd frontend
npm run build
```

Output goes to `frontend/dist` — deploy it with any static host, and set `VITE_API_URL` to your
deployed backend URL before building.

## Notes

- Uploaded livestock attachments are stored in `backend/uploads/` — make sure this folder exists
  and is writable wherever you deploy
- Password rule: 8+ characters, one uppercase, one lowercase, one number, one special character

## Known issues / things I'd fix with more time

- Old attachment files aren't deleted from `backend/uploads/` when a livestock record is updated with a new file — just accumulates over time
- Forgot password just checks if the email exists and lets you reset immediately, no OTP or reset link/token with expiry. Not secure enough for a real production app
- No rate limiting on login or reset password, so it's open to brute force right now
- Pagination on the request/feed/livestock list pages is done client side (fetch everything, then slice for the current page) — works fine for small data but won't scale
- No duplicate-request check, so an owner could submit the same feed request more than once
- Haven't really tested below ~768px width, tables need a mobile layout
- Password validation regex is duplicated in both the frontend (Signup.tsx) and backend (userController.ts) — should be a shared constant
- No automated tests yet

## Future improvements

- [ ] Move file upload cleanup so old attachments get deleted on update/delete
- [ ] Proper OTP-based or token-based password reset with expiry
- [ ] Server-side pagination for list views
- [ ] Add loading spinners instead of blank tables while data is fetching
- [ ] Mobile-responsive table views (probably card layout under 768px)
- [ ] Basic test coverage for the auth flow and request approval flow
- [ ] Maybe move manual form validation into a shared hook, it's repeated across a few components
- [ ] Email notifications when a request is approved/rejected

