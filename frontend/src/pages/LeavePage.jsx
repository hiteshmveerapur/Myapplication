import { useEffect, useState } from "react";
import api from "../services/api";

function LeavePage() {

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const studentId = user.id || user._id;

  const [leaves, setLeaves] = useState([]);

  const [formData, setFormData] = useState({
    studentId,
    fromDate: "",
    toDate: "",
    reason: "",
  });

  useEffect(() => {
    fetchLeaves();
  }, []);


  const fetchLeaves = async () => {
  try {
    const res = await api.get(
      `/leaves/student/${studentId}`
    );

    setLeaves(res.data);
  } catch (error) {
    console.log(error);
  }
  };

  const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
  };

  const applyLeave = async (e) => {
  e.preventDefault();

  try {
    await api.post("/leaves", {
      ...formData,
      studentId,
    });

    alert("Leave Applied Successfully");

    setFormData({
      studentId,
      fromDate: "",
      toDate: "",
      reason: "",
    });

    fetchLeaves();

    } catch (error) {
      console.log(error);
      alert("Failed To Apply Leave");
    }
  };

  return (
  <div className="container mt-4">

    <h2 className="mb-4">
      Student Leave Application
    </h2>

    <div className="card shadow p-4 mb-4">

      <form onSubmit={applyLeave}>

        <div className="mb-3">

          <label className="form-label">
            Student Name
          </label>

          <input
            type="text"
            className="form-control"
            value={user.name || ""}
            disabled
          />

        </div>

        <div className="row">

          <div className="col-md-6">

            <div className="mb-3">

              <label className="form-label">
                From Date
              </label>

              <input
                type="date"
                className="form-control"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          <div className="col-md-6">

            <div className="mb-3">

              <label className="form-label">
                To Date
              </label>

              <input
                type="date"
                className="form-control"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                required
              />

            </div>

          </div>

        </div>

        <div className="mb-3">

          <label className="form-label">
            Reason
          </label>

          <textarea
            className="form-control"
            rows="4"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Enter Leave Reason"
            required
          />

        </div>

        <button
          type="submit"
          className="btn btn-primary"
        >
          Apply Leave
        </button>

      </form>

    </div>

    <div className="card shadow p-3">

      <h4 className="mb-3">
        My Leave History
      </h4>

      <div className="table-responsive">

        <table className="table table-bordered table-striped">

          <thead className="table-dark">

            <tr>
              <th>From Date</th>
              <th>To Date</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>

          </thead>

          <tbody>

            {leaves.length > 0 ? (

              leaves.map((leave) => (

                <tr key={leave._id}>

                  <td>
                    {new Date(
                      leave.fromDate
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    {new Date(
                      leave.toDate
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    {leave.reason}
                  </td>

                  <td>

                    <span
                      className={`badge ${
                        leave.status === "Approved"
                          ? "bg-success"
                          : leave.status === "Rejected"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {leave.status}
                    </span>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="4"
                  className="text-center"
                >
                  No leave applications found.
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

export default LeavePage;