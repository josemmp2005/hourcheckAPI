import express from 'express';
import { getWorkModes } from '../controllers/workModeController.js';

const router = express.Router();

router.get('/', getWorkModes);

export default router;