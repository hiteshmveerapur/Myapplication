import { useEffect, useState } from "react";
import api from "../services/api";

function LeaveManagement() {

  const [leaves, setLeaves] = useState([]);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const teacherId = user.id || user._id;

  useEffect(() => {
    fetchLeaves();
  }, []);

    const fetchLeaves = async () => {
    try {
      const res = await api.get("/leaves");
      setLeaves(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const approveLeave = async (id) => {
    try {
      await api.put(`/leaves/approve/${id}`, {
        remarks: "Approved by Teacher",
      });

      alert("Leave Approved Successfully");

      fetchLeaves();
    } catch (error) {
      console.log(error);
      alert("Failed to approve leave");
    }
  };

  const rejectLeave = async (id) => {
    try {
      await api.put(`/leaves/reject/${id}`, {
        remarks: "Rejected by Teacher",
      });

      alert("Leave Rejected Successfully");

      fetchLeaves();
    } catch (error) {
      console.log(error);
      alert("Failed to reject leave");
    }
  };

    return (
    <div className="container mt-4">

      <h2 className="mb-4">
        Leave Management
      </h2>

      <div className="card shadow">

        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            Student Leave Requests
          </h4>
        </div>

        <div className="card-body">

          <div className="table-responsive">

            <table className="table table-bordered table-hover">

              <thead className="table-dark">

                <tr>
                  <th>Student</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {leaves.length === 0 ? (

                  <tr>
                    <td
                      colSpan="6"
                      className="text-center"
                    >
                      No Leave Requests Found
                    </td>
                  </tr>

                ) : (

                  leaves.map((leave) => (

                    <tr key={leave._id}>

                      <td>
                        {leave.studentId?.name}
                      </td>

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

                      <td>

                        {leave.status === "Pending" ? (

                          <>

                            <button
                              className="btn btn-success btn-sm"
                              onClick={() =>
                                approveLeave(
                                  leave._id
                                )
                              }
                            >
                              Approve
                            </button>

                            <button
                              className="btn btn-danger btn-sm ms-2"
                              onClick={() =>
                                rejectLeave(
                                  leave._id
                                )
                              }
                            >
                              Reject
                            </button>

                          </>

                        ) : (

                          <span className="text-muted">
                            Completed
                          </span>

                        )}

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default LeaveManagement;

  
   