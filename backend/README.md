# UCF Student Networking App — Backend

Node.js and Express REST API for the UCF Student Networking App. Uses MongoDB for data storage and JWT for authentication.

## Requirements

* Node.js and npm
* MongoDB database
* Postman (recommended for API testing)

## Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=your_secret_key
   ```

4. Start the development server:

   ```bash
   npm start
   ```

The API runs at `http://localhost:5000`.

## API Endpoints

| Method | Endpoint                    | Description                                   |
| ------ | --------------------------- | --------------------------------------------- |
| POST   | `/api/auth/register`        | Register a new user                           |
| POST   | `/api/auth/login`           | Authenticate a user                           |
| GET    | `/api/auth/verify`          | Verify a user's email                         |
| GET    | `/api/auth/me`              | Retrieve the authenticated user's information |
| POST   | `/api/auth/forgot-password` | Request a password reset                      |
| POST   | `/api/auth/reset-password`  | Reset a password                              |
| POST   | `/api/auth/logout`          | Logout endpoint, if implemented               |

Protected endpoints require a JWT in the `Authorization` header:

```text
Authorization: Bearer <access_token>
```

*Note: Update the endpoint paths above if your completed routing refactor uses different paths.*

## Security and Development Notes

* Passwords are hashed using `bcryptjs`.
* JWTs are signed using `ACCESS_TOKEN_SECRET`.
* Email verification and password reset links are printed in the backend terminal for local development.
* New users receive an automatically generated integer `UserID`.
* Never commit `.env` files or expose database credentials or JWT secrets.

## Testing

Use Postman to test registration, login, email verification, password recovery, and authenticated requests.

This project is intended for academic development and demonstration, not production deployment.

