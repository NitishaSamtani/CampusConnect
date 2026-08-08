import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import "../../pages/user/Dashboard/Dashboard.css";

function ResultChart({
  data,
}) {

  const chartData =
    data?.map(
      (item) => ({
        result: item._id,
        count: item.count,
      })
    ) || [];

  return (
    <div className="chart-card">

      <h2>
        Interview Result Analytics
      </h2>

      <ResponsiveContainer
        width="100%"
        height={320}
      >

        <BarChart
          data={chartData}
        >

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="result"
          />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="count"
            fill="#0077B6"
            radius={[
              8,
              8,
              0,
              0,
            ]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}

export default ResultChart;