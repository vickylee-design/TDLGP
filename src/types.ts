export enum UserRole {
  BUREAU = 'BUREAU',   // 教育局端
  SCHOOL = 'SCHOOL'    // 學校端
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

export enum AssetStatus {
  NORMAL = '正常',
  TRANSFERRING = '調撥中',
  REPLACEMENT = '汰換',
  SCRAPPED = '報廢'
}

export interface AssetHistory {
  date: string;
  action: '調撥' | '汰換' | '報廢' | '入庫' | '其他';
  description: string;
  remark?: string;
  operator: string;
}

export interface AssetMaster {
  // 基礎屬性
  name: string;
  serial: string; // Primary Key (SN)
  model: string;
  assignedSchool: string;
  schoolCode: string;

  // 技術狀態 (MDM API)
  osVersion: string;
  storageTotal: string;
  storageRemaining: string;
  battery: number;
  lastConnection: string;

  // 行政屬性
  arrivalDate: string;
  warrantyDate: string;
  status: AssetStatus;
  project: string; // 計畫別 (例如: 生生有平板, 前瞻計畫)

  // 業務邏輯擴充
  mdmReportedSchoolId?: string; // 用於比對 mismatch
  usageHoursInherited: number; // 汰換繼承的時數
  currentUsageHours: number;   // 當前設備時數
  history: AssetHistory[];
}
