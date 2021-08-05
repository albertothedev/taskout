# Taskout

Task app built with Vue, Node.js (Express), and MySQL. TypeScript is enabled globally. SCSS is used for styling, Vuex for state management, Vue Router for route handling, Passport and JWT for user authentication, Bcrypt for password hashing, Sequelize for database manipulation, Nodemailer for email sending, and Docker for local development.

## Getting started

1. Installs dependencies on frontend and backend (/ui and /api).

   ```sh
   npm run install
   ```

2. Builds the images for the frontend, the backend, and the database and creates three containers from them.

   ```sh
   npm run start
   ```

## Environment variables

Specified in /.env.development.

- **TASKOUT_PORT**: Port the backend will run on.
- **TASKOUT_DATABASE_URI**: MySQL database URL.
- **TASKOUT_EMAIL_ACCOUNT**: Email account you want to send emails from.
- **TASKOUT_EMAIL_PASSWORD**: Password for aforementioned email account.
- **TASKOUT_JWT_SECRET**: JWT secret.
- **VUE_APP_TASKOUT_API_URL**: Backend URL.

## Other commands

- Removes images, containers, and volumes.

  ```sh
  npm run stop
  ```

- Runs **stop** and **start** consecutively.

  ```sh
  npm run restart
  ```
