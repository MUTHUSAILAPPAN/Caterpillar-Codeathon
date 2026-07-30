import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ForecastChart = ({ data }) => {
  // Aggregate data by site or equipment type for the chart
  const chartData = data.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.site_id);
    if (existing) {
      existing.units += curr.predicted_units_needed;
    } else {
      acc.push({ name: curr.site_id || 'Unknown', units: curr.predicted_units_needed });
    }
    return acc;
  }, []);

  return (
    <div className="h-80 w-full bg-white p-4 shadow-sm rounded-md border-t-4 border-[#FFCD11]">
      <h3 className="text-lg font-bold text-[#000000] mb-4">Predicted Units Needed by Site</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{fill: '#333333'}} />
          <YAxis tick={{fill: '#333333'}} allowDecimals={false} />
          <Tooltip 
            cursor={{fill: '#f4f4f5'}}
            contentStyle={{backgroundColor: '#000000', color: '#FFFFFF', borderRadius: '4px', border: 'none'}}
            itemStyle={{color: '#FFCD11'}}
          />
          <Legend />
          <Bar dataKey="units" name="Predicted Units" fill="#FFCD11" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
