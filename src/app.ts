import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';

const app: Application = express();
app.use(express.text());
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://parcel-management-system-ae1b6.web.app'],
    credentials: true,
  }),
);

//https://parcel-management-system-server.vercel.app/api

app.use(cookieParser());
app.use(express.json());

app.use('/api/', router);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
