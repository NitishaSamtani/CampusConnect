import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import "../../pages/user/Dashboard/Dashboard.css";


function TrendChart({
  data,
}) {

  const chartData =
    data?.map(
      (item) => ({
        company:
          item._id?.name,
        total:
          item.total,
      })
    ) || [];

  return (
    <div className="chart-card">

      <h2>
        Company Trends
      </h2>

      <ResponsiveContainer
        width="100%"
        height={320}
      >

        <AreaChart
          data={chartData}
        >

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="company"
          />

          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="total"
            stroke="#0077B6"
            fill="#90E0EF"
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>
  );
}

export default TrendChart;