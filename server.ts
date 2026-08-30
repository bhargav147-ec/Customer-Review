import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy initialization of GoogleGenAI client
function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
});

// Auto-Categorize Reviews with Gemini API
app.post('/api/gemini/categorize', async (req, res) => {
  try {
    const { reviews } = req.body;
    if (!Array.isArray(reviews) || reviews.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide an array of reviews to categorize.' 
      });
    }

    const ai = getGenAIClient();

    const reviewsPayload = reviews.map((r: { id: string; text: string; rating?: number; platform?: string; author?: string }) => ({
      id: r.id,
      text: r.text,
      rating: r.rating,
      platform: r.platform,
      author: r.author,
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `You are an AI customer review categorization specialist.
Analyze the following customer review(s) and classify each one into the single most relevant IssueCategory.

Allowed IssueCategory values:
1. 'service': Wait times, delayed seating, order fulfillment, delivery, table management, reservations, general operations.
2. 'quality': Food preparation, food temperature, taste, freshness, defective or undercooked items, recipe quality, ingredient safety.
3. 'pricing': Overcharging, billing disputes, unexpected fees, expensive items, value for money, receipt errors, refund requests.
4. 'cleanliness': Hygiene, dirty tables/utensils, restrooms, trash, sanitation, hair or foreign objects in food, odors.
5. 'staff': Host or server conduct, friendliness, rudeness, attentiveness, communication, manager attitude, service etiquette.

Reviews to categorize:
${JSON.stringify(reviewsPayload, null, 2)}
`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          description: 'Array of categorized reviews',
          items: {
            type: Type.OBJECT,
            properties: {
              id: {
                type: Type.STRING,
                description: 'The review ID matching the input',
              },
              category: {
                type: Type.STRING,
                enum: ['service', 'quality', 'pricing', 'cleanliness', 'staff'],
                description: 'The classified issue category',
              },
              confidence: {
                type: Type.NUMBER,
                description: 'Confidence score between 0.0 and 1.0 (e.g. 0.95)',
              },
              reasoning: {
                type: Type.STRING,
                description: 'A clear, concise 1-sentence explanation of why this category was chosen.',
              },
            },
            required: ['id', 'category', 'confidence', 'reasoning'],
          },
        },
      },
    });

    const jsonText = response.text?.trim() || '[]';
    const categorizedResults = JSON.parse(jsonText);

    return res.json({
      success: true,
      results: categorizedResults,
      source: 'gemini-3.7-flash',
    });
  } catch (error: any) {
    console.error('Gemini Categorization Error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to auto-categorize with Gemini',
    });
  }
});

// Vite middleware for dev / static for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
