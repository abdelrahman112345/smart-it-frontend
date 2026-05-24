import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import API from "../services/api";
import DeviceChart from "../components/DeviceChart";

function Dashboard() {

const [tickets,setTickets] = useState([])
const [devices,setDevices] = useState([])

useEffect(()=>{

const fetchData = async()=>{

const ticketRes = await API.get("/tickets")
const deviceRes = await API.get("/devices")

setTickets(ticketRes.data)
setDevices(deviceRes.data)

}

fetchData()

},[])

const online = devices.filter(d=>d.status==="online").length
const offline = devices.filter(d=>d.status==="offline").length

  return (
        <div>
      <Navbar />

      <div className="container mt-4">

      <h2 className="mb-4">Dashboard</h2>

      <div className="row">

      <div className="col-12 col-md-6 col-lg-4 mb-3">
      <div className="card p-3 shadow-sm">
      <h5>Total Tickets</h5>
      <h2>{tickets.length}</h2>
      </div>
      </div>

      <div className="col-12 col-md-6 col-lg-4 mb-3">
      <div className="card p-3 shadow-sm">
      <h5>Online Devices</h5>
      <h2 className="text-success">{online}</h2>
      </div>
      </div>

      <div className="col-12 col-md-6 col-lg-4 mb-3">
      <div className="card p-3 shadow-sm">
      <h5>Offline Devices</h5>
      <h2 className="text-danger">{offline}</h2>
      </div>
      </div>

      </div>

      {/* Chart Section */}

      <div className="row mt-4">
      <div className="col-12 d-flex justify-content-center">
      <DeviceChart devices={devices} />
      </div>
      </div>

      </div>

    </div>
  );
}

export default Dashboard;