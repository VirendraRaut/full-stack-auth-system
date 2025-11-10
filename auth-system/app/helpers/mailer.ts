// import nodemailer from "nodemailer";
// import User from "../models/userModel";
// import bcryptjs from "bcryptjs";

// interface SendEmailParams {
//   email: string;
//   emailType: "VERIFY" | "RESET";
//   userId: string;
// }

// export const sendEmail = async ({ email, emailType, userId }: SendEmailParams) => {
//   try {
//     if (!userId) throw new Error("Missing userId for email sending");

//     const hashedToken = await bcryptjs.hash(userId.toString(), 10);

//     if (emailType === "VERIFY") {
//       await User.findByIdAndUpdate(userId, {
//         verifyToken: hashedToken,
//         verifyTokenExpiry: Date.now() + 3600000,
//       });
//     } else if (emailType === "RESET") {
//       await User.findByIdAndUpdate(userId, {
//         forgotPasswordToken: hashedToken,
//         forgotPasswordTokenExpiry: Date.now() + 3600000,
//       });
//     }

//     const transport = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 465,
//         secure: true, // true for port 465
//         auth: {
//           user: process.env.NODE_MAILER_USER,
//           pass: process.env.NODE_MAILER_PASSWORD,
//         },
//       });
      

//     const mailOptions = {
//       from: "virendraraut6021@gmail.com",
//       to: email,
//       subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
//       html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${
//         emailType === "VERIFY" ? "verify your email" : "reset your password"
//       } or copy this link: ${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`,
//     };

//     const mailresponse = await transport.sendMail(mailOptions);
//     return mailresponse;
//   } catch (error: any) {
//     console.error("❌ Email sending error:", error);
//     throw new Error(error.message);
//   }
// };
// app/helpers/mailer.ts
import nodemailer from "nodemailer";
import User from "@/app/models/userModel";
import bcryptjs from "bcryptjs";

interface SendOtpParams {
  email: string;
  userId: string;
  otpLength?: number;
  ttlMinutes?: number;
}

export const sendOtpToEmail = async ({
  email,
  userId,
  otpLength = 6,
  ttlMinutes = 10,
}: SendOtpParams) => {
  try {
    if (!userId) throw new Error("Missing userId for sending OTP");

    // generate numeric OTP (e.g. 6 digits)
    const otp = Math.floor(
      Math.pow(10, otpLength - 1) + Math.random() * 9 * Math.pow(10, otpLength - 1)
    )
      .toString()
      .slice(0, otpLength);

    // hash OTP before storing
    const hashedOtp = await bcryptjs.hash(otp, 10);

    // save hashed OTP & expiry in user doc
    await User.findByIdAndUpdate(userId, {
      forgotPasswordToken: hashedOtp,
      forgotPasswordTokenExpiry: Date.now() + ttlMinutes * 60 * 1000,
    });

    // create transporter (Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODE_MAILER_USER,
        pass: process.env.NODE_MAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.NODE_MAILER_USER,
      to: email,
      subject: "Your password reset OTP",
      html: `
        <p>Use the following OTP to reset your password:</p>
        <h2 style="letter-spacing:4px">${otp}</h2>
        <p>This OTP is valid for ${ttlMinutes} minutes.</p>
      `,
    };

    const mailResponse = await transporter.sendMail(mailOptions);

    // return minimal success info (do NOT return otp in production logs)
    return { ok: true, info: mailResponse };
  } catch (error: any) {
    console.error("❌ sendOtpToEmail error:", error);
    throw new Error(error.message || "Failed to send OTP");
  }
};

