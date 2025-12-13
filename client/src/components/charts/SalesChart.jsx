// src/components/charts/SalesChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const SalesChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#cbb8a0" />
        <XAxis dataKey="month" stroke="#5b3d25" />
        <YAxis stroke="#5b3d25" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#5b3d25"
          strokeWidth={3}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;
