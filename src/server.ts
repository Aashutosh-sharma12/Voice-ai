import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import StatusCodes from "http-status-codes";
import "express-async-errors";
import apiRouter from "./routes/app";
import { CustomError } from "@utils/errors";
import adminRoutesBE from "./routes/admin/index";
import { connect } from "@utils/database";
import cors from "cors";
import "@utils/cron_job";
import { checkFileSize, upload, uploadSingleImage } from "@utils/multer";
const app = express();
import path from "path"
import helmet from 'helmet';

/***********************************************************************************
 *                                  Connect DB
 ***********************************************************************************/
connect();

/***********************************************************************************
 *                                  Middlewares
 **********************************************************************************/

// Use CORS middleware with specified options
app.use(cors());

// Common middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Use Helmet for security
app.use(helmet());
app.use(cookieParser());

/***********************************************************************************
 *                         API routes and error handling
 **********************************************************************************/

// Add api router
app.use("/api/v1", apiRouter);

// Admin api router
app.use("/api/v1/admin", adminRoutesBE);

/***********************************************************************************
 *                         API route file upload
 **********************************************************************************/

apiRouter.post('/upload', upload.fields([{ name: 'image', maxCount: 1 }]), checkFileSize, uploadSingleImage, async (req: any, res: Response) => {
  if (req.imageDetails) {
    return res.status(StatusCodes.OK).send({ data: { url: req.imageDetails }, code: StatusCodes.OK, message: 'File uploaded.' })
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Error in file upload',
      message: 'Error in file upload',
      code: StatusCodes.BAD_REQUEST
    });
  }
});

// Error handling
app.use((err: Error | CustomError, req: Request, res: Response, __: NextFunction) => {
  const status = err instanceof CustomError ? err.HttpStatus : StatusCodes.BAD_REQUEST;
  return res.status(status).json({
    error: err.message,
    message: err.message,
    code: status,
  });
}
);

/***********************************************************************************
 *                                  Front-end content
 **********************************************************************************/
app.use(express.static(path.join(__dirname, 'public')));
app.get('/api/v1/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views', 'abouts.html'));
});

app.get('/api/v1/terms_conditions', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views', 'terms_conditions.html'));
});

app.get('/api/v1/contactUs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views', 'contactUs.html'));
});

import { getAuthUrl, setCredentials, addEvent } from "@controllers/user/calender";
app.get('/auth', (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
});

app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  const tokens = await setCredentials(code);
  res.json({ message: 'Google Calendar connected!', tokens });
});

app.get('/add-event', async (req, res) => {
  const event = {
    summary: 'Test Event',
    description: 'Event from Node.js',
    start: { dateTime: '2025-04-11T10:00:00-07:00' },
    end: { dateTime: '2025-04-11T11:00:00-07:00' },
  };
  const result = await addEvent(event);
  res.json(result);
});

export default app;
