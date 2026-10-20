/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ActiveScreen,
  Currency,
  DocumentItem,
  InvoiceRecord,
  CreditNoteItem,
  NumberingConfig,
} from './types';
import {
  INITIAL_AGENTS,
  INITIAL_TASKS,
  INITIAL_INVOICES,
  INITIAL_CREDIT_NOTES,
  INITIAL_EXPENSES,
  INITIAL_NUMBERING,
} from './data/mockData';
import { TopAppBar, BottomNavBar } from './components/Navigation';
import { ExporterBillingDashboard } from './screens/ExporterBillingDashboard';
import { InvoicesScreen } from './screens/InvoicesScreen';
import { ShipmentTrackerScreen } from './screens/ShipmentTrackerScreen';
import { PnlMonitorScreen } from './screens/PnlMonitorScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AskAgentModal } from './components/modals/AskAgentModal';
import { DocumentPreviewModal } from './components/modals/DocumentPreviewModal';
import { AgentLogStreamModal } from './components/modals/AgentLogStreamModal';
import { TriggerConfigModal } from './components/modals/TriggerConfigModal';

export default function App() {
  // Navigation: Exporter Billing Dashboard is the Initial Screen (Screen 1)
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('agents');
  const [currency, setCurrency] = useState<Currency>('USD');

  // Application Data States
  const [agents] = useState(INITIAL_AGENTS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(INITIAL_INVOICES);
  const [creditNotes, setCreditNotes] = useState<CreditNoteItem[]>(INITIAL_CREDIT_NOTES);
  const [expenses] = useState(INITIAL_EXPENSES);
  const [numbering, setNumbering] = useState<NumberingConfig>(INITIAL_NUMBERING);

  // Modals
  const [isAskAgentOpen, setIsAskAgentOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isTriggersOpen, setIsTriggersOpen] = useState(false);
  const [selectedDocPreview, setSelectedDocPreview] = useState<{
    doc: DocumentItem;
    inv: InvoiceRecord;
  } | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // Handler to add credit note and recalculate tasks
  const handleAddCreditNote = (note: Omit<CreditNoteItem, 'id'>) => {
    const newId = `cn-${Date.now()}`;
    const newNote: CreditNoteItem = { id: newId, ...note };
    setCreditNotes((prev) => [newNote, ...prev]);

    // Add task queue item
    setTasks((prev) => [
      {
        id: `task-${Date.now()}`,
        agentName: 'Agent 5 (P&L Auditor)',
        status: 'Verified',
        statusColor: 'text-[#006591]',
        description: `Deducted Credit Note #${newNote.number} ($${newNote.debitValueUSD.toLocaleString()}) for ${newNote.discrepancy}.`,
        timestamp: 'Just now',
        icon: 'account_balance_wallet',
      },
      ...prev,
    ]);
  };

  // Handler to update invoice record
  const handleUpdateInvoice = (updated: InvoiceRecord) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === updated.id ? updated : inv)));
  };

  // Handler to update numbering config
  const handleUpdateNumbering = (config: NumberingConfig) => {
    setNumbering(config);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col justify-between selection:bg-[#c9e6ff] selection:text-[#001e2f]">
      {/* Top Header */}
      <TopAppBar
        activeScreen={activeScreen}
        onScreenChange={setActiveScreen}
        currency={currency}
        onCurrencyToggle={setCurrency}
        unreadCount={2}
        onOpenNotifications={() => setShowNotifications(!showNotifications)}
      />

      {/* Notifications Drawer Popover */}
      {showNotifications && (
        <div className="fixed top-14 right-4 z-50 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#006591]">notifications</span>
              Agent Broadcasts
            </span>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
          <div className="space-y-2">
            <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-900">
              <span className="font-semibold block text-[11px]">Feeder Delay Broadcast</span>
              <p className="text-[11px] text-amber-800 mt-0.5">
                CMA CGM Pegasus delay +14h registered. Consignee notified.
              </p>
            </div>
            <div className="p-2 rounded bg-red-50 border border-red-200 text-red-900">
              <span className="font-semibold block text-[11px]">Quarantine Escrow Notice</span>
              <p className="text-[11px] text-red-800 mt-0.5">
                Invoice #EXP-2024-902 quarantined due to HS Code mismatch.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Screens Container */}
      <div className="flex-1 w-full">
        {activeScreen === 'agents' && (
          <ExporterBillingDashboard
            agents={agents}
            tasks={tasks}
            numbering={numbering}
            onUpdateNumbering={handleUpdateNumbering}
            onNavigate={setActiveScreen}
            onOpenAskAgent={() => setIsAskAgentOpen(true)}
            onOpenLogs={() => setIsLogsOpen(true)}
            onOpenTriggers={() => setIsTriggersOpen(true)}
          />
        )}

        {activeScreen === 'invoices' && (
          <InvoicesScreen
            invoices={invoices}
            onSelectDocument={(doc, inv) => setSelectedDocPreview({ doc, inv })}
            onNavigate={setActiveScreen}
            onUpdateInvoice={handleUpdateInvoice}
          />
        )}

        {activeScreen === 'shipments' && (
          <ShipmentTrackerScreen onNavigate={setActiveScreen} />
        )}

        {activeScreen === 'pnl' && (
          <PnlMonitorScreen
            currency={currency}
            onCurrencyToggle={setCurrency}
            creditNotes={creditNotes}
            expenses={expenses}
            onAddCreditNote={handleAddCreditNote}
            onNavigate={setActiveScreen}
          />
        )}

        {activeScreen === 'settings' && (
          <SettingsScreen
            numbering={numbering}
            onUpdateNumbering={handleUpdateNumbering}
          />
        )}
      </div>

      {/* Persistent Bottom Navigation Bar */}
      <BottomNavBar activeScreen={activeScreen} onScreenChange={setActiveScreen} />

      {/* Global Interactive Modals */}
      <AskAgentModal
        isOpen={isAskAgentOpen}
        onClose={() => setIsAskAgentOpen(false)}
        onNavigateToScreen={setActiveScreen}
      />

      <DocumentPreviewModal
        document={selectedDocPreview?.doc || null}
        invoice={selectedDocPreview?.inv || null}
        onClose={() => setSelectedDocPreview(null)}
      />

      <AgentLogStreamModal
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
      />

      <TriggerConfigModal
        isOpen={isTriggersOpen}
        onClose={() => setIsTriggersOpen(false)}
        onSave={() => {
          setTasks((prev) => [
            {
              id: `task-${Date.now()}`,
              agentName: 'Agent 2 & 4 Mesh',
              status: 'Completed',
              statusColor: 'text-[#047857]',
              description: 'Updated autonomous delay threshold (+12h) & escrow quarantine rules.',
              timestamp: 'Just now',
              icon: 'tune',
            },
            ...prev,
          ]);
        }}
      />
    </div>
  );
}
