import { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. We add a state to track if the mobile menu is open or closed
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  // Hide Navbar on Login Page
  if (location.pathname === "/") {
    return null;
  }

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = localStorage.getItem("role") || "";

  const logout = () => {
    if (!window.confirm("Are you sure you want to logout?")) {
      return;
    }
    localStorage.clear();
    setIsNavCollapsed(true); // Close menu on logout
    navigate("/");
  };

  const badgeColor = () => {
    switch (role) {
      case "admin": return "bg-danger";
      case "teacher": return "bg-success";
      case "student": return "bg-primary";
      default: return "bg-secondary";
    }
  };

  // 2. A helper function to close the menu when any link is clicked
  const handleMenuClose = () => setIsNavCollapsed(true);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div className="container">
        
        <Link className="navbar-brand fw-bold" to="/" onClick={handleMenuClose}>
          🎓 Smart Attendance
        </Link>

        {/* 3. We change the button to use React's onClick instead of Bootstrap's data-bs attributes */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsNavCollapsed(!isNavCollapsed)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* 4. We dynamically add the "show" class when the button is clicked */}
        <div className={`collapse navbar-collapse ${isNavCollapsed ? '' : 'show'}`} id="navbarNav">
          
          <ul className="navbar-nav me-auto">
            {role === "admin" && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin" onClick={handleMenuClose}>Dashboard</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/subjects" onClick={handleMenuClose}>Subjects</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/attendance" onClick={handleMenuClose}>Attendance</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/leave-management" onClick={handleMenuClose}>Leaves</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/analytics" onClick={handleMenuClose}>Analytics</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/reports" onClick={handleMenuClose}>Reports</NavLink>
                </li>
              </>
            )}

            {role === "teacher" && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/teacher" onClick={handleMenuClose}>Dashboard</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/attendance" onClick={handleMenuClose}>Attendance</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/scan" onClick={handleMenuClose}>QR Scanner</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/leave-management" onClick={handleMenuClose}>Leave Requests</NavLink>
                </li>
              </>
            )}

            {role === "student" && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/student" onClick={handleMenuClose}>Dashboard</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/leave" onClick={handleMenuClose}>Apply Leave</NavLink>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center mt-3 mt-lg-0">
            <div
              className="rounded-circle bg-light text-dark d-flex align-items-center justify-content-center me-3"
              style={{
                width: 40,
                height: 40,
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            <div className="text-white me-3">
              <div className="fw-bold">{user.name}</div>
              <span className={`badge ${badgeColor()}`}>{role.toUpperCase()}</span>
            </div>

            <button className="btn btn-outline-light" onClick={logout}>
              Logout
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;