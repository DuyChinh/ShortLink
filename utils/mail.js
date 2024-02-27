"use strict";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "doanduychinh2102@gmail.com",
    pass: "zyep qddq fows qjrj",
  },
});

const sendMail = async(to, subject, message) => {
    const info = await transporter.sendMail({
      from: '"Duy Chinh Dev" <doanduychinh2102@gmail.com>', // sender address
      to, // list of receivers
      subject,// Subject line
      html: message, // html body
    });
    return info;
}
module.exports = sendMail;