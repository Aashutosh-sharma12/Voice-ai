"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthUrl = getAuthUrl;
exports.setCredentials = setCredentials;
exports.addEvent = addEvent;
const { google } = require('googleapis');
const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
// Generate auth URL
function getAuthUrl() {
    const SCOPES = ['https://www.googleapis.com/auth/calendar'];
    return oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
}
// Set credentials from code
async function setCredentials(code) {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    return tokens;
}
// Add event to calendar
async function addEvent(event) {
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    const res = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event
    });
    return res.data;
}
