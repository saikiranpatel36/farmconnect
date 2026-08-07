import express from 'express';
import * as feedController from '../controllers/feedController';
import { validateToken } from '../authUtils';

const router = express.Router();

router.get('/getAllFeeds', validateToken, feedController.getAllFeeds);
router.get('/getFeedById/:id', validateToken, feedController.getFeedById);
router.post('/addFeed', validateToken, feedController.addFeed);
router.put('/updateFeed/:id', validateToken, feedController.updateFeed);
router.delete('/deleteFeed/:id', validateToken, feedController.deleteFeed);

export default router;
