import React, { useRef, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const SalesChart = ({ data }) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(600);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "300px" }}>
      <LineChart
        width={containerWidth}
        height={300}
        data={data}
        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
      >
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
    </div>
  );
};

export default SalesChart;
