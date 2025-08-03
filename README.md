
# Seamless Screening: Web-Based Applicant Management System

A comprehensive web-based solution for managing job applications, interviews, and applicant screening processes.

## Features

- **User Authentication**

  - Secure registration and login
  - Role-based access (Admin/Applicant)
- **Job Management**

  - Post and manage job openings
  - Configurable job criteria and requirements
  - Automated applicant scoring system
- **Application Processing**

  - Resume/CV upload and parsing
  - Automated skills matching
  - Application status tracking
- **Interview Management**

  - Schedule and track interviews
  - Email notifications
  - Online/On-site interview options
- **Notifications System**

  - Real-time application updates
  - Interview reminders
  - System notifications

## Tech Stack

- **Frontend**: React.js, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Email Service**: Nodemailer
- **File Handling**: Multer
- **Authentication**: JWT, bcrypt

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Git
- Yarn package manager

## Environment Setup

1. Clone the repository:

```bash
git clone [your-repo-url]
cd SoftEng
```

2. CONNECTION_STRING=your_mongodb_connection_string

3. Install dependencies:

```bash
# Install frontend dependencies
cd frontend
yarn install

# Install backend dependencies
cd ../api
yarn install
```

## Running the Application

1. Start the backend server:

```bash
cd api
yarn start
```

2. Start the frontend development server:

```bash
cd frontend
yarn run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
SoftEng/
├── api/                # Backend server
│   ├── models/        # Database models
│   └── index.js       # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── App.jsx
│   └── public/
└── README.md
```

## Software Developer and Researchers

- Garrido, Regiel Zyrus
- Jovellanos, Kenzie
- Vasquez, Charles Patrick

## License

This project is part of academic requirements for Software Engineering 1 and 2.
