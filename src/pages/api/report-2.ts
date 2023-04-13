import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

type Report = {
  Name: string;
  Report: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const data = [] as Report[];
    const { Name, Report } = req.query;

    data.push({ Name: Name as string, Report: Report as string });

    if (data.length === 0 && data[0].Name === '' && data[0].Report === '') {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.setContent(generateReportHtml(data));

      const pdfBuffer = await page.pdf({ format: 'Letter' });
      await browser.close();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
      res.send(pdfBuffer);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
function generateReportHtml(data: Report[]) {
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
            <div class="report-title">${data[0].Name}'s Report</div>
            <div class="report-date">Generated on: ${new Date().toLocaleDateString()}</div>
          </div>
          <table class="report-table">
            <thead>
              <tr>
                <th>Report</th>
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (measurement) => `
                    <tr>
                      <td>${measurement.Report}</td>
                    </tr>
                  `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </body>
    </html>
  `;
}
