const nodemailer = require("nodemailer");

const sendEmailAlert = async (device) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: "Smart IT System",
      to: process.env.ALERT_EMAIL,
      subject: `Device Offline Alert: ${device.deviceName}`,
      text: `Device ${device.deviceName} with IP ${device.ipAddress} is OFFLINE`,
    });

    console.log("Email sent");
  } catch (error) {
    console.error(error);
  }
};

module.exports = sendEmailAlert;