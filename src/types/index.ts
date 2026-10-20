export type ActiveScreen = 'agents' | 'shipments' | 'invoices' | 'pnl' | 'settings';

export type Currency = 'USD' | 'EUR';

export interface AgentInfo {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  status: string;
  description: string;
  icon: string;
  accuracy?: string;
  latency?: string;
  active: boolean;
}

export interface AgentTask {
  id: string;
  agentName: string;
  status: 'In Flight' | 'Completed' | 'Verified' | 'Pending';
  statusColor?: string;
  description: string;
  timestamp: string;
  icon: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  fileName: string;
  fileSize: string;
  docType: 'bl' | 'phyto' | 'insurance' | 'contract' | 'invoice' | 'customs';
  verifiedBy?: string;
  statusText: string;
  badgeText?: string;
  badgeStyle?: string;
  timestamp: string;
  isDiscrepant?: boolean;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  salesContractNumber: string;
  consignee: string;
  amountEUR: number;
  amountUSD: number;
  incoterm: string;
  incotermLocation: string;
  pol: { code: string; name: string };
  pod: { code: string; name: string };
  imo?: string;
  agentHash?: string;
  containerId: string;
  blNumber: string;
  verifiedDocsCount: number;
  totalDocsCount: number;
  escrowStatus: 'Ready for release' | 'Cold Cloud Stored' | 'Action Required' | 'Quarantined';
  discrepancyNote?: string;
  documents: DocumentItem[];
  locked?: boolean;
}

export interface CreditNoteItem {
  id: string;
  number: string;
  consignee: string;
  status: 'Settled & Deducted' | 'Pending Escrow Offset' | 'Under Review';
  discrepancy: string;
  linkedInvoice: string;
  debitValueUSD: number;
  debitValueEUR: number;
}

export interface LogisticsExpenseItem {
  id: string;
  title: string;
  subtitle: string;
  amountUSD: number;
  amountEUR: number;
  icon: string;
}

export interface VesselTelemetry {
  containerId: string;
  blNumber: string;
  invoiceNumber: string;
  carrier: string;
  incoterm: string;
  status: string;
  feeder: {
    name: string;
    imo: string;
    status: string;
  };
  mother: {
    name: string;
    imo: string;
    status: string;
    eta: string;
  };
  ais: {
    satId: string;
    navStatus: string;
    speed: string;
    course: string;
    draft: string;
    coordinates: string;
    corridor: string;
    nextFix: number;
  };
  timeline: Array<{
    title: string;
    meta: string;
    desc: string;
    completed: boolean;
    active?: boolean;
    icon?: string;
  }>;
}

export interface NumberingConfig {
  salesContract: { prefix: string; suffix: string; sample: string };
  commercialInvoice: { prefix: string; suffix: string; sample: string };
  creditNote: { prefix: string; suffix: string; sample: string };
}
