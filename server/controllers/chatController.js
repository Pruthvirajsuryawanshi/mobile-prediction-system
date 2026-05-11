import Conversation from '../models/Conversation.js';
import { extractRequirements } from '../ai/openRouter.js';
import { getFilteredPhones, getPhonesByName, formatPhonesForAI } from '../services/recommendationService.js';
import { streamChatResponse } from '../ai/openRouter.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * POST /api/chat
 * Main chat endpoint with streaming
 */
export async function chat(req, res) {
  const { message, sessionId: clientSessionId, conversationId } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  try {
    const sessionId = clientSessionId || uuidv4();

    // Find or create conversation
    let conversation = conversationId
      ? await Conversation.findById(conversationId)
      : await Conversation.findOne({ sessionId });

    if (!conversation) {
      conversation = new Conversation({
        sessionId,
        title: message.slice(0, 50),
        messages: [],
        context: {},
      });
    }

    // Add user message to conversation
    conversation.messages.push({ role: 'user', content: message });

    // Step 1: Extract requirements from user message
    const requirements = await extractRequirements(message);
    
    // Merge with previous context
    if (requirements) {
      if (requirements.budget) conversation.context.budget = requirements.budget;
      if (requirements.brands?.length) conversation.context.preferredBrands = requirements.brands;
      if (requirements.priorities?.length) conversation.context.priorities = requirements.priorities;
    }

    // Step 2: Filter phones from database
    let phonesForAI = [];
    
    if (requirements?.isComparison && requirements?.phoneNames?.length > 0) {
      // Comparison mode - get specific phones
      const phones = await getPhonesByName(requirements.phoneNames);
      phonesForAI = formatPhonesForAI(phones);
    } else {
      // Recommendation mode - use context + current requirements
      const mergedRequirements = {
        ...requirements,
        budget: requirements?.budget || conversation.context.budget,
        brands: requirements?.brands?.length ? requirements.brands : conversation.context.preferredBrands,
        priorities: requirements?.priorities?.length ? requirements.priorities : conversation.context.priorities,
      };

      const phones = await getFilteredPhones(mergedRequirements, 6);
      phonesForAI = formatPhonesForAI(phones);
    }

    // Step 3: Build message history for AI
    const messageHistory = conversation.messages
      .slice(-10)
      .map(msg => ({ role: msg.role, content: msg.content }));

    // Step 4: Stream AI response
    const { minimalMode } = req.body;
    await streamChatResponse(messageHistory, phonesForAI, res, minimalMode);


    // Save conversation (async, don't block response)
    conversation.messages.push({ 
      role: 'assistant', 
      content: '[Streaming response]',
    });
    conversation.save().catch(console.error);

  } catch (error) {
    console.error('Chat error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

/**
 * GET /api/chat/history/:sessionId
 */
export async function getChatHistory(req, res) {
  try {
    const { sessionId } = req.params;
    const conversation = await Conversation.findOne({ sessionId }).lean();
    
    if (!conversation) {
      return res.json({ success: true, data: null });
    }

    res.json({ success: true, data: conversation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * GET /api/chat/conversations
 */
export async function getConversations(req, res) {
  try {
    const conversations = await Conversation.find({ isActive: true })
      .select('title sessionId createdAt')
      .sort({ updatedAt: -1 })
      .limit(20)
      .lean();

    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * DELETE /api/chat/:id
 */
export async function deleteConversation(req, res) {
  try {
    await Conversation.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Conversation deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
