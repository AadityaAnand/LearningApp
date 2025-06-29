const axios = require('axios');

class LLMService {
  constructor() {
    this.provider = this.detectProvider();
  }

  detectProvider() {
    if (process.env.LLM_PROVIDER === 'ollama') {
      return 'ollama';
    } else if (process.env.ANTHROPIC_API_KEY) {
      return 'anthropic';
    } else if (process.env.OPENAI_API_KEY) {
      return 'openai';
    } else if (process.env.GOOGLE_API_KEY) {
      return 'google';
    } else {
      return 'mock'; // Fallback to mock responses
    }
  }

  async generateLearningPlan(resumeText, careerGoal, currentRole = '', targetRole = '') {
    try {
      switch (this.provider) {
        case 'ollama':
          return await this.generateWithOllama(resumeText, careerGoal, currentRole, targetRole);
        case 'anthropic':
          return await this.generateWithClaude(resumeText, careerGoal, currentRole, targetRole);
        case 'openai':
          return await this.generateWithOpenAI(resumeText, careerGoal, currentRole, targetRole);
        case 'google':
          return await this.generateWithGemini(resumeText, careerGoal, currentRole, targetRole);
        default:
          return this.generateMockPlan(resumeText, careerGoal, currentRole, targetRole);
      }
    } catch (error) {
      console.error('LLM API error:', error);
      // Fallback to mock plan if API fails
      return this.generateMockPlan(resumeText, careerGoal, currentRole, targetRole);
    }
  }

  async generateWithClaude(resumeText, careerGoal, currentRole = '', targetRole = '') {
    const prompt = this.buildPrompt(resumeText, careerGoal, currentRole, targetRole);
    
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

  async generateWithOpenAI(resumeText, careerGoal, currentRole = '', targetRole = '') {
    const prompt = this.buildPrompt(resumeText, careerGoal, currentRole, targetRole);
    
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

  async generateWithGemini(resumeText, careerGoal, currentRole = '', targetRole = '') {
    const prompt = this.buildPrompt(resumeText, careerGoal, currentRole, targetRole);
    
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

  async generateWithOllama(resumeText, careerGoal, currentRole = '', targetRole = '') {
    const prompt = this.buildPrompt(resumeText, careerGoal, currentRole, targetRole);
    const model = process.env.OLLAMA_MODEL || 'llama2';
    try {
      const response = await axios.post('http://localhost:11434/api/generate', {
        model,
        prompt,
        stream: false
      });
      const content = response.data.response;
      return this.parseLLMResponse(content);
    } catch (error) {
      console.error('Ollama API error:', error);
      return this.generateMockPlan(resumeText, careerGoal, currentRole, targetRole);
    }
  }

  buildPrompt(resumeText, careerGoal, currentRole = '', targetRole = '') {
    return `You are a career development AI that creates personalized learning schedules based on comprehensive resume analysis.

**User Context:**
- Current Resume: ${resumeText || 'No resume provided'}
- Current Position: ${currentRole || '[CURRENT_ROLE]'}
- Target Position: ${targetRole || '[TARGET_ROLE]'}
- Career Goal: ${careerGoal}

**Your Task:**
Analyze the resume thoroughly to identify existing skills, education, and experience. Create a learning schedule that builds upon what they already have and focuses ONLY on skill gaps needed for their target role.

**Analysis Instructions:**
1. Extract current skills, technologies, and tools from resume
2. Identify education level and relevant coursework/certifications
3. Assess work experience and projects
4. Compare against target role requirements
5. Focus learning plan ONLY on missing skills and knowledge gaps

**Output Format (JSON):**
{
  "title": "Personalized Learning Plan: [Current Role] to [Target Role]",
  "disclaimer": "This plan is customized based on your uploaded resume. Skills already demonstrated in your resume are not included in this learning path.",
  "resumeAnalysis": {
    "existingSkills": ["skill1", "skill2", "skill3"],
    "education": "Brief summary of educational background",
    "experience": "Years of experience and relevant roles",
    "strengths": ["strength1", "strength2"]
  },
  "skillGaps": ["gap1", "gap2", "gap3"],
  "duration": "X weeks",
  "overview": "Brief summary focusing on what needs to be learned (not what they already know)",
  "modules": [
    {
      "week": 1,
      "title": "Module Name",
      "objective": "What they'll achieve this week",
      "lessons": [
        {
          "title": "Lesson Title",
          "duration": "15-30 mins",
          "type": "reading|video|practice|project",
          "content": "Detailed lesson content for NEW skills only",
          "resources": ["resource1", "resource2"],
          "prerequisite": "Assumes you already know [existing skill from resume]"
        }
      ],
      "weeklyGoal": "Specific measurable outcome"
    }
  ],
  "timeline": "Realistic timeframe based on existing foundation",
  "nextSteps": ["immediate actions leveraging existing skills"]
}

**Guidelines:**
1. DO NOT include lessons for skills already listed in the resume
2. Build upon their existing education and experience
3. Reference their current skills as prerequisites for advanced topics
4. Create micro-lessons (15-30 minutes each) for NEW skills only
5. Adjust timeline based on their educational background and experience level
6. Include disclaimer about plan being based on resume content
7. Focus on bridging specific gaps rather than starting from scratch
8. Consider their industry experience when suggesting learning approaches`;
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

  generateMockPlan(resumeText, careerGoal, currentRole = '', targetRole = '') {
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