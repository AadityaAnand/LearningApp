# AI-Powered Micro-Learning Platform

A personalized learning platform that uses AI (Claude, GPT, or Gemini) to create custom learning plans based on your resume and career goals.

## 🚀 Features

- **AI-Generated Learning Plans**: Personalized learning paths created by LLMs
- **Resume Analysis**: Upload your resume for tailored recommendations
- **Career Goal Tracking**: Set and update your career objectives
- **Progress Tracking**: Monitor your learning journey
- **Dark/Light Theme**: Beautiful, responsive UI with theme switching
- **Real-time Updates**: Regenerate learning plans as your goals evolve

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, MongoDB
- **AI Integration**: Anthropic Claude, OpenAI GPT, Google Gemini
- **Authentication**: JWT-based auth system

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- API key from one of the supported LLM providers

## 🔧 Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd micro-learning
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/micro-learning

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# LLM API Configuration - Choose ONE provider:

# Option 1: Anthropic Claude API (Recommended)
ANTHROPIC_API_KEY=your-anthropic-api-key-here
ANTHROPIC_MODEL=claude-3-sonnet-20240229

# Option 2: OpenAI GPT API
# OPENAI_API_KEY=your-openai-api-key-here
# OPENAI_MODEL=gpt-4

# Option 3: Google Gemini API
# GOOGLE_API_KEY=your-google-api-key-here
# GOOGLE_MODEL=gemini-pro

# Environment
NODE_ENV=development
```

### 4. Get API Keys

#### Option 1: Anthropic Claude (Recommended)
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up for an account
3. Navigate to "API Keys"
4. Create a new API key
5. Copy the key to your `.env` file

#### Option 2: OpenAI GPT
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up for an account
3. Navigate to "API Keys"
4. Create a new API key
5. Copy the key to your `.env` file

#### Option 3: Google Gemini
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env` file

### 5. Start the Application

#### Start Backend Server
```bash
cd backend
npm start
```
The backend will run on `http://localhost:5001`

#### Start Frontend Development Server
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

### 6. Seed the Database (Optional)
```bash
# In development mode only
curl -X POST http://localhost:5001/api/courses/seed
```

## 🎯 How It Works

1. **Registration**: Users sign up with their resume and career goals
2. **AI Analysis**: The LLM analyzes the resume and career goal to create a personalized learning plan
3. **Learning Journey**: Users follow the AI-generated modules and lessons
4. **Progress Tracking**: The system tracks completion and provides insights
5. **Plan Updates**: Users can regenerate their learning plan as goals evolve

## 📁 Project Structure

```
micro-learning/
├── backend/
│   ├── models/          # MongoDB models
│   ├── middleware/      # Express middleware
│   ├── utils/           # Utility functions (LLM service)
│   └── server.js        # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   └── api/         # API utilities
│   └── package.json
└── README.md
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS configuration
- Input validation
- Secure API key handling

## 🚀 Deployment

### Backend Deployment
1. Set up a MongoDB database (MongoDB Atlas recommended)
2. Deploy to your preferred platform (Heroku, Vercel, AWS, etc.)
3. Set environment variables in your deployment platform
4. Ensure your API keys are securely stored

### Frontend Deployment
1. Update the API base URL in `frontend/src/api/axios.js`
2. Deploy to your preferred platform (Vercel, Netlify, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check that all environment variables are set correctly
2. Ensure MongoDB is running and accessible
3. Verify your API key is valid and has sufficient credits
4. Check the console logs for detailed error messages

## 🔮 Future Enhancements

- [ ] Resume parsing with PDF extraction
- [ ] Advanced progress analytics
- [ ] Social learning features
- [ ] Mobile app development
- [ ] Integration with learning platforms
- [ ] Gamification elements
- [ ] Multi-language support 