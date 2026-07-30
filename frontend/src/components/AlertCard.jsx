import React from 'react';

const alertTypeLabels = {
  overdue: "Overdue Return",
  idle_excess: "Excessive Idle Time",
  unassigned: "Missing Assignment",
  geofence: "Geofence Violation",
  unauthorized_access: "Unauthorized Access"
};

const severityStyles = {
  high: "bg-[#C0392B] text-[#FFFFFF]",
  medium: "bg-[#E67E22] text-[#FFFFFF]",
  low: "bg-[#6B7280] text-[#FFFFFF]"
};

const borderStyles = {
  high: "border-[#C0392B]",
  medium: "border-[#E67E22]",
  low: "border-[#6B7280]"
};

const AlertCard = ({ alert, onResolve }) => {
  const isResolved = alert.is_resolved;
  const severityBadge = severityStyles[alert.severity] || severityStyles.low;
  const borderBadge = borderStyles[alert.severity] || borderStyles.low;
  
  const typeLabel = alertTypeLabels[alert.alert_type] || alert.alert_type;

  return (
    <div className={`bg-[#FFFFFF] shadow-sm rounded-md p-5 border-l-4 ${borderBadge} ${isResolved ? 'opacity-60 bg-gray-50' : ''} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
      <div className="flex-grow space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="font-bold text-lg text-[#000000]">Equipment {alert.equipment_id}</h3>
          <span className={`px-2 py-1 text-xs font-bold rounded-full ${severityBadge}`}>
            {alert.severity ? alert.severity.toUpperCase() : 'UNKNOWN'}
          </span>
          {isResolved && (
            <span className="flex items-center text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Resolved
            </span>
          )}
        </div>
        <p className="text-sm font-semibold text-[#333333]">{typeLabel}</p>
        <p className="text-sm text-[#333333]">{alert.message}</p>
      </div>
      
      {!isResolved && (
        <button 
          onClick={() => onResolve(alert.id)}
          className="px-4 py-2 bg-[#000000] text-[#FFCD11] hover:bg-[#FFCD11] hover:text-[#000000] text-sm font-semibold rounded transition-colors whitespace-nowrap shadow-sm"
        >
          Resolve
        </button>
      )}
    </div>
  );
};

export default AlertCard;
