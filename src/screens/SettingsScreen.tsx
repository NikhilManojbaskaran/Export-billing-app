import React, { useState } from 'react';
import { NumberingConfig } from '../types';

interface SettingsScreenProps {
  numbering: NumberingConfig;
  onUpdateNumbering: (config: NumberingConfig) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  numbering,
  onUpdateNumbering,
}) => {
  const [config, setConfig] = useState<NumberingConfig>(numbering);
  const [aisProvider, setAisProvider] = useState('MarineTraffic Dual Satellite');
  const [isoProtocol, setIsoProtocol] = useState('ISO 20022 Swift Fin (MT700/pain.001)');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdateNumbering(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="w-full max-w-md mx-auto px-4 pt-3 pb-28 flex flex-col gap-3">
      <div className="bg-white rounded-xl p-3.5 border border-[#CBD5E1] shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b border-[#CBD5E1] pb-2">
          <span className="material-symbols-outlined text-[#006591] text-[20px]">tune</span>
          <div>
            <h2 className="text-base font-bold text-slate-900">System Preferences &amp; Automations</h2>
            <p className="text-xs text-slate-500">Autonomous multi-agent routing configurations</p>
          </div>
        </div>

        {/* AIS Marine Integration */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-800 block">
            Satellite AIS Telemetry Provider
          </label>
          <select
            value={aisProvider}
            onChange={(e) => setAisProvider(e.target.value)}
            className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-xs font-mono bg-[#f8f9ff]"
          >
            <option value="MarineTraffic Dual Satellite">MarineTraffic Dual Satellite (ORB Constellation)</option>
            <option value="Lloyds List Intelligence">Lloyd&apos;s List Intelligence AIS Stream</option>
            <option value="VesselFinder Global Sat">VesselFinder Global Sat API</option>
          </select>
          <p className="text-[11px] text-slate-500">
            Doppler sync frequency: 45 seconds. Transshipment deviation threshold: ±0.0012°.
          </p>
        </div>

        {/* Banking Swift Protocol */}
        <div className="space-y-1.5 pt-2 border-t border-[#CBD5E1]">
          <label className="text-xs font-semibold text-slate-800 block">
            Escrow Banking Swift Protocol
          </label>
          <select
            value={isoProtocol}
            onChange={(e) => setIsoProtocol(e.target.value)}
            className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-xs font-mono bg-[#f8f9ff]"
          >
            <option value="ISO 20022 Swift Fin (MT700/pain.001)">ISO 20022 Swift Fin (MT700 / pain.001)</option>
            <option value="camt.053 Real-Time Statement">camt.053 Real-Time Electronic Statement</option>
            <option value="SEPA B2B Direct Debit">SEPA B2B Trade Finance Guarantee</option>
          </select>
        </div>

        {/* Numbering Preview */}
        <div className="space-y-2 pt-2 border-t border-[#CBD5E1]">
          <span className="text-xs font-bold text-slate-900 block">Active Sequence Masks</span>
          <div className="bg-[#eff4ff] p-2.5 rounded-lg text-xs font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-600">Sales Contracts:</span>
              <span className="font-bold text-[#006591]">{config.salesContract.prefix}####{config.salesContract.suffix}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Invoices:</span>
              <span className="font-bold text-[#006591]">{config.commercialInvoice.prefix}####{config.commercialInvoice.suffix}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Credit Notes:</span>
              <span className="font-bold text-[#006591]">{config.creditNote.prefix}###{config.creditNote.suffix}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">save</span>
          <span>{saved ? 'Preferences Saved & Applied!' : 'Save Configurations'}</span>
        </button>
      </div>
    </main>
  );
};
