import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      switch (role) {
        case "admin":
          navigate("/admin");
          break;
        case "teacher":
          navigate("/teacher");
          break;
        case "student":
          navigate("/student");
          break;
        default:
          break;
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "role",
        res.data.user.role
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Login Successful");

      switch (res.data.user.role) {
        case "admin":
          navigate("/admin");
          break;

        case "teacher":
          navigate("/teacher");
          break;

        case "student":
          navigate("/student");
          break;

        default:
          navigate("/");
      }

    } catch (error) {

      console.log(error);

      alert(
        error?.response?.data?.message ||
        "Invalid Email or Password"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div
      className="container d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >

      <div
        className="card shadow-lg p-4"
        style={{
          width: "420px",
          borderRadius: "15px",
        }}
      >

        <div className="text-center mb-4">

          <h2 className="fw-bold">
            Smart Attendance
          </h2>

          <p className="text-muted">
            Login to continue
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">

            <label className="form-label">
              Email
            </label>

            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

          <div className="mb-3">

            <label className="form-label">
              Password
            </label>

            <div className="input-group">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                className="form-control"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;
