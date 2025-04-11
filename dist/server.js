"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
require("express-async-errors");
const app_1 = __importDefault(require("./routes/app"));
const errors_1 = require("./utils/errors");
const index_1 = __importDefault(require("./routes/admin/index"));
const database_1 = require("./utils/database");
const cors_1 = __importDefault(require("cors"));
require("./utils/cron_job");
const multer_1 = require("./utils/multer");
const app = (0, express_1.default)();
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
/***********************************************************************************
 *                                  Connect DB
 ***********************************************************************************/
(0, database_1.connect)();
/***********************************************************************************
 *                                  Middlewares
 **********************************************************************************/
// Use CORS middleware with specified options
app.use((0, cors_1.default)());
// Common middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Use Helmet for security
app.use((0, helmet_1.default)());
app.use((0, cookie_parser_1.default)());
/***********************************************************************************
 *                         API routes and error handling
 **********************************************************************************/
// Add api router
app.use("/api/v1", app_1.default);
// Admin api router
app.use("/api/v1/admin", index_1.default);
/***********************************************************************************
 *                         API route file upload
 **********************************************************************************/
app_1.default.post('/upload', multer_1.upload.fields([{ name: 'image', maxCount: 1 }]), multer_1.checkFileSize, multer_1.uploadSingleImage, async (req, res) => {
    if (req.imageDetails) {
        return res.status(http_status_codes_1.default.OK).send({ data: { url: req.imageDetails }, code: http_status_codes_1.default.OK, message: 'File uploaded.' });
    }
    else {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({
            error: 'Error in file upload',
            message: 'Error in file upload',
            code: http_status_codes_1.default.BAD_REQUEST
        });
    }
});
// Error handling
app.use((err, req, res, __) => {
    const status = err instanceof errors_1.CustomError ? err.HttpStatus : http_status_codes_1.default.BAD_REQUEST;
    return res.status(status).json({
        error: err.message,
        message: err.message,
        code: status,
    });
});
/***********************************************************************************
 *                                  Front-end content
 **********************************************************************************/
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.get('/api/v1/about', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public/views', 'abouts.html'));
});
app.get('/api/v1/terms_conditions', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public/views', 'terms_conditions.html'));
});
app.get('/api/v1/contactUs', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public/views', 'contactUs.html'));
});
const calender_1 = require("./controllers/user/calender");
app.get('/auth', (req, res) => {
    const url = (0, calender_1.getAuthUrl)();
    res.redirect(url);
});
app.get('/oauth2callback', async (req, res) => {
    const code = req.query.code;
    const tokens = await (0, calender_1.setCredentials)(code);
    res.json({ message: 'Google Calendar connected!', tokens });
});
app.get('/add-event', async (req, res) => {
    const event = {
        summary: 'Test Event',
        description: 'Event from Node.js',
        start: { dateTime: '2025-04-11T10:00:00-07:00' },
        end: { dateTime: '2025-04-11T11:00:00-07:00' },
    };
    const result = await (0, calender_1.addEvent)(event);
    res.json(result);
});
exports.default = app;
