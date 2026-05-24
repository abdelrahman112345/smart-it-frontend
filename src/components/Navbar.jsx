import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Navbar() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const user = token ? jwtDecode(token) : null;

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (

    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">

      <div className="container">

        {/* Logo */}

        <Link className="navbar-brand fw-bold fs-4" to="/dashboard">
          Smart IT
        </Link>

        {/* Mobile Toggle */}

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}

        <div className="collapse navbar-collapse" id="navbarNav">

          <ul className="navbar-nav ms-auto align-items-lg-center">

            {/* Dashboard */}

            <li className="nav-item me-2 mt-2 mt-lg-0">

              <Link
                className="btn btn-outline-light w-100"
                to="/dashboard"
              >
                📊 Dashboard
              </Link>

            </li>

            {/* Tickets */}

            <li className="nav-item me-2 mt-2 mt-lg-0">

              <Link
                className="btn btn-outline-light w-100"
                to="/tickets"
              >
                🎫 Tickets
              </Link>

            </li>

            {/* Devices - Admin & Support only */}

            {(user?.role === "admin" ||
              user?.role === "it") && (

              <li className="nav-item me-2 mt-2 mt-lg-0">

                <Link
                  className="btn btn-outline-light w-100"
                  to="/devices"
                >
                  🖥 Devices
                </Link>

              </li>

            )}

            {/* Role Badge */}

            <li className="nav-item me-2 mt-2 mt-lg-0">

              <span className="badge bg-primary p-2 fs-6">
                {user?.role || "user"}
              </span>

            </li>

            {/* Logout */}

            <li className="nav-item mt-2 mt-lg-0">

              <button
                className="btn btn-danger w-100"
                onClick={logout}
              >
                🚪 Logout
              </button>

            </li>

          </ul>

        </div>

      </div>

    </nav>

  );
}

export default Navbar; 