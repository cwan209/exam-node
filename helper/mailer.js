"use strict";
const nodemailer = require("nodemailer");
const nconf = require('nconf');

// async..await is not allowed in global scope, must use a wrapper
async function send(mailOptions){

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

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
exports.send = send;

function sendAccountVerificationEmail(email, verificationToken) {

  const link = `${nconf.get('frontEndUrl')}verify?verificationToken=${verificationToken}&email=${email}`;

  let mailOptions = {
    from: 'lukechenluwang@gmail.com', // sender address
    to: email, // list of receivers
    subject: `Please Verify your account: ${email}`, // Subject line
    text: "Hello world?", // plain text body
    html: `<b style="text-align: center">Thank you for signing up, please click on the following link to activate</b>
           <a href="${link}">${link}</a>` // html body
  };

  return send(mailOptions);
}

exports.sendAccountVerificationEmail = sendAccountVerificationEmail;
