import nodemailer from "nodemailer";

const sendEmail = (sender: any, recipient: any, body: any) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.TASKOUT_EMAIL_ACCOUNT,
      pass: process.env.TASKOUT_EMAIL_PASSWORD,
    },
  });

  const mailOptions: nodemailer.SendMailOptions = {
    from: `"${sender.name}" <${sender.email}>`,
    to: recipient,
    subject: "Confirm your registration",
    html: body,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) console.error("NODEMAILER ERROR: ", error);
    else console.log("Email sent: " + info.response);
  });
};

module.exports = sendEmail;
