# Live Documentation

## 1. Project Summary
This project is a full-stack MERN-style application with:
- `client/`: React + Vite frontend
- `server/`: Express + MongoDB backend

The current application includes:
- user registration and login
- JWT-based authentication
- protected user profile fetch
- contact form submission
- public services listing
- admin-only area with nested routes
- admin users management
- admin contacts management
- admin services management
- toast-based feedback
- frontend route protection for admin pages
- deployment-ready env-based API configuration

---

## 2. Tech Stack

### Frontend
- React
- React Router DOM
- Vite
- React Toastify
- React Icons
- Context API for auth state

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token (`jsonwebtoken`)
- bcrypt
- zod
- dotenv
- cors

---

## 3. Current Folder Responsibility

### Frontend
- `client/src/pages`
  - page-level UI and page-specific API calls
- `client/src/components`
  - shared UI and route wrappers
- `client/src/store`
  - auth context and shared auth state
- `client/src/utils`
  - helper utilities like toast helpers and API base URL generation

### Backend
- `server/router`
  - route definitions
- `server/controllers`
  - business logic
- `server/models`
  - mongoose schemas and model methods
- `server/middlewares`
  - auth, validation, admin protection, error handling
- `server/utils`
  - database connection logic

---

## 4. Frontend Architecture

### 4.1 Main App Routing
File:
- [App.jsx](c:\React\Vite-Proj\client\src\App.jsx)

Main responsibilities:
- mount public routes
- mount admin routes
- apply `AdminRoute` guard before admin pages
- render `Navbar`, `Footer`, and `ToastContainer`

Current route structure:
```jsx
<Route path="/" element={<Home />} />
<Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />
<Route path="/service" element={<Service />} />
<Route path="/register" element={<Register />} />
<Route path="/login" element={<Login />} />
<Route path="/logout" element={<Logout />} />

<Route element={<AdminRoute />}>
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminHome />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="services" element={<AdminServices />} />
    <Route path="contacts" element={<AdminContacts />} />
  </Route>
</Route>
```

Meaning:
- all admin pages are nested under `/admin`
- all admin pages render inside `AdminLayout`
- only verified admin users can access them

---

## 5. Auth Context and Frontend Auth Flow

File:
- [auth.jsx](c:\React\Vite-Proj\client\src\store\auth.jsx)

### 5.1 What `AuthProvider` stores
The auth context currently provides:
- `token`
- `authorizationToken`
- `user`
- `services`
- `isLoggedIn`
- `isAuthLoading`
- `storeTokenInLS()`
- `logoutUser()`

### 5.2 What each value means
- `token`
  - raw JWT from localStorage
- `authorizationToken`
  - formatted auth header value
  - shape:
  ```js
  const authorizationToken = `Bearer ${token}`;
  ```
- `user`
  - logged-in user object returned by `/api/auth/user`
- `services`
  - public service data fetched from backend
- `isLoggedIn`
  - `true` if token exists
- `isAuthLoading`
  - `true` while auth verification is still in progress

### 5.3 Auth flow
1. token is read from localStorage
2. `userAuthentication()` calls:
```txt
/api/auth/user
```
3. backend validates token
4. backend returns `userData`
5. context stores `user`
6. admin route guard uses `user.isAdmin`

### 5.4 Why `isAuthLoading` was added
Without it, admin pages could render before auth finished loading.

Now the flow is:
- loading -> wait
- not admin -> redirect home
- admin -> render admin pages

---

## 6. Frontend API Base URL

File:
- [api.js](c:\React\Vite-Proj\client\src\utils\api.js)

Purpose:
- remove hardcoded localhost URLs
- make hosting easy

Current helper:
```js
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(
  /\/$/,
  ""
);

export const apiUrl = (path) => `${API_BASE_URL}${path}`;
```

Meaning:
- local dev works without extra setup
- production uses `VITE_API_BASE_URL`

Example:
```js
fetch(apiUrl("/api/auth/login"))
```

---

## 7. Frontend Pages

### 7.1 Register Page
File:
- [Register.jsx](c:\React\Vite-Proj\client\src\pages\Register.jsx)

Features:
- controlled form
- frontend validation
- loading state
- toast notifications
- stores token after success

Register request:
```txt
POST /api/auth/register
```

Validation rules:
- username required, min 3
- email required, valid format
- phone required, 10 digits
- password required, min 6

### 7.2 Login Page
File:
- [Login.jsx](c:\React\Vite-Proj\client\src\pages\Login.jsx)

Features:
- controlled form
- frontend validation
- loading state
- backend error handling
- stores token on success

Login request:
```txt
POST /api/auth/login
```

### 7.3 Contact Page
File:
- [Contact.jsx](c:\React\Vite-Proj\client\src\pages\Contact.jsx)

Features:
- auto-fills `username` and `email` from logged-in user
- message-only clear after submit
- loading state with spinner
- toast success/error

Contact request:
```txt
POST /api/form/contact
```

### 7.4 Service Page
File:
- [Service.jsx](c:\React\Vite-Proj\client\src\pages\Service.jsx)

Features:
- reads service data from auth context
- uses public service fetch handled in `auth.jsx`

---

## 8. Admin Frontend

### 8.1 Admin Route Protection
File:
- [AdminRoute.jsx](c:\React\Vite-Proj\client\src\components\AdminRoute.jsx)

Purpose:
- stop non-admin users from entering admin routes

Logic:
```jsx
if (isAuthLoading) return loading-ui;
if (!isLoggedIn || !user?.isAdmin) return <Navigate to="/" replace />;
return <Outlet />;
```

This is frontend protection only.
Real security is still enforced on the backend.

### 8.2 Admin Layout
File:
- [Admin-Layout.jsx](c:\React\Vite-Proj\client\src\components\Layouts\Admin-Layout.jsx)

Responsibilities:
- render sidebar nav
- render signed-in user info
- render top bar
- render nested child pages via `Outlet`

Navigation links:
- Home
- Users
- Services
- Contacts

### 8.3 Admin Home
File:
- [Admin-Home.jsx](c:\React\Vite-Proj\client\src\pages\Admin-Home.jsx)

Purpose:
- landing screen for admin area
- summary cards and overview copy

### 8.4 Admin Users
File:
- [Admin-users.jsx](c:\React\Vite-Proj\client\src\pages\Admin-users.jsx)

Current capabilities:
- fetch all users
- loading state
- error state
- empty state
- refresh button
- edit existing user
- delete user
- admin badge display
- selected row highlight during edit

Used backend routes:
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id`
- `DELETE /api/admin/users/:id`

### 8.5 Admin Contacts
File:
- [Admin-Contacts.jsx](c:\React\Vite-Proj\client\src\pages\Admin-Contacts.jsx)

Current capabilities:
- fetch all contacts
- loading state
- error state
- empty state
- refresh button
- edit contact
- delete contact
- auto-scroll to edit form
- selected row highlight during edit

Used backend routes:
- `GET /api/admin/contacts`
- `PATCH /api/admin/contacts/:id`
- `DELETE /api/admin/contacts/:id`

### 8.6 Admin Services
File:
- [Admin-Services.jsx](c:\React\Vite-Proj\client\src\pages\Admin-Services.jsx)

Current capabilities:
- fetch all services
- loading state
- error state
- empty state
- refresh button
- edit service
- delete service
- auto-scroll to edit form
- selected row highlight during edit

Used backend routes:
- `GET /api/admin/services`
- `PATCH /api/admin/services/:id`
- `DELETE /api/admin/services/:id`

---

## 9. Toast System

Files:
- [toast.js](c:\React\Vite-Proj\client\src\utils\toast.js)
- [App.jsx](c:\React\Vite-Proj\client\src\App.jsx)
- [index.css](c:\React\Vite-Proj\client\src\index.css)

How it is used:
- validation errors
- request loading states
- success messages
- failure messages

Patterns used:
- `showLoadingToast()`
- `showErrorToast()`
- `updateToastSuccess()`
- `updateToastError()`

This avoids repeated `alert()` calls and keeps UX consistent.

---

## 10. Backend Architecture

### 10.1 Server Entry
File:
- [server.js](c:\React\Vite-Proj\server\server.js)

Responsibilities:
- load `.env`
- configure CORS
- enable JSON body parsing
- mount routes
- register error middleware
- connect DB
- start server

Mounted routes:
- `/api/auth`
- `/api/form`
- `/api/data`
- `/api/admin`

### 10.2 CORS
Current CORS is env-driven:
```js
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
```

Meaning:
- production frontend domains should be listed in `CLIENT_ORIGIN`
- requests from unknown origins are rejected

---

## 11. Database Connection Logic

File:
- [db.js](c:\React\Vite-Proj\server\utils\db.js)

Purpose:
- resolve correct MongoDB URI
- connect to cloud/local based on env
- fail clearly if the target DB is unavailable

Important env values:
- `DB_TARGET`
- `ALLOW_LOCAL_FALLBACK`
- `MONGO_URI`
- `LOCAL_DB_URI`

Current intended production setup:
```env
DB_TARGET=cloud
ALLOW_LOCAL_FALLBACK=false
```

This avoids silent data confusion between Atlas and local MongoDB.

---

## 12. Backend Models

### 12.1 User Model
File:
- [user-models.js](c:\React\Vite-Proj\server\models\user-models.js)

Fields:
- `username`
- `email`
- `phone`
- `password`
- `isAdmin`

Important model behavior:
- hashes password before save
- generates JWT
- compares hashed password during login

JWT payload includes:
- `userId`
- `email`
- `isAdmin`

### 12.2 Contact Model
File:
- [contact-model.js](c:\React\Vite-Proj\server\models\contact-model.js)

Fields:
- `username`
- `email`
- `message`

### 12.3 Service Model
File:
- [service-model.js](c:\React\Vite-Proj\server\models\service-model.js)

Fields:
- `service`
- `description`
- `price`
- `provider`

---

## 13. Backend Controllers

### 13.1 Auth Controller
File:
- [auth-controller.js](c:\React\Vite-Proj\server\controllers\auth-controller.js)

Current handlers:
- `home`
- `register`
- `login`
- `user`

#### Register flow
1. validate body
2. normalize email
3. check duplicate email
4. create user
5. return token and user id

#### Login flow
1. normalize email
2. find user with password
3. compare password
4. bootstrap admin if no admin exists yet
5. return token and user id

#### Admin bootstrap note
If no admin exists yet, the first valid user can be promoted so admin access is possible without manual DB setup.

### 13.2 Admin Controller
File:
- [admin-controller.js](c:\React\Vite-Proj\server\controllers\admin-controller.js)

Current handlers:
- `getAllusers`
- `updateUserById`
- `deleteUserById`
- `getAllContacts`
- `updateContactById`
- `deleteContactById`
- `getAllServices`
- `updateServiceById`
- `deleteServiceById`

### 13.3 Service Controller
File:
- [service-controller.js](c:\React\Vite-Proj\server\controllers\service-controller.js)

Current role:
- public fetch of all services

---

## 14. Backend Middleware

### 14.1 Validation Middleware
File:
- [validate-middleware.js](c:\React\Vite-Proj\server\middlewares\validate-middleware.js)

Purpose:
- parse request body with zod
- attach clean error messages on validation failure

### 14.2 Error Middleware
File:
- [error-middleware.js](c:\React\Vite-Proj\server\middlewares\error-middleware.js)

Purpose:
- centralize backend errors
- standardize error JSON shape

Response shape:
```json
{
  "message": "Error text",
  "details": []
}
```

### 14.3 Auth Middleware
File:
- [auth-middleware.js](c:\React\Vite-Proj\server\middlewares\auth-middleware.js)

Purpose:
- verify JWT
- fetch user from DB
- attach:
  - `req.user`
  - `req.userId`
  - `req.auth`

Admin status resolution currently uses:
- DB `isAdmin`
- token payload `isAdmin`
- optional configured admin email fallback

### 14.4 Admin Middleware
File:
- [admin-middleware.js](c:\React\Vite-Proj\server\middlewares\admin-middleware.js)

Purpose:
- allow only authenticated admin users

It rejects:
- unauthenticated users
- authenticated non-admin users

---

## 15. Backend Routes

### Auth Routes
File:
- [auth-router.js](c:\React\Vite-Proj\server\router\auth-router.js)

Endpoints:
- `GET /api/auth/`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/user`

### Contact Routes
File:
- [contact-router.js](c:\React\Vite-Proj\server\router\contact-router.js)

Endpoints:
- `POST /api/form/contact`

### Public Service Routes
File:
- [service-router.js](c:\React\Vite-Proj\server\router\service-router.js)

Endpoints:
- `GET /api/data/service`

### Admin Routes
File:
- [admin-router.js](c:\React\Vite-Proj\server\router\admin-router.js)

Protected by:
- `authMiddleware`
- `adminMiddleware`

Endpoints:
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id`
- `DELETE /api/admin/users/:id`
- `GET /api/admin/contacts`
- `PATCH /api/admin/contacts/:id`
- `DELETE /api/admin/contacts/:id`
- `GET /api/admin/services`
- `PATCH /api/admin/services/:id`
- `DELETE /api/admin/services/:id`

---

## 16. Validation

File:
- [auth-validator.js](c:\React\Vite-Proj\server\validators\auth-validator.js)

### Signup schema
- username min 3
- email valid
- phone 10 digits
- password min 6

### Login schema
- email valid
- password min 6

This aligns with the frontend forms.

---

## 17. Styling Notes

Primary styling files:
- [index.css](c:\React\Vite-Proj\client\src\index.css)
- [App.css](c:\React\Vite-Proj\client\src\App.css)

Current admin design includes:
- custom admin shell
- sidebar navigation
- top bar
- cards
- stats blocks
- admin tables
- inline edit forms
- row highlight for active editing
- responsive adjustments

Toast styling is also customized inside `index.css`.

---

## 18. Hosting Readiness

### Frontend
Use:
- [client/.env.example](c:\React\Vite-Proj\client\.env.example)

Required production variable:
```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

### Backend
Use:
- [server/.env.example](c:\React\Vite-Proj\server\.env.example)

Required production variables:
```env
PORT=5000
NODE_ENV=production
DB_TARGET=cloud
ALLOW_LOCAL_FALLBACK=false
MONGO_URI=your_encoded_atlas_uri
JWT_SECRET=your_strong_secret
CLIENT_ORIGIN=https://your-frontend-domain.com
```

### Why this matters
- frontend no longer depends on localhost
- backend no longer uses wildcard CORS
- cloud database is explicit
- local fallback can be disabled for production consistency

---

## 19. Common Troubleshooting

### Register says email already exists
Possible causes:
- checking a different database than the one configured in `.env`
- cloud/local mismatch
- previously stored user actually exists in active DB

### Admin page says `Admin only`
Possible causes:
- user is not actually admin in DB
- token is stale
- frontend auth did not finish loading
- backend admin middleware rejected request

Current frontend fix:
- non-admin users are redirected home before admin page renders

### Admin edit seems not working
This was previously a UX issue:
- form was opening above the table without strong visual feedback

Current fix:
- page auto-scrolls to the edit form
- edited row is highlighted
- current item name is shown in the edit section

### Atlas works sometimes, local works other times
Root cause is usually `DB_TARGET` or fallback settings.

For production:
```env
DB_TARGET=cloud
ALLOW_LOCAL_FALLBACK=false
```

---

## 20. Current Completion Status

Implemented and working:
- auth register/login
- JWT verification
- protected `/api/auth/user`
- contact form save
- public service fetch
- admin route backend protection
- admin route frontend protection
- admin users view/edit/delete
- admin contacts view/edit/delete
- admin services view/edit/delete
- toast feedback
- route-level loading state
- env-based API URLs
- production-oriented CORS
- hosting env examples

Remaining optional improvements only:
- confirmation modal before delete
- create/new service from admin page
- create/new contact note workflow if needed
- pagination/search for large admin tables
- stronger audit logging for admin actions

---

## 21. Practical Summary

This project now follows this runtime flow:

1. frontend loads
2. auth context checks token
3. user profile is fetched
4. admin route waits for auth to resolve
5. non-admin users redirect home
6. admin users enter nested admin layout
7. admin pages fetch protected data with bearer token
8. backend verifies JWT and admin role
9. admin controllers read/write MongoDB
10. UI updates immediately after successful edit/delete

This is a complete and structured baseline for deployment.
