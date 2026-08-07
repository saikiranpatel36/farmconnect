import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from './types/auth';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY as string;

// creates the jwt sent back after login/signup
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
};

// middleware to protect routes - checks Authorization: Bearer <token>
export const validateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  const headerValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;
  const token = headerValue.startsWith('Bearer ') ? headerValue.split(' ')[1] : headerValue;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }
    req.user = decoded as JwtPayload;
    next();
  });
};
