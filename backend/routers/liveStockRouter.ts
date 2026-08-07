import express from 'express';
import upload from '../config/multerConfig';
import {
  getAllLivestock,
  getLivestockById,
  getLivestockByUserId,
  addLivestock,
  updateLivestock,
  deleteLivestock,
  getFileByLivestockId
} from '../controllers/liveStockController';
import { validateToken } from '../authUtils';

const router = express.Router();

router.get('/getAllLivestock', validateToken, getAllLivestock);
router.get('/getLivestockById/:id', validateToken, getLivestockById);
router.get('/getLivestockByUserId/:id', validateToken, getLivestockByUserId);
router.post('/addLivestock', validateToken, upload.single('attachment'), addLivestock);
router.put('/updateLivestock/:id', validateToken, upload.single('attachment'), updateLivestock);
router.delete('/deleteLivestock/:id', validateToken, deleteLivestock);
router.get('/getFileByLivestockId/:id/file', validateToken, getFileByLivestockId);

export default router;
