import React, { FC } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Tooltip,
  Bar,
} from "recharts";
import withAuth from "~/hocs/withAuth";

const data = [
  { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 500, pv: 2500, amt: 2500 },
  { name: "Page B", uv: 500, pv: 2500, amt: 2500 },
];

const data1 = [
  { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 500, pv: 2500, amt: 2500 },
  { name: "Page B", uv: 500, pv: 2500, amt: 2500 },
];

const Dashboard: FC = () => {
  return (
    <section>
      <LineChart width={400} height={400} data={data}>
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
      </LineChart>

      <BarChart width={600} height={300} data={data1}>
        <XAxis dataKey="name" stroke="#8884d8" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <Bar dataKey="uv" fill="#8884d8" barSize={30} />
      </BarChart>
    </section>
  );
};

export default withAuth(Dashboard);
