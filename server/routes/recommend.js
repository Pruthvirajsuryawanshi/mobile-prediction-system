import express from 'express';
import { recommend } from '../controllers/recommendController.js';

const router = express.Router();

router.post('/', recommend);

export default router;
