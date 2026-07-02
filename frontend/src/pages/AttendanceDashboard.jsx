import { useEffect, useState } from "react";
import api from "../services/api";

function AttendanceDashboard() {
  // --- Data State ---
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);

  // --- Bulk Marking State ---
  const [selectedSubject, setSelectedSubject] = useState("");
  const [attendanceMap, setAttendanceMap] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get logged-in user (Teacher/Admin)
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // --- Initialization ---
  useEffect(() => {
    fetchStudents();
    fetchSubjects();
    fetchAttendance();
  }, []);

  // Initialize all students to "Present" when student list loads
  useEffect(() => {
    if (students.length > 0) {
      const initialMap = {};
      students.forEach((student) => {
        initialMap[student._id] = { status: "Present", remarks: "" };
      });
      setAttendanceMap(initialMap);
    }
  }, [students]);

  // --- API Calls ---
  const fetchStudents = async () => {
    try {
      const res = await api.get("/students");
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await api.get("/attendance");
      // Sort to show newest records first
      const sortedData = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAttendanceList(sortedData);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  // --- Helper: Check if already marked today ---
  const getTodayAttendance = (studentId) => {
    if (!selectedSubject) return null;
    const today = new Date().toDateString();
    
    return attendanceList.find((record) => {
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

  // --- Handlers for Input ---
  const handleStatusChange = (studentId, newStatus) => {
    setAttendanceMap((prev) => {
      const existingData = prev[studentId] || { status: "Present", remarks: "" };
      return {
        ...prev,
        [studentId]: { ...existingData, status: newStatus },
      };
    });
  };

  const handleRemarksChange = (studentId, newRemarks) => {
    setAttendanceMap((prev) => {
      const existingData = prev[studentId] || { status: "Present", remarks: "" };
      return {
        ...prev,
        [studentId]: { ...existingData, remarks: newRemarks },
      };
    });
  };

  // --- Submit Handler ---
  const submitBulkAttendance = async (e) => {
    e.preventDefault();

    if (!selectedSubject) {
      alert("Please select a subject before submitting attendance.");
      return;
    }

    // Filter out students who already have attendance marked for today
    const unmarkedStudents = students.filter(student => !getTodayAttendance(student._id));

    if (unmarkedStudents.length === 0) {
      alert("All students have already been marked for this subject today.");
      return;
    }

    try {
      setIsSubmitting(true);
      const teacherId = user.teacherId || user.id || user._id;

      // Create an array of API promises ONLY for unmarked students
      const attendancePromises = unmarkedStudents.map((student) => {
        const record = attendanceMap[student._id] || { status: "Present", remarks: "" };
        
        return api.post("/attendance", {
          studentId: student._id,
          subjectId: selectedSubject,
          status: record.status,
          remarks: record.remarks,
          teacherId: teacherId,
        });
      });

      // Send all requests to the backend at once
      await Promise.all(attendancePromises);

      alert(`Attendance Marked Successfully for ${unmarkedStudents.length} student(s)!`);
      
      // Refresh the history table so the UI instantly updates to "Already Marked"
      fetchAttendance(); 

      // Reset defaults back to Present for next use
      const resetMap = {};
      students.forEach((student) => {
        resetMap[student._id] = { status: "Present", remarks: "" };
      });
      setAttendanceMap(resetMap);

    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed To Mark Bulk Attendance. Please check the console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render ---
  return (
    <div className="container mt-4 mb-5">
      
      {/* Header section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Attendance Dashboard</h2>
          <p className="text-muted">Manage daily student attendance quickly</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 text-center p-3">
            <h6 className="text-muted text-uppercase fw-bold">Total Students</h6>
            <h2 className="text-primary mb-0">{students.length}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 text-center p-3">
            <h6 className="text-muted text-uppercase fw-bold">Total Subjects</h6>
            <h2 className="text-success mb-0">{subjects.length}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 text-center p-3">
            <h6 className="text-muted text-uppercase fw-bold">Total Records</h6>
            <h2 className="text-info mb-0">{attendanceList.length}</h2>
          </div>
        </div>
      </div>

      {/* Bulk Attendance Form Container */}
      <div className="card shadow-sm border-0 mb-5">
        <div className="card-header bg-white border-bottom py-3">
          <h4 className="mb-0 text-primary fw-bold">Mark Daily Attendance</h4>
        </div>
        
        <div className="card-body p-4">
          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label fw-bold">1. Select Subject</label>
              <select
                className="form-select form-select-lg shadow-none border-primary"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                required
              >
                <option value="">-- Choose Subject --</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.subjectName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedSubject ? (
            <div className="mt-4 animate__animated animate__fadeIn">
              <div className="d-flex justify-content-between align-items-end mb-3">
                <div>
                  <label className="form-label fw-bold fs-5 mb-0">2. Mark Students</label>
                  <p className="text-muted small mb-0">Unmarked students are Present by default. Toggle to Absent if missing.</p>
                </div>
              </div>
              
              <form onSubmit={submitBulkAttendance}>
                <div className="table-responsive rounded border">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="px-4">Student ID</th>
                        <th>Name</th>
                        <th>Attendance Status</th>
                        <th className="px-4">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => {
                        const existingRecord = getTodayAttendance(student._id);
                        const studentData = attendanceMap[student._id] || { status: "Present", remarks: "" };
                        
                        return (
                          <tr key={student._id}>
                            <td className="px-4 text-muted">{student.studentId}</td>
                            <td className="fw-bold">{student.name}</td>
                            <td>
                              {existingRecord ? (
                                // Show Badge if already marked
                                <span className={`badge px-3 py-2 ${existingRecord.status === "Present" ? "bg-success" : "bg-danger"}`}>
                                  <i className={`bi ${existingRecord.status === "Present" ? "bi-check-circle" : "bi-x-circle"} me-1`}></i>
                                  Marked: {existingRecord.status}
                                </span>
                              ) : (
                                // Show Button Group if not marked
                                <div className="btn-group shadow-sm" role="group">
                                  <button
                                    type="button"
                                    className={`btn btn-sm fw-bold px-3 ${studentData.status === "Present" ? "btn-success" : "btn-outline-success"}`}
                                    onClick={() => handleStatusChange(student._id, "Present")}
                                  >
                                    Present
                                  </button>
                                  <button
                                    type="button"
                                    className={`btn btn-sm fw-bold px-3 ${studentData.status === "Absent" ? "btn-danger" : "btn-outline-danger"}`}
                                    onClick={() => handleStatusChange(student._id, "Absent")}
                                  >
                                    Absent
                                  </button>
                                </div>
                              )}
                            </td>
                            <td className="px-4">
                              {existingRecord ? (
                                // Show static remark text if already marked
                                <span className="text-muted small fst-italic">
                                  {existingRecord.remarks || "No remarks"}
                                </span>
                              ) : (
                                // Show input if not marked
                                <input
                                  type="text"
                                  className="form-control form-control-sm shadow-none"
                                  placeholder="Add remark..."
                                  value={studentData.remarks}
                                  onChange={(e) => handleRemarksChange(student._id, e.target.value)}
                                />
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex justify-content-end mt-4">
                  <button
                    className="btn btn-primary btn-lg px-5 shadow-sm"
                    type="submit"
                    disabled={isSubmitting || students.every(s => getTodayAttendance(s._id))}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : students.every(s => getTodayAttendance(s._id)) ? (
                      "All Marked for Today"
                    ) : (
                      "Submit Attendance"
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="alert alert-secondary mt-4 border-0 text-center p-4">
              <i className="bi bi-arrow-up-circle fs-3 text-muted mb-2 d-block"></i>
              Please select a subject from the dropdown above to view the student list.
            </div>
          )}
        </div>
      </div>

      {/* History Table Container */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-dark text-white py-3">
          <h5 className="mb-0">Recent Attendance History</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Teacher</th>
                  <th>Status</th>
                  <th className="px-4">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {attendanceList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      No attendance records found.
                    </td>
                  </tr>
                ) : (
                  attendanceList.slice(0, 15).map((record) => (
                    <tr key={record._id}>
                      <td className="px-4 text-muted">
                        {new Date(record.date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="fw-bold">{record.studentId?.name || "-"}</td>
                      <td>{record.subjectId?.subjectName || "-"}</td>
                      <td>{record.teacherId?.name || "-"}</td>
                      <td>
                        <span
                          className={`badge rounded-pill px-3 py-2 ${
                            record.status === "Present"
                              ? "bg-success"
                              : record.status === "Absent"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 text-muted small">{record.remarks || "-"}</td>
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

export default AttendanceDashboard;