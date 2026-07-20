# Employee Console — Frontend (Prodigy_FS_02)

A React + Tailwind admin dashboard for the Employee Management REST API. Admins sign in, then create, search, edit, and delete employee records through a UI backed entirely by your `Prodigy_FS_02` API.

## Features

- JWT-based login/signup, session persisted across refresh
- Route guarding: non-admins are redirected to a clear "admin access required" screen instead of the dashboard
- Employee table with debounced search, pagination, and inline actions
- Slide-in drawer for creating and editing records, with server-side validation errors surfaced in the form
- Confirm dialog before delete
- Automatic logout if the token expires or is rejected (401)

## Tech Stack

React 18 · React Router · Axios · Vite · Tailwind CSS

## Setup

```bash
npm install
cp .env.example .env   # point VITE_API_URL at your running backend
npm run dev
```

The app expects your `Prodigy_FS_02` backend running (default `http://localhost:5000/api`). Update `VITE_API_URL` in `.env` if it's hosted elsewhere.

## Using it

1. Go to `/signup`, create an account (new accounts default to the `user` role).
2. In MongoDB Atlas, manually set that user's `role` field to `"admin"` — there's no self-service admin signup, by design.
3. Log in at `/login`. Non-admin accounts are redirected to an "admin access required" screen; admin accounts land on `/employees`.
4. Add, search, edit, and delete employee records from the dashboard.

## Build

```bash
npm run build
```

Outputs a production build to `dist/`.
