import { Navigate } from "react-router-dom";

function AdminTeacherRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role !== "admin" && role !== "teacher") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminTeacherRoute;