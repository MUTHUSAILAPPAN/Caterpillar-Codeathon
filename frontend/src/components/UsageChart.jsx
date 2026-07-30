import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const UsageChart = ({ data = [], title = '', type = 'bar', dataKey = 'value', color = '#FFCD11' }) => {
  if (!data.length) {
    return (
      <div className="rounded-[24px] border border-[#E0E0E0] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#1A1A1A]">{title}</h2>
          <span className="rounded-full bg-[#FFF8D8] px-3 py-1 text-sm font-semibold text-[#E6B800]">No data</span>
        </div>
        <div className="rounded-[16px] bg-[#F5F5F5] p-6 text-center text-sm text-[#6B6B6B]">No chart data available yet.</div>
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-[#E0E0E0] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#1A1A1A]">{title}</h2>
          <p className="text-sm text-[#6B6B6B]">Performance trend for the current reporting window.</p>
        </div>
        <span className="rounded-full bg-[#FFF8D8] px-3 py-1 text-sm font-semibold text-[#E6B800]">Live view</span>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'pie' ? (
            <PieChart>
              <Pie data={data} dataKey={dataKey} nameKey="name" innerRadius={58} outerRadius={98} paddingAngle={3}>
                {data.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={index % 2 === 0 ? '#FFCD11' : '#231F20'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey={data[0]?.site ? 'site' : 'log_date'} tick={{ fontSize: 12, fill: '#6B6B6B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6B6B6B' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UsageChart;
