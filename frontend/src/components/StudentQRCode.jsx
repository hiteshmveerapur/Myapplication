import { useEffect, useState } from "react";
import QRCode from "qrcode";

function StudentQRCode({ studentId }) {
  const [qr, setQr] = useState("");

  useEffect(() => {
    if (studentId) {
      generateQR();
    }
  }, [studentId]);

  const generateQR = async () => {
    try {
      const qrData = await QRCode.toDataURL(studentId);
      setQr(qrData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="text-center">

      <h4 className="mb-3">
        Student QR Code
      </h4>

      {qr ? (
        <img
          src={qr}
          alt="Student QR Code"
          width="220"
          className="img-fluid border rounded p-2"
        />
      ) : (
        <p>Generating QR Code...</p>
      )}

    </div>
  );
}

export default StudentQRCode;