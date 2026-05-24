import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";

function DeviceChart({ devices }) {
  const online = devices.filter((d) => d.status === "online").length;
  const offline = devices.filter((d) => d.status === "offline").length;

  const data = [
    { name: "Online", value: online },
    { name: "Offline", value: offline },
  ];

  const COLORS = ["#00C49F", "#FF4C4C"];

  return (
    <PieChart width={300} height={300}>
      <Pie
        data={data}
        dataKey="value"
        outerRadius={100}
        label
      >
        {data.map((entry, index) => (
          <Cell key={index} fill={COLORS[index]} />
        ))}
      </Pie>

      <Tooltip />
      <Legend />
    </PieChart>
  );
}

export default DeviceChart;