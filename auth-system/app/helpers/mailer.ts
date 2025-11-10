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
import nodemailer from "nodemailer";
import User from "../models/userModel"; // ✅ use correct import path
import bcryptjs from "bcryptjs";

interface SendEmailParams {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}

export const sendEmail = async ({ email, emailType, userId }: SendEmailParams) => {
  try {
    if (!userId) throw new Error("Missing userId for email sending");

    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail", // simpler + works automatically with port 465 or 587
      auth: {
        user: process.env.NODE_MAILER_USER,
        pass: process.env.NODE_MAILER_PASSWORD,
      },
    });

    // ✅ Use correct link based on type
    const link =
      emailType === "VERIFY"
        ? `${process.env.DOMAIN}/verifyemail?token=${hashedToken}`
        : `${process.env.DOMAIN}/resetpassword?token=${hashedToken}`;

    const mailOptions = {
      from: process.env.NODE_MAILER_USER,
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `
        <p>Click 
          <a href="${link}" target="_blank">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }.
        </p>
        <p>Or copy this link: ${link}</p>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    console.error("❌ Email sending error:", error);
    throw new Error(error.message);
  }
};
