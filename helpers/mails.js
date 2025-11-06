const nodemailer = require('nodemailer');

require('../lib/env');
/**
 * mail helper to send mail
 */
exports.sendMail = async (mailOptions, callBack) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 2525,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'apikey',
      pass: process.env.AWS_MAIL_PASS,
    },
  });

  // send mail with defined transport object
  return transporter.sendMail(mailOptions, callBack);
};
