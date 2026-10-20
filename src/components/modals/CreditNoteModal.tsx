import React, { useState } from 'react';
import { CreditNoteItem } from '../../types';

interface CreditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCreditNote: (note: Omit<CreditNoteItem, 'id'>) => void;
}

export const CreditNoteModal: React.FC<CreditNoteModalProps> = ({
  isOpen,
  onClose,
  onAddCreditNote,
}) => {
  const [consignee, setConsignee] = useState('Hamburg Traders GMBH');
  const [linkedInvoice, setLinkedInvoice] = useState('EXP-2024-884');
  const [discrepancy, setDiscrepancy] = useState('Cargo moisture & temperature deviation');
  const [debitValueUSD, setDebitValueUSD] = useState(1200);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newNoteNumber = `CN-2024-${Math.floor(110 + Math.random() * 80)}`;
    onAddCreditNote({
      number: newNoteNumber,
      consignee,
      status: 'Settled & Deducted',
      discrepancy,
      linkedInvoice,
      debitValueUSD: Number(debitValueUSD),
      debitValueEUR: Math.round(Number(debitValueUSD) * 0.92),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400">add_circle</span>
            <h3 className="font-bold text-sm text-white">Issue New Credit Note</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Consignee Buyer</label>
            <select
              value={consignee}
              onChange={(e) => setConsignee(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#006591]"
            >
              <option value="Hamburg Traders GMBH">Hamburg Traders GMBH</option>
              <option value="Rotterdam Agro BV">Rotterdam Agro BV</option>
              <option value="Tokyo Electronics KK">Tokyo Electronics KK</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Linked Export Invoice</label>
            <select
              value={linkedInvoice}
              onChange={(e) => setLinkedInvoice(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#006591] font-mono"
            >
              <option value="EXP-2024-884">INV #EXP-2024-884 (CIF HAMBURG)</option>
              <option value="EXP-2024-891">INV #EXP-2024-891 (FOB TOKYO)</option>
              <option value="EXP-2024-902">INV #EXP-2024-902 (EXW ROTTERDAM)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Discrepancy Justification</label>
            <input
              type="text"
              value={discrepancy}
              onChange={(e) => setDiscrepancy(e.target.value)}
              placeholder="e.g. Broken pallet seal, cargo shrinkage"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#006591]"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Debit Value (USD $)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 font-bold text-slate-400">$</span>
              <input
                type="number"
                min="50"
                step="50"
                value={debitValueUSD}
                onChange={(e) => setDebitValueUSD(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#006591] font-mono font-bold text-red-600"
                required
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Agent 5 will deduct this from realized export net revenue immediately.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">receipt</span>
              <span>Post to Ledger</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
