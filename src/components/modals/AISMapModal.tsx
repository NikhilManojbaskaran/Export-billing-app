import React from 'react';

interface AISMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  coordinates: string;
  vesselName: string;
}

export const AISMapModal: React.FC<AISMapModalProps> = ({
  isOpen,
  onClose,
  coordinates,
  vesselName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="bg-[#0b1c30] rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 bg-[#131b2e] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#38BDF8]">map</span>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                Live AIS Marine Map • {vesselName}
              </h3>
              <p className="text-[11px] text-[#38BDF8] font-mono">{coordinates} (Indian Ocean Corridor)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Visual Map Canvas (Styled SVG Nautical Chart) */}
        <div className="relative h-72 sm:h-96 bg-[#081325] overflow-hidden flex items-center justify-center">
          {/* Nautical Grid Lines */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>

          <svg className="w-full h-full" viewBox="0 0 600 350" fill="none">
            {/* Coastline approximations */}
            <path
              d="M 50,80 Q 90,140 110,210 T 80,330"
              stroke="#1e293b"
              strokeWidth="3"
              fill="#0f172a"
              opacity="0.6"
            />
            <path
              d="M 450,40 Q 480,120 520,180 T 580,260"
              stroke="#1e293b"
              strokeWidth="3"
              fill="#0f172a"
              opacity="0.6"
            />

            {/* Shipping Lane Corridor */}
            <path
              d="M 80,250 C 180,200 320,170 510,120"
              stroke="#0284c7"
              strokeWidth="2"
              strokeDasharray="6 4"
              opacity="0.8"
            />

            {/* Waypoints */}
            <circle cx="80" cy="250" r="4" fill="#10B981" />
            <text x="85" y="265" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">
              BRSSZ (Santos)
            </text>

            <circle cx="280" cy="180" r="5" fill="#10B981" />
            <text x="270" y="200" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">
              LKCMB (Colombo)
            </text>

            {/* Vessel Current Position */}
            <g transform="translate(360, 160)">
              <circle cx="0" cy="0" r="16" fill="#0284C7" opacity="0.25" className="animate-ping" />
              <circle cx="0" cy="0" r="8" fill="#38BDF8" stroke="#ffffff" strokeWidth="2" />
              <polygon points="0,-12 6,4 -6,4" fill="#ffffff" transform="rotate(-76)" />
              <text x="12" y="-5" fill="#38BDF8" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                {vesselName} (16.4 kts)
              </text>
              <text x="12" y="10" fill="#e2e8f0" fontSize="9" fontFamily="monospace">
                Fix: {coordinates}
              </text>
            </g>

            {/* Destination Hamburg */}
            <circle cx="510" cy="120" r="5" fill="#f59e0b" />
            <text x="470" y="105" fill="#fbbf24" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
              DEHAM (Hamburg)
            </text>
          </svg>

          {/* Telemetry overlay pill */}
          <div className="absolute bottom-3 left-3 bg-[#131b2e]/90 backdrop-blur-xs border border-slate-700 rounded-lg p-2.5 text-[11px] font-mono text-slate-300 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-white font-bold">ORB-784 Satellite Live Track</span>
            </div>
            <div>Doppler Course: 284° W • Sea State: Calm (0.8m swell)</div>
            <div>Estimated Hamburg Berth: Oct 23, 08:30 UTC</div>
          </div>
        </div>

        <div className="p-3 bg-[#131b2e] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Close AIS Radar
          </button>
        </div>
      </div>
    </div>
  );
};

export const PortInspectionModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400">assignment_turned_in</span>
            <h3 className="font-bold text-sm text-white">Port Terminal Inspection Clearance</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-5 space-y-3.5 text-xs">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-900">
            <div className="flex items-center gap-1.5 font-bold">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
              <span>Berth 04 Pre-Allocation Cleared</span>
            </div>
            <p className="mt-1 text-[11px] text-emerald-800">
              CTA Altenwerder Container Terminal has verified container MEDU7482910-40HC customs pre-filing.
            </p>
          </div>

          <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50">
            <div className="flex justify-between">
              <span className="text-slate-500">Terminal Crane Assignment:</span>
              <span className="font-mono font-bold text-slate-800">Gantry #04 (Twin-Lift)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Fumigation Clearance:</span>
              <span className="font-mono text-emerald-700 font-semibold">Passed (Cert #PHY-99321)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Demurrage Free Days:</span>
              <span className="font-mono text-slate-800">7 Days Granted</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Smart Escrow Payout:</span>
              <span className="font-mono font-bold text-[#006591]">$142,500.00 USD</span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
          >
            Acknowledge Clearance
          </button>
        </div>
      </div>
    </div>
  );
};
