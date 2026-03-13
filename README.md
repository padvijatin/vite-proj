# Vite-Proj

Full-stack MERN application with JWT authentication, protected admin routes, contact management, services listing, and a production-ready deployment setup.

## Overview
This project includes:
- React + Vite frontend
- Node.js + Express backend
- MongoDB Atlas database
- admin-only dashboard with nested routes
- protected CRUD for users, contacts, and services
- toast-based notifications
- deployment-ready environment configuration

## Core Features
- User registration and login
- JWT-based authentication
- Logged-in user prefill on contact form
- Public services page
- Admin route protection on frontend and backend
- Admin users management
- Admin contacts management
- Admin services management
- Loading, error, and empty states across admin pages

## Tech Stack

### Frontend
- React
- Vite
- React Router DOM
- React Toastify
- React Icons

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- bcrypt
- JSON Web Token
- zod

## Project Structure
```txt
client/
  src/
    components/
    pages/
    store/
    utils/
server/
  controllers/
  middlewares/
  models/
  router/
  utils/
```

## Environment Setup

### Frontend
Create `client/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

### Backend
Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
DB_TARGET=cloud
ALLOW_LOCAL_FALLBACK=false
MONGO_URI=your_encoded_mongodb_atlas_uri
JWT_SECRET=your_secret_key
CLIENT_ORIGIN=http://localhost:5173
```

Use the example files as reference:
- [client/.env.example](c:\React\Vite-Proj\client\.env.example)
- [server/.env.example](c:\React\Vite-Proj\server\.env.example)

## Local Development

### Frontend
```bash
cd client
npm install
npm run dev
```

### Backend
```bash
cd server
npm install
npm run dev
```

## Deployment

### Backend
- Render
- MongoDB Atlas

### Frontend
- Vercel

Production variables:

Frontend:
```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

Backend:
```env
NODE_ENV=production
DB_TARGET=cloud
ALLOW_LOCAL_FALLBACK=false
MONGO_URI=your_encoded_mongodb_atlas_uri
JWT_SECRET=your_strong_secret
CLIENT_ORIGIN=https://your-frontend-domain.com
```

## Pages
- `/`
- `/about`
- `/contact`
- `/service`
- `/register`
- `/login`
- `/logout`
- `/admin`
- `/admin/users`
- `/admin/services`
- `/admin/contacts`

## Admin Security
- frontend route guard redirects non-admin users to home
- backend verifies JWT before admin access
- backend checks admin role before protected admin controllers run

## Repository Notes
- Keep real secrets out of GitHub
- Use `.env.example` files as templates only
- Use live deployment URLs only after they are final

## Recommended GitHub Repo Description
Use this in GitHub repo settings:

```txt
Full-stack MERN app with JWT auth, protected admin dashboard, contact management, and services CRUD.
```

## Recommended Website / Repo Links Section
Once your live URLs are final, add these to the top of the README:

```txt
Frontend: https://your-frontend-domain.com
Backend: https://your-backend-domain.com
```

Do not keep placeholder URLs like `https://vite-proj-xxxx.vercel.app` in the final public README. Replace them with the actual deployed URL.

## Documentation
- [livedoc.md](c:\React\Vite-Proj\livedoc.md)

## Status
Project is feature-complete for:
- authentication
- admin route protection
- admin dashboard CRUD
- deployment preparation
