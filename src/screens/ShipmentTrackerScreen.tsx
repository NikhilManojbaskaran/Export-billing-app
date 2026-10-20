import React, { useState, useEffect } from 'react';
import { VESSEL_DATA_MAP } from '../data/mockData';
import { ActiveScreen } from '../types';
import { AISMapModal, PortInspectionModal } from '../components/modals/AISMapModal';

interface ShipmentTrackerScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const ShipmentTrackerScreen: React.FC<ShipmentTrackerScreenProps> = ({
  onNavigate,
}) => {
  const [searchContainer, setSearchContainer] = useState('MEDU7482910-40HC');
  const [activeContainer, setActiveContainer] = useState('MEDU7482910-40HC');
  const [nextFix, setNextFix] = useState(18);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);

  const vessel = VESSEL_DATA_MAP[activeContainer] || VESSEL_DATA_MAP['MEDU7482910-40HC'];

  // Countdown timer for next satellite fix
  useEffect(() => {
    const timer = setInterval(() => {
      setNextFix((prev) => (prev <= 1 ? 20 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleQuery = (e: React.FormEvent) => {
    e.preventDefault();
    setIsQuerying(true);
    setTimeout(() => {
      setIsQuerying(false);
      const clean = searchContainer.trim().toUpperCase();
      if (clean.includes('ONEY') || clean.includes('4401928')) {
        setActiveContainer('ONEY-4401928');
      } else {
        setActiveContainer('MEDU7482910-40HC');
      }
    }, 600);
  };

  return (
    <main className="w-full max-w-md mx-auto px-4 pt-3 flex flex-col gap-3 pb-28">
      {/* 1. SEARCH & CROSS-VERIFICATION MODULE */}
      <section className="bg-white rounded-xl p-3.5 border border-[#CBD5E1] shadow-xs flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <label
            className="text-[11px] text-slate-600 flex items-center gap-1.5 font-bold uppercase tracking-wider"
            htmlFor="shipment-search"
          >
            <span className="material-symbols-outlined text-[15px] text-[#006591]">search</span>
            CONTAINER / B/L IDENTIFIER
          </label>
          <span className="text-[11px] bg-[#eff4ff] text-slate-800 font-mono px-1.5 py-0.5 rounded border border-[#CBD5E1]">
            HS-8471.30
          </span>
        </div>

        {/* Search Input Field */}
        <form onSubmit={handleQuery} className="relative flex items-center">
          <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
            <span className="material-symbols-outlined text-[18px]">travel_explore</span>
          </div>
          <input
            className="w-full pl-9 pr-24 py-2 bg-[#f8f9ff] border border-[#CBD5E1] rounded-lg text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:border-[#006591] focus:ring-1 focus:ring-[#006591] transition-all"
            id="shipment-search"
            placeholder="Enter Container e.g. MEDU7482910 or ONEY-4401928"
            type="text"
            value={searchContainer}
            onChange={(e) => setSearchContainer(e.target.value)}
          />
          <button
            type="submit"
            disabled={isQuerying}
            className="absolute right-1.5 px-2.5 py-1 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 active:scale-95 transition-all flex items-center gap-1"
          >
            <span>{isQuerying ? 'Querying...' : 'Query'}</span>
            <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
          </button>
        </form>

        {/* Live Cross-Verification Badge Strip */}
        <div className="flex items-start gap-2 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg p-2">
          <span
            className="material-symbols-outlined text-[17px] text-[#15803D] mt-0.5 shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
          <div className="flex flex-col">
            <p className="text-xs text-[#14532D] leading-tight font-semibold">
              Cross-verified via MarineTraffic Satellite AIS &amp; Port Terminal API
            </p>
            <span className="text-[10px] text-[#166534] font-mono mt-0.5">
              Constellation Ping: 42s ago • Doppler Sync: Stable (±0.0012°)
            </span>
          </div>
        </div>
      </section>

      {/* 2. PRIMARY ACTIVE VESSEL BREAKDOWN (MOTHER & FEEDER) */}
      <section className="bg-white rounded-xl border border-[#CBD5E1] shadow-xs overflow-hidden flex flex-col">
        {/* Container & Invoice Meta Ribbon */}
        <div className="px-3.5 py-2.5 bg-[#eff4ff] border-b border-[#CBD5E1] flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900 tracking-tight font-mono">
                {vessel.containerId}
              </span>
              <span className="bg-white text-slate-700 text-[10px] px-1.5 py-0.5 rounded uppercase font-mono font-bold border border-[#CBD5E1]">
                {vessel.incoterm}
              </span>
            </div>
            <button
              onClick={() => onNavigate('invoices')}
              className="text-[11px] text-slate-500 font-mono hover:text-[#006591] text-left hover:underline"
            >
              Invoice: {vessel.invoiceNumber} • {vessel.carrier}
            </button>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-[#F0F9FF] text-[#0369A1] border border-[#BAE6FD] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] animate-pulse"></span>
            {vessel.status}
          </span>
        </div>

        {/* Vessels Dynamic Linkage Diagram */}
        <div className="p-3.5 flex flex-col gap-3">
          {/* Dual Vessel Identity Spec Rack */}
          <div className="grid grid-cols-2 gap-2 bg-[#f8f9ff] p-2.5 rounded-lg border border-[#CBD5E1]">
            {/* Feeder Vessel */}
            <div className="flex flex-col border-r border-[#CBD5E1] pr-2">
              <div className="flex items-center gap-1 text-slate-500">
                <span className="material-symbols-outlined text-[14px]">forklift</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">CONNECTIVE FEEDER</span>
              </div>
              <span className="text-xs font-bold text-slate-900 truncate mt-0.5">
                {vessel.feeder.name}
              </span>
              <span className="text-[10px] font-mono text-slate-500">IMO {vessel.feeder.imo}</span>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-[#047857]">
                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                <span className="font-medium truncate">{vessel.feeder.status}</span>
              </div>
            </div>

            {/* Mother Vessel */}
            <div className="flex flex-col pl-1">
              <div className="flex items-center gap-1 text-[#006591]">
                <span className="material-symbols-outlined text-[14px]">directions_boat</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">MOTHER VESSEL</span>
              </div>
              <span className="text-xs font-bold text-slate-900 truncate mt-0.5">
                {vessel.mother.name}
              </span>
              <span className="text-[10px] font-mono text-slate-500">IMO {vessel.mother.imo}</span>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-[#0369A1]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] animate-ping"></span>
                <span className="font-semibold truncate">{vessel.mother.status}</span>
              </div>
            </div>
          </div>

          {/* Live MarineTraffic AIS Telemetry Cockpit */}
          <div className="bg-[#131b2e] text-white rounded-lg p-3 flex flex-col gap-2 shadow-xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#2A3756]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#38BDF8] text-[16px]">
                  satellite_alt
                </span>
                <span className="text-[11px] text-[#BAE6FD] font-semibold tracking-wide">
                  MARINETRAFFIC AIS LIVE FEED
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#94A3B8]">
                SAT-ID: {vessel.ais.satId}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#94A3B8] block">
                  Navigational Status
                </span>
                <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                  {vessel.ais.navStatus}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#94A3B8] block">
                  Speed &amp; Course
                </span>
                <span className="font-mono text-[#E0F2FE] font-bold mt-0.5 block">
                  {vessel.ais.speed} / {vessel.ais.course}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#94A3B8] block">
                  Current Draft
                </span>
                <span className="font-mono text-[#E0F2FE] mt-0.5 block">
                  {vessel.ais.draft}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#94A3B8] block">
                  Live Coordinates
                </span>
                <span className="font-mono text-[#38BDF8] font-bold mt-0.5 block">
                  {vessel.ais.coordinates}
                </span>
              </div>
            </div>

            <div className="pt-1.5 border-t border-[#2A3756] flex items-center justify-between text-[11px]">
              <span className="text-[#94A3B8] truncate mr-2">Corridor: {vessel.ais.corridor}</span>
              <span className="text-[#38BDF8] font-mono shrink-0">Next Fix: {nextFix}s</span>
            </div>
          </div>

          {/* Visual Multi-Leg Stepper Timeline */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              INTERMODAL TRANSSHIPMENT TIMELINE
            </span>
            <div className="relative pl-6 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
              {vessel.timeline.map((step, idx) => (
                <div key={idx} className={`relative ${!step.completed && !step.active ? 'opacity-60' : ''}`}>
                  <span
                    className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      step.completed
                        ? 'bg-[#10B981] text-white'
                        : step.active
                        ? 'bg-[#006591] text-white ring-4 ring-[#c9e6ff]'
                        : 'border-2 border-slate-300 bg-white'
                    }`}
                  >
                    {step.completed ? (
                      <span
                        className="material-symbols-outlined text-[11px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check
                      </span>
                    ) : step.active ? (
                      <span className="material-symbols-outlined text-[10px]">sailing</span>
                    ) : null}
                  </span>

                  <div className="flex items-baseline justify-between">
                    <span
                      className={`text-xs ${
                        step.active ? 'font-bold text-[#006591]' : 'font-semibold text-slate-900'
                      }`}
                    >
                      {step.title}
                    </span>
                    <span
                      className={`text-[11px] font-mono ${
                        step.active ? 'text-[#006591] font-bold' : 'text-slate-500'
                      }`}
                    >
                      {step.meta}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECONDARY SHIPMENT CARD */}
      <section
        onClick={() => {
          setActiveContainer('ONEY-4401928');
          setSearchContainer('ONEY-4401928');
        }}
        className="bg-white rounded-xl border border-[#CBD5E1] shadow-xs p-3.5 flex flex-col gap-2.5 cursor-pointer hover:border-[#006591] transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[17px] text-[#006591]">inventory_2</span>
            <span className="text-xs font-bold text-slate-900 font-mono">ONEY-4401928</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[11px] bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
            Berth Cleared
          </span>
        </div>

        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500">
              B/L: <strong className="text-slate-900 font-mono">ONEY-4401928</strong>
            </span>
            <span className="text-slate-500 font-mono">Linked: EXP-INV-2024-891</span>
          </div>
          <div className="bg-[#f8f9ff] rounded p-2 border border-[#CBD5E1] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                Connective Route
              </span>
              <span className="text-xs font-semibold text-slate-900">Pacific Feeder 09</span>
              <span className="text-[11px] text-[#006591] font-medium">
                Busan (KRPUS) → Yokohama (JPYOK)
              </span>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                AIS Telemetry
              </span>
              <span className="text-[10px] font-mono font-bold text-[#047857] bg-[#ECFDF5] px-1.5 py-0.5 rounded border border-[#A7F3D0] mt-0.5">
                Ping 4m ago
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">Anchorage Bay Sec 3</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AGENT 2 LIVE TRIGGERS & AUTOMATIONS */}
      <section className="bg-white rounded-xl border border-[#CBD5E1] shadow-xs p-3.5 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-[#CBD5E1] pb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006591] text-[18px]">smart_toy</span>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900">
              Agent 2 Live Triggers &amp; Automations
            </h2>
          </div>
          <span className="text-[10px] font-mono bg-[#c9e6ff] text-[#001e2f] font-bold px-2 py-0.5 rounded">
            AUTONOMOUS
          </span>
        </div>

        {/* Trigger 1: Delay Guard */}
        <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#eff4ff] border border-[#d3e4fe]">
          <div className="w-7 h-7 rounded bg-[#006591] flex items-center justify-center text-white shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[16px]">flip_camera_ios</span>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">
                Connective Vessel Delay Guard
              </span>
              <span className="text-[10px] font-mono text-[#0369A1] bg-[#E0F2FE] px-1 rounded">
                Dispatched
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Auto-notification &amp; revised ETA broadcasted to consignee:{' '}
              <strong className="text-slate-900">Hamburg Traders GMBH</strong>
            </p>
          </div>
        </div>

        {/* Trigger 2: Escrow Milestone */}
        <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1]">
          <div className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center text-white shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[16px]">lock_clock</span>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">
                Escrow Release Milestone
              </span>
              <span className="text-[10px] font-mono text-[#B45309] bg-[#FEF3C7] px-1 rounded">
                Awaiting Signal
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Smart contract milestone conditioned on AIS verified discharge timestamp at{' '}
              <strong className="text-slate-900">DEHAM Berth 04</strong> ($142,500.00 USD).
            </p>
          </div>
        </div>

        {/* Action Buttons Cluster */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => setShowMapModal(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">map</span>
            <span>Open Full AIS Map</span>
          </button>
          <button
            onClick={() => setShowInspectionModal(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white hover:bg-slate-50 border border-[#CBD5E1] text-slate-800 rounded-lg text-xs font-semibold active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">assignment_turned_in</span>
            <span>Port Inspection</span>
          </button>
        </div>
      </section>

      {/* AIS Map Modal */}
      <AISMapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        coordinates={vessel.ais.coordinates}
        vesselName={vessel.mother.name}
      />

      {/* Port Inspection Modal */}
      <PortInspectionModal
        isOpen={showInspectionModal}
        onClose={() => setShowInspectionModal(false)}
      />
    </main>
  );
};
