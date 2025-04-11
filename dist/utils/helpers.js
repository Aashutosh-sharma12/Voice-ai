"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_refreshToken = generate_refreshToken;
exports.generate_accessToken = generate_accessToken;
exports.identityGenerator = identityGenerator;
exports.generateOtp = generateOtp;
exports.convertToJsonFromUrl = convertToJsonFromUrl;
const jwt = require("jsonwebtoken");
const otp_generator_1 = __importDefault(require("otp-generator"));
const axios_1 = __importDefault(require("axios"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const mammoth_1 = __importDefault(require("mammoth"));
const path_1 = require("path");
const word_extractor_1 = __importDefault(require("word-extractor"));
function generate_refreshToken(userId, role) {
    const refreshToken = jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET_TOKEN, {
        expiresIn: process.env.refreshToken_expire_time,
    });
    return refreshToken;
}
function generate_accessToken(userId, role) {
    const accessToken = jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET_TOKEN, {
        expiresIn: process.env.accessToken_expire_time,
    });
    return accessToken;
}
function identityGenerator(role, count) {
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
    const otp = otp_generator_1.default.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });
    return otp;
}
async function fetchFile(url) {
    const response = await axios_1.default.get(url, {
        responseType: 'arraybuffer',
        maxRedirects: 5, // Adjust based on expected redirect behavior
    });
    return Buffer.from(response.data);
}
/**
 *
 * Convert Only TXT , PDF, DOC, DOCX INTO JSON/TEXT
 */
async function convertToJsonFromUrl(url) {
    try {
        const fileBuffer = await fetchFile(url);
        const extension = (0, path_1.extname)(url).toLowerCase();
        switch (extension) {
            case '.txt':
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch file: ${response.statusText}`);
                }
                const text = await response.text();
                return text;
            case '.pdf':
                const data = await (0, pdf_parse_1.default)(fileBuffer);
                return data.text; // You may split or structure as needed
            case '.doc':
                console.log('doc_enter block');
                const extractor = new word_extractor_1.default();
                const extracted = await extractor.extract(fileBuffer);
                // Get the extracted text
                const text1 = extracted.getBody();
                return text1;
            case '.docx':
                const { value } = await mammoth_1.default.extractRawText({ buffer: fileBuffer });
                return value;
            default:
                console.log("Error : Unsupported file type.");
                throw new Error('Unsupported file type.[File must be TXT, PDF, DOC, DOCX]');
        }
    }
    catch (err) {
        console.log(err, "sss");
        throw err;
    }
}
