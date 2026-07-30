import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8002';
const equipmentOptions = [
  { value: 'CAT-1001', label: 'CAT-1001 • Excavator' },
  { value: 'CAT-1002', label: 'CAT-1002 • Loader' },
  { value: 'CAT-1003', label: 'CAT-1003 • Dozer' },
  { value: 'CAT-1004', label: 'CAT-1004 • Grader' },
];

const UsageLogs = () => {
  const today = new Date().toISOString().slice(0, 10);
  const [formData, setFormData] = useState({
    equipment_id: equipmentOptions[0].value,
    log_date: today,
    engine_hours: '',
    idle_hours: '',
    fuel_usage: '',
    location: '',
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadLogs = async (equipmentId = formData.equipment_id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/usage-logs`, {
        params: { equipment_id: equipmentId },
      });
      setLogs(response.data || []);
    } catch (err) {
      setError('Unable to load usage history right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    if (!success) {
      return undefined;
    }

    const timer = window.setTimeout(() => setSuccess(''), 2500);
    return () => window.clearTimeout(timer);
  }, [success]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...formData,
        engine_hours: Number(formData.engine_hours),
        idle_hours: Number(formData.idle_hours),
        fuel_usage: Number(formData.fuel_usage),
      };
      await axios.post(`${API_BASE_URL}/usage-logs`, payload);
      setSuccess('Usage log saved successfully.');
      setFormData((previous) => ({ ...previous, engine_hours: '', idle_hours: '', fuel_usage: '', location: '' }));
      await loadLogs(payload.equipment_id);
    } catch (err) {
      setError('Save failed. Please verify the values and try again.');
    } finally {
      setSaving(false);
    }
  };

  const historyRows = useMemo(() => logs, [logs]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={handleSubmit} className="rounded-[20px] border border-[#E0E0E0] bg-[#FFFFFF] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[#1A1A1A]">Daily Usage Form</h2>
              <p className="mt-1 text-sm text-[#6B6B6B]">Capture engine, idle, fuel, and location details for each equipment unit.</p>
            </div>
            <span className="rounded-full bg-[#FFF8D8] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E6B800]">
              Live input
            </span>
          </div>

          {error ? <div className="mb-4 rounded-[14px] border border-[#F4C2C2] bg-[#FFF5F5] p-3 text-sm text-[#D32F2F]">{error}</div> : null}
          {success ? <div className="mb-4 rounded-[14px] border border-[#C7E8CC] bg-[#F4FFF5] p-3 text-sm text-[#2E7D32]">{success}</div> : null}

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1A1A1A]">Equipment</label>
              <div className="flex items-center rounded-[12px] border border-[#E0E0E0] bg-[#F5F5F5] px-2.5 py-2.5">
                <svg viewBox="0 0 24 24" className="mr-2 h-3.5 w-3.5 flex-shrink-0 text-[#E6B800]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 7h16" />
                  <path d="M7 7v10" />
                  <path d="M17 7v10" />
                  <path d="M7 17h10" />
                </svg>
                <select name="equipment_id" value={formData.equipment_id} onChange={handleChange} className="w-full bg-transparent text-sm outline-none" required>
                  {equipmentOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1A1A1A]">Date</label>
              <div className="flex items-center rounded-[12px] border border-[#E0E0E0] bg-[#F5F5F5] px-2.5 py-2.5">
                <svg viewBox="0 0 24 24" className="mr-2 h-3.5 w-3.5 flex-shrink-0 text-[#E6B800]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="17" rx="2" />
                  <path d="M16 2v4" />
                  <path d="M8 2v4" />
                  <path d="M3 10h18" />
                </svg>
                <input type="date" name="log_date" value={formData.log_date} onChange={handleChange} className="w-full bg-transparent text-sm outline-none" required />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1A1A1A]">Engine Hours</label>
              <div className="flex items-center rounded-[12px] border border-[#E0E0E0] bg-[#F5F5F5] px-2.5 py-2.5">
                <svg viewBox="0 0 24 24" className="mr-2 h-3.5 w-3.5 flex-shrink-0 text-[#E6B800]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v18" />
                  <path d="M12 5c-3.9 0-7 3.1-7 7s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7z" />
                </svg>
                <input type="number" name="engine_hours" min="0" step="0.1" value={formData.engine_hours} onChange={handleChange} placeholder="0" className="w-full bg-transparent text-sm outline-none" required />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1A1A1A]">Idle Hours</label>
              <div className="flex items-center rounded-[12px] border border-[#E0E0E0] bg-[#F5F5F5] px-2.5 py-2.5">
                <svg viewBox="0 0 24 24" className="mr-2 h-3.5 w-3.5 flex-shrink-0 text-[#E6B800]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 7h16" />
                  <path d="M7 7v10" />
                  <path d="M17 7v10" />
                  <path d="M7 17h10" />
                </svg>
                <input type="number" name="idle_hours" min="0" step="0.1" value={formData.idle_hours} onChange={handleChange} placeholder="0" className="w-full bg-transparent text-sm outline-none" required />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1A1A1A]">Fuel Usage</label>
              <div className="flex items-center rounded-[12px] border border-[#E0E0E0] bg-[#F5F5F5] px-2.5 py-2.5">
                <svg viewBox="0 0 24 24" className="mr-2 h-3.5 w-3.5 flex-shrink-0 text-[#E6B800]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 8h12l2 3v5H4z" />
                  <path d="M16 11h2" />
                  <path d="M7 16h.01" />
                </svg>
                <input type="number" name="fuel_usage" min="0" step="0.1" value={formData.fuel_usage} onChange={handleChange} placeholder="0" className="w-full bg-transparent text-sm outline-none" required />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1A1A1A]">Location</label>
              <div className="flex items-center rounded-[12px] border border-[#E0E0E0] bg-[#F5F5F5] px-2.5 py-2.5">
                <svg viewBox="0 0 24 24" className="mr-2 h-3.5 w-3.5 flex-shrink-0 text-[#E6B800]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21s-6-5.8-6-10a6 6 0 1 1 12 0c0 4.2-6 10-6 10Z" />
                  <circle cx="12" cy="11" r="2.5" />
                </svg>
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Site or depot" className="w-full bg-transparent text-sm outline-none" required />
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving} className="mt-5 w-full rounded-[12px] bg-[#FFCD11] px-4 py-2.5 font-semibold text-[#000000] transition hover:bg-[#E6B800] disabled:cursor-not-allowed disabled:opacity-70">
            {saving ? 'Saving...' : 'Save Usage Log'}
          </button>
        </form>

        <div className="rounded-[20px] bg-[#000000] p-5 text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#FFCD11] text-sm font-black text-[#000000]">⚙</div>
            <div>
              <h2 className="text-base font-semibold">Operational Snapshot</h2>
              <p className="text-sm text-[#D0D0D0]">Live fleet pulse for the selected machine.</p>
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            <div className="rounded-[14px] border border-white/10 bg-white/10 p-3.5">
              <div className="text-sm text-[#D0D0D0]">Selected Equipment</div>
              <div className="mt-1 text-base font-semibold text-[#FFCD11]">{formData.equipment_id}</div>
            </div>
            <div className="rounded-[14px] border border-white/10 bg-white/10 p-3.5">
              <div className="text-sm text-[#D0D0D0]">Today&apos;s Date</div>
              <div className="mt-1 text-base font-semibold">{formData.log_date}</div>
            </div>
            <div className="rounded-[14px] border border-white/10 bg-white/10 p-3.5">
              <div className="text-sm text-[#D0D0D0]">Latest Entries</div>
              <div className="mt-1 text-base font-semibold text-[#FFCD11]">{historyRows.length} records</div>
            </div>
            <div className="rounded-[14px] border border-white/10 bg-white/10 p-3.5">
              <div className="text-sm text-[#D0D0D0]">Status</div>
              <div className="mt-2 inline-flex items-center rounded-full bg-[#FFCD11] px-2.5 py-1 text-sm font-semibold text-[#000000]">Ready</div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[20px] border border-[#E0E0E0] bg-[#FFFFFF] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Usage History</h2>
            <p className="text-sm text-[#6B6B6B]">Recent logs for the selected equipment.</p>
          </div>
          <span className="rounded-full bg-[#F5F5F5] px-2.5 py-1 text-sm font-semibold text-[#231F20]">Tracked activity</span>
        </div>

        {loading ? (
          <div className="rounded-[16px] bg-[#F5F5F5] p-6 text-center text-sm text-[#6B6B6B]">Loading usage history...</div>
        ) : historyRows.length === 0 ? (
          <div className="rounded-[16px] bg-[#F5F5F5] p-6 text-center text-sm text-[#6B6B6B]">No usage logs saved yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full overflow-hidden rounded-[16px] border border-[#E0E0E0]">
              <thead className="bg-[#000000] text-left text-sm font-semibold text-[#FFCD11]">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Engine Hrs</th>
                  <th className="px-4 py-3">Idle Hrs</th>
                  <th className="px-4 py-3">Fuel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDEDED] bg-white text-sm text-[#231F20]">
                {historyRows.map((log, index) => (
                  <tr key={log.id} className={`transition hover:bg-[#FFF8D8] ${index % 2 === 1 ? 'bg-[#FCF7DF]' : 'bg-white'}`}>
                    <td className="px-4 py-3">{log.log_date}</td>
                    <td className="px-4 py-3">{log.location}</td>
                    <td className="px-4 py-3">{Number(log.engine_hours).toFixed(1)}</td>
                    <td className="px-4 py-3">{Number(log.idle_hours).toFixed(1)}</td>
                    <td className="px-4 py-3">{Number(log.fuel_usage).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsageLogs;
