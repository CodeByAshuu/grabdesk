// src/components/charts/ProductsChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const ProductsChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#cbb8a0" />
        <XAxis dataKey="name" stroke="#5b3d25" />
        <YAxis stroke="#5b3d25" />
        <Tooltip />
        <Bar dataKey="sales" fill="#5b3d25" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProductsChart;
