import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Invalid email or password"
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

              {/* Title */}

              <div className="text-center mb-4">

                <h2 className="fw-bold">
                  Smart IT
                </h2>

                <p className="text-muted">
                  Login to your account
                </p>

              </div>

              {/* Error */}

              {error && (

                <div className="alert alert-danger">
                  {error}
                </div>

              )}

              {/* Form */}

              <form onSubmit={handleLogin}>

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

                {/* Password */}

                <div className="mb-3">

                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                </div>

                {/* Login Button */}

                <button
                  type="submit"
                  className="btn btn-dark w-100"
                  disabled={loading}
                >

                  {loading ? "Logging in..." : "Login"}

                </button>

              </form>

              {/* Register Link */}

              <div className="text-center mt-4">

                <p className="mb-0">

                  Don't have an account?

                  <Link
                    to="/register"
                    className="ms-2 text-decoration-none"
                  >
                    Register
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

export default Login;