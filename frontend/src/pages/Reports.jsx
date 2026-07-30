import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import DealerComparisonTable from '../components/DealerComparisonTable';
import UsageChart from '../components/UsageChart';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8002';

const Reports = () => {
  const context = useContext(AuthContext) || { user: { role: 'admin' } };
  const userRole = context?.user?.role || 'admin';
  const [summary, setSummary] = useState(null);
  const [dealerData, setDealerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const [summaryResponse, dealerResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/reports/summary`),
          axios.get(`${API_BASE_URL}/reports/dealer-comparison`, {
            headers: { 'x-role': userRole },
          }),
        ]);
        setSummary(summaryResponse.data);
        setDealerData(dealerResponse.data || []);
      } catch (err) {
        setError('Unable to load report data at the moment.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [userRole]);

  const cards = useMemo(() => {
    if (!summary) {
      return [];
    }

    return [
      { label: 'Total Rental Hours', value: `${summary.total_rented_hours.toFixed(1)}`, accent: 'bg-[#FFCD11]' },
      { label: 'Usage Per Site', value: `${summary.usage_per_site.length}`, accent: 'bg-[#E6B800]' },
      { label: 'Downtime %', value: `${summary.downtime_percentage.toFixed(1)}%`, accent: 'bg-[#231F20]' },
    ];
  }, [summary]);

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-[24px] border border-[#E0E0E0] bg-[#FFFFFF] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
        <div className="text-lg font-semibold text-[#1A1A1A]">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {error ? <div className="rounded-[16px] border border-[#F4C2C2] bg-[#FFF5F5] p-4 text-sm text-[#D32F2F]">{error}</div> : null}

      <div className="grid gap-4 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-[24px] border border-[#E0E0E0] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
            <div className={`mb-4 h-1.5 w-16 rounded-full ${card.accent}`} />
            <div className="text-sm font-medium text-[#6B6B6B]">{card.label}</div>
            <div className="mt-3 text-3xl font-bold text-[#1A1A1A]">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <UsageChart data={summary?.site_usage_trend || []} title="Usage Per Site" type="bar" dataKey="usage" color="#FFCD11" />
        <UsageChart data={summary?.downtime_breakdown || []} title="Downtime Breakdown" type="pie" dataKey="value" color="#FFCD11" />
      </div>

      <div className="rounded-[24px] border border-[#E0E0E0] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-[#1A1A1A]">Site Usage Overview</h2>
            <p className="text-sm text-[#6B6B6B]">Utilization by location across the fleet.</p>
          </div>
          <span className="rounded-full bg-[#FFF8D8] px-3 py-1 text-sm font-semibold text-[#E6B800]">Fleet map</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full overflow-hidden rounded-[16px] border border-[#E0E0E0]">
            <thead className="bg-[#000000] text-left text-sm font-semibold text-[#FFCD11]">
              <tr>
                <th className="px-4 py-3">Site</th>
                <th className="px-4 py-3">Engine Hours</th>
                <th className="px-4 py-3">Idle Hours</th>
                <th className="px-4 py-3">Fuel Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEDED] bg-white text-sm text-[#231F20]">
              {(summary?.usage_per_site || []).map((item, index) => (
                <tr key={item.site} className={`transition hover:bg-[#FFF8D8] ${index % 2 === 1 ? 'bg-[#FCF7DF]' : 'bg-white'}`}>
                  <td className="px-4 py-3 font-medium text-[#1A1A1A]">{item.site}</td>
                  <td className="px-4 py-3">{item.engine_hours.toFixed(1)}</td>
                  <td className="px-4 py-3">{item.idle_hours.toFixed(1)}</td>
                  <td className="px-4 py-3">{item.fuel_usage.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DealerComparisonTable data={dealerData} role={userRole} />
    </div>
  );
};

export default Reports;
