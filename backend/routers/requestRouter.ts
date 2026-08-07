import express from 'express';
import {
  getAllRequests,
  getRequestById,
  getRequestsByUserId,
  addRequest,
  updateRequest,
  deleteRequest
} from '../controllers/requestController';
import { validateToken } from '../authUtils';

const router = express.Router();

router.get('/getAllRequests', validateToken, getAllRequests);
router.post('/addRequest', validateToken, addRequest);
router.put('/updateRequest/:id', validateToken, updateRequest);
router.delete('/deleteRequest/:id', validateToken, deleteRequest);
router.get('/getRequestById/:id', validateToken, getRequestById);
router.get('/getRequestsByUserId/:id', validateToken, getRequestsByUserId);

export default router;
