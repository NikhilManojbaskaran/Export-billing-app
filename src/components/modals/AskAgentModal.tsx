import React, { useState } from 'react';

interface AskAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToScreen: (screen: 'agents' | 'shipments' | 'invoices' | 'pnl') => void;
}

export const AskAgentModal: React.FC<AskAgentModalProps> = ({
  isOpen,
  onClose,
  onNavigateToScreen,
}) => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<
    Array<{ sender: 'user' | 'agent'; text: string; action?: { label: string; screen: 'agents' | 'shipments' | 'invoices' | 'pnl' } }>
  >([
    {
      sender: 'agent',
      text: 'Greetings. I am Agent 1 (Executive Briefing Agent). I have analyzed all 3 active export consignments, MarineTraffic satellite telemetry, and ledger deductibles. How can I assist your trade operations today?',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'Explain Singapore feeder delay impact',
    'Summarize Hamburg Consignment #EXP-2024-884 risk',
    'Why is Invoice #EXP-2024-902 quarantined?',
    'What is our current net export margin yield?',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || query;
    if (!text.trim()) return;

    const userMsg = { sender: 'user' as const, text };
    setChatHistory((prev) => [...prev, userMsg]);
    setQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      let action: { label: string; screen: 'agents' | 'shipments' | 'invoices' | 'pnl' } | undefined;

      const lower = text.toLowerCase();
      if (lower.includes('delay') || lower.includes('singapore') || lower.includes('pegasus')) {
        reply =
          'Feeder vessel CMA CGM Pegasus incurred a +14 hour transshipment delay at Port of Singapore. Agent 2 automatically detected this via MarineTraffic satellite AIS and notified consignee Hamburg Traders GMBH. Escrow release milestone conditions at DEHAM Berth 04 have been safely buffered by +18 hours.';
        action = { label: 'Track Pegasus in Marine AIS', screen: 'shipments' };
      } else if (lower.includes('884') || lower.includes('hamburg')) {
        reply =
          'Consignment #EXP-2024-884 is in excellent status. All 5/5 mandatory trade documents (B/L, Phyto, Insurance, Sales Contract, Commercial Invoice) have been validated by Agent 3 & 4. Net realized profit is calculated at +$16,432.50 USD (23.4% margin yield). Ready for escrow release upon berth discharge.';
        action = { label: 'Open Dossier in Invoices', screen: 'invoices' };
      } else if (lower.includes('902') || lower.includes('quarantine') || lower.includes('hs code')) {
        reply =
          'Invoice #EXP-2024-902 has an active quarantine hold. Agent 3 identified an HS Code discrepancy: the Phytosanitary Certificate specifies tariff 0804.40 (Avocados) while the Commercial Invoice and B/L state 0804.50 (Guavas/Mangoes). An amendment request is queued for the Rotterdam Inspectorate.';
        action = { label: 'Inspect Invoice Discrepancy', screen: 'invoices' };
      } else if (lower.includes('margin') || lower.includes('p&l') || lower.includes('profit')) {
        reply =
          'Your overall net realized profit across the ledger stands at $148,650.00 USD (+24.8% net margin) across $520,800.00 gross invoiced revenue. Deductions include $31,300 in logistics expenses and $5,050 in 2 audited credit notes.';
        action = { label: 'View Real-Time P&L Monitor', screen: 'pnl' };
      } else {
        reply = `Agent synthesis complete for "${text}". All ledger records are continuously audited with zero telemetry latency across our 5 autonomous agents.`;
      }

      setChatHistory((prev) => [...prev, { sender: 'agent', text: reply, action }]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/20 text-[#38BDF8] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                Executive Briefing Agent
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  Online
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">Autonomous Ledger &amp; Marine Operations Synthesis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70">
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#006591] text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                }`}
              >
                <p>{msg.text}</p>
                {msg.action && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToScreen(msg.action!.screen);
                    }}
                    className="mt-2.5 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-[#eff4ff] text-[#006591] hover:bg-[#dce9ff] transition-colors border border-[#006591]/20"
                  >
                    <span>{msg.action.label}</span>
                    <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                  </button>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.sender === 'user' ? 'You' : 'Agent 1'}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 p-2 bg-white rounded-xl border border-slate-200 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006591] animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#006591] animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#006591] animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[11px] font-mono ml-1 text-slate-600">Cross-referencing agents...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts Strip */}
        <div className="px-3 py-2 bg-white border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0">Quick:</span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-[11px] whitespace-nowrap bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-slate-200 flex gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask Agent 1 about consignments, delays, margins..."
            className="flex-1 text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#006591] focus:ring-1 focus:ring-[#006591]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#006591] hover:bg-[#004c6e] text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
          >
            <span>Send</span>
            <span className="material-symbols-outlined text-[15px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
