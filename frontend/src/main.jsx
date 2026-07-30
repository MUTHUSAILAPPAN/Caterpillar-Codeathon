import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import UsageLogs from './pages/UsageLogs';
import Reports from './pages/Reports';

const AppShell = () => {
  const [activeView, setActiveView] = useState('usage');

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A]">
      <div className="mx-auto flex max-w-[1400px] flex-col px-3 py-3 md:px-6 lg:px-8">
        <header className="mb-4 rounded-[20px] bg-[#000000] p-4 text-white shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#FFCD11] text-[11px] font-black text-[#000000]">
                CAT
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#FFCD11]">CAT SIS</p>
                <h1 className="text-base font-semibold text-white">Smart Rental Tracking</h1>
                <p className="text-xs text-[#D0D0D0]">Module 2 • Equipment Operations</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-[14px] border border-white/10 bg-white/10 px-2.5 py-2">
              <div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-[#D0D0D0]">Today</div>
                <div className="text-sm font-semibold">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              </div>
              <div className="rounded-full bg-[#FFCD11] px-2.5 py-1 text-xs font-semibold text-[#000000]">Operator</div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFCD11] text-sm font-bold text-[#000000]">C</div>
            </div>
          </div>
        </header>

        <div className="mb-4 flex flex-wrap gap-2 rounded-[16px] border border-[#E0E0E0] bg-[#FFFFFF] p-1.5 shadow-[0_6px_18px_rgba(0,0,0,0.04)]">
          <button
            type="button"
            onClick={() => setActiveView('usage')}
            className={`rounded-[12px] px-3.5 py-2 text-sm font-semibold transition ${activeView === 'usage' ? 'bg-[#FFCD11] text-[#000000]' : 'bg-transparent text-[#6B6B6B] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]'}`}
          >
            Usage Logs
          </button>
          <button
            type="button"
            onClick={() => setActiveView('reports')}
            className={`rounded-[12px] px-3.5 py-2 text-sm font-semibold transition ${activeView === 'reports' ? 'bg-[#FFCD11] text-[#000000]' : 'bg-transparent text-[#6B6B6B] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]'}`}
          >
            Reports
          </button>
        </div>

        {activeView === 'usage' ? <UsageLogs /> : <Reports />}
      </div>
    </div>
  );
};
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
import Forecasting from './pages/Forecasting'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppShell />
  </React.StrictMode>
);