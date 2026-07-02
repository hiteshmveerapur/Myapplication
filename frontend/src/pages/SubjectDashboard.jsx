import { useEffect, useState } from "react";
import api from "../services/api";

function SubjectDashboard() {

  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    subjectCode: "",
    subjectName: "",
    department: "",
    semester: "",
    credits: 3,
    teacherId: "",
  });

  useEffect(() => {
    fetchSubjects();
    fetchTeachers();
  }, []);

  // ===========================
  // Fetch Subjects
  // ===========================

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ===========================
  // Fetch Teachers
  // ===========================

  const fetchTeachers = async () => {
    try {
      const res = await api.get("/teachers");
      setTeachers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ===========================
  // Handle Input Change
  // ===========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===========================
  // Clear Form
  // ===========================

  const clearForm = () => {
    setEditId(null);

    setFormData({
      subjectCode: "",
      subjectName: "",
      department: "",
      semester: "",
      credits: 3,
      teacherId: "",
    });
  };

  // ===========================
  // Add / Update Subject
  // ===========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (editId) {

        await api.put(`/subjects/${editId}`, formData);

        alert("Subject Updated Successfully");

      } else {

        await api.post("/subjects", formData);

        alert("Subject Added Successfully");

      }

      clearForm();

      fetchSubjects();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Operation Failed"
      );

    }
  };

  // ===========================
  // Edit Subject
  // ===========================

  const handleEdit = (subject) => {

    setEditId(subject._id);

    setFormData({
      subjectCode: subject.subjectCode,
      subjectName: subject.subjectName,
      department: subject.department,
      semester: subject.semester,
      credits: subject.credits,
      teacherId: subject.teacherId?._id || "",
    });

  };

  // ===========================
  // Delete Subject
  // ===========================

  const deleteSubject = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this subject?"
    );

    if (!confirmDelete) return;

    try {

      await api.delete(`/subjects/${id}`);

      alert("Subject Deleted Successfully");

      fetchSubjects();

    } catch (error) {

      console.log(error);

      alert("Delete Failed");

    }
  };

  return (

    <div className="container mt-4">

      <h2 className="mb-4">
        Subject Dashboard
      </h2>

      <div className="card shadow p-4 mb-4">

        <h4 className="mb-3">

          {editId
            ? "Edit Subject"
            : "Add Subject"}

        </h4>

        <form onSubmit={handleSubmit}>
          <div className="row">

            <div className="col-md-6 mb-3">

              <label className="form-label">
                Subject Code
              </label>

              <input
                type="text"
                className="form-control"
                name="subjectCode"
                value={formData.subjectCode}
                onChange={handleChange}
                required
              />

            </div>

            <div className="col-md-6 mb-3">

              <label className="form-label">
                Subject Name
              </label>

              <input
                type="text"
                className="form-control"
                name="subjectName"
                value={formData.subjectName}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          <div className="row">

            <div className="col-md-6 mb-3">

              <label className="form-label">
                Department
              </label>

              <input
                type="text"
                className="form-control"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              />

            </div>

            <div className="col-md-3 mb-3">

              <label className="form-label">
                Semester
              </label>

              <input
                type="number"
                className="form-control"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
              />

            </div>

            <div className="col-md-3 mb-3">

              <label className="form-label">
                Credits
              </label>

              <input
                type="number"
                className="form-control"
                name="credits"
                value={formData.credits}
                onChange={handleChange}
              />

            </div>

          </div>

          <div className="mb-3">

            <label className="form-label">
              Assign Teacher
            </label>

            <select
              className="form-select"
              name="teacherId"
              value={formData.teacherId}
              onChange={handleChange}
            >

              <option value="">
                Select Teacher
              </option>

              {teachers.map((teacher) => (

                <option
                  key={teacher._id}
                  value={teacher._id}
                >
                  {teacher.name}
                </option>

              ))}

            </select>

          </div>

          <button
            type="submit"
            className="btn btn-primary"
          >
            {editId
              ? "Update Subject"
              : "Add Subject"}
          </button>

          {editId && (

            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={clearForm}
            >
              Cancel
            </button>

          )}

        </form>

      </div>

      <div className="card shadow p-3">

        <h4 className="mb-3">
          Subjects List
        </h4>

        <div className="table-responsive">

          <table className="table table-bordered table-striped">

            <thead className="table-dark">

              <tr>

                <th>Code</th>

                <th>Name</th>

                <th>Department</th>

                <th>Semester</th>

                <th>Credits</th>

                <th>Teacher</th>

                <th>Actions</th>

              </tr>

            </thead>

            <tbody>
              {subjects.length > 0 ? (

                subjects.map((subject) => (

                  <tr key={subject._id}>

                    <td>{subject.subjectCode}</td>

                    <td>{subject.subjectName}</td>

                    <td>{subject.department}</td>

                    <td>{subject.semester}</td>

                    <td>{subject.credits}</td>

                    <td>
                      {subject.teacherId?.name || "Not Assigned"}
                    </td>

                    <td>

                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEdit(subject)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm ms-2"
                        onClick={() =>
                          deleteSubject(subject._id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="text-center text-muted"
                  >
                    No Subjects Found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}

export default SubjectDashboard;
        