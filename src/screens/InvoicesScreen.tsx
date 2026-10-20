import React, { useState } from 'react';
import { InvoiceRecord, DocumentItem, ActiveScreen } from '../types';

interface InvoicesScreenProps {
  invoices: InvoiceRecord[];
  onSelectDocument: (doc: DocumentItem, inv: InvoiceRecord) => void;
  onNavigate: (screen: ActiveScreen) => void;
  onUpdateInvoice: (updated: InvoiceRecord) => void;
}

export const InvoicesScreen: React.FC<InvoicesScreenProps> = ({
  invoices,
  onSelectDocument,
  onNavigate,
  onUpdateInvoice,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'action'>('all');
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>('inv-884');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadToast, setUploadToast] = useState<string | null>(null);
  const [amendmentSent, setAmendmentSent] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState<string | null>(null);

  // Filter invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.consignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.incotermLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.containerId.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'verified') return inv.escrowStatus === 'Ready for release';
    if (statusFilter === 'action') return inv.escrowStatus === 'Action Required';
    return true;
  });

  const handleSimulateUpload = (type: string) => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadToast(`Agent 3 parsed ${type} successfully! Extracted HS Code 0804.50 & carrier seal.`);
      setTimeout(() => setUploadToast(null), 4000);
    }, 1200);
  };

  const handleToggleLock = (invoice: InvoiceRecord) => {
    const updated = { ...invoice, locked: !invoice.locked };
    onUpdateInvoice(updated);
  };

  const handleTransmit = (invoice: InvoiceRecord) => {
    alert(
      `ISO 20022 Swift Trade Message generated for Invoice #${invoice.invoiceNumber}. Transmitted to Consignee & Escrow Bank.`
    );
  };

  const handleRequestAmendment = () => {
    setAmendmentSent(true);
    setTimeout(() => {
      // Auto-resolve after brief period
      const inv902 = invoices.find((i) => i.id === 'inv-902');
      if (inv902) {
        const updatedDocs = inv902.documents.map((d) =>
          d.docType === 'phyto'
            ? {
                ...d,
                name: 'Phytosanitary Certificate (Amended)',
                statusText: 'Inspectorate Certified (HS 0804.50)',
                isDiscrepant: false,
              }
            : d
        );
        onUpdateInvoice({
          ...inv902,
          escrowStatus: 'Ready for release',
          discrepancyNote: undefined,
          documents: updatedDocs,
          verifiedDocsCount: 3,
        });
      }
    }, 1800);
  };

  return (
    <main className="w-full max-w-2xl mx-auto px-4 py-4 space-y-4 pb-28">
      {/* 1. Agent 3 & 4 Status Banner */}
      <section className="bg-white border border-[#CBD5E1] rounded-xl p-3.5 shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5 items-center">
              <span className="w-7 h-7 rounded-lg bg-[#131b2e] text-white flex items-center justify-center text-xs font-bold border border-white shadow-xs">
                A3
              </span>
              <span className="w-7 h-7 rounded-lg bg-[#006591] text-white flex items-center justify-center text-xs font-bold border border-white shadow-xs">
                A4
              </span>
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                Intake &amp; Organization Agents Active
              </span>
            </div>
          </div>
          <span className="text-xs text-[#006591] font-semibold flex items-center gap-0.5 bg-[#eff4ff] px-2 py-1 rounded">
            <span className="material-symbols-outlined text-[14px]">bolt</span> Syncing
          </span>
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="bg-[#eff4ff]/70 rounded-lg p-2.5 border border-[#CBD5E1]/60 flex items-start gap-2">
            <span className="material-symbols-outlined text-[#006591] text-[18px] shrink-0 mt-0.5">
              document_scanner
            </span>
            <div>
              <span className="font-semibold text-slate-900 block text-xs">
                Agent 3 · OCR &amp; Extraction
              </span>
              <p className="text-slate-600 text-[11px] leading-tight mt-0.5">
                Extracts structured key-values, verifies stamps, and cross-checks phytosanitary metadata.
              </p>
            </div>
          </div>

          <div className="bg-[#eff4ff]/70 rounded-lg p-2.5 border border-[#CBD5E1]/60 flex items-start gap-2">
            <span className="material-symbols-outlined text-[#006591] text-[18px] shrink-0 mt-0.5">
              auto_transmission
            </span>
            <div>
              <span className="font-semibold text-slate-900 block text-xs">
                Agent 4 · Ledger Matcher
              </span>
              <p className="text-slate-600 text-[11px] leading-tight mt-0.5">
                Auto-indexes export documents into designated folders using prefix{' '}
                <span className="font-mono text-slate-900 font-bold">EXP-INV-</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick Ingestion Action Card (Drop or Upload) */}
      <section className="bg-white border-2 border-dashed border-[#CBD5E1] hover:border-[#006591] transition-all rounded-xl p-4 shadow-xs text-center relative overflow-hidden group">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#006591] flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <span className="material-symbols-outlined text-[26px]">cloud_upload</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 mt-2">
            Drop or Upload Export Documents
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-sm">
            Drag &amp; drop raw freight dossiers, bulk PDFs, or snap mobile scan to initiate immediate autonomous agent ingestion.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            <button
              onClick={() => handleSimulateUpload('Bill of Lading PDF')}
              disabled={isUploading}
              className="h-9 px-4 rounded-lg bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">upload</span>
              <span>{isUploading ? 'Agent 3 Ingesting...' : 'Upload Files'}</span>
            </button>
            <button
              onClick={() => handleSimulateUpload('Phytosanitary Mobile Scan')}
              disabled={isUploading}
              className="h-9 px-4 rounded-lg bg-white border border-[#CBD5E1] text-slate-800 text-xs font-semibold flex items-center gap-1.5 hover:bg-[#eff4ff] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
              <span>Snap Scan</span>
            </button>
          </div>

          {/* Toast */}
          {uploadToast && (
            <div className="mt-3 p-2 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-xs font-medium flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
              <span>{uploadToast}</span>
            </div>
          )}

          {/* Supported Document Badges */}
          <div className="mt-3 pt-3 border-t border-[#CBD5E1]/60 w-full flex flex-col items-center">
            <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase mb-1.5">
              Supported Document Types:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {[
                'Bill of Lading (B/L)',
                'Phyto Certificate',
                'Certificate of Origin (e-CO)',
                'Inspection Report',
                'Customs Declaration',
              ].map((badge) => (
                <button
                  key={badge}
                  onClick={() => handleSimulateUpload(badge)}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#eff4ff] text-slate-700 hover:bg-[#dce9ff] border border-[#CBD5E1] transition-colors"
                >
                  {badge}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Primary Section: Filing System Organized by Invoice Number */}
      <section className="space-y-3">
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
              search
            </span>
            <input
              className="w-full pl-9 pr-8 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#006591] focus:ring-1 focus:ring-[#006591]/30 transition-all"
              placeholder="Search by Invoice #, Contract #, Consignee name..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-[16px]">cancel</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setStatusFilter(statusFilter === 'all' ? 'verified' : statusFilter === 'verified' ? 'action' : 'all')}
              className={`px-3 py-2 border rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                statusFilter !== 'all'
                  ? 'bg-[#eff4ff] border-[#006591] text-[#006591]'
                  : 'bg-white border-[#CBD5E1] text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">filter_list</span>
              <span>{statusFilter === 'all' ? 'All Status' : statusFilter === 'verified' ? 'Verified' : 'Action Req'}</span>
            </button>
            <button
              onClick={() => setSearchQuery('EXP-2024-884')}
              className="px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">history</span>
              <span>Recent</span>
            </button>
          </div>
        </div>

        {/* Header Label */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
            Filing Vault Ledgers ({filteredInvoices.length} Folders)
          </span>
          <span className="text-[11px] font-mono text-[#006591] font-medium">Prefix Lock: EXP-INV-*</span>
        </div>

        {/* Invoices List */}
        <div className="space-y-3.5">
          {filteredInvoices.map((inv) => {
            const isExpanded = expandedInvoiceId === inv.id;
            const isDiscrepant = inv.escrowStatus === 'Action Required';

            return (
              <article
                key={inv.id}
                className={`bg-white rounded-xl overflow-hidden shadow-xs transition-all border ${
                  isDiscrepant ? 'border-2 border-red-300' : 'border-[#CBD5E1]'
                }`}
              >
                {/* Header / Accordion trigger */}
                <header
                  onClick={() => setExpandedInvoiceId(isExpanded ? null : inv.id)}
                  className={`p-3.5 border-b cursor-pointer transition-colors flex flex-col gap-2 ${
                    isDiscrepant
                      ? 'bg-red-50/40 border-red-200 hover:bg-red-50/70'
                      : 'bg-white hover:bg-slate-50/60 border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`material-symbols-outlined text-[20px] ${
                            isDiscrepant ? 'text-red-700' : 'text-[#006591]'
                          }`}
                        >
                          {isExpanded ? 'folder_open' : 'folder'}
                        </span>
                        <span className="text-base font-bold text-slate-900 font-mono tracking-tight">
                          Invoice #{inv.invoiceNumber}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {inv.incoterm} {inv.incotermLocation}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Consignee: <span className="font-semibold text-slate-900">{inv.consignee}</span> ·{' '}
                        <span className="font-mono font-bold text-slate-900">
                          €{inv.amountEUR.toLocaleString()} (${inv.amountUSD.toLocaleString()} USD)
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isDiscrepant ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1 animate-pulse">
                          <span className="material-symbols-outlined text-[14px]">warning</span>
                          Action Required
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          {inv.verifiedDocsCount}/{inv.totalDocsCount} Verified
                        </span>
                      )}
                      <span className="material-symbols-outlined text-slate-400 text-[18px]">
                        {isExpanded ? 'expand_less' : 'expand_more'}
                      </span>
                    </div>
                  </div>

                  {/* Route Visualizer Mini Rack */}
                  <div className="flex items-center justify-between text-xs font-mono bg-[#eff4ff] px-2.5 py-1 rounded border border-[#CBD5E1]/60">
                    <span className="text-slate-600 flex items-center gap-1">
                      <span className="text-[#006591] font-bold">POL:</span> {inv.pol.code} ({inv.pol.name})
                    </span>
                    <span className="material-symbols-outlined text-[14px] text-slate-400">
                      arrow_forward
                    </span>
                    <span className="text-slate-600 flex items-center gap-1">
                      <span className="text-[#006591] font-bold">POD:</span> {inv.pod.code} ({inv.pod.name})
                    </span>
                    <span className="text-slate-500 hidden sm:inline">
                      {inv.imo ? `IMO: ${inv.imo}` : inv.agentHash}
                    </span>
                  </div>

                  {/* Discrepancy Callout if any */}
                  {inv.discrepancyNote && (
                    <div className="bg-white border border-red-200 rounded-lg p-2.5 flex items-start gap-2 text-xs">
                      <span className="material-symbols-outlined text-red-700 text-[18px] shrink-0 mt-0.5">
                        error
                      </span>
                      <div className="text-[11px] leading-tight">
                        <span className="font-bold text-red-800 block">
                          HS Code 0804.50 Mismatch flagged by Agent 3
                        </span>
                        <p className="text-slate-600 mt-0.5">{inv.discrepancyNote}</p>
                      </div>
                    </div>
                  )}
                </header>

                {/* Expanded Document Docket */}
                {isExpanded && (
                  <div>
                    {/* Discrepancy action row for inv-902 */}
                    {isDiscrepant && (
                      <div className="p-3 bg-red-50/50 border-b border-red-200 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-600"></span>
                          <div>
                            <p className="text-xs font-bold text-slate-900">
                              Phytosanitary Certificate (Faulty OCR)
                            </p>
                            <p className="text-[11px] text-red-700">
                              Awaiting amended re-upload from Inspectorate
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleRequestAmendment}
                            disabled={amendmentSent}
                            className="px-2.5 py-1 rounded bg-red-100 border border-red-300 text-red-800 text-xs font-semibold hover:bg-red-200 flex items-center gap-1 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px]">refresh</span>
                            <span>{amendmentSent ? 'Amendment Ingesting...' : 'Request Amendment'}</span>
                          </button>
                          <button
                            onClick={() => setShowAuditLog(inv.id)}
                            className="px-2 py-1 rounded bg-white text-slate-700 text-xs font-medium border border-slate-300 hover:bg-slate-50"
                          >
                            View Audit Log
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Document List Items */}
                    <div className="divide-y divide-[#CBD5E1]/50">
                      {inv.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-3 hover:bg-[#eff4ff]/40 transition-colors flex items-center justify-between gap-3"
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded bg-[#dce9ff] flex items-center justify-center text-[#006591] shrink-0 mt-0.5">
                              <span className="material-symbols-outlined text-[18px]">
                                {doc.docType === 'bl'
                                  ? 'description'
                                  : doc.docType === 'phyto'
                                  ? 'verified_user'
                                  : doc.docType === 'insurance'
                                  ? 'security'
                                  : doc.docType === 'contract'
                                  ? 'handshake'
                                  : 'receipt_long'}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-semibold text-slate-900 truncate">
                                  {doc.name}
                                </span>
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-100 text-slate-700">
                                  {doc.fileName}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                                {doc.verifiedBy && (
                                  <span className="inline-flex items-center gap-0.5 text-emerald-700 text-[11px] font-medium">
                                    <span className="material-symbols-outlined text-[13px]">
                                      verified
                                    </span>
                                    Verified by {doc.verifiedBy}
                                  </span>
                                )}
                                {doc.badgeText && (
                                  <span className="text-[11px] font-medium text-[#006591]">
                                    {doc.badgeText}
                                  </span>
                                )}
                                <span>·</span>
                                <span className="text-[11px] font-mono">{doc.statusText}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => onSelectDocument(doc, inv)}
                              className="w-7 h-7 rounded border border-[#CBD5E1] hover:bg-white flex items-center justify-center text-slate-700 hover:text-[#006591] transition-colors"
                              title="Preview Document"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                visibility
                              </span>
                            </button>
                            <button
                              onClick={() => alert(`Downloading verified copy: ${doc.fileName}`)}
                              className="w-7 h-7 rounded border border-[#CBD5E1] hover:bg-white flex items-center justify-center text-slate-700 hover:text-[#006591] transition-colors"
                              title="Download PDF"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                download
                              </span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Deep Linking Cross Navigation Strip */}
                    <div className="px-3 py-2 bg-[#f8f9ff] border-t border-[#CBD5E1]/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <button
                        onClick={() => onNavigate('shipments')}
                        className="text-[#006591] hover:underline font-semibold flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[15px]">directions_boat</span>
                        <span>Track Container {inv.containerId} in AIS</span>
                      </button>
                      <button
                        onClick={() => onNavigate('pnl')}
                        className="text-slate-700 hover:text-[#006591] font-semibold flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[15px]">monitoring</span>
                        <span>Audit Consignment Net P&amp;L</span>
                      </button>
                    </div>

                    {/* Folder Actions Footer */}
                    <footer className="p-3 bg-[#eff4ff]/50 border-t border-[#CBD5E1]/60 flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-600">
                        Escrow: <strong className="text-slate-900">{inv.escrowStatus}</strong>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleLock(inv)}
                          className="px-2.5 py-1.5 rounded bg-white border border-[#CBD5E1] text-xs font-semibold text-slate-800 hover:bg-[#eff4ff] flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {inv.locked ? 'lock' : 'lock_open'}
                          </span>
                          <span>{inv.locked ? 'Locked' : 'Lock Dossier'}</span>
                        </button>
                        <button
                          onClick={() => handleTransmit(inv)}
                          className="px-3 py-1.5 rounded bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 flex items-center gap-1 shadow-xs active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[15px]">share</span>
                          <span>Transmit</span>
                        </button>
                      </div>
                    </footer>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. Agent File Action Buttons (Multi-Action Grid) */}
      <section className="pt-2 space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            onClick={() => {
              alert('Complete ISO trade docket archived & ready for download as ZIP/PDF.');
            }}
            className="h-11 px-4 rounded-lg bg-white border border-[#CBD5E1] text-slate-800 text-xs sm:text-sm font-semibold hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <span className="material-symbols-outlined text-[20px] text-[#006591]">archive</span>
            <span>Export Complete Docket (ZIP/PDF)</span>
          </button>
          <button
            onClick={() => {
              alert('Escrow package encrypted with ISO 20022 Swift format and shared with depository bank.');
            }}
            className="h-11 px-4 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white text-xs sm:text-sm font-semibold active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <span className="material-symbols-outlined text-[20px]">account_balance</span>
            <span>Share Escrow Package with Bank</span>
          </button>
        </div>
        <p className="text-center text-[11px] text-slate-500">
          Encrypted ISO 20022 Swift Trade Message generation ready for all verified folders.
        </p>
      </section>

      {/* Audit Log Modal */}
      {showAuditLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900">
                Agent 3 &amp; 4 Discrepancy Audit Log
              </h3>
              <button onClick={() => setShowAuditLog(null)} className="text-slate-400">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="space-y-2 text-xs font-mono bg-slate-50 p-3 rounded-lg border border-slate-200">
              <p className="text-slate-600">[07:18:02] Agent 3 OCR Ingestion initialized on PHYTO-DUTCH-902.pdf.</p>
              <p className="text-amber-700 font-semibold">[07:18:04] Tariff code extracted: 0804.40 (HS Avocado).</p>
              <p className="text-slate-600">[07:18:05] Cross-referencing against Commercial Invoice &amp; B/L: 0804.50.</p>
              <p className="text-red-700 font-bold">[07:18:06] Discrepancy detected: Delta ±1 digit. Escrow status set to Action Required.</p>
              <p className="text-emerald-700 font-semibold">[07:18:07] Smart contract quarantine engaged.</p>
            </div>
            <button
              onClick={() => setShowAuditLog(null)}
              className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
            >
              Close Log
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
