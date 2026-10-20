import React from 'react';
import { DocumentItem, InvoiceRecord } from '../../types';

interface DocumentPreviewModalProps {
  document: DocumentItem | null;
  invoice: InvoiceRecord | null;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  invoice,
  onClose,
}) => {
  if (!document || !invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#006591] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">description</span>
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                {document.name}
              </h3>
              <p className="text-[11px] text-slate-300 font-mono">
                {document.fileName} • {document.fileSize}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Document Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
          {/* Status Badge Strip */}
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-[18px] ${document.isDiscrepant ? 'text-red-600' : 'text-emerald-600'}`}>
                {document.isDiscrepant ? 'warning' : 'verified'}
              </span>
              <span className="text-xs font-semibold text-slate-800">
                {document.isDiscrepant ? 'Discrepancy Flagged by Agent 3' : 'Verified by Agent 3 & 4'}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              SHA-256: 0x9f82...c31b
            </span>
          </div>

          {/* Simulated Authentic Document Paper */}
          <div className="bg-white p-6 rounded-xl border border-slate-300 shadow-sm font-mono text-xs space-y-4 relative">
            {/* Watermark / Seal */}
            <div className="absolute right-6 top-6 w-16 h-16 rounded-full border-2 border-emerald-600/30 flex items-center justify-center rotate-12 pointer-events-none">
              <div className="text-[8px] text-center font-bold text-emerald-700 leading-tight uppercase">
                Customs
                <br />
                Verified
                <br />
                2026
              </div>
            </div>

            <div className="border-b border-slate-200 pb-3 flex justify-between items-start">
              <div>
                <p className="text-sm font-bold font-sans text-slate-900 uppercase tracking-wider">
                  International Trade Docket
                </p>
                <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                  Consignment Ref: <span className="text-[#006591] font-bold">{invoice.invoiceNumber}</span>
                </p>
              </div>
              <span className="text-[11px] font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                {invoice.incoterm} {invoice.incotermLocation}
              </span>
            </div>

            {/* Extracted Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-slate-400 block uppercase text-[10px]">Consignee</span>
                <span className="font-semibold text-slate-800">{invoice.consignee}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px]">Carrier / Vessel</span>
                <span className="font-semibold text-slate-800">{invoice.imo ? `IMO: ${invoice.imo}` : 'Pacific Feeder'}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px]">Port of Loading</span>
                <span className="font-semibold text-slate-800">{invoice.pol.name} ({invoice.pol.code})</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px]">Port of Discharge</span>
                <span className="font-semibold text-slate-800">{invoice.pod.name} ({invoice.pod.code})</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px]">Invoice Value</span>
                <span className="font-semibold text-emerald-700 tabular-nums">€{invoice.amountEUR.toLocaleString()} EUR (${invoice.amountUSD.toLocaleString()} USD)</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px]">Container / Seal</span>
                <span className="font-semibold text-slate-800">{invoice.containerId}</span>
              </div>
            </div>

            {document.isDiscrepant && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 space-y-1">
                <div className="flex items-center gap-1 font-bold text-xs">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  <span>OCR Cross-Check Anomaly Detected</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Phytosanitary certificate mentions HS Code 0804.40 whereas the commercial invoice and customs entry declare HS Code 0804.50. Automatic escrow payment has been quarantined.
                </p>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-sans">
              <span>Timestamp: {document.timestamp}</span>
              <span>Agent 3 Ingestion ID: #ING-89410</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              alert(`Downloading authenticated copy of ${document.fileName}...`);
            }}
            className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Download Signed PDF</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
