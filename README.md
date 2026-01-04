# Micro-Task Platform - Server

Backend application for the Micro-Task and Earning Platform, built with Node.js,
Express, and MongoDB. The server handles authentication, task management,
payments, and user roles for the platform.



## Tech Stack

- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Firebase Admin** - Authentication verification
- **JWT** - Token-based authentication
- **Stripe** - Payment processing
- **BCrypt** - Password hashing

## Project Structure

```
server/
├── config/
│   ├── db.js           # MongoDB connection
│   └── firebase.js     # Firebase Admin setup
├── middleware/
│   ├── auth.js         # JWT verification
│   ├── verifyAdmin.js  # Admin role check
│   ├── verifyBuyer.js  # Buyer role check
│   └── verifyWorker.js # Worker role check
├── models/
│   ├── User.js
│   ├── Task.js
│   ├── Submission.js
│   ├── Payment.js
│   ├── Withdrawal.js
│   └── Notification.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── tasks.js
│   ├── submissions.js
│   ├── payments.js
│   ├── withdrawals.js
│   └── notifications.js
├── controllers/
└── utils/
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account or local MongoDB
- Firebase project with Admin SDK

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file:

```bash
cp .env.example .env
```

3. Add your environment variables to `.env`

4. Start development server:

```bash
npm run dev
```

The server will run at `http://localhost:5000`

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google Sign-In
- `GET /api/auth/me` - Get current user

### Users (Admin only)

- `GET /api/users` - Get all users
- `PATCH /api/users/:id/role` - Update user role
- `DELETE /api/users/:id` - Delete user

### Tasks

- `GET /api/tasks` - Get available tasks
- `GET /api/tasks/:id` - Get task details
- `POST /api/tasks` - Create task (Buyer)
- `PATCH /api/tasks/:id` - Update task (Buyer)
- `DELETE /api/tasks/:id` - Delete task

### Submissions

- `POST /api/submissions` - Create submission (Worker)
- `GET /api/submissions/worker/:email` - Get worker submissions
- `PATCH /api/submissions/:id/approve` - Approve submission (Buyer)
- `PATCH /api/submissions/:id/reject` - Reject submission (Buyer)

### Payments

- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/buyer/:email` - Get payment history

### Withdrawals

- `POST /api/withdrawals` - Create withdrawal request
- `GET /api/withdrawals/pending` - Get pending requests (Admin)
- `PATCH /api/withdrawals/:id/approve` - Approve withdrawal (Admin)

### Notifications

- `GET /api/notifications/:email` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark as read

## Environment Variables

See `.env.example` for required environment variables.

## Database Models

- **User** - User accounts with roles and coins
- **Task** - Tasks created by buyers
- **Submission** - Task submissions by workers
- **Payment** - Buyer coin purchases
- **Withdrawal** - Worker withdrawal requests
- **Notification** - User notifications

## What I Learned in this Vibe Coding Project

This project was built using a "Vibe Coding" approach, leveraging AI assistance
to accelerate development while maintaining code quality. Key learnings include:

- **AI-Assisted Workflow:** Integrating AI agents to handle boilerplate code,
  debugging, and rapid prototyping.
- **Complex State Management:** Handling multi-role authentication
  (Worker/Buyer/Admin) and real-time state updates.
- **Secure Payments:** Implementing Stripe for secure financial transactions and
  coin-based economy logic.
- **System Architecture:** Designing a scalable MERN stack architecture with
  clean separation of concerns.
- **Responsive Design:** Using Tailwind CSS and DaisyUI to create a modern,
  mobile-first interface.

## ⏱Development Time

- **Estimated Build Time:** ~15-20 Hours
- **Core Features:** 10 Hours
- **UI/UX Refinement:** 5 Hours
- **Testing & Debugging:** 3 Hours
- **Built with:** ♥️ and AI Assistance

