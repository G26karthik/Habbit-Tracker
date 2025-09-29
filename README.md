# 🎯 Mini Habit Tracker

A full-stack web application for tracking daily habits with a beautiful, intuitive interface. Built as a shortlisting assignment for a Full-Stack Intern role.

![Habit Tracker Preview](https://img.shields.io/badge/Status-Production%20Ready-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![SQLite](https://img.shields.io/badge/Database-SQLite-blue)

## ✨ Features

### 🎨 Core Features
- ✅ **Habit Creation**: Add new habits with names and optional descriptions
- 📅 **Daily Check-ins**: Mark habits as completed or missed for any day
- 🗓️ **Weekly Calendar View**: Visual 7-day grid with color-coded status indicators
- 📊 **Summary Statistics**: Weekly and monthly completion rates and progress tracking
- 🗑️ **Habit Management**: Delete habits with confirmation prompts

### 🔧 Technical Features
- **Persistent Data**: All data stored in SQLite database
- **Responsive Design**: Clean UI that works on desktop and mobile
- **Real-time Updates**: Dynamic calendar updates with instant feedback
- **Error Handling**: Comprehensive error handling and user notifications
- **Form Validation**: Client-side validation with helpful error messages
- **Toast Notifications**: Beautiful success/error notifications
- **Loading States**: Smooth loading indicators for better UX

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern functional components with hooks
- **TailwindCSS** - Utility-first CSS framework for rapid styling
- **Axios** - HTTP client for API communication
- **React Hot Toast** - Beautiful toast notifications
- **date-fns** - Modern date utility library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **SQLite3** - Lightweight, file-based database
- **CORS** - Cross-origin resource sharing
- **Body Parser** - HTTP request body parsing

### Development Tools
- **Nodemon** - Development server with auto-restart
- **Concurrently** - Run multiple npm scripts simultaneously
- **PostCSS & Autoprefixer** - CSS processing

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation & Setup

1. **Clone or download the project**
   ```bash
   cd "Habbit Tracker"
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```
   This command installs dependencies for both frontend and backend.

3. **Start the development servers**
   ```bash
   npm run dev
   ```
   This starts both the React frontend (port 3000) and Express backend (port 5000) concurrently.

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.

### Alternative Setup (Manual)

If you prefer to run frontend and backend separately:

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## 📋 API Documentation

### Base URL
`http://localhost:5000/api`

### Endpoints

#### Habits
- `GET /habits` - Retrieve all habits
- `POST /habits` - Create a new habit
  ```json
  {
    "name": "Drink 8 glasses of water",
    "description": "Stay hydrated throughout the day"
  }
  ```
- `DELETE /habits/:id` - Delete a specific habit
- `GET /habits/:id` - Get a specific habit

#### Check-ins
- `GET /checkins/:habitId` - Get check-ins for a habit
- `POST /checkins/:habitId` - Create/update a check-in
  ```json
  {
    "date": "2025-09-29",
    "status": "done"
  }
  ```
- `DELETE /checkins/:habitId/:date` - Delete a check-in

#### Summary
- `GET /summary` - Get weekly and monthly statistics
- `GET /summary/habit/:habitId` - Get stats for a specific habit

## 💾 Database Schema

### Habits Table
```sql
CREATE TABLE habits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Check-ins Table
```sql
CREATE TABLE checkins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  habit_id INTEGER NOT NULL,
  date DATE NOT NULL,
  status TEXT CHECK(status IN ('done', 'missed')) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE,
  UNIQUE(habit_id, date)
);
```

## 🎨 UI/UX Features

### Color Coding
- 🟢 **Green**: Completed habits
- 🔴 **Red**: Missed habits  
- ⚪ **Gray**: Not tracked yet

### Interactive Elements
- Click calendar cells to cycle through: Not tracked → Done → Missed
- Hover effects and smooth transitions
- Responsive grid layout
- Form validation with inline error messages
- Confirmation dialogs for destructive actions

### Visual Feedback
- Success/error toast notifications
- Loading spinners and skeleton screens
- Progress bars for completion rates
- Motivational messages based on progress

## 🔧 Development

### Project Structure
```
Habbit Tracker/
├── backend/
│   ├── database/
│   │   ├── db.js              # Database connection & setup
│   │   └── habits.db          # SQLite database file (auto-created)
│   ├── routes/
│   │   ├── habits.js          # Habit CRUD operations
│   │   ├── checkins.js        # Check-in management
│   │   └── summary.js         # Statistics endpoints
│   ├── server.js              # Express server setup
│   ├── package.json           # Backend dependencies
│   └── .env                   # Environment variables
├── frontend/
│   ├── public/
│   │   ├── index.html         # HTML template
│   │   └── manifest.json      # PWA manifest
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── HabitForm.js   # Create new habits
│   │   │   ├── HabitList.js   # Display & manage habits
│   │   │   ├── HabitCalendar.js # Weekly calendar view
│   │   │   └── SummaryStats.js # Statistics display
│   │   ├── context/
│   │   │   └── HabitContext.js # Global state management
│   │   ├── services/
│   │   │   └── api.js         # API communication
│   │   ├── utils/
│   │   │   └── dateUtils.js   # Date manipulation helpers
│   │   ├── App.js             # Main app component
│   │   ├── index.js           # React entry point
│   │   └── index.css          # TailwindCSS styles
│   ├── package.json           # Frontend dependencies
│   ├── tailwind.config.js     # TailwindCSS configuration
│   └── postcss.config.js      # PostCSS configuration
├── package.json               # Root package.json
└── README.md                  # This file
```

### Available Scripts

**Root level:**
- `npm run install-all` - Install all dependencies
- `npm run dev` - Start both frontend and backend
- `npm run frontend` - Start only frontend
- `npm run backend` - Start only backend

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

**Frontend:**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## ✅ Requirements Compliance

### ✓ Core Features Implemented
- [x] Habit creation with database persistence
- [x] Daily check-in functionality
- [x] 7-day calendar view with color indicators
- [x] Weekly and monthly summary statistics
- [x] Data persistence in SQLite database

### ✓ Tech Stack Requirements
- [x] React with functional components and hooks
- [x] TailwindCSS for styling
- [x] Node.js + Express backend
- [x] SQLite database with proper schema

### ✓ Code Quality
- [x] Clean, readable code with comments
- [x] Proper React state management with Context API
- [x] MVC-style backend architecture
- [x] Comprehensive error handling and validation
- [x] Responsive and intuitive UI design

### ✓ Production Ready
- [x] Simple setup commands (`npm install` → `npm run dev`)
- [x] Comprehensive documentation
- [x] Proper project structure
- [x] Environment configuration
- [x] Error boundaries and fallbacks

## 🚀 Deployment Considerations

For production deployment:

1. **Environment Variables**: Configure production database path and API URLs
2. **Build Frontend**: Run `npm run build` in frontend directory
3. **Database**: Consider upgrading to PostgreSQL or MySQL for production
4. **Security**: Add authentication, rate limiting, and input sanitization
5. **Monitoring**: Add logging and error tracking

## 🎯 Future Enhancements

Potential features for future versions:
- User authentication and multi-user support
- Habit streaks and achievements
- Habit categories and tags  
- Data export/import functionality
- Mobile app using React Native
- Push notifications for habit reminders
- Advanced analytics and insights
- Social features and habit sharing

## 📞 Support

If you encounter any issues during setup or have questions about the implementation:

1. Check that Node.js is properly installed (`node --version`)
2. Ensure all dependencies are installed (`npm run install-all`)
3. Verify that ports 3000 and 5000 are available
4. Check the browser console and terminal for error messages

---

**Built with ❤️ for the Full-Stack Intern position**

*This project demonstrates proficiency in React, Node.js, Express, SQLite, and modern web development practices. The codebase is production-ready with comprehensive error handling, responsive design, and clean architecture.*