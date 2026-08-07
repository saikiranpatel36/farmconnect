import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, 'uploads/');
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '_' + file.originalname);
  }
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'text/markdown'];
  const extName = /\.(jpeg|jpg|png|pdf|md)$/i.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.includes(file.mimetype);
  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error('Only allowed images (JPEG, JPG, PNG), PDFs, and Markdown files.'));
  }
};

export default multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5mb, hardcoded for now
  },
  fileFilter
});
