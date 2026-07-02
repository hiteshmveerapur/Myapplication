import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import TeacherDashboard from "../pages/TeacherDashboard";
import StudentDashboard from "../pages/StudentDashboard";

import LeavePage from "../pages/LeavePage";
import LeaveManagement from "../pages/LeaveManagement";

import QRScanner from "../pages/QRScanner";
import AdminTeacherRoute from "./AdminTeacherRoute";
import SubjectDashboard from "../pages/SubjectDashboard";
import AttendanceDashboard from "../pages/AttendanceDashboard";

import AnalyticsDashboard from "../pages/AnalyticsDashboard";
import Reports from "../pages/Reports";

import AdminRoute from "./AdminRoute";
import TeacherRoute from "./TeacherRoute";
import StudentRoute from "./StudentRoute";
import PrivateRoute from "./PrivateRoute";

function NotFound() {
  return (
    <div className="container text-center mt-5">

      <h1 className="display-3">
        404
      </h1>

      <h3>
        Page Not Found
      </h3>

      <p>
        The page you are looking for does not exist.
      </p>

      <Navigate to="/" replace />

    </div>
  );
}

function AppRoutes() {
  return (

    <Routes>

      {/* Login */}

      <Route
        path="/"
        element={<Login />}
      />

      {/* Admin */}

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* Teacher */}

      <Route
        path="/teacher"
        element={
          <TeacherRoute>
            <TeacherDashboard />
          </TeacherRoute>
        }
      />

      <Route
        path="/scan"
        element={
          <TeacherRoute>
            <QRScanner />
          </TeacherRoute>
        }
      />

      <Route
        path="/leave-management"
        element={
          <AdminTeacherRoute>
            <LeaveManagement />
          </AdminTeacherRoute>
        }
      />

      {/* Student */}

      <Route
        path="/student"
        element={
          <StudentRoute>
            <StudentDashboard />
          </StudentRoute>
        }
      />

      {/* Shared */}

      <Route
        path="/subjects"
        element={
          <PrivateRoute>
            <SubjectDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/attendance"
        element={
          <PrivateRoute>
            <AttendanceDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/leave"
        element={
          <PrivateRoute>
            <LeavePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <PrivateRoute>
            <AnalyticsDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        }
      />

      {/* 404 */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>

  );
}

export default AppRoutes;

