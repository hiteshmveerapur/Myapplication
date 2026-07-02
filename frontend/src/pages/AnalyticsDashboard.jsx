
import { useEffect, useState } from "react";
import api from "../services/api";

function AnalyticsDashboard() {

  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {

      setLoading(true);

      const [
        studentsRes,
        teachersRes,
        subjectsRes,
        attendanceRes,
        leavesRes,
      ] = await Promise.all([
        api.get("/students"),
        api.get("/teachers"),
        api.get("/subjects"),
        api.get("/attendance"),
        api.get("/leaves"),
      ]);

      setStudents(studentsRes.data);
      setTeachers(teachersRes.data);
      setSubjects(subjectsRes.data);
      setAttendance(attendanceRes.data);
      setLeaves(leavesRes.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  const present =
    attendance.filter(
      (a) => a.status === "Present"
    ).length;

  const absent =
    attendance.filter(
      (a) => a.status === "Absent"
    ).length;

  const late =
    attendance.filter(
      (a) => a.status === "Late"
    ).length;

  const attendancePercentage =
    attendance.length === 0
      ? 0
      : (
          (present / attendance.length) *
          100
        ).toFixed(1);

  const approvedLeaves =
    leaves.filter(
      (l) => l.status === "Approved"
    ).length;

  const pendingLeaves =
    leaves.filter(
      (l) => l.status === "Pending"
    ).length;

  const rejectedLeaves =
    leaves.filter(
      (l) => l.status === "Rejected"
    ).length;

  const departmentStats = {};

  students.forEach((student) => {

    departmentStats[
      student.department
    ] =
      (departmentStats[
        student.department
      ] || 0) + 1;

  });

  if (loading) {

    return (

      <div className="container text-center mt-5">

        <div className="spinner-border text-primary"></div>

      </div>

    );

  }
  
  return (
    <div className="container mt-4">

      <h2 className="mb-4 fw-bold">
        📊 Analytics Dashboard
      </h2>

      {/* Summary Cards */}

      <div className="row">

        <div className="col-md-2 mb-3">
          <div className="card shadow border-0 text-center">
            <div className="card-body">
              <h6>Total Students</h6>
              <h2 className="text-primary">
                {students.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-2 mb-3">
          <div className="card shadow border-0 text-center">
            <div className="card-body">
              <h6>Teachers</h6>
              <h2 className="text-success">
                {teachers.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-2 mb-3">
          <div className="card shadow border-0 text-center">
            <div className="card-body">
              <h6>Subjects</h6>
              <h2 className="text-warning">
                {subjects.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow border-0 text-center">
            <div className="card-body">
              <h6>Attendance Records</h6>
              <h2 className="text-info">
                {attendance.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow border-0 text-center">
            <div className="card-body">
              <h6>Leave Requests</h6>
              <h2 className="text-danger">
                {leaves.length}
              </h2>
            </div>
          </div>
        </div>

      </div>

      {/* Attendance Statistics */}

      <div className="card shadow border-0 mt-4">

        <div className="card-header bg-primary text-white">
          Attendance Statistics
        </div>

        <div className="card-body">

          <div className="mb-3">

            <div className="d-flex justify-content-between">

              <span>Overall Attendance</span>

              <strong>
                {attendancePercentage}%
              </strong>

            </div>

            <div className="progress">

              <div
                className="progress-bar bg-success"
                style={{
                  width: `${attendancePercentage}%`,
                }}
              />

            </div>

          </div>

          <div className="row text-center">

            <div className="col-md-4">

              <div className="alert alert-success">

                <h4>{present}</h4>

                Present

              </div>

            </div>

            <div className="col-md-4">

              <div className="alert alert-danger">

                <h4>{absent}</h4>

                Absent

              </div>

            </div>

            <div className="col-md-4">

              <div className="alert alert-warning">

                <h4>{late}</h4>

                Late

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Leave Statistics */}

      <div className="card shadow border-0 mt-4">

        <div className="card-header bg-dark text-white">
          Leave Statistics
        </div>

        <div className="card-body">

          <div className="row text-center">

            <div className="col-md-4">

              <div className="alert alert-success">

                <h4>{approvedLeaves}</h4>

                Approved

              </div>

            </div>

            <div className="col-md-4">

              <div className="alert alert-warning">

                <h4>{pendingLeaves}</h4>

                Pending

              </div>

            </div>

            <div className="col-md-4">

              <div className="alert alert-danger">

                <h4>{rejectedLeaves}</h4>

                Rejected

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Department Statistics */}

      <div className="card shadow border-0 mt-4">

        <div className="card-header bg-secondary text-white">

          Department-wise Students

        </div>

        <div className="card-body">

          <table className="table table-striped">

            <thead>

              <tr>

                <th>Department</th>

                <th>Total Students</th>

              </tr>

            </thead>

            <tbody>

              {Object.keys(departmentStats).length === 0 ? (

                <tr>

                  <td
                    colSpan="2"
                    className="text-center"
                  >
                    No Data Available
                  </td>

                </tr>

              ) : (

                Object.entries(departmentStats).map(
                  ([department, total]) => (

                    <tr key={department}>

                      <td>{department}</td>

                      <td>{total}</td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default AnalyticsDashboard;



