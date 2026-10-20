import React, { useState, useEffect } from 'react';

interface AgentLogStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LogEntry {
  id: string;
  timestamp: string;
  agent: string;
  level: 'INFO' | 'SUCCESS' | 'WARN' | 'DISPATCH';
  message: string;
}

export const AgentLogStreamModal: React.FC<AgentLogStreamModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: '07:22:12',
      agent: 'Agent 2 (AIS)',
      level: 'INFO',
      message: 'ORB-784 constellation ping received: Bab-el-Mandeb corridor. Speed: 16.4 kts.',
    },
    {
      id: '2',
      timestamp: '07:22:28',
      agent: 'Agent 5 (Auditor)',
      level: 'SUCCESS',
      message: 'Ledger recalculation: Realized margin steady at +24.8% ($148,650.00).',
    },
    {
      id: '3',
      timestamp: '07:22:35',
      agent: 'Agent 3 (OCR)',
      level: 'WARN',
      message: 'HS Code anomaly flagged on INV #EXP-2024-902 (0804.40 vs 0804.50).',
    },
    {
      id: '4',
      timestamp: '07:22:41',
      agent: 'Agent 4 (Hierarchy)',
      level: 'DISPATCH',
      message: 'Escrow quarantine lock placed on folder #EXP-2024-902 pending amendment.',
    },
    {
      id: '5',
      timestamp: '07:22:50',
      agent: 'Agent 1 (Briefing)',
      level: 'INFO',
      message: 'Executive summary cache updated. Zero telemetry latency across 5 agents.',
    },
  ]);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      const seconds = new Date().getSeconds().toString().padStart(2, '0');
      const minutes = new Date().getMinutes().toString().padStart(2, '0');
      const timeStr = `07:${minutes}:${seconds}`;

      const dynamicEntries: Omit<LogEntry, 'id' | 'timestamp'>[] = [
        {
          agent: 'Agent 2 (AIS)',
          level: 'INFO',
          message: 'Doppler fix verified: CMA CGM Pegasus coordinates 05°58\'N 080°12\'E.',
        },
        {
          agent: 'Agent 3 (OCR)',
          level: 'SUCCESS',
          message: 'Clean Ocean B/L MAEU-9821804 verified. Carrier stamp intact.',
        },
        {
          agent: 'Agent 5 (Auditor)',
          level: 'INFO',
          message: 'Freight deductible reconciled: BAF surcharge -$18,400.00 matched to MSC invoice.',
        },
      ];

      const chosen = dynamicEntries[Math.floor(Math.random() * dynamicEntries.length)];
      setLogs((prev) => [
        ...prev.slice(-15),
        { id: Date.now().toString(), timestamp: timeStr, ...chosen },
      ]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-[#0b1c30] rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-[#131b2e] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#38BDF8] text-[20px]">terminal</span>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                Autonomous Agent Live Log Stream
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </h3>
              <p className="text-[11px] text-slate-400">WebSocket telemetry • Ingestion mesh active</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Console stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs bg-slate-950">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 text-slate-300 leading-relaxed border-b border-slate-900 pb-1.5">
              <span className="text-slate-500 shrink-0">{log.timestamp}</span>
              <span className="text-[#38BDF8] shrink-0 font-semibold">[{log.agent}]</span>
              <span
                className={`text-[10px] px-1 rounded shrink-0 font-bold ${
                  log.level === 'WARN'
                    ? 'bg-amber-900/60 text-amber-300'
                    : log.level === 'DISPATCH'
                    ? 'bg-purple-900/60 text-purple-300'
                    : log.level === 'SUCCESS'
                    ? 'bg-emerald-900/60 text-emerald-300'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {log.level}
              </span>
              <span className="flex-1 text-slate-200">{log.message}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#131b2e] border-t border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-400">Buffer: 100% synchronized</span>
          <button
            onClick={() => setLogs([])}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
          >
            Clear Screen
          </button>
        </div>
      </div>
    </div>
  );
};
