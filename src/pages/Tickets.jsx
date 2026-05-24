import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { jwtDecode } from "jwt-decode";

function Tickets() {
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  // 👇 clean role check
  const canManageTickets = ["admin", "it"].includes(user?.role);

  const [tickets, setTickets] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= Fetch Tickets =================
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await API.get("/tickets");
        setTickets(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTickets();
  }, []);

  // ================= Create Ticket =================
  const createTicket = async () => {
    if (!title || !description) {
      return setError("All fields are required");
    }

    setLoading(true);

    try {
      const res = await API.post("/tickets", {
        title,
        description,
        priority: "medium",
      });

      setTickets([res.data, ...tickets]);

      setTitle("");
      setDescription("");
      setError("");
    } catch (err) {
      setError("Failed to create ticket", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= Delete Ticket =================
  const deleteTicket = async (id) => {
    try {
      await API.delete(`/tickets/${id}`);
      setTickets(tickets.filter((t) => t._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // ================= Close Ticket =================
  const closeTicket = async (id) => {
    try {
      await API.patch(`/tickets/${id}`, {
        status: "closed",
      });

      setTickets(
        tickets.map((t) =>
          t._id === id ? { ...t, status: "closed" } : t
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container mt-4">

        {/* ================= CREATE FORM ================= */}
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">

            <div className="card shadow-sm border-0 p-4 mb-4">

              <h3 className="mb-3">Create Ticket</h3>

              {/* Error */}
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <input
                className="form-control mb-3"
                placeholder="Ticket Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                className="form-control mb-3"
                rows="4"
                placeholder="Ticket Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <button
                className="btn btn-dark w-100"
                onClick={createTicket}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Ticket"}
              </button>

            </div>
          </div>
        </div>

        {/* ================= HEADER ================= */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Tickets</h3>

          <span className="badge bg-primary fs-6">
            {tickets.length}
          </span>
        </div>

        {/* ================= EMPTY STATE ================= */}
        {tickets.length === 0 && (
          <div className="text-center text-muted mt-5">
            No tickets yet 🎫
          </div>
        )}

        {/* ================= LIST ================= */}
        <div className="row">

          {tickets.map((t) => (
            <div
              key={t._id}
              className="col-12 col-md-6 col-lg-4 mb-4"
            >
              <div className="card shadow-sm border-0 h-100">

                <div className="card-body d-flex flex-column">

                  <h5>{t.title}</h5>

                  <p className="text-muted flex-grow-1">
                    {t.description}
                  </p>

                  <span
                    className={
                      t.status === "closed"
                        ? "badge bg-success"
                        : "badge bg-warning text-dark"
                    }
                  >
                    {t.status}
                  </span>

                  {/* ================= ACTIONS ================= */}
                  {canManageTickets && (
                    <div className="d-flex gap-2 mt-3">

                      {/* Close */}
                      {t.status !== "closed" && (
                        <button
                          className="btn btn-success btn-sm w-50"
                          onClick={() => closeTicket(t._id)}
                        >
                          Close
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        className="btn btn-danger btn-sm w-50"
                        onClick={() => deleteTicket(t._id)}
                      >
                        Delete
                      </button>

                    </div>
                  )}

                </div>

              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default Tickets;