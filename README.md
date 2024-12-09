# Cool Tech

Cool Tech is a web application designed to manage user credentials and divisions, featuring role-based access and intuitive dashboards for admins, managers, and normal users.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [License](#license)

---

## Features

- **Role-Based Dashboards**: Custom dashboards for Admin, Management, and Normal users.
- **Credential Management**: Add, update, and delete credentials with division-based access control.
- **Division and Organisational Unit Management**: Manage divisions and assign organisational units.
- **Authentication**: Secure login and registration with JWT-based authentication.

---

## Tech Stack

- **Frontend**: React, React Bootstrap
- **Backend**: Node.js, Express.js, MongoDB
- **Styling**: Bootstrap, Custom CSS
- **Middleware**: Helmet, CORS, Morgan

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v16 or later)
- MongoDB (Local or Atlas connection)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/doorstep75/cool-tech.git
   cd cool-tech
   ```
2.	Install dependencies for both frontend and backend:
  ```bash
  cd backend
  npm install
  ```
3. 	Set up the environment variables (see Environment Variables).
  
4.  Start the development servers (see below for commands per environment):
  ```bash
  npm start
  ```
  
# Backend (from the /backend directory)
node server.js

# Frontend (from the /frontend directory)
npm start

5.	Access the application:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Environment Variables

Create a `.env` file in the `backend` directory with the following:

```env
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
```

- Replace <your_mongodb_connection_string> with your MongoDB connection string.
- Replace <your_jwt_secret> with a secure secret key for signing JWT tokens.

  Additionally, create a `.env` file in the frontend directory with the following:


  ```env
  REACT_APP_API_URL=http://localhost:3000/api
  REACT_APP_API_URL=http://localhost:5000/api
  ```

## Running the Application

### Backend setup

1.	Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.	Install the dependencies:
    ```bash
    npm install
    ```
3.	Start the backend server:
    ```bash
    npm start
    ```

## Frontend setup

1.	Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.	Install the dependencies:
    ```bash
    npm install
    ```
3.	Start the frontend server:
    ```bash
    npm start
    ```

## Features

- Authentication: User login, registration, and JWT-based authentication.
- Role-Based Access Control: Different dashboards and permissions for normal users, management users, and admin users.
- Credential Management: Add, update, and view credentials based on user roles.
- User Management: Admin can manage users, assign divisions and organisational units.

## Directory Structure

```plaintext
cool-tech/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── styles/
│   │   └── App.js
│   ├── .env
│   └── package.json
└── README.md
```

## License

This project is licensed under the MIT License.