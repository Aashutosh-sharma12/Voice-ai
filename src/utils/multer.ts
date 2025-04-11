import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { NextFunction } from 'express';
import multer from 'multer'
import { s3Client } from './aws_config';
import { StatusCodes } from 'http-status-codes';
import messages from '@Custom_message/index';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
const ffmpegPath = require('ffmpeg-static')
ffmpeg.setFfmpegPath(ffmpegPath);


// Set up multer with memory storage
const storage = multer.memoryStorage();
export const upload = multer({ storage });
// Error handling middleware for Multer

const compressImage = async (fileBuffer: Buffer, fileName: string): Promise<Buffer> => {
  const compressedBuffer = await sharp(fileBuffer)
    // .resize(900, 600)
    .jpeg({ quality: 40 })
    .toBuffer();
  // const metadata = await sharp(fileBuffer).metadata();
  // let image = sharp(fileBuffer);
  // if (metadata.format === 'jpeg') {
  //   image = image.jpeg({ quality: 80 });
  // } else if (metadata.format === 'png') {
  //   image = image.png({ compressionLevel: 8 });
  // } else {
  //     image = image.jpeg({ quality: 80 });
  // }
  // const compressedBuffer = await image.toBuffer();
  return compressedBuffer;
};

//Middleware to check file sizes
export const checkFileSize = (req: any, res: any, next: any) => {
  if (!req.files) return next();
  const maxSizeImage = 10 * 1024 * 1024; // 10 MB
  const maxSizeVideo = 10 * 1024 * 1024; // 10 MB
  const maxSizeDoc = 10 * 1024 * 1024; // 10 MB
  const maxSizeAudio = 10 * 1024 * 1024; // 10 MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const video_allowedTypes = ['video/mp4'];
  const doc_allowedTypes = ['application/pdf', 'application/'];
  const audo_allowedTypes = ['audio/mpeg']
  // Check if req.files is an array (for multiple files) or an object
  const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
  for (const file of files) {
    if (file.mimetype.startsWith('image/')) {
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ error: 'Invalid file type. Only JPG, PNG, and GIF are allowed.', code: 400 });
      }
      if (file.mimetype.startsWith('image/') && file.size > maxSizeImage) {
        return res.status(400).json({ error: `${file.originalname} image file size exceeds 5 MB.`, code: 400 });
      }
    } else if (file.mimetype.startsWith('video/')) {
      if (!video_allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ error: 'Invalid file type. Only MP4 is allowed.', code: 400 });
      }
      if (file.mimetype.startsWith('video/') && file.size > maxSizeVideo) {
        return res.status(400).json({ error: 'Video file size exceeds 10 MB.', code: 400 });
      }
    } else if (file.mimetype.startsWith('application/')) {
      // if (!doc_allowedTypes.includes(file.mimetype)) {
      //   return res.status(400).json({ error: 'Invalid file type. Only pdf is allowed.', code: 400 });
      // }
      if (file.mimetype.startsWith('application/') && file.size > maxSizeDoc) {
        return res.status(400).json({ error: 'Document file size exceeds 10 MB.', code: 400 });
      }
    } else if (file.mimetype.startsWith('audio/')) {
      // if (!audo_allowedTypes.includes(file.mimetype)) {
      //   return res.status(400).json({ error: 'Invalid file type. Only mpeg is allowed.', code: 400 });
      // }
      if (file.mimetype.startsWith('audio/') && file.size > maxSizeAudio) {
        return res.status(400).json({ error: 'Audio file size exceeds 10 MB.', code: 400 });
      }
    } else {
      return res.status(400).json({ error: 'Invalid file.', code: 400 });
    }
  }
  next();
};

export const uploadSingleImage = async (req: any, res: any, next: NextFunction) => {
  const { type } = req.query
  if (!req.files) {
    return res.status(StatusCodes.EXPECTATION_FAILED).json({ error: "message.imageRequired", code: StatusCodes.EXPECTATION_FAILED });
  }
  if (!type) {
    return res.status(StatusCodes.EXPECTATION_FAILED).json({ error: "message.typeRequired", code: StatusCodes.EXPECTATION_FAILED });
  }
  let compressedBuffer;
  const file = req.files.image[0]
  let key;
  let contentType;
  const fileBuffer = file.buffer;
  const fileName = file.originalname;
  const fileType = file.mimetype;
  if (file.mimetype.startsWith('image/')) {
    compressedBuffer = fileBuffer
    key = `images/${type}/${Date.now()}-${fileName}`
    contentType = fileType
  } else if (file.mimetype.startsWith('application/')) {
    compressedBuffer = fileBuffer;
    key = `documents/${type}/${Date.now()}-${fileName}`
    contentType = fileType
  }
  else {
    return res.status(StatusCodes.EXPECTATION_FAILED).json({ error: "message.invalidFile", code: StatusCodes.EXPECTATION_FAILED });
  }

  const params = {
    Bucket: process.env.BucketName,
    Key: key,
    Body: compressedBuffer,
    ContentType: contentType
  };
  const command = new PutObjectCommand(params);
  const data: any = await s3Client.send(command);
  if (data['$metadata'].httpStatusCode == 200) {
    const imageUrl = `https://${process.env.BucketName}.s3.${process.env.Region}.amazonaws.com/${key}`;
    req.imageDetails = imageUrl
    next();
  } else {
    return res.status(StatusCodes.EXPECTATION_FAILED).json({ error: "message.invalidFile", code: StatusCodes.EXPECTATION_FAILED });
  }
};

export const uploadMultiple_images = async (req: any, res: any, next: NextFunction) => {
  const uploadedFiles = req.files;
  const { type } = req.query
  if (!type) {
    return res.status(StatusCodes.EXPECTATION_FAILED).json({ error: "message.typeRequired", code: StatusCodes.EXPECTATION_FAILED });
  }
  // Check if files were uploaded
  if (!uploadedFiles || uploadedFiles.length === 0) {
    return res.status(400).json({ error: "message.nofile_upload", code: StatusCodes.EXPECTATION_FAILED });
  }

  // Log the uploaded files
  const data = uploadedFiles.map(async (file: any) => {
    let key;
    let contentType;
    const fileBuffer = file.buffer;
    const fileName = file.originalname;
    const fileType = file.mimetype;
    if (file.mimetype.startsWith('image/')) {
      key = `images/${type}/${Date.now()}-${fileName}`
      contentType = fileType
    } else if (file.mimetype.startsWith('application/')) {
      key = `documents/${type}/${Date.now()}-${fileName}`
      contentType = fileType
    } else {
      return res.status(StatusCodes.EXPECTATION_FAILED).json({ error: "message.invalidFile", code: StatusCodes.EXPECTATION_FAILED });
    }
    const params = {
      Bucket: process.env.BucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType
    };

    const command = new PutObjectCommand(params);
    const data: any = await s3Client.send(command);
    if (data['$metadata'].httpStatusCode == 200) {
      const imageUrl = `https://${process.env.BucketName}.s3.${process.env.Region}.amazonaws.com/${key}`;
      return imageUrl;
    } else {
      return res.status(StatusCodes.EXPECTATION_FAILED).json({ error: "message.invalidFile", code: StatusCodes.EXPECTATION_FAILED });
    }
  });
  const image_Urls = await Promise.all(data)
  req.imagesUrl = image_Urls
  next();
};
