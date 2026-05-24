import { useEffect, useState } from "react";
import API from "../services/api";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";
import { jwtDecode } from "jwt-decode";

const socket = io("http://localhost:5000");

function Devices() {
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  const canManageDevices =
    user?.role === "admin" || user?.role === "it";

  const [devices, setDevices] = useState([]);

  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(false);

  // ================= Fetch Devices =================
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await API.get("/devices");
        setDevices(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDevices();

    socket.on("devicesUpdated", (data) => {
      setDevices(data);
    });

    return () => socket.off("devicesUpdated");
  }, []);

  // ================= Reset Form =================
  const resetForm = () => {
    setName("");
    setIp("");
    setEditId(null);
  };

  // ================= Add Device =================
  const addDevice = async () => {
    if (!name || !ip) return;

    setLoading(true);

    try {
      const res = await API.post("/devices", {
        deviceName: name,
        ipAddress: ip,
      });

      setDevices([res.data, ...devices]);
      resetForm();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= Update Device =================
  const updateDevice = async () => {
    if (!editId) return;

    setLoading(true);

    try {
      await API.put(`/devices/${editId}`, {
        deviceName: name,
        ipAddress: ip,
      });

      const res = await API.get("/devices");
      setDevices(res.data);

      resetForm();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= Delete Device =================
  const deleteDevice = async (id) => {
    try {
      await API.delete(`/devices/${id}`);
      setDevices(devices.filter((d) => d._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container mt-4">

        {/* ================= FORM ================= */}
        {canManageDevices && (
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">

              <div className="card shadow-sm p-4 mb-4">

                <h3 className="mb-3">
                  {editId ? "Edit Device" : "Add Device"}
                </h3>

                <input
                  className="form-control mb-3"
                  placeholder="Device Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  className="form-control mb-3"
                  placeholder="IP Address"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                />

                <button
                  className={`btn w-100 ${
                    editId ? "btn-primary" : "btn-success"
                  }`}
                  onClick={editId ? updateDevice : addDevice}
                  disabled={loading}
                >
                  {loading
                    ? "Loading..."
                    : editId
                    ? "Update Device"
                    : "Add Device"}
                </button>

                {editId && (
                  <button
                    className="btn btn-secondary w-100 mt-2"
                    onClick={resetForm}
                  >
                    Cancel Edit
                  </button>
                )}

              </div>
            </div>
          </div>
        )}

        {/* ================= LIST ================= */}
        <div className="d-flex justify-content-between mb-3">
          <h3>Devices</h3>
          <span className="badge bg-dark">
            {devices.length}
          </span>
        </div>

        {/* EMPTY STATE */}
        {devices.length === 0 && (
          <div className="text-center text-muted mt-5">
            No devices found 🚫
          </div>
        )}

        <div className="row">

          {devices.map((d) => (
            <div key={d._id} className="col-12 col-md-6 col-lg-4 mb-3">

              <div className="card p-3 shadow-sm h-100">

                <h5>{d.deviceName}</h5>
                <p className="text-muted">{d.ipAddress}</p>

                <span
                  className={
                    d.status === "online"
                      ? "badge bg-success"
                      : "badge bg-danger"
                  }
                >
                  {d.status}
                </span>

                {/* ACTIONS */}
                {canManageDevices && (
                  <div className="d-flex gap-2 mt-3">

                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => {
                        setEditId(d._id);
                        setName(d.deviceName);
                        setIp(d.ipAddress);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteDevice(d._id)}
                    >
                      Delete
                    </button>

                  </div>
                )}

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default Devices;