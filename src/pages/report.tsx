import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import axios from "axios";

type Record = {
  id: string;
  fields: {
    "Full Name": string;
    Email: string;
    Notes: string;
  };
};

type Response = {
  records: Record[];
};

const AirtablePage = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState<any>([]);

  const sendMessage = async (
    recipientId: string,
    messageText: string,
    accessToken: string
  ) => {
    await fetchUser();
    const messageData = {
      recipient: {
        id: recipientId,
      },
      message: {
        text: messageText,
      },
    };

    try {
      const response = await axios.post(
        `https://graph.facebook.com/v13.0/messages?access_token=${accessToken}`,
        messageData
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_BASEID}/${process.env.NEXT_PUBLIC_AIRTABLE_TABLEID}?maxRecords=10&view=Grid%20view`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_APIKEY}`,
          },
        }
      );
      const json = await res.json();
      const { records } = json as Response;
      setRecords(records);
    };

    const fetchToken = async () => {
      const appId = process.env.NEXT_PUBLIC_appId;
      const appSecret = process.env.NEXT_PUBLIC_appSecret;
      const shortLivedUserAccessToken =
        process.env.NEXT_PUBLIC_shortLivedUserAccessToken;

      const url = `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedUserAccessToken}`;

      try {
        axios
          .get(url)
          .then((response) => {
            setToken(response.data.access_token);
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    fetchToken();
  }, []);

  const fetchUser = async () => {
    try {
      const result = await axios.get(
        `https://graph.facebook.com/v13.0/me?access_token=${token}`
      );

      setUserData(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const convertToPdf = async () => {
    const doc = new jsPDF();
    doc.text("Student Report", 20, 20);
    doc.setFontSize(12);
    let y = 30;
    records.forEach((record) => {
      doc.text(`Record ID: ${record.id}`, 10, y);
      doc.text(`Full Name: ${record.fields["Full Name"]}`, 10, y + 10);
      doc.text(`Email: ${record.fields["Email"]}`, 10, y + 20);
      doc.text(`Notes: ${record.fields["Notes"]}`, 10, y + 30);
      y += 50;
    });
    const pdfData = doc.output("arraybuffer");
    const blob = new Blob([pdfData], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  return (
    <div>
      {records?.map((record) => (
        <div key={record.id}>
          <h2>{record.fields["Full Name"]}</h2>
          <p>{record.fields["Email"]}</p>
          <p>{record.fields["Notes"]}</p>
        </div>
      ))}
      <button onClick={convertToPdf}>Convert to PDF</button>
      <button onClick={() => sendMessage(userData.id, "Hello", token)}>
        Send message
      </button>
    </div>
  );
};

export default AirtablePage;
