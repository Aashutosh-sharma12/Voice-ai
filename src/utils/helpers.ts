const jwt = require("jsonwebtoken");
import otpGenerator from 'otp-generator'
import axios from 'axios';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { extname } from 'path';
import WordExtractor from 'word-extractor';

function generate_refreshToken(userId: any, role: any) {
  const refreshToken = jwt.sign(
    { id: userId, role: role },
    process.env.JWT_SECRET_TOKEN,
    {
      expiresIn: process.env.refreshToken_expire_time,
    }
  );
  return refreshToken;
}

function generate_accessToken(userId: any, role: any) {
  const accessToken = jwt.sign(
    { id: userId, role: role },
    process.env.JWT_SECRET_TOKEN,
    {
      expiresIn: process.env.accessToken_expire_time,
    }
  );
  return accessToken;
}

function identityGenerator(role: string, count: number) {
  let padding;
  switch (role) {
    case "user":
      padding = "VOU";
      break;
    default:
      padding = "VOU";
  }

  var m = new Date();
  const timestamp = Date.now().toString(36);
  var theID = padding + "" + timestamp.toUpperCase() + "" + count;
  return theID;
}

function generateOtp() {
  const otp = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false
  });
  return otp;
}

async function fetchFile(url: string): Promise<Buffer> {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    maxRedirects: 5, // Adjust based on expected redirect behavior
  });
  return Buffer.from(response.data);
}

/**
 * 
 * Convert Only TXT , PDF, DOC, DOCX INTO JSON/TEXT
 */
async function convertToJsonFromUrl(url: string) {
  try {
    const fileBuffer = await fetchFile(url);
    const extension = extname(url).toLowerCase();
    switch (extension) {
      case '.txt':
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }
        const text = await response.text();
        return text;
      case '.pdf':
        const data = await pdfParse(fileBuffer);
        return data.text; // You may split or structure as needed
      case '.doc':
        console.log('doc_enter block')
        const extractor = new WordExtractor();
        const extracted = await extractor.extract(fileBuffer);
        // Get the extracted text
        const text1 = extracted.getBody();
        return text1;
      case '.docx':
        const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
        return value;
      default:
        console.log("Error : Unsupported file type.")
        throw new Error('Unsupported file type.[File must be TXT, PDF, DOC, DOCX]');
    }
  } catch (err) {
    console.log(err, "sss");
    throw err;
  }
}



export {
  generate_refreshToken,
  generate_accessToken,
  identityGenerator,
  generateOtp,
  convertToJsonFromUrl
};
