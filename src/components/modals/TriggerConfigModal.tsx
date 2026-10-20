import React, { useState } from 'react';

interface TriggerConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const TriggerConfigModal: React.FC<TriggerConfigModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [delayThresholdHours, setDelayThresholdHours] = useState(12);
  const [autoEscrowHold, setAutoEscrowHold] = useState(true);
  const [ocrTolerance, setOcrTolerance] = useState(95);
  const [autoNotifyConsignee, setAutoNotifyConsignee] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onSave();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#38BDF8]">tune</span>
            <h3 className="font-bold text-sm text-white">Configure Autonomous Agent Triggers</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="font-semibold text-slate-800 block mb-1">
              Marine Delay Escalation Threshold (Hours)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="4"
                max="48"
                step="2"
                value={delayThresholdHours}
                onChange={(e) => setDelayThresholdHours(Number(e.target.value))}
                className="flex-1 accent-[#006591]"
              />
              <span className="font-mono font-bold text-[#006591] bg-slate-100 px-2.5 py-1 rounded">
                +{delayThresholdHours}h
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Delays exceeding this will auto-reschedule milestone escrow dates.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200 space-y-3">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={autoEscrowHold}
                onChange={(e) => setAutoEscrowHold(e.target.checked)}
                className="mt-0.5 rounded text-[#006591] focus:ring-[#006591]"
              />
              <div>
                <span className="font-semibold text-slate-800 block">Auto-Quarantine Escrow on HS Code Discrepancies</span>
                <span className="text-[11px] text-slate-500">
                  Prevents unauthorized payout releases until inspectorate amendment.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={autoNotifyConsignee}
                onChange={(e) => setAutoNotifyConsignee(e.target.checked)}
                className="mt-0.5 rounded text-[#006591] focus:ring-[#006591]"
              />
              <div>
                <span className="font-semibold text-slate-800 block">Broadcast AIS Feeder Delay Guard Notices</span>
                <span className="text-[11px] text-slate-500">
                  Transmits automated ETA revisions directly to consignee port agents.
                </span>
              </div>
            </label>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <label className="font-semibold text-slate-800 block mb-1">
              Agent 3 OCR Extraction Confidence Minimum (%)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="80"
                max="99"
                value={ocrTolerance}
                onChange={(e) => setOcrTolerance(Number(e.target.value))}
                className="w-24 px-2 py-1.5 border border-slate-300 rounded font-mono text-center"
              />
              <span className="text-[11px] text-slate-500">
                Documents below {ocrTolerance}% confidence trigger manual review flag.
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-[#006591] hover:bg-[#004c6e] text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {isSaved ? (
              <>
                <span className="material-symbols-outlined text-[16px]">check</span>
                <span>Saved &amp; Synced!</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">save</span>
                <span>Save Triggers</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
