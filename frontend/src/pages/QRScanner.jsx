import { useState, useEffect } from "react";
import QRCodeScanner from "../components/QRCodeScanner";
import api from "../services/api";

function QRScanner() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [subjectId, setSubjectId] = useState("");
  const [subjects, setSubjects] = useState([]);

  // Fetch subjects when the component loads
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("/subjects");
        setSubjects(res.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, []);

  return (
    <div className="container mt-4 mb-5">
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">QR Attendance Scanner</h2>
          <p className="text-muted">Scan student IDs to instantly mark attendance</p>
        </div>
      </div>

      {/* Subject Selection Card */}
      <div className="card shadow-sm border-0 p-4 mb-4">
        <div className="mb-2">
          <label className="form-label fw-bold">1. Select Subject</label>
          <select
            className="form-select form-select-lg border-primary shadow-none"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            <option value="">-- Choose a Subject --</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.subjectName}
              </option>
            ))}
          </select>
          {!subjectId && (
            <small className="text-danger mt-2 d-block">
              <i className="bi bi-exclamation-circle me-1"></i>
              Please select a subject before scanning.
            </small>
          )}
        </div>
      </div>

      {/* Scanner Section */}
      <div className="card shadow-sm border-0 p-4">
        <h5 className="fw-bold mb-3">2. Scan QR Code</h5>
        
        {/* Only render the scanner if a subject is actually selected */}
        {subjectId ? (
          <div className="animate__animated animate__fadeIn">
            <QRCodeScanner
              teacherId={user.teacherId || user.id || user._id}
              subjectId={subjectId}
              onAttendanceMarked={() => {
                console.log("Attendance Marked");
              }}
            />
          </div>
        ) : (
          <div className="alert alert-secondary text-center p-5 border-0 mb-0">
             <div className="fs-1 text-muted mb-3">📸</div>
             <h5 className="text-muted fw-bold">Camera Offline</h5>
             <p className="text-muted mb-0">Select a subject from the dropdown above to activate the scanner.</p>
          </div>
        )}
      </div>

    </div>
  );
}

export default QRScanner;