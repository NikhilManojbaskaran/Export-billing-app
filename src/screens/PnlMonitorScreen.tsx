import React, { useState } from 'react';
import { CreditNoteItem, LogisticsExpenseItem, Currency, ActiveScreen } from '../types';
import { CreditNoteModal } from '../components/modals/CreditNoteModal';

interface PnlMonitorScreenProps {
  currency: Currency;
  onCurrencyToggle: (currency: Currency) => void;
  creditNotes: CreditNoteItem[];
  expenses: LogisticsExpenseItem[];
  onAddCreditNote: (note: Omit<CreditNoteItem, 'id'>) => void;
  onNavigate: (screen: ActiveScreen) => void;
}

export const PnlMonitorScreen: React.FC<PnlMonitorScreenProps> = ({
  currency,
  creditNotes,
  expenses,
  onAddCreditNote,
  onNavigate,
}) => {
  const [showCNModal, setShowCNModal] = useState(false);
  const [selectedConsignmentIndex, setSelectedConsignmentIndex] = useState(0);
  const [alertThresholdSet, setAlertThresholdSet] = useState(false);

  // FX conversion factor
  const fx = currency === 'USD' ? 1.0 : 0.92;
  const sym = currency === 'USD' ? '$' : '€';

  const formatMoney = (usdVal: number) => {
    const val = usdVal * fx;
    return `${sym}${Math.abs(val).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Dynamic calculations based on credit notes
  const totalCreditNotesUSD = creditNotes.reduce((acc, curr) => acc + curr.debitValueUSD, 0);
  const totalExpensesUSD = expenses.reduce((acc, curr) => acc + curr.amountUSD, 0);

  const baseGrossUSD = 520800.0;
  const totalDeductionsUSD = 333000.0 + totalExpensesUSD + totalCreditNotesUSD;
  const netProfitUSD = baseGrossUSD - totalDeductionsUSD;
  const marginPct = ((netProfitUSD / baseGrossUSD) * 100).toFixed(1);

  // Consignments list
  const consignments = [
    {
      invoice: '#EXP-2024-884',
      incoterm: 'CIF',
      consignee: 'Hamburg Traders GMBH',
      grossEUR: '€64,500.00',
      grossUSD: 70082.5,
      creditNoteText: 'Less Credit Note #CN-102:',
      creditNoteAmount: -3200.0,
      freightAmount: -12450.0,
      cogsText: 'COGS (Arabica Beans 2x40ft):',
      cogsAmount: -38000.0,
      netMarginUSD: 16432.5,
      yieldRatio: '23.4% Yield Ratio',
    },
    {
      invoice: '#EXP-2024-891',
      incoterm: 'FOB',
      consignee: 'Tokyo Electronics KK',
      grossEUR: '€118,250.00',
      grossUSD: 128400.0,
      creditNoteText: 'Less Quality Discount:',
      creditNoteAmount: 0.0,
      freightAmount: -6800.0,
      cogsText: 'COGS (Semiconductor Modules):',
      cogsAmount: -84000.0,
      netMarginUSD: 37600.0,
      yieldRatio: '29.3% Yield Ratio',
    },
    {
      invoice: '#EXP-2024-902',
      incoterm: 'EXW',
      consignee: 'Rotterdam Agro BV',
      grossEUR: '€38,900.00',
      grossUSD: 42250.0,
      creditNoteText: 'Less Credit Note #CN-105:',
      creditNoteAmount: -1850.0,
      freightAmount: -3400.0,
      cogsText: 'COGS (Tropical Fruits Consignment):',
      cogsAmount: -28000.0,
      netMarginUSD: 9000.0,
      yieldRatio: '21.3% Yield Ratio',
    },
  ];

  const currentConsignment = consignments[selectedConsignmentIndex] || consignments[0];

  const handleDownloadStatement = () => {
    const text = `
TRADEPAY EXPORTER - AUDITED P&L STATEMENT
Currency: ${currency}
Net Realized Profit: ${formatMoney(netProfitUSD)}
Gross Invoiced Revenue: ${formatMoney(baseGrossUSD)}
Total Deductions & Logistics: -${formatMoney(totalDeductionsUSD)}
Margin Yield: +${marginPct}%
Audited by Agent 5 Autonomous Ledger
    `;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PnL-Audit-Statement-${currency}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="w-full max-w-md mx-auto px-4 pt-3 pb-28 flex flex-col gap-3">
      {/* Agent 5 Live Status Pill */}
      <div className="flex items-center justify-between bg-white px-3.5 py-1.5 rounded-xl border border-[#CBD5E1] shadow-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
          </span>
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Agent 5 Autonomous Ledger
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#006591] font-semibold bg-[#eff4ff] px-1.5 py-0.5 rounded border border-[#CBD5E1]">
          Synced 14s ago
        </span>
      </div>

      {/* 1. Executive Net Margin Banner */}
      <section className="bg-white rounded-xl p-3.5 border border-[#CBD5E1] shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 w-28 h-28 bg-[#eff4ff] rounded-bl-full pointer-events-none -mr-6 -mt-6"></div>
        <div className="relative z-10 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Net Realized Profit</span>
            <span className="text-xs bg-[#6ffbbe] text-[#002113] px-2 py-0.5 rounded font-bold border border-[#4edea3] inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +{marginPct}% Margin
            </span>
          </div>

          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1 font-mono">
            {formatMoney(netProfitUSD)}
          </div>
          <p className="text-xs text-slate-500">
            Real-time ledger audit across active ocean &amp; air consignments
          </p>

          {/* Divider */}
          <div className="w-full h-px bg-slate-200 my-1.5"></div>

          {/* Metric Inline Sub-Grid */}
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <div className="flex flex-col bg-[#eff4ff] p-2 rounded-lg border border-[#CBD5E1]">
              <span className="text-[11px] text-slate-500">Gross Invoiced Revenue</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 font-mono">
                {formatMoney(baseGrossUSD)}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">14 Invoices Settled</span>
            </div>
            <div className="flex flex-col bg-red-50 p-2 rounded-lg border border-red-200">
              <span className="text-[11px] text-red-700">Total Deductions &amp; Exp.</span>
              <span className="text-sm font-bold text-red-700 mt-0.5 font-mono">
                -{formatMoney(totalDeductionsUSD)}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">Logistics &amp; Credit Notes</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Credit Notes Adjustment Section */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-0.5">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
              Credit Notes Adjustments
              <span className="text-[10px] font-mono bg-[#dce9ff] px-1.5 py-0.5 rounded text-[#006591] font-bold">
                {creditNotes.length} Active
              </span>
            </h2>
            <p className="text-[11px] text-slate-500">Deducted prior to export profit recognition</p>
          </div>
        </div>

        {/* Credit Note Cards Rack */}
        <div className="flex flex-col gap-2">
          {creditNotes.map((cn) => (
            <div
              key={cn.id}
              className="bg-white rounded-xl p-3 border border-[#CBD5E1] shadow-xs flex flex-col gap-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    Credit Note #{cn.number}
                  </span>
                  <span className="text-[11px] text-slate-600">
                    Consignee: <strong className="text-slate-900">{cn.consignee}</strong>
                  </span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                    cn.status === 'Settled & Deducted'
                      ? 'bg-[#6ffbbe] text-[#002113] border-[#4edea3]'
                      : 'bg-[#c9e6ff] text-[#001e2f] border-[#89ceff]'
                  }`}
                >
                  {cn.status}
                </span>
              </div>

              <div className="bg-[#eff4ff] p-2 rounded-lg text-xs border border-[#CBD5E1] flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Discrepancy:</span>
                  <span className="text-slate-900 font-medium">{cn.discrepancy}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Linked Export Invoice:</span>
                  <button
                    onClick={() => onNavigate('invoices')}
                    className="text-[11px] font-mono text-[#006591] font-bold hover:underline"
                  >
                    INV #{cn.linkedInvoice}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <span className="text-xs text-slate-500">Debit Value:</span>
                <span className="text-sm font-bold text-red-600 font-mono">
                  -{formatMoney(cn.debitValueUSD)} {currency}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Button */}
        <button
          onClick={() => setShowCNModal(true)}
          className="w-full h-10 bg-white text-slate-900 hover:bg-[#eff4ff] border border-[#CBD5E1] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">add_circle</span>
          <span>+ Issue New Credit Note</span>
        </button>
      </section>

      {/* 3. All Operational & Logistics Expenses Breakdown */}
      <section className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            Logistics &amp; Operation Expenses
          </h2>
          <span className="text-xs text-slate-500">{expenses.length} Line Categories</span>
        </div>
        <p className="text-[11px] text-slate-500 px-0.5">
          Granular deductions required for verified profit recognition
        </p>

        <div className="bg-white rounded-xl border border-[#CBD5E1] shadow-xs divide-y divide-[#CBD5E1] overflow-hidden">
          {expenses.map((exp) => (
            <div
              key={exp.id}
              className="p-2.5 flex items-center justify-between hover:bg-[#eff4ff]/60 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-[#eff4ff] flex items-center justify-center text-[#006591] border border-[#CBD5E1]">
                  <span className="material-symbols-outlined text-[16px]">{exp.icon}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-900">{exp.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{exp.subtitle}</span>
                </div>
              </div>
              <span className="text-xs font-bold text-red-600 font-mono whitespace-nowrap">
                -{formatMoney(exp.amountUSD)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Per-Invoice P&L Breakdown Card */}
      <section className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            Consignment Ledger Breakdown
          </h2>
          <div className="flex items-center gap-1">
            {consignments.map((_, i) => (
              <button
                key={i}
                onClick={() => setSelectedConsignmentIndex(i)}
                className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold transition-colors ${
                  selectedConsignmentIndex === i
                    ? 'bg-[#006591] text-white'
                    : 'bg-[#eff4ff] text-[#006591] hover:bg-[#dce9ff]'
                }`}
              >
                {i + 1} of {consignments.length}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#CBD5E1] shadow-xs p-3.5 flex flex-col gap-2.5">
          {/* Invoice Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-slate-900 font-mono">
                  {currentConsignment.invoice}
                </span>
                <span className="text-[10px] bg-[#eff4ff] text-slate-700 px-1.5 py-0.5 rounded border border-[#CBD5E1] font-mono font-bold">
                  {currentConsignment.incoterm}
                </span>
              </div>
              <span className="text-xs text-slate-600">
                Consignee: {currentConsignment.consignee}
              </span>
            </div>
            <span className="text-[10px] bg-[#6ffbbe] text-[#002113] px-2 py-0.5 rounded font-bold border border-[#4edea3]">
              Agent 5 Verified
            </span>
          </div>

          {/* Ledger Line Items */}
          <div className="bg-[#eff4ff] p-2.5 rounded-lg border border-[#CBD5E1] flex flex-col gap-1 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">
                Gross Invoice Value ({currentConsignment.grossEUR}):
              </span>
              <span className="font-semibold text-slate-900 font-mono">
                +{formatMoney(currentConsignment.grossUSD)} {currency}
              </span>
            </div>
            {currentConsignment.creditNoteAmount !== 0 && (
              <div className="flex justify-between items-center text-red-600">
                <span className="text-slate-600">{currentConsignment.creditNoteText}</span>
                <span className="font-semibold font-mono">
                  -{formatMoney(Math.abs(currentConsignment.creditNoteAmount))} {currency}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center text-red-600">
              <span className="text-slate-600">Less Freight, Ins. &amp; Customs:</span>
              <span className="font-semibold font-mono">
                -{formatMoney(Math.abs(currentConsignment.freightAmount))} {currency}
              </span>
            </div>
            <div className="flex justify-between items-center text-red-600">
              <span className="text-slate-600">{currentConsignment.cogsText}</span>
              <span className="font-semibold font-mono">
                -{formatMoney(Math.abs(currentConsignment.cogsAmount))} {currency}
              </span>
            </div>
          </div>

          {/* Margin Outcome */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-500">
                Net Realized Margin
              </span>
              <span className="text-[11px] font-mono text-[#009668] font-bold">
                {currentConsignment.yieldRatio}
              </span>
            </div>
            <span className="text-base sm:text-lg font-bold text-[#009668] font-mono">
              +{formatMoney(currentConsignment.netMarginUSD)} {currency}
            </span>
          </div>
        </div>
      </section>

      {/* 5. Quick CTAs */}
      <section className="flex flex-col gap-2 pt-1">
        <button
          onClick={handleDownloadStatement}
          className="w-full h-11 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">file_download</span>
          <span>Download P&amp;L Audit Statement</span>
        </button>
        <button
          onClick={() => {
            setAlertThresholdSet(true);
            setTimeout(() => setAlertThresholdSet(false), 2500);
          }}
          className="w-full h-11 bg-white text-slate-900 hover:bg-[#eff4ff] border border-[#CBD5E1] rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
          <span>{alertThresholdSet ? 'Thresholds Configured (Margin < 15%)' : 'Set Expense Alert Thresholds'}</span>
        </button>
      </section>

      {/* Credit Note Modal */}
      <CreditNoteModal
        isOpen={showCNModal}
        onClose={() => setShowCNModal(false)}
        onAddCreditNote={onAddCreditNote}
      />
    </main>
  );
};
