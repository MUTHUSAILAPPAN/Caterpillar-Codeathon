import React, { useMemo, useState } from 'react';

const DealerComparisonTable = ({ data = [], role = 'admin' }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'average_fuel_usage', direction: 'desc' });

  if (role !== 'admin') {
    return null;
  }

  const sortedRows = useMemo(() => {
    const rows = [...data];
    rows.sort((left, right) => {
      const leftValue = left[sortConfig.key];
      const rightValue = right[sortConfig.key];
      if (typeof leftValue === 'number' && typeof rightValue === 'number') {
        return sortConfig.direction === 'asc' ? leftValue - rightValue : rightValue - leftValue;
      }
      return sortConfig.direction === 'asc'
        ? String(leftValue).localeCompare(String(rightValue))
        : String(rightValue).localeCompare(String(leftValue));
    });
    return rows;
  }, [data, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((previous) => ({
      key,
      direction: previous.key === key && previous.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getEfficiency = (row) => {
    if (row.average_idle_hours <= 2 && row.average_fuel_usage <= 5) {
      return { label: 'Excellent', className: 'bg-[#E8F5E9] text-[#2E7D32]' };
    }
    if (row.average_idle_hours <= 4 || row.average_fuel_usage <= 7) {
      return { label: 'Average', className: 'bg-[#FFF3E0] text-[#ED6C02]' };
    }
    return { label: 'Poor', className: 'bg-[#FDECEC] text-[#D32F2F]' };
  };

  return (
    <div className="rounded-[24px] border border-[#E0E0E0] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[#1A1A1A]">Dealer Comparison</h2>
          <p className="text-sm text-[#6B6B6B]">Administrative view of average utilization by dealer.</p>
        </div>
        <span className="rounded-full bg-[#FFF8D8] px-3 py-1 text-sm font-semibold text-[#E6B800]">Admin insight</span>
      </div>

      {sortedRows.length === 0 ? (
        <div className="rounded-[16px] bg-[#F5F5F5] p-6 text-center text-sm text-[#6B6B6B]">No dealer comparison data available yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full overflow-hidden rounded-[16px] border border-[#E0E0E0]">
            <thead className="bg-[#000000] text-left text-sm font-semibold text-[#FFCD11]">
              <tr>
                <th className="px-4 py-3">
                  <button className="font-semibold" onClick={() => handleSort('dealer_name')} type="button">
                    Dealer
                  </button>
                </th>
                <th className="px-4 py-3">
                  <button className="font-semibold" onClick={() => handleSort('average_fuel_usage')} type="button">
                    Avg Fuel Usage
                  </button>
                </th>
                <th className="px-4 py-3">
                  <button className="font-semibold" onClick={() => handleSort('average_idle_hours')} type="button">
                    Avg Idle Hours
                  </button>
                </th>
                <th className="px-4 py-3">Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEDED] bg-white text-sm text-[#231F20]">
              {sortedRows.map((row, index) => {
                const efficiency = getEfficiency(row);
                return (
                  <tr key={row.dealer_name} className={`transition hover:bg-[#FFF8D8] ${index % 2 === 1 ? 'bg-[#FCF7DF]' : 'bg-white'}`}>
                    <td className="px-4 py-3 font-medium text-[#1A1A1A]">{row.dealer_name}</td>
                    <td className="px-4 py-3">{row.average_fuel_usage.toFixed(1)}</td>
                    <td className="px-4 py-3">{row.average_idle_hours.toFixed(1)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${efficiency.className}`}>{efficiency.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DealerComparisonTable;
