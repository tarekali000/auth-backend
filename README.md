# NestJS Authentication API

A secure and scalable authentication backend built with **NestJS**, **TypeScript**, and **MongoDB**.

This project provides a JWT-based authentication system with access and refresh tokens, HTTP-only cookies, password hashing, and protected API endpoints.

## Features

- User registration and login.
- Password hashing using bcrypt.
- JWT Access Tokens.
- JWT Refresh Tokens.
- HTTP-only authentication cookies.
- Custom authentication guard.
- Current authenticated user profile (`/auth/users/me`).
- Token refresh endpoint.
- Swagger / OpenAPI API documentation.
- Request validation using DTOs.

## Tech Stack

| Technology | Purpose |
|---|---|
| NestJS | Backend framework |
| TypeScript | Programming language |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcrypt | Password hashing |
| Swagger | API documentation |
| Cookie Parser | Cookie handling |

## API Endpoints

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Login | Public |
| POST | `/auth/refresh` | Refresh tokens | Refresh Cookie |
| GET | `/auth/users/me` | Get current user | Access Cookie |

## Token Configuration

| Token | Lifetime | Purpose |
|---|---|---|
| Access Token | 15 minutes | Authenticate API requests |
| Refresh Token | 7 days | Renew authentication tokens |

Tokens are delivered through HTTP-only cookies rather than being exposed in the JSON response.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/tarekali000/auth-backend.git
cd auth-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env
PORT=3000

MONGODB_URI=mongodb://127.0.0.1:27017/auth

JWT_KEY=your_access_token_secret
JWT_REFRESH_KEY=your_refresh_token_secret
```

Use strong, randomly generated secrets and never commit your `.env` file.

### 4. Run the application

Development:

```bash
npm run start:dev
```

Production:

```bash
npm run build
npm run start:prod
```

## API Documentation

After starting the application, access the Swagger documentation at the configured Swagger route.

Default application URL:

```text
http://localhost:3000
```

## Security Notes

- Passwords are hashed before database storage.
- Authentication tokens are stored in HTTP-only cookies.
- Access and refresh tokens use separate signing secrets.
- Protected routes use a custom authentication guard.
- Production deployments should configure HTTPS, explicit CORS origins, CSRF protection, and authentication rate limiting.

**Production Note:** Server-side refresh-token storage, revocation, and reuse detection should be implemented before treating refresh-token rotation as production-ready.

## Author

**Tarek Mahmoud**

GitHub: [@tarekali000](https://github.com/tarekali000)

---

Built with NestJS and TypeScript.
