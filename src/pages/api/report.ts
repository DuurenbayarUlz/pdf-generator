import { NextApiRequest, NextApiResponse } from "next";
import pdf from "html-pdf";
import { CreateOptions } from "html-pdf";

type Measurement = {
  type: string;
  value: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    let measurements: Measurement[] = req.body;

    if (measurements.length === 0) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const reportHtml = generateReportHtml(measurements);
    const options: CreateOptions = {
      format: "Letter",
    };

    pdf.create(reportHtml, options).toStream(function (err, stream) {
      if (err)
        return res.status(500).json({ message: "Error generating PDF file" });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=report.pdf");

      stream.pipe(res);
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

function generateReportHtml(measurements: Measurement[]) {
  return `
    <html>
      <head>
        <style>
          .report-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .report-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .report-title {
            font-size: 36px;
            font-weight: bold;
          }
          
          .report-date {
            font-size: 18px;
            font-style: italic;
          }
          
          .report-table {
            margin-top: 20px;
            width: 100%;
            border-collapse: collapse;
            font-size: 18px;
          }
          
          .report-table th {
            background-color: #f2f2f2;
            text-align: left;
            padding: 10px;
          }
          
          .report-table td {
            border: 1px solid #ddd;
            padding: 10px;
          }
        </style>
        <title>Pinecone Student Report</title>
      </head>
      <body>
        <div class="report-container">
          <div class="report-header">
            <div class="report-title">${measurements[0].value}'s Report</div>
            <div class="report-date">Generated on: ${new Date().toLocaleDateString()}</div>
          </div>
          <table class="report-table">
            <thead>
              <tr>
                <th>Skills</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              ${measurements
                .slice(1)
                .map(
                  (measurement) => `
                    <tr>
                      <td>${measurement.type}</td>
                      <td>${measurement.value}</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </body>
    </html>
  `;
}
