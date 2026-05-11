import express from 'express';
import { chat, getChatHistory, getConversations, deleteConversation } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', chat);
router.get('/history/:sessionId', getChatHistory);
router.get('/conversations', getConversations);
router.delete('/:id', deleteConversation);

export default router;
