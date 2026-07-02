
import { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../services/api";

function Reports() {

  const [loading, setLoading] = useState(false);

  // ===========================
  // Excel Export
  // ===========================

  const downloadExcel = (data, fileName) => {

    const worksheet =
      XLSX.utils.json_to_sheet(data);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Report"
    );

    XLSX.writeFile(
      workbook,
      `${fileName}.xlsx`
    );

  };

  // ===========================
  // Generic PDF Generator
  // ===========================

  const generatePDF = (
    title,
    headers,
    body,
    fileName
  ) => {

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text(
      "Smart Attendance System",
      14,
      15
    );

    doc.setFontSize(13);

    doc.text(title, 14, 24);

    autoTable(doc, {

      startY: 30,

      head: [headers],

      body,

      styles: {

        fontSize: 10,

      },

      headStyles: {

        fillColor: [13, 110, 253],

      },

    });

    doc.save(fileName);

  };

  // ===========================
  // Student Report
  // ===========================

  const exportStudents = async () => {

    try {

      setLoading(true);

      const res =
        await api.get("/students");

      downloadExcel(
        res.data,
        "Students_Report"
      );

    } catch (err) {

      console.log(err);

      alert("Failed to export Students");

    } finally {

      setLoading(false);

    }

  };

  const exportStudentsPDF = async () => {

    try {

      setLoading(true);

      const res =
        await api.get("/students");

      generatePDF(

        "Students Report",

        [
          "Student ID",
          "Name",
          "Email",
          "Department",
          "Semester",
        ],

        res.data.map((student) => [

          student.studentId,

          student.name,

          student.email,

          student.department,

          student.semester,

        ]),

        "Students_Report.pdf"

      );

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  // ===========================
  // Teacher Report
  // ===========================

  const exportTeachers = async () => {

    try {

      setLoading(true);

      const res =
        await api.get("/teachers");

      downloadExcel(
        res.data,
        "Teachers_Report"
      );

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  const exportTeachersPDF = async () => {

    try {

      setLoading(true);

      const res =
        await api.get("/teachers");

      generatePDF(

        "Teachers Report",

        [
          "Name",
          "Email",
          "Department",
        ],

        res.data.map((teacher) => [

          teacher.name,

          teacher.email,

          teacher.department,

        ]),

        "Teachers_Report.pdf"

      );

    } finally {

      setLoading(false);

    }

  };
  
  // ===========================
  // Attendance Report
  // ===========================

  const exportAttendance = async () => {

    try {

      setLoading(true);

      const res =
        await api.get("/attendance");

      downloadExcel(
        res.data,
        "Attendance_Report"
      );

    } catch (err) {

      console.log(err);

      alert("Failed to export attendance report.");

    } finally {

      setLoading(false);

    }

  };

  const exportAttendancePDF = async () => {

    try {

      setLoading(true);

      const res =
        await api.get("/attendance");

      generatePDF(

        "Attendance Report",

        [
          "Student",
          "Subject",
          "Teacher",
          "Status",
          "Date",
        ],

        res.data.map((item) => [

          item.studentId?.name || "-",

          item.subjectId?.subjectName || "-",

          item.teacherId?.name || "-",

          item.status,

          new Date(item.date).toLocaleDateString(),

        ]),

        "Attendance_Report.pdf"

      );

    } catch (err) {

      console.log(err);

      alert("Failed to export attendance report.");

    } finally {

      setLoading(false);

    }

  };

  // ===========================
  // Leave Report
  // ===========================

  const exportLeaves = async () => {

    try {

      setLoading(true);

      const res =
        await api.get("/leaves");

      downloadExcel(
        res.data,
        "Leave_Report"
      );

    } catch (err) {

      console.log(err);

      alert("Failed to export leave report.");

    } finally {

      setLoading(false);

    }

  };

  const exportLeavesPDF = async () => {

    try {

      setLoading(true);

      const res =
        await api.get("/leaves");

      generatePDF(

        "Leave Report",

        [
          "Student",
          "Reason",
          "Status",
          "From",
          "To",
        ],

        res.data.map((leave) => [

          leave.studentId?.name || "-",

          leave.reason,

          leave.status,

          new Date(
            leave.fromDate
          ).toLocaleDateString(),

          new Date(
            leave.toDate
          ).toLocaleDateString(),

        ]),

        "Leave_Report.pdf"

      );

    } catch (err) {

      console.log(err);

      alert("Failed to export leave report.");

    } finally {

      setLoading(false);

    }

  };
  
  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2>Reports Dashboard</h2>

        {loading && (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">
              Loading...
            </span>
          </div>
        )}

      </div>

      <div className="row g-4">

        {/* Students */}

        <div className="col-md-6">

          <div className="card shadow">

            <div className="card-body">

              <h4>Students Report</h4>

              <p className="text-muted">
                Export all student records.
              </p>

              <button
                className="btn btn-success me-2"
                onClick={exportStudents}
              >
                Excel
              </button>

              <button
                className="btn btn-danger"
                onClick={exportStudentsPDF}
              >
                PDF
              </button>

            </div>

          </div>

        </div>

        {/* Teachers */}

        <div className="col-md-6">

          <div className="card shadow">

            <div className="card-body">

              <h4>Teachers Report</h4>

              <p className="text-muted">
                Export all teacher records.
              </p>

              <button
                className="btn btn-success me-2"
                onClick={exportTeachers}
              >
                Excel
              </button>

              <button
                className="btn btn-danger"
                onClick={exportTeachersPDF}
              >
                PDF
              </button>

            </div>

          </div>

        </div>

        {/* Attendance */}

        <div className="col-md-6">

          <div className="card shadow">

            <div className="card-body">

              <h4>Attendance Report</h4>

              <p className="text-muted">
                Export attendance history.
              </p>

              <button
                className="btn btn-success me-2"
                onClick={exportAttendance}
              >
                Excel
              </button>

              <button
                className="btn btn-danger"
                onClick={exportAttendancePDF}
              >
                PDF
              </button>

            </div>

          </div>

        </div>

        {/* Leave */}

        <div className="col-md-6">

          <div className="card shadow">

            <div className="card-body">

              <h4>Leave Report</h4>

              <p className="text-muted">
                Export leave requests.
              </p>

              <button
                className="btn btn-success me-2"
                onClick={exportLeaves}
              >
                Excel
              </button>

              <button
                className="btn btn-danger"
                onClick={exportLeavesPDF}
              >
                PDF
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Reports;


