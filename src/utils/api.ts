import { Quiz, Settings, APIResponse } from '../types';

export const generateQuiz = async (subject: string, settings: Settings): Promise<APIResponse> => {
  try {
    // Adjust difficulty level instructions based on the selected difficulty
    let difficultyInstructions = '';
    
    switch(settings.difficulty) {
      case 'easy':
        difficultyInstructions = 'Make the questions suitable for beginners with basic knowledge. Use simple language and straightforward concepts.';
        break;
      case 'medium':
        difficultyInstructions = 'Make the questions moderately challenging, suitable for students with intermediate knowledge.';
        break;
      case 'hard':
        difficultyInstructions = 'Make the questions challenging and complex, suitable for advanced students. Include more nuanced concepts and detailed knowledge requirements.';
        break;
      default:
        difficultyInstructions = 'Make the questions moderately challenging, suitable for students with intermediate knowledge.';
    }
    
    const prompt = `Generate a quiz about ${subject} with exactly 5 multiple choice questions. 
    Each question should have 4 options with exactly one correct answer. Generate specifically for Malaysian Education system.
    
    Difficulty level: ${settings.difficulty.toUpperCase()}
    ${difficultyInstructions}
    
    Format your response as a JSON object with this structure:
    {
      "questions": [
        {
          "question": "Question text here",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0,
          "explanation": "Brief explanation of the correct answer"
        }
      ]
    }
    
    Make sure the JSON is valid and parseable.`;

    let response;

    if (settings.aiSource === 'ollama') {
      response = await fetch(`${settings.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: settings.model,
          prompt: prompt,
          stream: false,
          format: 'json'
        }),
      });
    } else {
      // Prepare request body based on model provider
      const requestBody: any = {
        model: settings.model,
        messages: [{ role: "user", content: prompt }]
      };
      
      // Only add response_format for non-Meta models
      // Meta models like meta-llama/Llama-3 don't support the response_format parameter
      if (!settings.model.includes('meta') && !settings.model.includes('llama')) {
        requestBody.response_format = { type: "json_object" };
      }
      
      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.openrouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin, // Required for OpenRouter
          'X-Title': 'Quiz Generator' // Optional but recommended
        },
        body: JSON.stringify(requestBody),
      });
    }

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    let quizData;

    if (settings.aiSource === 'ollama') {
      quizData = JSON.parse(data.response);
    } else {
      // Handle OpenRouter response
      const content = data.choices[0].message.content;
      try {
        quizData = JSON.parse(content);
      } catch (e) {
        // If the response isn't valid JSON, try to extract JSON from the text
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          quizData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse JSON response from AI model');
        }
      }
    }

    const quiz: Quiz = {
      id: crypto.randomUUID(),
      subject,
      questions: quizData.questions.map((q: any, index: number) => ({
        id: crypto.randomUUID(),
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      })),
      createdAt: new Date().toISOString(),
      aiSource: settings.aiSource
    };

    return { success: true, data: quiz };
  } catch (error) {
    console.error('Quiz generation error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};