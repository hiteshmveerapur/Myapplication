import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

function DownloadIDCard() {
  
  // Download as PNG Image
  const handleDownloadImage = async () => {
    const cardElement = document.getElementById("student-card");
    if (!cardElement) return;

    try {
      const canvas = await html2canvas(cardElement, {
        useCORS: true,
        allowTaint: true,
        scale: 2, // High resolution
        backgroundColor: "#ffffff",
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "Student_ID_Card.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to download ID card:", error);
    }
  };

  // Download as PDF Document
  const handleDownloadPDF = async () => {
    const cardElement = document.getElementById("student-card");
    if (!cardElement) return;

    try {
      const canvas = await html2canvas(cardElement, {
        useCORS: true,
        allowTaint: true,
        scale: 2, 
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      
      // Calculate dimensions to match the canvas perfectly
      const pdfWidth = canvas.width / 2;
      const pdfHeight = canvas.height / 2;

      // Create a PDF with custom dimensions matching the ID card
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [pdfWidth, pdfHeight]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save("Student_ID_Card.pdf");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  };

  return (
    <div className="d-flex gap-2 w-100">
      <button 
        onClick={handleDownloadImage} 
        className="btn btn-dark flex-grow-1 shadow-sm fw-bold"
      >
        <i className="bi bi-image me-2"></i> Save Image
      </button>
      
      <button 
        onClick={handleDownloadPDF} 
        className="btn btn-danger flex-grow-1 shadow-sm fw-bold"
      >
        <i className="bi bi-file-earmark-pdf me-2"></i> Save PDF
      </button>
    </div>
  );
}

export default DownloadIDCard;