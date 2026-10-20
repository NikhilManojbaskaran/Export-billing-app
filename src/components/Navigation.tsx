import React, { useState } from 'react';
import { ActiveScreen, Currency } from '../types';

interface NavigationProps {
  activeScreen: ActiveScreen;
  onScreenChange: (screen: ActiveScreen) => void;
  currency: Currency;
  onCurrencyToggle: (currency: Currency) => void;
  unreadCount?: number;
  onOpenNotifications?: () => void;
}

export const TopAppBar: React.FC<NavigationProps> = ({
  activeScreen,
  currency,
  onCurrencyToggle,
  unreadCount = 2,
  onOpenNotifications,
}) => {
  const getHeaderContent = () => {
    switch (activeScreen) {
      case 'agents':
        return {
          title: 'TradePay Exporter',
          subtitle: 'Real-time trade operations & autonomous ledger auditing',
          chip: '5 Agents Active',
          chipColor: 'bg-[#eff4ff] text-[#006591] border-[#c6c6cd]',
        };
      case 'shipments':
        return {
          title: 'Shipment & Marine AIS Tracker',
          subtitle: 'Autonomous Feeder Agent 2 • Live',
          chip: 'Live Feeder Feed',
          chipColor: 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]',
        };
      case 'invoices':
        return {
          title: 'Invoice Document Vault',
          subtitle: 'Autonomous Agent Routing',
          chip: '3 Folders Active',
          chipColor: 'bg-[#eff4ff] text-[#006591] border-[#c6c6cd]',
        };
      case 'pnl':
        return {
          title: 'Export P&L & Expenses Monitor',
          subtitle: 'Agent 5 Autonomous Ledger Audit',
          chip: 'Real-time',
          chipColor: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
        };
      case 'settings':
        return {
          title: 'Exporter System Settings',
          subtitle: 'Prefix Rules & API Webhooks',
          chip: 'Config Synced',
          chipColor: 'bg-slate-100 text-slate-700 border-slate-200',
        };
    }
  };

  const header = getHeaderContent();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-xs">
      <div className="max-w-4xl mx-auto flex justify-between items-center w-full px-4 md:px-6 h-14">
        {/* Left branding */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#006591] shrink-0 border border-[#CBD5E1]">
            <span className="material-symbols-outlined text-[20px]">anchor</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-none truncate">
              {header.title}
            </h1>
            <p className="text-[11px] text-slate-500 font-medium leading-none mt-1 truncate">
              {header.subtitle}
            </p>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Currency Toggle on P&L screen */}
          {activeScreen === 'pnl' ? (
            <div className="flex items-center bg-[#eff4ff] p-0.5 rounded-lg border border-[#CBD5E1]">
              <button
                onClick={() => onCurrencyToggle('USD')}
                className={`px-2.5 py-0.5 rounded text-xs font-bold transition-all ${
                  currency === 'USD'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                USD
              </button>
              <button
                onClick={() => onCurrencyToggle('EUR')}
                className={`px-2.5 py-0.5 rounded text-xs font-bold transition-all ${
                  currency === 'EUR'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                EUR
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-[#eff4ff] border border-[#CBD5E1]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006591] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#006591]"></span>
              </span>
              <span className="text-xs font-medium text-slate-800">{header.chip}</span>
            </div>
          )}

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center relative transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-white"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export const BottomNavBar: React.FC<{
  activeScreen: ActiveScreen;
  onScreenChange: (screen: ActiveScreen) => void;
}> = ({ activeScreen, onScreenChange }) => {
  const tabs: Array<{
    id: ActiveScreen;
    label: string;
    icon: string;
  }> = [
    { id: 'agents', label: 'Agents', icon: 'smart_toy' },
    { id: 'shipments', label: 'Shipments', icon: 'directions_boat' },
    { id: 'invoices', label: 'Documents', icon: 'receipt_long' },
    { id: 'pnl', label: 'P&L Monitor', icon: 'monitoring' },
    { id: 'settings', label: 'Settings', icon: 'tune' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center h-16 px-2 bg-white border-t border-[#E2E8F0] shadow-md">
      {tabs.map((tab) => {
        const isActive = activeScreen === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onScreenChange(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-95 ${
              isActive
                ? 'text-[#006591] font-semibold'
                : 'text-slate-500 hover:text-[#006591]'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isActive ? 'scale-110' : ''
              }`}
              style={{
                fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              {tab.icon}
            </span>
            <span className="text-[11px] font-medium mt-0.5 tracking-tight">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
