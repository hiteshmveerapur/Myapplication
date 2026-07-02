import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
  // --- UI State ---
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("students"); // 'students' or 'teachers'
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    subjects: 0,
    attendance: 0,
    leaves: 0,
  });

  // --- Student State ---
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    semester: "",
    section: "",
    userId: "",
  });

  // --- Teacher State ---
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [editTeacherId, setEditTeacherId] = useState(null);
  const [teacherFormData, setTeacherFormData] = useState({
    teacherId: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    userId: "",
  });

  // --- Initialization & Filtering ---
  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    // Filter Students
    const studentResult = students.filter((student) => {
      return (
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.studentId.toLowerCase().includes(search.toLowerCase()) ||
        student.department.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilteredStudents(studentResult);

    // Filter Teachers
    const teacherResult = teachers.filter((teacher) => {
      return (
        teacher.name.toLowerCase().includes(search.toLowerCase()) ||
        (teacher.teacherId && teacher.teacherId.toLowerCase().includes(search.toLowerCase())) ||
        teacher.department.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilteredTeachers(teacherResult);
  }, [search, students, teachers]);

  const loadDashboard = async () => {
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
      setFilteredStudents(studentsRes.data);
      setFilteredTeachers(teachersRes.data);

      setStats({
        students: studentsRes.data.length,
        teachers: teachersRes.data.length,
        subjects: subjectsRes.data.length,
        attendance: attendanceRes.data.length,
        leaves: leavesRes.data.length,
      });
    } catch (err) {
      console.log(err);
      alert("Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  // --- User Creation Handler ---
  const handleCreateUser = async (role) => {
    const currentData = role === "student" ? formData : teacherFormData;
    
    if (!currentData.name || !currentData.email) {
      alert("Please enter a Name and Email first to create a user account.");
      return;
    }

    try {
      // Assuming your backend route for creating a user is /users or /auth/register
      const res = await api.post("/user", {
        name: currentData.name,
        email: currentData.email,
        password: "123456", // Default password for new accounts
        role: role
      });

      // Get the newly created user's ID
      const newUserId = res.data._id || res.data.user._id;

      // Auto-fill the userId field in the form
      if (role === "student") {
        setFormData({ ...formData, userId: newUserId });
      } else {
        setTeacherFormData({ ...teacherFormData, userId: newUserId });
      }

      alert(`Success! User account created. Default password is '123456'. ID has been auto-filled.`);
    } catch (error) {
      console.log(error);
      alert("Failed to create user. The email might already exist.");
    }
  };

  // --- Student Handlers ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const clearForm = () => {
    setEditId(null);
    setFormData({
      studentId: "",
      name: "",
      email: "",
      phone: "",
      department: "",
      semester: "",
      section: "",
      userId: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/students/${editId}`, formData);
        alert("Student Updated");
      } else {
        await api.post("/students", formData);
        alert("Student Added");
      }
      clearForm();
      loadDashboard();
    } catch (err) {
      console.log(err);
      alert("Operation Failed");
    }
  };

  const editStudent = (student) => {
    setEditId(student._id);
    setFormData({
      studentId: student.studentId,
      name: student.name,
      email: student.email,
      phone: student.phone || "",
      department: student.department,
      semester: student.semester,
      section: student.section || "",
      userId: student.userId,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await api.delete(`/students/${id}`);
      loadDashboard();
      alert("Student Deleted");
    } catch (err) {
      console.log(err);
      alert("Delete Failed");
    }
  };

  // --- Teacher Handlers ---
  const handleTeacherChange = (e) => {
    setTeacherFormData({ ...teacherFormData, [e.target.name]: e.target.value });
  };

  const clearTeacherForm = () => {
    setEditTeacherId(null);
    setTeacherFormData({
      teacherId: "",
      name: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      userId: "",
    });
  };

  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editTeacherId) {
        await api.put(`/teachers/${editTeacherId}`, teacherFormData);
        alert("Teacher Updated");
      } else {
        await api.post("/teachers", teacherFormData);
        alert("Teacher Added");
      }
      clearTeacherForm();
      loadDashboard();
    } catch (err) {
      console.log(err);
      alert("Teacher Operation Failed");
    }
  };

  const editTeacher = (teacher) => {
    setEditTeacherId(teacher._id);
    setTeacherFormData({
      teacherId: teacher.teacherId,
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone || "",
      department: teacher.department,
      designation: teacher.designation || "",
      userId: teacher.userId,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteTeacher = async (id) => {
    if (!window.confirm("Delete this teacher?")) return;
    try {
      await api.delete(`/teachers/${id}`);
      loadDashboard();
      alert("Teacher Deleted");
    } catch (err) {
      console.log(err);
      alert("Delete Failed");
    }
  };

  // --- Render Loading State ---
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <h4 className="mt-3">Loading Dashboard...</h4>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Admin Dashboard</h2>
          <p className="text-muted">Smart Attendance Management System</p>
        </div>
        <button className="btn btn-primary" onClick={loadDashboard}>
          Refresh Dashboard
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-2">
          <div className="card shadow border-0 text-center">
            <div className="card-body">
              <h5>Total Students</h5>
              <h2 className="text-primary">{stats.students}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card shadow border-0 text-center">
            <div className="card-body">
              <h5>Teachers</h5>
              <h2 className="text-success">{stats.teachers}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card shadow border-0 text-center">
            <div className="card-body">
              <h5>Subjects</h5>
              <h2 className="text-warning">{stats.subjects}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow border-0 text-center">
            <div className="card-body">
              <h5>Attendance</h5>
              <h2 className="text-info">{stats.attendance}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow border-0 text-center">
            <div className="card-body">
              <h5>Leave Requests</h5>
              <h2 className="text-danger">{stats.leaves}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-4">
        <button
          className={`btn me-2 ${activeTab === "students" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setActiveTab("students")}
        >
          Manage Students
        </button>
        <button
          className={`btn ${activeTab === "teachers" ? "btn-success" : "btn-outline-success"}`}
          onClick={() => setActiveTab("teachers")}
        >
          Manage Teachers
        </button>
      </div>

      {/* Global Search */}
      <div className="card shadow border-0 mb-4">
        <div className="card-body">
          <input
            className="form-control"
            placeholder={`Search ${activeTab === "students" ? "Students" : "Teachers"} by Name / ID / Department...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ======================= STUDENTS TAB ======================= */}
      {activeTab === "students" && (
        <>
          {/* Student Form */}
          <div className="card shadow border-0 mb-4">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">{editId ? "Edit Student" : "Add New Student"}</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <input className="form-control" placeholder="Student ID" name="studentId" value={formData.studentId} onChange={handleChange} required />
                  </div>
                  <div className="col-md-3 mb-3">
                    <input className="form-control" placeholder="Student Name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="col-md-3 mb-3">
                    <input className="form-control" type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="col-md-3 mb-3">
                    <input className="form-control" placeholder="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                  </div>
                  <div className="col-md-3 mb-3">
                    <input className="form-control" placeholder="Department" name="department" value={formData.department} onChange={handleChange} required />
                  </div>
                  <div className="col-md-3 mb-3">
                    <input className="form-control" type="number" placeholder="Semester" name="semester" value={formData.semester} onChange={handleChange} required />
                  </div>
                  <div className="col-md-3 mb-3">
                    <input className="form-control" placeholder="Section" name="section" value={formData.section} onChange={handleChange} />
                  </div>
                  
                  {/* Updated User ID Input Group with Create Button */}
                  <div className="col-md-3 mb-3">
                    <div className="input-group">
                      <input className="form-control" placeholder="User ID" name="userId" value={formData.userId} onChange={handleChange} required />
                      <button 
                        className="btn btn-secondary" 
                        type="button" 
                        onClick={() => handleCreateUser("student")}
                        title="Auto-create a user account using Name & Email"
                      >
                        + Create
                      </button>
                    </div>
                  </div>

                </div>
                <button className="btn btn-success me-2" type="submit">
                  {editId ? "Update Student" : "Add Student"}
                </button>
                {editId && (
                  <button className="btn btn-secondary" type="button" onClick={clearForm}>Cancel</button>
                )}
              </form>
            </div>
          </div>

          {/* Student Table */}
          <div className="card shadow border-0">
            <div className="card-header bg-dark text-white">
              <h4 className="mb-0">Students List</h4>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover table-bordered">
                  <thead className="table-primary">
                    <tr>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Semester</th>
                      <th>Section</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length === 0 ? (
                      <tr><td colSpan="7" className="text-center">No Students Found</td></tr>
                    ) : (
                      filteredStudents.map((student) => (
                        <tr key={student._id}>
                          <td>{student.studentId}</td>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>{student.department}</td>
                          <td>{student.semester}</td>
                          <td>{student.section}</td>
                          <td>
                            <button className="btn btn-warning btn-sm me-2" onClick={() => editStudent(student)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteStudent(student._id)}>Delete</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ======================= TEACHERS TAB ======================= */}
      {activeTab === "teachers" && (
        <>
          {/* Teacher Form */}
          <div className="card shadow border-0 mb-4">
            <div className="card-header bg-success text-white">
              <h4 className="mb-0">{editTeacherId ? "Edit Teacher" : "Add New Teacher"}</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleTeacherSubmit}>
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <input className="form-control" placeholder="Teacher ID" name="teacherId" value={teacherFormData.teacherId} onChange={handleTeacherChange} required />
                  </div>
                  <div className="col-md-3 mb-3">
                    <input className="form-control" placeholder="Teacher Name" name="name" value={teacherFormData.name} onChange={handleTeacherChange} required />
                  </div>
                  <div className="col-md-3 mb-3">
                    <input className="form-control" type="email" placeholder="Email" name="email" value={teacherFormData.email} onChange={handleTeacherChange} required />
                  </div>
                  <div className="col-md-3 mb-3">
                    <input className="form-control" placeholder="Phone" name="phone" value={teacherFormData.phone} onChange={handleTeacherChange} />
                  </div>
                  <div className="col-md-4 mb-3">
                    <input className="form-control" placeholder="Department" name="department" value={teacherFormData.department} onChange={handleTeacherChange} required />
                  </div>
                  <div className="col-md-4 mb-3">
                    <input className="form-control" placeholder="Designation" name="designation" value={teacherFormData.designation} onChange={handleTeacherChange} />
                  </div>
                  
                  {/* Updated User ID Input Group with Create Button */}
                  <div className="col-md-4 mb-3">
                    <div className="input-group">
                      <input className="form-control" placeholder="User ID" name="userId" value={teacherFormData.userId} onChange={handleTeacherChange} required />
                      <button 
                        className="btn btn-secondary" 
                        type="button" 
                        onClick={() => handleCreateUser("teacher")}
                        title="Auto-create a user account using Name & Email"
                      >
                        + Create
                      </button>
                    </div>
                  </div>

                </div>
                <button className="btn btn-success me-2" type="submit">
                  {editTeacherId ? "Update Teacher" : "Add Teacher"}
                </button>
                {editTeacherId && (
                  <button className="btn btn-secondary" type="button" onClick={clearTeacherForm}>Cancel</button>
                )}
              </form>
            </div>
          </div>

          {/* Teacher Table */}
          <div className="card shadow border-0">
            <div className="card-header bg-dark text-white">
              <h4 className="mb-0">Teachers List</h4>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover table-bordered">
                  <thead className="table-success">
                    <tr>
                      <th>Teacher ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeachers.length === 0 ? (
                      <tr><td colSpan="7" className="text-center">No Teachers Found</td></tr>
                    ) : (
                      filteredTeachers.map((teacher) => (
                        <tr key={teacher._id}>
                          <td>{teacher.teacherId}</td>
                          <td>{teacher.name}</td>
                          <td>{teacher.email}</td>
                          <td>{teacher.phone}</td>
                          <td>{teacher.department}</td>
                          <td>{teacher.designation}</td>
                          <td>
                            <button className="btn btn-warning btn-sm me-2" onClick={() => editTeacher(teacher)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteTeacher(teacher._id)}>Delete</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

export default AdminDashboard;