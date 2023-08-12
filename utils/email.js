const nodemailer = require("nodemailer");

const sendCustonEmails = ({ to, msg, sub, template }) => {
  try {
    const transPorter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    transPorter.sendMail(
      {
        to,
        from: process.env.EMAIL,
        subject: sub,
        text: msg,
        html: template,
      },
      (err) => {
        if (err) {
          console.log(err);
          return false;
        } else {
          console.log("Email Send Successfully");
          return true;
        }
      }
    );
  } catch (error) {
    console.log(error);
    return false;
  }
};
module.exports = sendCustonEmails;
