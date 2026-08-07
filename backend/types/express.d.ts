import { JwtPayload } from './auth';

// so req.user works without casting to any everywhere
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
