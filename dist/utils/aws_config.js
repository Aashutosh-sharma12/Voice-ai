"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sesClient = exports.s3Client = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const client_ses_1 = require("@aws-sdk/client-ses");
const region = process.env.Region;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
exports.s3Client = new client_s3_1.S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
});
exports.sesClient = new client_ses_1.SESClient({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});
