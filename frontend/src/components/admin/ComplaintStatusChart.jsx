import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const COLORS = ["#f91616", "#10b981"];

const ComplaintStatusChart = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <h3 className="text-sm font-bold text-gray-800 mb-4">
        Complaint Status Overview
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            outerRadius={90}
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComplaintStatusChart;