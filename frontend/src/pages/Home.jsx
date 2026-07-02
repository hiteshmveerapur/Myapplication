import { Link } from "react-router-dom";

function Home() {
return ( <div className="container mt-4"> <h1>
Smart Attendance Management System </h1>


  <div className="row mt-4">
    <div className="col-md-4 mb-3">
      <div className="card">
        <div className="card-body">
          <h5>Students</h5>

          <Link
            to="/admin"
            className="btn btn-primary"
          >
            Open
          </Link>
        </div>
      </div>
    </div>

    <div className="col-md-4 mb-3">
      <div className="card">
        <div className="card-body">
          <h5>Teachers</h5>

          <Link
            to="/teachers"
            className="btn btn-primary"
          >
            Open
          </Link>
        </div>
      </div>
    </div>

    <div className="col-md-4 mb-3">
      <div className="card">
        <div className="card-body">
          <h5>Subjects</h5>

          <Link
            to="/subjects"
            className="btn btn-primary"
          >
            Open
          </Link>
        </div>
      </div>
    </div>
  </div>
</div>


);
}

export default Home;
