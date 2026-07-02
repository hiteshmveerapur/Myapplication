import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../services/api";

function QRCodeScanner({ teacherId, subjectId, onAttendanceMarked }) {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Refs
  const html5QrCodeRef = useRef(null);
  const isProcessingRef = useRef(false);
  const fileInputRef = useRef(null);
  const propsRef = useRef({ teacherId, subjectId, onAttendanceMarked });

  // Keep props synced so the camera knows when the subject changes
  useEffect(() => {
    propsRef.current = { teacherId, subjectId, onAttendanceMarked };
  }, [teacherId, subjectId, onAttendanceMarked]);

  // Initialize the scanner instance once on mount
  useEffect(() => {
    let isMounted = true;
    
    // Tiny delay to protect against React 18 Strict Mode double-mounts
    setTimeout(() => {
      if (!isMounted) return;
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode("qr-reader-container");
      }
    }, 100);

    // Cleanup when leaving the page or component unmounts
    return () => {
      isMounted = false;
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(console.error);
      }
    };
  }, []);

  // --- Core Processing Logic ---
  const processScan = async (decodedText) => {
    // 1. Prevent rapid-fire duplicate scans
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    
    setScanResult(decodedText);
    setErrorMsg("");

    // 2. Play a success beep
    try {
      new Audio("https://www.soundjay.com/buttons/beep-07a.mp3").play().catch(() => {});
    } catch (e) {}

    // 3. Send to Database
    try {
      const { subjectId: currentSub, teacherId: currentTeach, onAttendanceMarked: onMarked } = propsRef.current;
      
      if (!currentSub) {
        alert("Please select a subject first!");
        setScanResult(null);
        isProcessingRef.current = false;
        return;
      }

      await api.post("/attendance", {
        studentId: decodedText,
        subjectId: currentSub,
        teacherId: currentTeach,
        status: "Present",
        remarks: "QR Scanned",
      });

      if (onMarked) onMarked(); // Refresh the table
    } catch (error) {
      console.error("Scan Error:", error);
      setErrorMsg("Failed to mark attendance. Already marked or invalid QR.");
    } finally {
      // 4. Wait 2.5 seconds before allowing the next student to scan
      setTimeout(() => {
        setScanResult(null);
        setErrorMsg("");
        isProcessingRef.current = false;
      }, 2500);
    }
  };

  // --- Custom Controls ---
  const startScanner = async () => {
    if (!html5QrCodeRef.current) return;
    
    try {
      setErrorMsg("");
      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        processScan,
        () => {} // Ignore frame errors
      );
      setIsScanning(true);
    } catch (err) {
      console.error(err);
      setErrorMsg("Could not start camera. Check permissions.");
    }
  };

  const stopScanner = async () => {
    if (!html5QrCodeRef.current) return;

    try {
      if (html5QrCodeRef.current.isScanning || isScanning) {
        await html5QrCodeRef.current.stop();
        setIsScanning(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Stop the live camera if it is currently running
      if (isScanning) await stopScanner();

      // Scan the file invisibly in the background (the 'false' prevents UI stretching)
      const decodedText = await html5QrCodeRef.current.scanFile(file, false);
      processScan(decodedText);
    } catch (err) {
      console.error("File scan error:", err);
      setErrorMsg("Could not read a valid QR code from that image.");
    } finally {
      // Reset the file input so the same image can be uploaded again if needed
      e.target.value = ""; 
    }
  };

  return (
    <div className="d-flex flex-column align-items-center w-100">
      
      {/* --- The Scanner Window --- */}
      <div 
        className="position-relative shadow-sm border-0 rounded-4 overflow-hidden bg-dark d-flex align-items-center justify-content-center"
        style={{ width: "100%", maxWidth: "400px", minHeight: "300px" }}
      >
        {/* The "Camera Off" Overlay (Handled by React) */}
        {!isScanning && (
          <div className="position-absolute text-white opacity-50 d-flex flex-column align-items-center" style={{ zIndex: 10 }}>
            <i className="bi bi-camera-video-off fs-1 mb-2"></i>
            <span className="fw-bold tracking-wide">Camera Off</span>
          </div>
        )}

        {/* The Video Feed (Handled exclusively by the html5-qrcode library) */}
        <div id="qr-reader-container" className="w-100"></div>
      </div>

      {/* --- Custom Control Buttons --- */}
      <div className="d-flex gap-2 w-100 mt-3" style={{ maxWidth: "400px" }}>
        {isScanning ? (
          <button onClick={stopScanner} className="btn btn-outline-danger flex-grow-1 fw-bold shadow-sm">
            <i className="bi bi-stop-circle me-2"></i> Stop Camera
          </button>
        ) : (
          <button onClick={startScanner} className="btn btn-outline-success flex-grow-1 fw-bold shadow-sm">
            <i className="bi bi-play-circle me-2"></i> Start Camera
          </button>
        )}

        {/* Hidden File Input connected to the Upload Button */}
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          style={{ display: "none" }} 
        />
        <button 
          onClick={() => fileInputRef.current.click()} 
          className="btn btn-primary flex-grow-1 fw-bold shadow-sm"
        >
          <i className="bi bi-upload me-2"></i> Upload QR
        </button>
      </div>

      {/* --- Dynamic Status Display --- */}
      <div style={{ height: "70px", width: "100%", maxWidth: "400px" }} className="mt-3">
        {scanResult ? (
          <div className="alert alert-success d-flex align-items-center justify-content-center shadow-sm py-3 animate__animated animate__fadeIn">
            <div className="spinner-border spinner-border-sm me-3" role="status"></div>
            <span className="fs-5">Marking <strong>{scanResult}</strong>...</span>
          </div>
        ) : errorMsg ? (
           <div className="alert alert-danger text-center py-2 shadow-sm animate__animated animate__shakeX">
             <small><i className="bi bi-exclamation-triangle me-2"></i>{errorMsg}</small>
           </div>
        ) : (
          <div className="alert alert-light text-center py-3 border shadow-sm text-muted fw-bold">
            <i className="bi bi-upc-scan me-2 fs-5"></i> Ready to scan ID cards
          </div>
        )}
      </div>

    </div>
  );
}

export default QRCodeScanner;