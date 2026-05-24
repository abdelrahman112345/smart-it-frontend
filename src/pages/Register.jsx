import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState("user");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {

    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {

      await API.post("/auth/register", {
        name,
        email,
        password,
        role
      });

      navigate("/");

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Registration failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="bg-light min-vh-100 d-flex align-items-center">

      <div className="container">

        <div className="row justify-content-center">

          <div className="col-12 col-sm-10 col-md-8 col-lg-5">

            <div className="card shadow-lg border-0 p-4">

              {/* Header */}

              <div className="text-center mb-4">

                <h2 className="fw-bold">
                  Create Account
                </h2>

                <p className="text-muted">
                  Smart IT Monitoring System
                </p>

              </div>

              {/* Error */}

              {error && (

                <div className="alert alert-danger">
                  {error}
                </div>

              )}

              {/* Form */}

              <form onSubmit={handleRegister}>

                {/* Name */}

                <div className="mb-3">

                  <label className="form-label">
                    Full Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

                </div>

                {/* Email */}

                <div className="mb-3">

                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                </div>

                {/* Role */}

                <div className="mb-3">

                  <label className="form-label">
                    Role
                  </label>

                  <select
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >

                    <option value="user">
                      User
                    </option>

                    <option value="it">
                      IT Support
                    </option>

                    <option value="admin">
                      Admin
                    </option>

                  </select>

                </div>

                {/* Password */}

                <div className="mb-3">

                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                </div>

                {/* Confirm Password */}

                <div className="mb-4">

                  <label className="form-label">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />

                </div>

                {/* Submit */}

                <button
                  type="submit"
                  className="btn btn-dark w-100"
                  disabled={loading}
                >

                  {loading
                    ? "Creating Account..."
                    : "Register"}

                </button>

              </form>

              {/* Login Link */}

              <div className="text-center mt-4">

                <p className="mb-0">

                  Already have an account?

                  <Link
                    to="/"
                    className="ms-2 text-decoration-none"
                  >
                    Login
                  </Link>

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Register;