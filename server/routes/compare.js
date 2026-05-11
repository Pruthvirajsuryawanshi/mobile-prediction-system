import express from 'express';
import { comparePhones } from '../controllers/compareController.js';

const router = express.Router();

router.post('/', comparePhones);

export default router;
