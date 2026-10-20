import React, { useState } from 'react';
import { AgentInfo, AgentTask, NumberingConfig, ActiveScreen } from '../types';

interface ExporterBillingDashboardProps {
  agents: AgentInfo[];
  tasks: AgentTask[];
  numbering: NumberingConfig;
  onUpdateNumbering: (config: NumberingConfig) => void;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenAskAgent: () => void;
  onOpenLogs: () => void;
  onOpenTriggers: () => void;
}

export const ExporterBillingDashboard: React.FC<ExporterBillingDashboardProps> = ({
  agents,
  tasks,
  numbering,
  onUpdateNumbering,
  onNavigate,
  onOpenAskAgent,
  onOpenLogs,
  onOpenTriggers,
}) => {
  const [localNumbering, setLocalNumbering] = useState<NumberingConfig>(numbering);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentInfo | null>(null);

  const handleSaveNumbering = () => {
    onUpdateNumbering(localNumbering);
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 2000);
  };

  const handleExportPDF = () => {
    const docketData = `
=====================================================
TRADEPAY EXPORTER - EXECUTIVE SUMMARY AUDIT
Generated: ${new Date().toLocaleString()}
Status: 5 Autonomous Agents Synchronized
=====================================================
ACTIVE OCEAN FREIGHT: 3 Shipments en route to POD
PENDING COLLECTIONS: $314,250.00 USD (4 Escrow Accounts)
CURRENT DELAY GUARD: Feeder CMA CGM Pegasus (+14h delay)
NET REALIZED MARGIN: +24.8% ($148,650.00 USD)
ACTIVE INVOICE DOSSIERS:
  1. EXP-2024-884 (CIF HAMBURG) - €64,500.00 (Ready for Release)
  2. EXP-2024-891 (FOB TOKYO)   - $128,400.00 (Cold Cloud Stored)
  3. EXP-2024-902 (EXW ROTTERDAM)- €38,900.00 (Action Required)
=====================================================
Cross-verified via MarineTraffic Satellite AIS & Port Terminal API
`;
    const blob = new Blob([docketData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TradePay-Executive-Briefing-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="w-full max-w-md mx-auto px-4 py-3 space-y-4 pb-24">
      {/* Screen Title Bar */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            AI Multi-Agent Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time trade operations &amp; autonomous ledger auditing
          </p>
        </div>
        <div className="bg-white border border-[#CBD5E1] rounded-lg p-2 shadow-xs text-[#006591]">
          <span className="material-symbols-outlined text-[20px]">smart_toy</span>
        </div>
      </div>

      {/* Prominent Quick-Switch to Invoices Screen */}
      <div className="bg-gradient-to-r from-[#006591] to-[#004666] text-white rounded-xl p-3 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
          </div>
          <div>
            <span className="text-xs font-bold block">Invoices Document Vault</span>
            <span className="text-[11px] text-blue-100">
              3 active ledgers (#EXP-2024-884, 891, 902)
            </span>
          </div>
        </div>
        <button
          onClick={() => onNavigate('invoices')}
          className="px-3 py-1.5 bg-white text-[#006591] text-xs font-bold rounded-lg hover:bg-blue-50 transition-all flex items-center gap-1 shadow-xs active:scale-95 shrink-0"
        >
          <span>Open Invoices</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>

      {/* 1. Header Card: Autonomous Multi-Agent Workflow Engine */}
      <section className="bg-white rounded-xl border border-[#CBD5E1] p-3.5 shadow-xs">
        <div className="flex items-start justify-between mb-2">
          <div className="space-y-0.5">
            <span className="text-[10px] font-semibold text-[#006591] uppercase tracking-wider block">
              Orchestration Mesh
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Autonomous Multi-Agent Workflow Engine
            </h2>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#eff4ff] text-[#006591] text-xs font-semibold border border-[#CBD5E1]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006591]"></span>
            Synced
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          All 5 Agents Synchronized &amp; Operating with zero telemetry latency.
        </p>

        {/* Visual Pipeline: 5 Agents */}
        <div className="space-y-2 relative before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className="relative flex items-center space-x-2.5 pl-1 bg-[#f8f9ff] hover:bg-[#eff4ff] p-2 rounded-lg border border-[#CBD5E1]/60 cursor-pointer transition-colors"
            >
              <div className="z-10 w-5 h-5 rounded-full bg-[#131b2e] text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[13px]">{agent.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900 truncate">
                    {agent.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#006591] bg-white px-1.5 py-0.2 rounded border border-[#CBD5E1]">
                    {agent.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{agent.status}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Live Executive Overview Agent Summary Card */}
      <section className="bg-white rounded-xl border border-[#CBD5E1] p-3.5 shadow-xs">
        <div className="flex items-center space-x-2 mb-2.5">
          <span className="material-symbols-outlined text-[#006591] text-[20px]">auto_awesome</span>
          <h2 className="text-base font-bold text-slate-900">
            Live Executive Overview Agent Summary
          </h2>
        </div>

        {/* Overview Metrics Rack */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div
            onClick={() => onNavigate('shipments')}
            className="bg-[#eff4ff] p-2.5 rounded-lg border border-[#CBD5E1]/50 cursor-pointer hover:border-[#006591] transition-colors"
          >
            <span className="text-[11px] text-slate-500 block">Active Ocean Freight</span>
            <span className="text-base font-bold text-slate-900 block mt-0.5">3 Shipments</span>
            <span className="text-[11px] text-[#006591] font-semibold block mt-0.5 flex items-center gap-0.5">
              <span>En route to POD</span>
              <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
            </span>
          </div>

          <div
            onClick={() => onNavigate('invoices')}
            className="bg-[#eff4ff] p-2.5 rounded-lg border border-[#CBD5E1]/50 cursor-pointer hover:border-[#006591] transition-colors"
          >
            <span className="text-[11px] text-slate-500 block">Pending Collections</span>
            <span className="text-base font-bold text-slate-900 tabular-nums block mt-0.5">
              $314,250
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5 flex items-center gap-0.5">
              <span>Across 4 Escrow accounts</span>
              <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
            </span>
          </div>
        </div>

        {/* Real-time Agent Notice / Delay Alert */}
        <div className="bg-[#eff4ff] border-l-4 border-[#006591] p-3 rounded-r-lg mb-3 text-xs text-slate-800">
          <div className="flex items-start space-x-2">
            <span className="material-symbols-outlined text-[#006591] text-[18px] shrink-0 mt-0.5">
              warning
            </span>
            <div className="space-y-1">
              <span className="font-semibold text-slate-900 block">
                Feeder Transshipment Delay Detected
              </span>
              <p className="text-slate-600 leading-relaxed">
                Feeder vessel <span className="font-semibold text-slate-900">CMA CGM Pegasus</span> incurred{' '}
                <span className="font-semibold text-slate-900">+14h delay</span> at Port of Singapore. Automatic escrow condition triggers adjusted by 18 hours.
              </p>
              <button
                onClick={() => onNavigate('shipments')}
                className="text-[11px] font-bold text-[#006591] hover:underline inline-flex items-center gap-0.5 pt-0.5"
              >
                <span>Inspect Marine AIS Feeder Leg</span>
                <span className="material-symbols-outlined text-[12px]">open_in_new</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onOpenAskAgent}
            className="flex items-center justify-center space-x-1.5 py-2 px-3 bg-[#eff4ff] text-slate-900 rounded-lg border border-[#CBD5E1] hover:bg-[#dce9ff] transition-colors text-xs font-semibold active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">forum</span>
            <span>Ask Agent</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center justify-center space-x-1.5 py-2 px-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-xs font-semibold active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
            <span>Export Summary PDF</span>
          </button>
        </div>
      </section>

      {/* 3. Invoice & Sales Contract Numbering Configuration */}
      <section className="bg-white rounded-xl border border-[#CBD5E1] p-3.5 shadow-xs space-y-3">
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="material-symbols-outlined text-[#006591] text-[18px]">tag</span>
            <h2 className="text-base font-bold text-slate-900">Numbering Configuration</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Global Prefix/Suffix parameters for automated document generation
          </p>
        </div>

        {/* Sales Contract Formatter */}
        <div className="bg-[#f8f9ff] p-2.5 rounded-lg border border-[#CBD5E1]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-900">Sales Contract Format</span>
            <span className="text-[11px] text-slate-600 bg-white px-2 py-0.5 rounded border border-[#CBD5E1] font-mono">
              {localNumbering.salesContract.prefix}8841{localNumbering.salesContract.suffix}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-500 mb-1 block">Prefix</label>
              <input
                className="w-full text-xs font-mono bg-white border border-[#CBD5E1] rounded px-2.5 py-1.5 focus:border-[#006591] focus:ring-0"
                type="text"
                value={localNumbering.salesContract.prefix}
                onChange={(e) =>
                  setLocalNumbering({
                    ...localNumbering,
                    salesContract: { ...localNumbering.salesContract, prefix: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 mb-1 block">Suffix</label>
              <input
                className="w-full text-xs font-mono bg-white border border-[#CBD5E1] rounded px-2.5 py-1.5 focus:border-[#006591] focus:ring-0"
                type="text"
                value={localNumbering.salesContract.suffix}
                onChange={(e) =>
                  setLocalNumbering({
                    ...localNumbering,
                    salesContract: { ...localNumbering.salesContract, suffix: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Commercial Invoice Formatter */}
        <div className="bg-[#f8f9ff] p-2.5 rounded-lg border border-[#CBD5E1]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-900">Commercial Invoice Format</span>
            <span className="text-[11px] text-slate-600 bg-white px-2 py-0.5 rounded border border-[#CBD5E1] font-mono">
              {localNumbering.commercialInvoice.prefix}2024-884{localNumbering.commercialInvoice.suffix}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-500 mb-1 block">Prefix</label>
              <input
                className="w-full text-xs font-mono bg-white border border-[#CBD5E1] rounded px-2.5 py-1.5 focus:border-[#006591] focus:ring-0"
                type="text"
                value={localNumbering.commercialInvoice.prefix}
                onChange={(e) =>
                  setLocalNumbering({
                    ...localNumbering,
                    commercialInvoice: { ...localNumbering.commercialInvoice, prefix: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 mb-1 block">Suffix</label>
              <input
                className="w-full text-xs font-mono bg-white border border-[#CBD5E1] rounded px-2.5 py-1.5 focus:border-[#006591] focus:ring-0"
                type="text"
                value={localNumbering.commercialInvoice.suffix}
                onChange={(e) =>
                  setLocalNumbering({
                    ...localNumbering,
                    commercialInvoice: { ...localNumbering.commercialInvoice, suffix: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Credit Note Formatter */}
        <div className="bg-[#f8f9ff] p-2.5 rounded-lg border border-[#CBD5E1]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-900">Credit Note Format</span>
            <span className="text-[11px] text-slate-600 bg-white px-2 py-0.5 rounded border border-[#CBD5E1] font-mono">
              {localNumbering.creditNote.prefix}091{localNumbering.creditNote.suffix}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-500 mb-1 block">Prefix</label>
              <input
                className="w-full text-xs font-mono bg-white border border-[#CBD5E1] rounded px-2.5 py-1.5 focus:border-[#006591] focus:ring-0"
                type="text"
                value={localNumbering.creditNote.prefix}
                onChange={(e) =>
                  setLocalNumbering({
                    ...localNumbering,
                    creditNote: { ...localNumbering.creditNote, prefix: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 mb-1 block">Suffix</label>
              <input
                className="w-full text-xs font-mono bg-white border border-[#CBD5E1] rounded px-2.5 py-1.5 focus:border-[#006591] focus:ring-0"
                type="text"
                value={localNumbering.creditNote.suffix}
                onChange={(e) =>
                  setLocalNumbering({
                    ...localNumbering,
                    creditNote: { ...localNumbering.creditNote, suffix: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveNumbering}
          className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center space-x-1.5 active:scale-95 shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px]">sync</span>
          <span>{syncSuccess ? 'Synced to All Invoices!' : 'Save & Sync to Numbering Generator'}</span>
        </button>
      </section>

      {/* 4. Quick Agent Task Queue */}
      <section className="bg-white rounded-xl border border-[#CBD5E1] p-3.5 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="material-symbols-outlined text-[#006591] text-[18px]">playlist_play</span>
            <h2 className="text-base font-bold text-slate-900">Agent Task Queue</h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500 tabular-nums">
            {tasks.length} items active
          </span>
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-2.5 rounded-lg border border-[#CBD5E1]/70 bg-[#f8f9ff] flex items-start space-x-2.5"
            >
              <span className="p-1 rounded bg-[#eff4ff] text-[#006591] text-[16px] shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[16px]">{task.icon}</span>
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900 truncate">
                    {task.agentName}
                  </span>
                  <span
                    className={`text-[11px] font-semibold ${
                      task.status === 'Completed'
                        ? 'text-emerald-700'
                        : task.status === 'Verified'
                        ? 'text-[#006591]'
                        : 'text-[#0284c7]'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{task.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Row */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={onOpenTriggers}
            className="py-2 px-3 border border-[#CBD5E1] rounded-lg bg-white text-slate-800 text-xs font-semibold hover:bg-[#eff4ff] transition-colors flex items-center justify-center space-x-1.5 active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Configure Agent Triggers</span>
          </button>
          <button
            onClick={onOpenLogs}
            className="py-2 px-3 border border-[#CBD5E1] rounded-lg bg-white text-slate-800 text-xs font-semibold hover:bg-[#eff4ff] transition-colors flex items-center justify-center space-x-1.5 active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">terminal</span>
            <span>Agent Log Stream</span>
          </button>
        </div>
      </section>

      {/* Agent Detail Modal (when clicked from workflow engine) */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006591] text-[22px]">
                  {selectedAgent.icon}
                </span>
                <h3 className="font-bold text-sm text-slate-900">{selectedAgent.name}</h3>
              </div>
              <button
                onClick={() => setSelectedAgent(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{selectedAgent.description}</p>
            <div className="bg-[#eff4ff] p-2.5 rounded-lg text-xs space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Telemetry Status:</span>
                <span className="text-emerald-700 font-bold">Synchronized</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reported Accuracy:</span>
                <span className="text-[#006591] font-bold">{selectedAgent.accuracy || '99%'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Latency:</span>
                <span className="text-slate-700 font-bold">12ms (Direct Socket)</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedAgent(null)}
              className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
