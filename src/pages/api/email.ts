import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    let { records, email } = req.body;

    if (records.length === 0 && email.length === 0) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "",
        pass: "",
      },
    });

    const sendReportByEmail = async (records: any, email: string) => {
      try {
        const mailDetails = {
          from: "",
          to: email,
          subject: "Student Report",
          text: "Please find the attached student report.",
          attachments: [
            {
              filename: "student_report.pdf",
              content: records,
            },
          ],
        };
        await transporter.sendMail(mailDetails);
      } catch (error) {
        console.log(error);
      }
    };

    sendReportByEmail(records, email);
    res.status(200).json({ message: "Report sent successfully.", records });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
