import express from 'express';
import { getLeaveTypes } from '../controllers/leavesTypesController.js';

const router = express.Router();

router.get('/', getLeaveTypes);

export default router;