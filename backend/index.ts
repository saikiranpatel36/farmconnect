import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import cors from 'cors';
import express from 'express';
import path from 'path';

import feedRouter from './routers/feedRouter';
import livestockRouter from './routers/liveStockRouter';
import userRouter from './routers/userRouter';
import requestRouter from './routers/requestRouter';

const app = express();

// only allows requests from the frontend url in .env, single origin for now
app.use(
  cors({
    origin: process.env.FRONT_END_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'X-Powered-By'],
    credentials: false
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// this exposes uploads/ directly without checking the jwt, so technically anyone
// with the file url can view it. fine for a college project, wouldn't ship this as-is
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/feed', feedRouter);
app.use('/livestock', livestockRouter);
app.use('/liveStock', livestockRouter); // frontend uses both casings in a couple places, too lazy to fix rn
app.use('/user', userRouter);
app.use('/request', requestRouter);

app.get('/', (_req, res) => {
  res.json({ message: 'FarmConnect API is running' });
});

const PORT = process.env.SERVER_PORT || 8080;
const MONGO_URI = process.env.MONGO_CONNECTION_URI || 'mongodb://127.0.0.1:27017/farmconnect';

mongoose
  .set('strictQuery', true)
  .connect(MONGO_URI)
  .then(() => {
    console.log('Database is Connected Successfully!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log('Database is Not Connected', error);
  });
