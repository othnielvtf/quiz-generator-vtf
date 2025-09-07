import { Quiz, Settings, APIResponse } from '../types';

export const generateQuiz = async (subject: string, settings: Settings): Promise<APIResponse> => {
  try {
    const prompt = `Generate a quiz about ${subject} with exactly 5 multiple choice questions. 
    Each question should have 4 options with exactly one correct answer.
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
      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.openrouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Quiz Generator'
        },
        body: JSON.stringify({
          model: settings.model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          response_format: { type: "json_object" }
        }),
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
      quizData = JSON.parse(data.choices[0].message.content);
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