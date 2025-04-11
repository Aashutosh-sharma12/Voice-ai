import { sesClient } from "./aws_config";
import { SendEmailCommand } from '@aws-sdk/client-ses';

const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');

const loadTemplate = (templateName: any, context: any) => {
  const filePath = path.join(__dirname, 'emailTemplates', `${templateName}.html`);
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const template = handlebars.compile(source);
  return template(context);
};

const sendEmail = async (toAddress: any, subject: any, templateName: any, context: any) => {
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
    const data = await sesClient.send(new SendEmailCommand(params));
    console.log('Email sent successfully:', data);
  } catch (err) {
    console.error('Error sending email:', err);
  }
};

const send_welcomeEmail = (body: any) => {
  try {
    // sendEmail(body.email,body.subject,body.templateName,body.context)
    console.log(body);
  } catch (err) {
    console.error("Email error :: ", err);
  }
}

const send_forgotPasswordEmail = (body: any) => {
  try {
    console.log(body);
  } catch (err) {
    console.error("Email error :: ", err);
  }
}

export {
  send_welcomeEmail,
  send_forgotPasswordEmail
}