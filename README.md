# CareerCraft AI

Welcome to CareerCraft AI, your personal AI-powered career development co-pilot. This platform is designed to help you bridge the gap between your current skills and your dream job. By analyzing your resume and understanding your career goals, CareerCraft AI generates a custom, step-by-step learning plan with bite-sized, interactive lessons.

All features are, and will always be, **completely free**.

## ✨ Key Features

*   **🤖 AI-Powered Learning Plans**: Get a personalized curriculum tailored to your specific career goals and skill gaps.
*   **📄 Resume Analysis**: Upload your resume and let our AI identify your strengths and areas for improvement.
*   **🎯 Goal-Oriented Learning**: Every lesson is designed to move you measurably closer to your desired role.
*   **🌓 Light & Dark Modes**: A beautiful and modern UI with a persistent theme switcher for your comfort.
*   **🚀 Interactive Micro-Lessons**: Engage with bite-sized lessons that are easy to fit into a busy schedule.
*   **📈 Progress Tracking**: Visualize your journey and stay motivated by tracking your completed modules.

## 🛠️ Tech Stack

*   **Frontend**: React, Tailwind CSS, Framer Motion
*   **Backend**: Node.js, Express
*   **Database**: MongoDB

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js and npm installed
*   MongoDB instance (local or Atlas)

### Installation & Setup

1.  **Clone the repo**
    ```sh
    git clone https://github.com/your-username/careercraft-ai.git
    cd careercraft-ai
    ```
2.  **Install root dependencies**
    ```sh
    npm install
    ```
3.  **Install backend dependencies**
    ```sh
    cd backend
    npm install
    ```
4.  **Install frontend dependencies**
    ```sh
    cd ../frontend
    npm install
    ```
5.  **Configure Environment Variables**
    -   In the `backend` directory, create a `.env` file.
    -   Add the following variables:
        ```env
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret
        EMAIL_HOST=your_email_host
        EMAIL_PORT=your_email_port
        EMAIL_USER=your_email_user
        EMAIL_PASS=your_email_pass
        ```
6.  **Run the application**
    -   From the root directory:
        ```sh
        npm run dev
        ```

This will start both the backend and frontend development servers concurrently.

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
PORT=5001
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
npm run server  # Backend only (port 5001)
npm run client  # Frontend only (port 3000)
```

### 5. Access the application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **API Health Check**: http://localhost:5001/api/health

## 📁 Project Structure

```
micro-learning/
├── backend/                 # Backend API
│   ├── models/             # Database models
│   │   ├── User.js         # User model with roles
│   │   ├── Course.js       # Course model
│   │   ├── Lesson.js       # Lesson model
│   │   └── Progress.js     # Progress tracking model
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication routes
│   │   ├── users.js        # User management routes
│   │   └── admin.js        # Admin panel routes
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js         # JWT authentication
│   │   └── errorHandler.js # Error handling
│   ├── utils/              # Utility functions
│   │   └── email.js        # Email functionality
│   ├── seeders/            # Database seeders
│   │   └── sampleContent.js # Sample content seeder
│   ├── server.js           # Express server
│   └── package.json        # Backend dependencies
├── frontend/               # React frontend
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Layout.js   # Main layout component
│   │   │   └── ProtectedRoute.js # Route protection
│   │   ├── contexts/       # React contexts
│   │   │   └── AuthContext.js # Authentication context
│   │   ├── pages/          # Page components
│   │   │   ├── Landing.js  # Landing page
│   │   │   ├── Login.js    # Login page
│   │   │   ├── Register.js # Registration page
│   │   │   ├── Profile.js  # User profile
│   │   │   ├── Admin.js    # Admin panel
│   │   │   └── ...         # Other pages
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

### Admin Panel
- `GET /api/admin/dashboard` - Get admin dashboard stats
- `GET /api/admin/courses` - Get all courses
- `POST /api/admin/courses` - Create new course
- `PUT /api/admin/courses/:id` - Update course
- `DELETE /api/admin/courses/:id` - Delete course
- `GET /api/admin/lessons` - Get all lessons
- `POST /api/admin/lessons` - Create new lesson
- `PUT /api/admin/lessons/:id` - Update lesson
- `DELETE /api/admin/lessons/:id` - Delete lesson
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user (promote to admin)

## 🎯 Features Implemented

### ✅ Completed (Day 1)
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

### ✅ Completed (Day 2)
- [x] Database models for Courses, Lessons, and Progress
- [x] Admin panel backend routes with CRUD operations
- [x] Admin panel frontend with content management
- [x] Sample content seeder with JavaScript and React courses
- [x] Role-based access control (Admin functionality)
- [x] Content management system
- [x] Beautiful landing page with SEO optimization
- [x] Enhanced login/register pages with social login UI

### 🚧 Next Steps (Future Features)
- [ ] Interactive coding exercises
- [ ] Peer review system
- [ ] Progress tracking dashboard
- [ ] Course enrollment system
- [ ] Discussion forums
- [ ] Mobile app development
- [ ] Advanced analytics and reporting

## 🗄️ Database Schema

### User Model
- Basic info (name, email, username)
- Role-based access (student, instructor, admin)
- Profile preferences and settings
- Email verification status

### Course Model
- Course metadata (title, description, difficulty)
- Category and tags
- Instructor assignment
- Course structure and settings

### Lesson Model
- Lesson content and metadata
- Course association
- Content type (text, video, interactive)
- Estimated completion time

### Progress Model
- User progress tracking
- Lesson completion status
- Time spent and scores
- Learning analytics data

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Security headers with Helmet
- Rate limiting protection
- Role-based access control

## 📧 Email Integration

The platform includes email functionality for:
- Email verification during registration
- Password reset requests
- Course notifications (future)
- Progress updates (future)

Configure your email settings in the `.env` file to enable these features.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the existing issues
2. Create a new issue with detailed information
3. Include your environment details and error logs

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Express.js](https://expressjs.com/) - Web framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Lucide](https://lucide.dev/) - Icon library

---

**Happy Learning! 🎓** 