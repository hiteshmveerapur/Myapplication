import { useState } from "react";
import api from "../services/api";

function AddStudentForm({ onStudentAdded }) {
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    semester: "",
    section: "",
    userId: "123456789012345678901234"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/students", formData);

      alert("Student Added Successfully");

      onStudentAdded();

      setFormData({
        studentId: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        semester: "",
        section: "",
        userId: "123456789012345678901234"
      });
    } catch (error) {
      alert("Failed to Add Student");
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Student</h2>

      <input
        name="studentId"
        placeholder="Student ID"
        value={formData.studentId}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="department"
        placeholder="Department"
        value={formData.department}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="semester"
        placeholder="Semester"
        value={formData.semester}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="section"
        placeholder="Section"
        value={formData.section}
        onChange={handleChange}
      />
      <br /><br />

      <button type="submit">
        Add Student
      </button>
    </form>
  );
}

export default AddStudentForm;