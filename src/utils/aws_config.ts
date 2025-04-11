import { S3Client } from '@aws-sdk/client-s3';
import { SESClient, } from '@aws-sdk/client-ses';

const region: any = process.env.Region
const accessKeyId: any = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey: any = process.env.AWS_SECRET_ACCESS_KEY

export const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
});

export const sesClient = new SESClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
  