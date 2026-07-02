import { Navigate } from "react-router-dom";

function StudentRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role !== "student") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default StudentRoute;