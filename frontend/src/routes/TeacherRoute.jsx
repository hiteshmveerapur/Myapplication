import { Navigate } from "react-router-dom";

function TeacherRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role !== "teacher") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default TeacherRoute;