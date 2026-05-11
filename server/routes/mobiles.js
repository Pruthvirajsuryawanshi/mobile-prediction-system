import express from 'express';
import { getAllMobiles, getMobileById, getTrendingMobiles, getBrands } from '../controllers/mobileController.js';

const router = express.Router();

router.get('/', getAllMobiles);
router.get('/trending', getTrendingMobiles);
router.get('/brands', getBrands);
router.get('/:id', getMobileById);

export default router;
