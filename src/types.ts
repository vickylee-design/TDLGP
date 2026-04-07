export enum UserRole {
  BUREAU = 'BUREAU',   // 教育局端
  SCHOOL = 'SCHOOL',   // 學校端
  TEACHER = 'TEACHER'  // 教師端
}

export interface Student {
  id: string;
  name: string;
  status: 'ONLINE' | 'OFFLINE' | 'RISK';
  currentApp: string;
  battery: number;
  thumbnailUrl: string;
  riskDetails?: string;
}

export interface ChartData {
  name: string;
  value: number;
  value2?: number; // Secondary value for dual-axis charts
}

export interface Alert {
  id: string;
  type: 'SECURITY' | 'IDLE' | 'BEHAVIOR';
  title: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

export interface ClassMetric {
  id: string;
  className: string;
  learningHours: number;
  violationCount: number;
}

export enum TransferStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW', // Waiting for Bureau
  APPROVED = 'APPROVED',             // Bureau Approved, ready for transfer
  REJECTED = 'REJECTED',             // Bureau Rejected
  TRANSFERRING = 'TRANSFERRING',     // Physical transfer in progress
  COMPLETED = 'COMPLETED'            // Property transfer done, case closed
}

export interface TransferRequest {
  id: string;
  sourceSchool: string;
  targetSchool: string;
  deviceCount: number;
  deviceModel: string; // Simplified for UI
  requestDate: string;
  status: TransferStatus;
  documents: string[]; // File names
  closingDocuments?: string[]; // File names
  rejectionReason?: string;
}
