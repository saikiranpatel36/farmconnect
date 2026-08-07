import express from 'express';
import {
  getUserByEmailAndPassword,
  addUser,
  verifyEmail,
  resetPassword
} from '../controllers/userController';

const router = express.Router();

router.post('/signup', addUser);
router.post('/login', getUserByEmailAndPassword);
router.post('/verifyEmail', verifyEmail);
router.post('/resetPassword', resetPassword);

export default router;
