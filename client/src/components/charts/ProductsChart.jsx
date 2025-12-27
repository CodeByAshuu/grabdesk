import React, { useRef, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const ProductsChart = ({ data }) => {
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
      <BarChart
        width={containerWidth}
        height={300}
        data={data}
        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#cbb8a0" />
        <XAxis dataKey="name" stroke="#5b3d25" />
        <YAxis stroke="#5b3d25" />
        <Tooltip />
        <Bar dataKey="sales" fill="#5b3d25" radius={[6, 6, 0, 0]} />
      </BarChart>
    </div>
  );
};

export default ProductsChart;
