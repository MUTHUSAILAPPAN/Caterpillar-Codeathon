import PlaceholderPage from './PlaceholderPage'
export default function Alerts() { return <PlaceholderPage title="Alerts" /> }
import React, { useState, useEffect, useContext } from 'react';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';
import AlertCard from '../components/AlertCard';

const Alerts = () => {
  const context = useContext(AuthContext);
  const user = context?.user || { role: 'admin' }; 

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  
  // Filters
  const [filterResolved, setFilterResolved] = useState('all'); // 'all', 'open', 'resolved'

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query string
      let url = '/alerts';
      if (filterResolved === 'open') url += '?is_resolved=false';
      if (filterResolved === 'resolved') url += '?is_resolved=true';
      
      const res = await client.get(url);
      setAlerts(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load alerts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [filterResolved]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      await client.post('/alerts/generate');
      await fetchAlerts(); // Refresh list
    } catch (err) {
      console.error(err);
      setError('Failed to generate alerts.');
    } finally {
      setGenerating(false);
    }
  };

  const handleResolve = async (alertId) => {
    try {
      await client.patch(`/alerts/${alertId}/resolve`);
      // Update local state to reflect resolution
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, is_resolved: true } : a));
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        setError("You are not authorized to resolve this alert.");
      } else {
        setError('Failed to resolve alert.');
      }
      // Auto clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading && alerts.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#FFCD11]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-[#333333]">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#000000]">System Alerts</h1>
            <p className="text-sm mt-1">Anomaly detection & geofencing violations</p>
          </div>
          {user?.role === 'admin' && (
            <button 
              onClick={handleGenerate}
              disabled={generating}
              className="mt-4 md:mt-0 px-5 py-2 bg-[#FFCD11] text-[#000000] hover:bg-[#000000] hover:text-[#FFCD11] font-bold rounded shadow-sm transition-colors disabled:opacity-50"
            >
              {generating ? 'Running Checks...' : 'Generate Alerts'}
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-[#C0392B] border-l-4 border-[#C0392B] rounded shadow-sm font-medium">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex space-x-2 border-b border-gray-200">
          <button 
            onClick={() => setFilterResolved('all')}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${filterResolved === 'all' ? 'border-[#FFCD11] text-[#000000]' : 'border-transparent text-gray-500 hover:text-[#000000]'}`}
          >
            All Alerts
          </button>
          <button 
            onClick={() => setFilterResolved('open')}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${filterResolved === 'open' ? 'border-[#FFCD11] text-[#000000]' : 'border-transparent text-gray-500 hover:text-[#000000]'}`}
          >
            Open
          </button>
          <button 
            onClick={() => setFilterResolved('resolved')}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${filterResolved === 'resolved' ? 'border-[#FFCD11] text-[#000000]' : 'border-transparent text-gray-500 hover:text-[#000000]'}`}
          >
            Resolved
          </button>
        </div>

        {/* Alerts List */}
        <div className="space-y-4 relative">
          {loading && alerts.length > 0 && (
             <div className="absolute inset-0 bg-white/50 flex justify-center items-start pt-10 z-10">
               <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-[#FFCD11]"></div>
             </div>
          )}
          
          {alerts.length === 0 && !loading ? (
            <div className="bg-[#FFFFFF] rounded-md p-8 text-center text-gray-500 shadow-sm border border-gray-100">
              No alerts found.
            </div>
          ) : (
            alerts.map(alert => (
              <AlertCard 
                key={alert.id} 
                alert={alert} 
                onResolve={handleResolve} 
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Alerts;
