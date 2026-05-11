import axios from 'axios';
import dotenv from 'dotenv';
import { SYSTEM_PROMPT, EXTRACT_REQUIREMENTS_PROMPT } from '../prompts/systemPrompts.js';

dotenv.config();

const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.AI_MODEL || 'anthropic/claude-3.5-sonnet';

// Create axios instance for OpenRouter
const openRouterClient = axios.create({
  baseURL: OPENROUTER_BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'HTTP-Referer': 'http://localhost:5173',
    'X-Title': 'MobileAI Recommendation System',
    'Content-Type': 'application/json',
  },
});

/**
 * Extract user requirements from natural language using AI
 */
export async function extractRequirements(userMessage) {
  try {
    const response = await openRouterClient.post('/chat/completions', {
      model: 'openai/gpt-4o-mini', // cheaper model for extraction
      messages: [
        {
          role: 'user',
          content: EXTRACT_REQUIREMENTS_PROMPT + userMessage,
        }
      ],
      max_tokens: 500,
      temperature: 0.1,
    });

    const content = response.data.choices[0]?.message?.content;
    
    // Clean JSON from possible code blocks
    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Error extracting requirements:', error.message);
    return null;
  }
}

/**
 * Stream AI chat response with phone database context
 */
export async function streamChatResponse(messages, phonesContext, res, minimalMode = false) {
  try {
    // Build context message about available phones
    const contextMessage = phonesContext && phonesContext.length > 0
      ? `\n\nAVAILABLE PHONES IN DATABASE (recommend ONLY from these):\n${JSON.stringify(phonesContext, null, 2)}`
      : '\n\nNo specific phones found for these filters. Ask the user to adjust their requirements.';

    let systemWithContext = SYSTEM_PROMPT + contextMessage;

    if (minimalMode) {
      systemWithContext += "\n\nMINIMAL MODE: Be extremely concise. Give recommendations immediately. Do NOT ask any follow-up questions unless absolutely necessary for safety or budget. Focus only on the direct answer.";
    }


    const response = await openRouterClient.post('/chat/completions', {
      model: MODEL,
      messages: [
        { role: 'system', content: systemWithContext },
        ...messages,
      ],
      stream: true,
      max_tokens: 2000,
      temperature: 0.7,
    }, {
      responseType: 'stream',
    });

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    let buffer = '';
    let fullContent = '';

    response.data.on('data', (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === 'data: [DONE]') {
          if (trimmed === 'data: [DONE]') {
            res.write(`data: [DONE]\n\n`);
          }
          continue;
        }
        
        if (trimmed.startsWith('data: ')) {
          try {
            const jsonStr = trimmed.slice(6);
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            
            if (delta) {
              fullContent += delta;
              res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
            }
          } catch (e) {
            // Skip malformed JSON
          }
        }
      }
    });

    response.data.on('end', () => {
      res.write(`data: [DONE]\n\n`);
      res.end();
    });

    response.data.on('error', (err) => {
      console.error('Stream error:', err);
      res.write(`data: ${JSON.stringify({ error: 'Stream error occurred' })}\n\n`);
      res.end();
    });

    return fullContent;
  } catch (error) {
    console.error('OpenRouter API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || 'AI service unavailable');
  }
}

/**
 * Non-streaming AI response for comparison
 */
export async function getChatCompletion(messages, systemPromptOverride = null) {
  try {
    const response = await openRouterClient.post('/chat/completions', {
      model: MODEL,
      messages: [
        { role: 'system', content: systemPromptOverride || SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    return response.data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('AI Completion Error:', error.response?.data || error.message);
    throw new Error('AI service unavailable');
  }
}
