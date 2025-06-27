# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

### 2. Set Up Environment Variables
```bash
cd backend
cp env.example .env
```

Edit `backend/.env` and add your API key:

```env
# Required: Choose ONE LLM provider
ANTHROPIC_API_KEY=your-claude-api-key-here

# Or use OpenAI
# OPENAI_API_KEY=your-openai-api-key-here

# Or use Google Gemini  
# GOOGLE_API_KEY=your-gemini-api-key-here

# Other settings (use defaults for now)
MONGODB_URI=mongodb://localhost:27017/micro-learning
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Get Your API Key

#### Option A: Claude (Recommended)
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up and create an API key
3. Copy the key to your `.env` file

#### Option B: OpenAI
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up and create an API key
3. Copy the key to your `.env` file

#### Option C: Google Gemini
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in and create an API key
3. Copy the key to your `.env` file

### 4. Start the Application
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend  
npm start
```

### 5. Test the Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5001
- Health Check: http://localhost:5001/api/health

## 🎯 What You'll Get

✅ **AI-Generated Learning Plans**: Personalized curriculum based on your resume and career goals

✅ **Beautiful Dashboard**: Modern UI with dark/light theme switching

✅ **Progress Tracking**: Monitor your learning journey

✅ **Plan Regeneration**: Update your goals and get new learning plans

## 🔧 Troubleshooting

**Backend won't start?**
- Check if MongoDB is running
- Verify your `.env` file exists and has the correct API key
- Check console for error messages

**Frontend shows proxy errors?**
- Make sure backend is running on port 5001
- Check that the API key is valid
- Verify CORS settings in backend

**API calls failing?**
- Ensure your API key has sufficient credits
- Check the LLM service logs in backend console
- The system will fallback to mock data if API fails

## 🚀 Next Steps

1. **Register** a new account with your resume and career goal
2. **Explore** your AI-generated learning plan
3. **Customize** your goals and regenerate the plan
4. **Track** your progress through the dashboard

## 💡 Pro Tips

- Start with Claude API for best results
- Upload a detailed resume for more personalized plans
- Use specific career goals (e.g., "Senior React Developer" vs "Software Engineer")
- The system works without API keys (uses mock data as fallback)

---

**Need help?** Check the main README.md for detailed documentation. 