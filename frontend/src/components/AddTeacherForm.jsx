import { useState } from "react";
import api from "../services/api";

function AddTeacherForm({ onTeacherAdded }) {
  const [formData, setFormData] = useState({
    teacherId: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "", // Replaced semester/section with designation
    userId: "123456789012345678901234" // Kept the hardcoded userId from your reference
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
      // Updated endpoint to /teachers
      await api.post("/teachers", formData);

      alert("Teacher Added Successfully");

      // Trigger the parent component to refresh the teacher list
      onTeacherAdded();

      // Reset the form
      setFormData({
        teacherId: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        designation: "",
        userId: "123456789012345678901234"
      });
    } catch (error) {
      alert("Failed to Add Teacher");
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Teacher</h2>

      <input
        name="teacherId"
        placeholder="Teacher ID"
        value={formData.teacherId}
        onChange={handleChange}
        required
      />
      <br /><br />

      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <br /><br />

      <input
        name="email"
        placeholder="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
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
        required
      />
      <br /><br />

      <input
        name="designation"
        placeholder="Designation (e.g., Professor, Assistant Prof.)"
        value={formData.designation}
        onChange={handleChange}
      />
      <br /><br />

      <button type="submit">
        Add Teacher
      </button>
    </form>
  );
}

export default AddTeacherForm;