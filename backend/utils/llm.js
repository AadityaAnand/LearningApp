const axios = require('axios');

class LLMService {
  constructor() {
    this.provider = this.detectProvider();
  }

  detectProvider() {
    if (process.env.ANTHROPIC_API_KEY) {
      return 'anthropic';
    } else if (process.env.OPENAI_API_KEY) {
      return 'openai';
    } else if (process.env.GOOGLE_API_KEY) {
      return 'google';
    } else {
      return 'mock'; // Fallback to mock responses
    }
  }

  async generateLearningPlan(resumeText, careerGoal) {
    try {
      switch (this.provider) {
        case 'anthropic':
          return await this.generateWithClaude(resumeText, careerGoal);
        case 'openai':
          return await this.generateWithOpenAI(resumeText, careerGoal);
        case 'google':
          return await this.generateWithGemini(resumeText, careerGoal);
        default:
          return this.generateMockPlan(resumeText, careerGoal);
      }
    } catch (error) {
      console.error('LLM API error:', error);
      // Fallback to mock plan if API fails
      return this.generateMockPlan(resumeText, careerGoal);
    }
  }

  async generateWithClaude(resumeText, careerGoal) {
    const prompt = this.buildPrompt(resumeText, careerGoal);
    
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      }
    });

    const content = response.data.content[0].text;
    return this.parseLLMResponse(content);
  }

  async generateWithOpenAI(resumeText, careerGoal) {
    const prompt = this.buildPrompt(resumeText, careerGoal);
    
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert career counselor and learning path designer.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const content = response.data.choices[0].message.content;
    return this.parseLLMResponse(content);
  }

  async generateWithGemini(resumeText, careerGoal) {
    const prompt = this.buildPrompt(resumeText, careerGoal);
    
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/${process.env.GOOGLE_MODEL || 'gemini-pro'}:generateContent`, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        key: process.env.GOOGLE_API_KEY
      }
    });

    const content = response.data.candidates[0].content.parts[0].text;
    return this.parseLLMResponse(content);
  }

  buildPrompt(resumeText, careerGoal) {
    return `You are an expert career counselor and learning path designer. Based on the following resume and career goal, create a personalized learning plan.

RESUME:
${resumeText || 'No resume provided'}

CAREER GOAL:
${careerGoal}

Please create a comprehensive learning plan with the following structure (respond in valid JSON format only):

{
  "title": "Personalized Learning Plan for [Career Goal]",
  "summary": "Brief overview of the learning journey",
  "modules": [
    {
      "title": "Module Title",
      "description": "What this module covers",
      "lessons": [
        {
          "title": "Lesson Title",
          "description": "What this lesson teaches",
          "duration": "estimated time in minutes",
          "difficulty": "beginner/intermediate/advanced",
          "resources": ["resource type 1", "resource type 2"]
        }
      ]
    }
  ],
  "estimatedDuration": "total estimated time",
  "prerequisites": ["any prerequisites"],
  "learningOutcomes": ["what the user will learn"]
}

Focus on practical, actionable learning steps that will help achieve the career goal. Include a mix of theoretical knowledge and hands-on projects.`;
  }

  parseLLMResponse(content) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.error('Failed to parse LLM response:', error);
      return this.generateMockPlan();
    }
  }

  generateMockPlan(resumeText, careerGoal) {
    const careerGoalShort = careerGoal ? careerGoal.substring(0, 30) : 'Software Developer';
    
    return {
      title: `Personalized Learning Plan for ${careerGoalShort}`,
      summary: `A comprehensive learning journey designed to help you transition into ${careerGoalShort}. This plan is based on your current skills and career aspirations.`,
      modules: [
        {
          title: "Foundation Skills",
          description: "Build the core fundamentals needed for your career transition",
          lessons: [
            {
              title: "Programming Fundamentals",
              description: "Learn basic programming concepts and problem-solving",
              duration: "120",
              difficulty: "beginner",
              resources: ["Video Lectures", "Interactive Exercises", "Coding Challenges"]
            },
            {
              title: "Data Structures & Algorithms",
              description: "Master essential data structures and algorithmic thinking",
              duration: "180",
              difficulty: "intermediate",
              resources: ["Online Course", "Practice Problems", "Code Reviews"]
            }
          ]
        },
        {
          title: "Core Technologies",
          description: "Master the specific technologies relevant to your career goal",
          lessons: [
            {
              title: "Modern Web Development",
              description: "Learn HTML, CSS, JavaScript and modern frameworks",
              duration: "240",
              difficulty: "intermediate",
              resources: ["Project-Based Learning", "Documentation", "Community Forums"]
            },
            {
              title: "Backend Development",
              description: "Build robust server-side applications and APIs",
              duration: "200",
              difficulty: "intermediate",
              resources: ["Hands-on Projects", "API Documentation", "Best Practices"]
            }
          ]
        },
        {
          title: "Advanced Concepts",
          description: "Dive deep into advanced topics and real-world applications",
          lessons: [
            {
              title: "System Design",
              description: "Learn to design scalable and efficient systems",
              duration: "300",
              difficulty: "advanced",
              resources: ["Case Studies", "Architecture Patterns", "System Design Interviews"]
            },
            {
              title: "DevOps & Deployment",
              description: "Master deployment, CI/CD, and infrastructure management",
              duration: "180",
              difficulty: "intermediate",
              resources: ["Cloud Platforms", "Automation Tools", "Best Practices"]
            }
          ]
        }
      ],
      estimatedDuration: "40 hours",
      prerequisites: ["Basic computer literacy", "Willingness to learn"],
      learningOutcomes: [
        "Proficiency in modern programming languages",
        "Understanding of software development lifecycle",
        "Ability to build and deploy web applications",
        "Problem-solving and algorithmic thinking skills"
      ]
    };
  }
}

module.exports = new LLMService(); 