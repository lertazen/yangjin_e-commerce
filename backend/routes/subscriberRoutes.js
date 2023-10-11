import express from 'express';
import { createSubscriber } from '../controllers/subscriberController.js';

const router = express.Router();

router.post('/', createSubscriber);

export default router;
