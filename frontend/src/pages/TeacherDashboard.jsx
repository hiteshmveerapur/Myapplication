import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import QRCodeScanner from "../components/QRCodeScanner";

function TeacherDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const teacherId = user._id || user.id;

  // --- State Management ---
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    students: 0,
    attendance: 0,
    subjects: 0,
    presentToday: 0,
  });

  // --- Data Loading ---
  useEffect(() => {
    if (teacherId) {
      loadDashboard();
    }
  }, [teacherId]);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [studentRes, subjectRes, attendanceRes] = await Promise.all([
        api.get("/students"),
        api.get("/subjects"),
        api.get("/attendance"),
      ]);

      setStudents(studentRes.data);
      setSubjects(subjectRes.data);
      
      // Sort attendance by newest first for the history table
      const sortedAttendance = attendanceRes.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAttendance(sortedAttendance);

      // Calculate strictly "Present Today"
      const todayStr = new Date().toDateString();
      const todayPresentCount = attendanceRes.data.filter((a) => {
        return a.status === "Present" && new Date(a.date).toDateString() === todayStr;
      }).length;

      setStats({
        students: studentRes.data.length,
        attendance: attendanceRes.data.length,
        subjects: subjectRes.data.length,
        presentToday: todayPresentCount,
      });

      // Auto-select first subject if none is selected
      if (subjectRes.data && subjectRes.data.length > 0 && !selectedSubject) {
        setSelectedSubject(subjectRes.data[0]._id);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // --- Helper Functions ---
  
  // Check if a student is already marked for the selected subject TODAY
  const getTodayAttendance = (studentId) => {
    const today = new Date().toDateString();
    return attendance.find((record) => {
      const recordStudentId = record.studentId?._id || record.studentId;
      const recordSubjectId = record.subjectId?._id || record.subjectId;
      const recordDate = new Date(record.date).toDateString();

      return (
        recordStudentId === studentId &&
        recordSubjectId === selectedSubject &&
        recordDate === today
      );
    });
  };

  const filteredStudents = students.filter((student) => {
    const term = search.toLowerCase();
    return (
      student.name.toLowerCase().includes(term) ||
      student.studentId.toLowerCase().includes(term) ||
      student.department.toLowerCase().includes(term)
    );
  });

  const markAttendance = async (studentId, status) => {
    if (!selectedSubject) {
      alert("Please select a subject first.");
      return;
    }

    try {
      await api.post("/attendance", {
        studentId,
        subjectId: selectedSubject,
        teacherId,
        status,
        remarks: "",
      });

      // Refresh data silently to show the updated status
      loadDashboard();
    } catch (err) {
      console.error(err);
      alert("Attendance marking failed. Check server logs.");
    }
  };

  // --- Auth Checks & Loaders ---
  if (!localStorage.getItem("token")) {
    return <Navigate to="/" replace />;
  }

  if (!teacherId) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger shadow-sm">
          <h4 className="alert-heading">Teacher information not found.</h4>
          <p className="mb-0">Please logout and login again.</p>
        </div>
      </div>
    );
  }

  if (loading && students.length === 0) {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <h4 className="mt-3 text-muted">Loading Teacher Dashboard...</h4>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="container-fluid p-4 mb-5">
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Welcome, {user.name}</h2>
          <p className="text-muted">Teacher Dashboard Overview</p>
        </div>
        <button className="btn btn-primary shadow-sm" onClick={loadDashboard}>
          <i className="bi bi-arrow-clockwise me-2"></i> Refresh Data
        </button>
      </div>

      {/* Top Stats Cards */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3 mb-lg-0">
          <div className="card shadow-sm border-0 text-center h-100 p-3">
            <h6 className="text-muted text-uppercase fw-bold">Total Students</h6>
            <h2 className="text-primary mb-0">{stats.students}</h2>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3 mb-lg-0">
          <div className="card shadow-sm border-0 text-center h-100 p-3">
            <h6 className="text-muted text-uppercase fw-bold">Subjects</h6>
            <h2 className="text-success mb-0">{stats.subjects}</h2>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3 mb-lg-0">
          <div className="card shadow-sm border-0 text-center h-100 p-3">
            <h6 className="text-muted text-uppercase fw-bold">Total Records</h6>
            <h2 className="text-warning mb-0">{stats.attendance}</h2>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card shadow-sm border-0 text-center h-100 p-3">
            <h6 className="text-muted text-uppercase fw-bold">Present Today</h6>
            <h2 className="text-danger mb-0">{stats.presentToday}</h2>
          </div>
        </div>
      </div>

      {/* Middle Section: Profile & Settings */}
      <div className="row mb-4">
        <div className="col-lg-4 mb-4 mb-lg-0">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-primary text-white py-3">
              <h5 className="mb-0">Teacher Profile</h5>
            </div>
            <div className="card-body d-flex flex-column justify-content-center">
              <p className="mb-2"><strong>Name:</strong> {user.name}</p>
              <p className="mb-2"><strong>Email:</strong> {user.email}</p>
              <p className="mb-0"><strong>Role:</strong> <span className="badge bg-secondary text-capitalize">{user.role}</span></p>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-success text-white py-3">
              <h5 className="mb-0">Attendance Control Panel</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label className="form-label fw-bold">Active Subject Context</label>
                  <select
                    className="form-select border-success shadow-none"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                  >
                    {subjects.map((subject) => (
                      <option key={subject._id} value={subject._id}>
                        {subject.subjectName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Search Roster</label>
                  <input
                    className="form-control shadow-none"
                    placeholder="Search by name, ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Scanner */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-dark text-white py-3">
          <h5 className="mb-0">QR Scanner (Auto-Mark)</h5>
        </div>
        <div className="card-body">
          <QRCodeScanner
            teacherId={teacherId}
            subjectId={selectedSubject}
            onAttendanceMarked={loadDashboard}
          />
        </div>
      </div>

      {/* Manual Attendance List */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-warning py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-dark fw-bold">Manual Attendance Roster</h5>
          <span className="badge bg-dark text-white">{new Date().toLocaleDateString()}</span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">Student ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Semester</th>
                  <th className="px-4 text-center">Action / Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No Students Found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => {
                    const existingRecord = getTodayAttendance(student._id);

                    return (
                      <tr key={student._id}>
                        <td className="px-4 text-muted">{student.studentId}</td>
                        <td className="fw-bold">{student.name}</td>
                        <td>{student.department}</td>
                        <td>{student.semester}</td>
                        <td className="px-4 text-center">
                          
                          {/* LOGIC: If marked show Badge, else show Present/Absent Buttons */}
                          {existingRecord ? (
                            <span
                              className={`badge px-3 py-2 ${
                                existingRecord.status === "Present" ? "bg-success" : "bg-danger"
                              }`}
                            >
                              {existingRecord.status}
                            </span>
                          ) : (
                            <div className="d-flex justify-content-center gap-2">
                              <button
                                className="btn btn-success btn-sm px-3"
                                onClick={() => markAttendance(student._id, "Present")}
                              >
                                Present
                              </button>
                              <button
                                className="btn btn-danger btn-sm px-3"
                                onClick={() => markAttendance(student._id, "Absent")}
                              >
                                Absent
                              </button>
                            </div>
                          )}

                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Attendance History Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-info text-white py-3">
          <h5 className="mb-0">Recent Subject Attendance History</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">Student Name</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 ? (
                  <tr>
                     <td colSpan="4" className="text-center py-4 text-muted">No attendance records found.</td>
                  </tr>
                ) : (
                  attendance.slice(0, 10).map((record) => (
                    <tr key={record._id}>
                      <td className="px-4 fw-bold">{record.studentId?.name || "-"}</td>
                      <td>{record.subjectId?.subjectName || "-"}</td>
                      <td>
                        <span
                          className={`badge ${
                            record.status === "Present"
                              ? "bg-success"
                              : record.status === "Absent"
                              ? "bg-danger"
                              : "bg-warning"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 text-muted small">
                        {new Date(record.date).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}

export default TeacherDashboard;