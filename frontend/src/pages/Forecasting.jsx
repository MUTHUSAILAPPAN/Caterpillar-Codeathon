import React, { useState, useEffect, useContext } from 'react';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';
import ForecastChart from '../components/ForecastChart';

const Forecasting = () => {
  // Fallback used in case context isn't fully wired yet (useful for isolated testing)
  const context = useContext(AuthContext);
  const user = context?.user || { role: 'admin' }; 

  const [forecasts, setForecasts] = useState([]);
  const [underutilized, setUnderutilized] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [forecastRes, underRes] = await Promise.all([
        client.get('/forecast'),
        client.get('/forecast/underutilized')
      ]);
      setForecasts(forecastRes.data);
      setUnderutilized(underRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load forecasting data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      await client.post('/forecast/generate');
      await fetchData(); // Refresh the data after generation
    } catch (err) {
      console.error(err);
      setError('Failed to generate forecast.');
    } finally {
      setGenerating(false);
    }
  };

  const getConfidenceBadge = (confidence) => {
    const percent = Math.round(confidence * 100);
    if (percent > 70) {
      return <span className="px-2 py-1 text-xs font-bold bg-[#FFCD11] text-[#000000] rounded-full">{percent}% Conf.</span>;
    } else if (percent >= 40) {
      return <span className="px-2 py-1 text-xs font-bold bg-gray-200 text-[#000000] rounded-full">{percent}% Conf.</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-bold bg-[#C0392B] text-[#FFFFFF] rounded-full">{percent}% Conf.</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#FFCD11]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-[#333333]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#000000]">Demand Forecasting</h1>
            <p className="text-sm mt-1">AI-driven insights for equipment allocation</p>
          </div>
          {user?.role === 'admin' && (
            <button 
              onClick={handleGenerate}
              disabled={generating}
              className="mt-4 md:mt-0 px-4 py-2 bg-[#000000] text-[#FFCD11] hover:bg-[#FFCD11] hover:text-[#000000] font-semibold rounded transition-colors shadow-sm disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate New Forecast'}
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-[#C0392B] border-l-4 border-[#C0392B] rounded shadow-sm">
            {error}
          </div>
        )}

        {/* Charts & Summary */}
        {forecasts.length > 0 && (
          <div className="mb-8">
            <ForecastChart data={forecasts} />
          </div>
        )}

        {/* Forecasts List */}
        <div>
          <h2 className="text-2xl font-bold text-[#000000] mb-4">Upcoming Demand</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forecasts.length === 0 ? (
              <p className="col-span-full text-gray-500">No forecasts available.</p>
            ) : (
              forecasts.map(forecast => (
                <div key={forecast.id} className="bg-[#FFFFFF] rounded-md shadow-sm border-l-4 border-[#FFCD11] p-5 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-[#000000]">{forecast.equipment_type}</h3>
                    {getConfidenceBadge(forecast.confidence)}
                  </div>
                  <div className="text-sm space-y-1 mb-4 flex-grow">
                    <p><span className="font-semibold">Site:</span> {forecast.site_id}</p>
                    <p><span className="font-semibold">Date Needed:</span> {forecast.predicted_demand_date}</p>
                    <p><span className="font-semibold">Units Needed:</span> {forecast.predicted_units_needed}</p>
                  </div>
                  <div className="mt-auto p-3 bg-gray-50 rounded text-sm font-medium border border-gray-100">
                    <span className="text-[#FFCD11] mr-2">⚡</span>
                    {forecast.recommended_action}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Under-Utilized Equipment */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[#000000] mb-4">Under-Utilized Equipment Flags</h2>
          <div className="bg-[#FFFFFF] rounded-md shadow-sm overflow-hidden border border-gray-200">
            {underutilized.length === 0 ? (
              <p className="p-6 text-gray-500">No under-utilized equipment detected.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[#000000] text-[#FFCD11]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Equipment ID</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Site</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Engine Hrs / Day</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Idle Hrs / Day</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Rental Days</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#FFFFFF] divide-y divide-gray-200">
                    {underutilized.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#000000]">{item.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{item.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{item.site_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{parseFloat(item.engine_hours_per_day).toFixed(1)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{parseFloat(item.idle_hours_per_day).toFixed(1)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{item.rental_days}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#C0392B] text-[#FFFFFF]">
                            Under-Utilized
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Forecasting;
