import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  const location = useLocation();

  // Hide navbar on login page
  const hideNavbar = location.pathname === "/";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f7fc",
      }}
    >
      {!hideNavbar && <Navbar />}

      <main
        className="container-fluid py-4"
        style={{
          minHeight: "calc(100vh - 70px)",
        }}
      >
        {children}
      </main>

      {!hideNavbar && (
        <footer
          className="text-center py-3 border-top bg-white mt-auto"
        >
          <small className="text-muted">
            Smart Attendance Management System © 2026
          </small>
        </footer>
      )}
    </div>
  );
}

export default MainLayout;