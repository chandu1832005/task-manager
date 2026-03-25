# Task Manager Application - MERN Stack

A modern, full-stack Task Manager application with authentication, user-specific tasks, and a Notion-like Kanban board interface with drag-and-drop functionality.

## Features

### Authentication
- ✅ User registration with name, email, and password
- ✅ Secure login with JWT tokens
- ✅ Protected routes
- ✅ Individual user accounts

### Task Management
- ✅ Create tasks in different columns (To Do, In Progress, Done)
- ✅ Drag and drop tasks between columns
- ✅ Edit task titles inline
- ✅ Delete tasks with confirmation
- ✅ Each user can only see and manage their own tasks

### Modern UI
- ✅ Clean, Notion-like interface
- ✅ Responsive design for mobile and desktop
- ✅ Smooth animations and transitions
- ✅ Real-time updates

## Project Structure

```
├── backend/
│   ├── models/
│   │   ├── Task.js           # Task schema
│   │   └── User.js           # User schema with authentication
│   ├── routes/
│   │   ├── authRoutes.js     # Authentication routes
│   │   └── taskRoutes.js     # Task CRUD routes
│   ├── controllers/
│   │   ├── authController.js # Auth logic
│   │   └── taskController.js # Task CRUD logic
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── server.js             # Express server
│   ├── .env                  # Environment variables
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.js # Authentication state management
│   │   ├── pages/
│   │   │   ├── Login.js     # Login page
│   │   │   ├── Register.js   # Registration page
│   │   │   ├── Register.css
│   │   │   ├── Auth.css
│   │   │   ├── KanbanBoard.js # Main Kanban board
│   │   │   └── KanbanBoard.css
│   │   ├── App.js           # Main app with routing
│   │   ├── App.css          # Global styles
│   │   └── index.js         # React entry point
│   └── package.json
│
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

## MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Configure network access (allow everywhere)
4. Create database user
5. Get connection string

## Installation & Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

Update `backend/.env` with your MongoDB Atlas connection string:
```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/taskManager
JWT_SECRET=yourSecretKey
JWT_EXPIRE=30d
PORT=5000
```

Start backend:
```bash
npm start
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Tasks (Protected Routes)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all user tasks |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| PUT | `/api/tasks/:id/status` | Update task status |
| PUT | `/api/tasks/reorder` | Reorder tasks |
| DELETE | `/api/tasks/:id` | Delete task |

## Usage

1. **Register**: Create a new account
2. **Login**: Sign in with your credentials
3. **Create Tasks**: Click "+ Add task" in any column
4. **Move Tasks**: Drag and drop between columns
5. **Edit Tasks**: Click on task title to edit inline
6. **Delete Tasks**: Click trash icon to delete

## Technologies Used

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React.js (Functional components with Hooks)
- Context API for state management
- Native HTML5 Drag and Drop API
- Axios for API calls
- Modern CSS3

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- User-specific data isolation

## Troubleshooting

**MongoDB Connection Error:**
- Verify your connection string in `.env`
- Check network access settings in Atlas
- Ensure database user credentials are correct

**Authentication Errors:**
- Clear browser localStorage
- Check JWT token expiration
- Verify CORS settings

**Drag & Drop Not Working:**
- Check browser console for errors
- Ensure JavaScript is enabled
- Try a different browser
