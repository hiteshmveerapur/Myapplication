import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import StudentQRCode from "../components/StudentQRCode";
import DownloadIDCard from "../components/DownloadIDCard";
import PhotoUpload from "../components/PhotoUpload";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://myapplication-backend.onrender.com";

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [percentage, setPercentage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [presentCount, setPresentCount] = useState(0); 

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user?._id) {
      loadDashboard();
    }
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const studentRes = await api.get("/students");
      const currentStudent = studentRes.data.find(
        (s) => String(s.userId) === String(user._id)
      );

      if (!currentStudent) {
        setLoading(false);
        return;
      }

      setStudent(currentStudent);

      const attendanceRes = await api.get(`/attendance/student/${currentStudent._id}`);
      setAttendance(attendanceRes.data);

      const calculatedPresents = attendanceRes.data.filter((record) => record.status === "Present").length;
      setPresentCount(calculatedPresents);

      const percentageRes = await api.get(`/attendance/percentage/${currentStudent._id}`);
      setPercentage(percentageRes.data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getProfileImageUrl = () => {
    if (student?.profileImage) {
      if (student.profileImage.startsWith("http")) return student.profileImage;
      
      const cleanPath = student.profileImage.replace(/\\/g, '/');
      const imagePath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
        
      return `${API_BASE_URL}${imagePath}?t=${new Date().getTime()}`;
    }
    return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  };

  if (!localStorage.getItem("token")) return <Navigate to="/" replace />;
  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border text-primary"></div></div>;
  if (!student) return <div className="container mt-5"><div className="alert alert-danger">Student profile not found.</div></div>;
  
  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4 fw-bold">🎓 Student Dashboard</h2>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-lg-4 mb-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-primary text-white fw-bold">Student Profile</div>
            <div className="card-body">
              <p className="mb-2"><strong>Name:</strong> {student.name}</p>
              <p className="mb-2"><strong>Student ID:</strong> {student.studentId}</p>
              <p className="mb-2"><strong>Email:</strong> {student.email}</p>
              <p className="mb-2"><strong>Department:</strong> {student.department}</p>
              <p className="mb-2"><strong>Semester:</strong> {student.semester}</p>
              <p className="mb-0"><strong>Section:</strong> {student.section}</p>
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-3">
          <div className="card shadow-sm border-0 text-center h-100">
            <div className="card-header bg-success text-white fw-bold">Attendance Percentage</div>
            <div className="card-body d-flex flex-column justify-content-center">
              <h1 className="display-4 text-success fw-bold mb-0">
                {percentage?.attendancePercentage || (attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) + "%" : "0%")}
              </h1>
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-3">
          <div className="card shadow-sm border-0 text-center h-100">
            <div className="card-header bg-warning text-dark fw-bold">Attendance Summary</div>
            <div className="card-body">
              <div className="row h-100 align-items-center">
                <div className="col-6 border-end">
                  <h6 className="text-muted text-uppercase mb-2">Total Classes</h6>
                  <h2 className="text-dark mb-0">{percentage?.totalClasses || attendance.length}</h2>
                </div>
                <div className="col-6">
                  <h6 className="text-muted text-uppercase mb-2">Present</h6>
                  <h2 className="text-success mb-0">{presentCount}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Left Column: ID Card & Download */}
        <div className="col-lg-5 mb-4 d-flex flex-column align-items-center">
          
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ width: "350px", backgroundColor: "#fff" }} id="student-card">
            
            {/* FIXED OVERLAP: Added pt-4 and pb-5 (padding bottom) to give the text more room */}
            <div className="bg-dark text-white text-center pt-4 pb-5 position-relative">
              <h4 className="mb-0 fw-bold text-uppercase tracking-wide">CITY UNIVERSITY</h4>
              <small className="text-light opacity-75 letter-spacing-1">STUDENT IDENTITY CARD</small>
            </div>
            
            <div className="card-body text-center pt-0 pb-3">
              {/* FIXED OVERLAP: Changed marginTop to -50px so it sits in the empty space below the text */}
              <div className="mb-3 position-relative" style={{ marginTop: "-50px", zIndex: 2 }}>
                <img
                  src={getProfileImageUrl()}
                  alt={student.name}
                  crossOrigin="anonymous"
                  className="rounded-3 shadow-sm bg-white p-1"
                  style={{ 
                    width: "130px", 
                    height: "150px", 
                    objectFit: "cover",
                    border: "3px solid #0d6efd",
                  }}
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                  }}
                />
              </div>
              
              <h4 className="fw-bold text-dark mb-0">{student.name}</h4>
              <p className="text-primary fw-bold mb-3">{student.studentId}</p>

              <div className="text-start px-3 mb-4 mx-auto" style={{ maxWidth: "300px" }}>
                <div className="d-flex border-bottom pb-2 mb-2">
                  <span className="text-muted small w-50">Course:</span>
                  <span className="fw-bold small w-50 text-end">{student.department}</span>
                </div>
                <div className="d-flex border-bottom pb-2 mb-2">
                  <span className="text-muted small w-50">Semester:</span>
                  <span className="fw-bold small w-50 text-end">{student.semester} (Sec {student.section})</span>
                </div>
                <div className="d-flex mb-2">
                  <span className="text-muted small w-25">Email:</span>
                  <span className="fw-bold small w-75 text-end text-truncate">{student.email}</span>
                </div>
              </div>

              <div className="d-flex justify-content-center mb-2">
                <div className="p-2 bg-light rounded-3 border">
                  <StudentQRCode studentId={student._id} />
                </div>
              </div>
              <p className="text-muted small mb-0" style={{ fontSize: "0.7rem" }}>Scan for digital verification</p>
            </div>
            
            <div className="bg-primary py-2 text-center text-white" style={{ fontSize: "0.75rem" }}>
              Property of City University. Valid for current academic year.
            </div>
          </div>

          <div className="mt-4 w-100 text-center" style={{ width: "350px" }}>
            <DownloadIDCard />
          </div>
        </div>

        {/* Right Column: Photo Upload & History */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-info text-white fw-bold">
              <i className="bi bi-camera me-2"></i> Update Profile Photo
            </div>
            <div className="card-body">
              <PhotoUpload 
                currentPhotoUrl={getProfileImageUrl()} 
                hasCustomPhoto={!!student.profileImage} 
                onUploadSuccess={loadDashboard} 
              />
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-header bg-secondary text-white fw-bold">
              <i className="bi bi-clock-history me-2"></i> Recent Attendance History
            </div>
            <div className="card-body p-0">
              <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
                <table className="table table-striped table-hover mb-0 align-middle">
                  <thead className="table-light sticky-top">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th>Subject</th>
                      <th>Status</th>
                      <th className="px-4">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.length === 0 ? (
                      <tr><td colSpan="4" className="text-center py-5 text-muted">No attendance records found yet.</td></tr>
                    ) : (
                      attendance.sort((a,b) => new Date(b.date) - new Date(a.date)).map((item) => (
                        <tr key={item._id}>
                          <td className="px-4 text-muted small">
                            {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </td>
                          <td className="fw-bold text-dark">{item.subjectId?.subjectName || "Unknown Subject"}</td>
                          <td>
                            <span className={`badge rounded-pill px-3 ${item.status === "Present" ? "bg-success" : item.status === "Absent" ? "bg-danger" : "bg-warning text-dark"}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 text-muted small fst-italic">{item.remarks || "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;