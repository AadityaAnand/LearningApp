# Micro Learning Platform

A modern micro-learning platform designed for developers to learn new technologies through bite-sized lessons with integrated coding practice and peer reviews.

## 🚀 Features

### Authentication & User Management
- ✅ User registration with email verification
- ✅ Secure login/logout with JWT tokens
- ✅ Password reset functionality
- ✅ User profile management
- ✅ Role-based access control (Student, Instructor, Admin)

### User Interface
- ✅ Modern, responsive design with Tailwind CSS
- ✅ Beautiful dashboard with learning progress
- ✅ Profile management with tabs
- ✅ Form validation with React Hook Form
- ✅ Toast notifications for user feedback

### Backend API
- ✅ RESTful API with Express.js
- ✅ MongoDB database with Mongoose ODM
- ✅ JWT authentication middleware
- ✅ Input validation with express-validator
- ✅ Error handling middleware
- ✅ Rate limiting and security headers
- ✅ Email functionality (configurable)

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **React Hook Form** - Form management and validation
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - Object Data Modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **nodemailer** - Email sending
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd micro-learning
```

### 2. Install dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (backend + frontend)
npm run install-all
```

### 3. Environment Setup

#### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/micro-learning

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Email Configuration (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**Note:** For email functionality, you'll need to:
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in the `EMAIL_PASS` field

### 4. Start the development servers

```bash
# Start both backend and frontend
npm run dev

# Or start them separately:
npm run server  # Backend only (port 5000)
npm run client  # Frontend only (port 3000)
```

### 5. Access the application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📁 Project Structure

```
micro-learning/
├── backend/                 # Backend API
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── server.js           # Express server
│   └── package.json        # Backend dependencies
├── frontend/               # React frontend
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   └── package.json        # Frontend dependencies
├── package.json            # Root package.json
└── README.md              # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/verify-email` - Verify email with token

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password
- `PUT /api/users/preferences` - Update user preferences
- `GET /api/users/:username` - Get public user profile
- `DELETE /api/users/account` - Delete user account

## 🎯 Features Implemented

### ✅ Completed
- [x] Project structure setup (React + Node.js/Express)
- [x] Database schema design with User model
- [x] User registration/login system
- [x] Basic user profile page
- [x] Password reset functionality
- [x] Email verification system
- [x] JWT token authentication
- [x] Form validation and error handling
- [x] Responsive UI with Tailwind CSS
- [x] Protected routes
- [x] User profile management
- [x] Dashboard with mock data

### 🚧 Next Steps (Future Features)
- [ ] Lesson management system
- [ ] Interactive coding exercises
- [ ] Peer review system
- [ ] Progress tracking
- [ ] Achievement badges
- [ ] Course creation for instructors
- [ ] Real-time notifications
- [ ] Search functionality
- [ ] Dark mode implementation
- [ ] Mobile app development

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Tokens**: Secure authentication with expiration
- **Input Validation**: Server-side validation with express-validator
- **Rate Limiting**: Protection against brute force attacks
- **Security Headers**: Helmet.js for security headers
- **CORS Configuration**: Proper cross-origin resource sharing
- **Environment Variables**: Secure configuration management

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 📦 Production Build

```bash
# Build frontend for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Express.js](https://expressjs.com/) - Web framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Lucide](https://lucide.dev/) - Icon library

---

**Happy Learning! 🎓** 