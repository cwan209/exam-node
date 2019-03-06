"use strict";
const nodemailer = require("nodemailer");
const nconf = require('nconf');

// async..await is not allowed in global scope, must use a wrapper
async function send(to){

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let account = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: nconf.get("smtp:host"),
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: nconf.get("smtp:username"), // generated ethereal user
      pass: nconf.get("smtp:password") // generated ethereal password
    }
  });
  // setup email data with unicode symbols
  let mailOptions = {
    from: 'lukechenluwang@gmail.com', // sender address
    to: to, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>" // html body
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions)

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

exports.send = send;

const sendUserVerificationEmail = to => {
  send(to).catch(console.error);
};

exports.sendUserVerificationEmail = sendUserVerificationEmail;
