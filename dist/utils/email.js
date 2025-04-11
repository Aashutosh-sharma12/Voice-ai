"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.send_forgotPasswordEmail = exports.send_welcomeEmail = void 0;
const aws_config_1 = require("./aws_config");
const client_ses_1 = require("@aws-sdk/client-ses");
const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');
const loadTemplate = (templateName, context) => {
    const filePath = path.join(__dirname, 'emailTemplates', `${templateName}.html`);
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    return template(context);
};
const sendEmail = async (toAddress, subject, templateName, context) => {
    const htmlBody = loadTemplate(templateName, context);
    const params = {
        Destination: {
            ToAddresses: [toAddress],
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: htmlBody,
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject,
            },
        },
        Source: process.env.SES_VERIFIED_EMAIL, // Must be a verified email in SES
    };
    try {
        const data = await aws_config_1.sesClient.send(new client_ses_1.SendEmailCommand(params));
        console.log('Email sent successfully:', data);
    }
    catch (err) {
        console.error('Error sending email:', err);
    }
};
const send_welcomeEmail = (body) => {
    try {
        // sendEmail(body.email,body.subject,body.templateName,body.context)
        console.log(body);
    }
    catch (err) {
        console.error("Email error :: ", err);
    }
};
exports.send_welcomeEmail = send_welcomeEmail;
const send_forgotPasswordEmail = (body) => {
    try {
        console.log(body);
    }
    catch (err) {
        console.error("Email error :: ", err);
    }
};
exports.send_forgotPasswordEmail = send_forgotPasswordEmail;
