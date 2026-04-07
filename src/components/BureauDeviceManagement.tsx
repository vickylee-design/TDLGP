import React, { useState, useMemo } from 'react';
import { 
  Tablet, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRightLeft, 
  FileText, 
  X,
  Filter,
  Smartphone,
  Calendar,
  Battery,
  Activity,
  User,
  Info,
  ChevronRight,
  Clock,
  School,
  Trash2,
  Image,
  AlertTriangle,
  RotateCcw,
  Layout,
  ShieldCheck,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

type TabType = 'device-list' | 'lost-devices';

// Mock Data for Devices
const initialDevices = [
  { 
    id: 'DL-iPad-001', 
    name: 'EDU-iPad-01',
    serial: 'DMPQ12345678', 
    model: 'iPad (第9代)', 
    school: '永康國小', 
    assignmentStatus: 'assigned',
    mdm: 'Jamf Pro', 
    os: 'iPadOS 17.2',
    storage: '128GB',
    usedStorage: '82GB',
    userName: '王小明',
    purchaseDate: '2023-05-15',
    warrantyDate: '2026-05-15',
    budget: '112年度數位建設',
    lastSeen: '10 分鐘前',
    battery: '98%',
    status: 'online',
    deviceStatus: 'active',
    latestPolicy: true,
    isLost: true,
    usage: {
      avgDaily: 270,
      today: 126,
      thisWeek: 1710,
      thisMonth: 6720,
      topApps: [
        { name: 'YouTube Kids', usage: '45%' },
        { name: 'Kahoot!', usage: '25%' },
        { name: 'Google Classroom', usage: '20%' },
        { name: 'Safari', usage: '10%' }
      ],
      curve: Array.from({ length: 30 }, (_, i) => ({
        day: `${i + 1}`,
        usage: Math.floor(Math.random() * 300) + 100
      })),
      timeCurve: [
        { time: '08:00前', usage: 15 },
        { time: '08:00', usage: 45 },
        { time: '09:00', usage: 120 },
        { time: '10:00', usage: 180 },
        { time: '11:00', usage: 150 },
        { time: '12:00', usage: 30 },
        { time: '13:00', usage: 60 },
        { time: '14:00', usage: 140 },
        { time: '15:00', usage: 160 },
        { time: '16:00', usage: 90 },
        { time: '17:00', usage: 40 },
        { time: '18:00', usage: 20 },
        { time: '18:00後', usage: 10 }
      ]
    }
  },
  { 
    id: 'DL-iPad-002', 
    name: 'EDU-iPad-02',
    serial: 'FGLR87654321', 
    model: 'iPad (第10代)', 
    school: '復興國小', 
    assignmentStatus: 'assigned',
    mdm: 'Intune', 
    os: 'iPadOS 17.1',
    storage: '64GB',
    usedStorage: '45GB',
    userName: '李小華',
    purchaseDate: '2023-08-20',
    warrantyDate: '2026-08-20',
    budget: '112年度數位建設',
    lastSeen: '2 小時前',
    battery: '95%',
    status: 'online',
    deviceStatus: 'active',
    latestPolicy: true,
    usage: {
      avgDaily: 228,
      today: 90,
      thisWeek: 1452,
      thisMonth: 5910,
      topApps: [
        { name: 'Quizizz', usage: '40%' },
        { name: 'Canva', usage: '30%' },
        { name: 'Google Slides', usage: '20%' },
        { name: 'Pages', usage: '10%' }
      ],
      curve: Array.from({ length: 30 }, (_, i) => ({
        day: `${i + 1}`,
        usage: Math.floor(Math.random() * 300) + 100
      })),
      timeCurve: [
        { time: '08:00前', usage: 5 },
        { time: '08:00', usage: 30 },
        { time: '09:00', usage: 80 },
        { time: '10:00', usage: 140 },
        { time: '11:00', usage: 120 },
        { time: '12:00', usage: 20 },
        { time: '13:00', usage: 40 },
        { time: '14:00', usage: 110 },
        { time: '15:00', usage: 130 },
        { time: '16:00', usage: 70 },
        { time: '17:00', usage: 30 },
        { time: '18:00', usage: 15 },
        { time: '18:00後', usage: 5 }
      ]
    }
  },
  { 
    id: 'DL-iPad-003', 
    name: 'EDU-iPad-03',
    serial: 'HJKT99887766', 
    model: 'iPad Air (第5代)', 
    school: '', 
    assignmentStatus: 'unassigned',
    mdm: 'Jamf Pro', 
    os: 'iPadOS 17.2',
    storage: '256GB',
    usedStorage: '12GB',
    userName: '-',
    purchaseDate: '2023-11-01',
    warrantyDate: '2026-11-01',
    budget: '112年度數位建設',
    lastSeen: '1 天前',
    battery: '92%',
    status: 'offline',
    deviceStatus: 'active',
    latestPolicy: false,
    usage: {
      avgDaily: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      topApps: [],
      curve: []
    }
  },
  { 
    id: 'DL-iPad-004', 
    name: 'EDU-iPad-04',
    serial: 'XCVB44332211', 
    model: 'iPad (第9代)', 
    school: '大橋國中', 
    assignmentStatus: 'assigned',
    mdm: 'Intune', 
    os: 'iPadOS 16.5',
    storage: '64GB',
    usedStorage: '58GB',
    userName: '張大同',
    purchaseDate: '2022-12-10',
    warrantyDate: '2025-12-10',
    budget: '111年度前瞻計畫',
    lastSeen: '30 分鐘前',
    battery: '88%',
    status: 'online',
    deviceStatus: 'active',
    latestPolicy: true,
    usage: {
      avgDaily: 312,
      today: 204,
      thisWeek: 1926,
      thisMonth: 7680,
      topApps: [
        { name: 'YouTube Kids', usage: '50%' },
        { name: 'Google Classroom', usage: '30%' },
        { name: 'Safari', usage: '20%' }
      ],
      curve: Array.from({ length: 30 }, (_, i) => ({
        day: `${i + 1}`,
        usage: Math.floor(Math.random() * 300) + 100
      })),
      timeCurve: [
        { time: '08:00前', usage: 20 },
        { time: '08:00', usage: 60 },
        { time: '09:00', usage: 150 },
        { time: '10:00', usage: 210 },
        { time: '11:00', usage: 180 },
        { time: '12:00', usage: 40 },
        { time: '13:00', usage: 80 },
        { time: '14:00', usage: 170 },
        { time: '15:00', usage: 190 },
        { time: '16:00', usage: 110 },
        { time: '17:00', usage: 50 },
        { time: '18:00', usage: 30 },
        { time: '18:00後', usage: 15 }
      ]
    }
  },
  { 
    id: 'DL-iPad-005', 
    name: 'EDU-iPad-05',
    serial: 'QWER11223344', 
    model: 'iPad Pro 11吋', 
    school: '', 
    assignmentStatus: 'unassigned',
    mdm: 'Jamf Pro', 
    os: 'iPadOS 17.2',
    storage: '512GB',
    usedStorage: '120GB',
    userName: '-',
    purchaseDate: '2024-01-05',
    warrantyDate: '2027-01-05',
    budget: '113年度數位建設',
    lastSeen: '5 分鐘前',
    battery: '100%',
    status: 'online',
    deviceStatus: 'active',
    latestPolicy: true,
    usage: {
      avgDaily: 150,
      today: 48,
      thisWeek: 924,
      thisMonth: 3720,
      topApps: [
        { name: 'Pages', usage: '60%' },
        { name: 'Numbers', usage: '30%' },
        { name: 'Keynote', usage: '10%' }
      ],
      curve: Array.from({ length: 30 }, (_, i) => ({
        day: `${i + 1}`,
        usage: Math.floor(Math.random() * 300) + 100
      })),
      timeCurve: [
        { time: '08:00前', usage: 2 },
        { time: '08:00', usage: 10 },
        { time: '09:00', usage: 40 },
        { time: '10:00', usage: 70 },
        { time: '11:00', usage: 60 },
        { time: '12:00', usage: 10 },
        { time: '13:00', usage: 20 },
        { time: '14:00', usage: 50 },
        { time: '15:00', usage: 60 },
        { time: '16:00', usage: 30 },
        { time: '17:00', usage: 15 },
        { time: '18:00', usage: 8 },
        { time: '18:00後', usage: 2 }
      ]
    }
  },
  { 
    id: 'DL-iPad-006', 
    name: 'EDU-iPad-06',
    serial: 'PLMK77665544', 
    model: 'iPad (第9代)', 
    school: '永康國小', 
    assignmentStatus: 'assigned',
    mdm: 'Intune', 
    os: 'iPadOS 16.0',
    storage: '64GB',
    usedStorage: '32GB',
    userName: '趙六',
    purchaseDate: '2021-03-10',
    warrantyDate: '2024-03-10',
    budget: '110年度數位建設',
    lastSeen: '1 個月前',
    battery: '82%',
    status: 'offline',
    deviceStatus: 'disposed',
    latestPolicy: false,
    isLost: false,
    usage: {
      avgDaily: 72,
      today: 0,
      thisWeek: 330,
      thisMonth: 1320,
      topApps: [
        { name: 'Safari', usage: '100%' }
      ],
      curve: []
    }
  },
];

const mockSchoolsList = [
  '永康國小',
  '復興國小',
  '安平國小',
  '海東國小',
  '樹林國小',
  '左鎮國小'
];

// Mock Data for Transfer Review
const mockTransferRequests = [
  { 
    id: 'TR-2024-001', 
    source: '永康國小', 
    target: '樹林國小', 
    status: 'pending', 
    date: '2024-03-20',
    reason: '偏鄉數位資源補強計畫',
    quantity: 15,
    applicant: '張主任',
    deviceModel: 'iPad (第9代)',
    transferStatus: 'waiting' // waiting, transferring, completed
  },
  { 
    id: 'TR-2024-002', 
    source: '復興國小', 
    target: '安平國小', 
    status: 'approved', 
    date: '2024-03-15',
    reason: '班級增班設備需求',
    quantity: 30,
    applicant: '李組長',
    deviceModel: 'iPad (第10代)',
    transferStatus: 'transferring'
  },
  { 
    id: 'TR-2024-003', 
    source: '大橋國中', 
    target: '左鎮國小', 
    status: 'approved', 
    date: '2024-03-10',
    reason: '跨校資源共享專案',
    quantity: 10,
    applicant: '王校長',
    deviceModel: 'iPad (第9代)',
    transferStatus: 'completed'
  },
  { 
    id: 'TR-2024-004', 
    source: '海東國小', 
    target: '樹林國小', 
    status: 'rejected', 
    date: '2024-03-05',
    reason: '設備老舊不建議轉移',
    quantity: 5,
    applicant: '陳主任',
    deviceModel: 'iPad (第8代)',
    transferStatus: 'waiting'
  }
];

// Mock Data for Disposal Audit
const mockDisposalRequests = [
  {
    id: 'DA-2024-001',
    school: '永康國小',
    serial: 'DMPQ12345678',
    model: 'iPad (第9代)',
    status: 'pending', // pending, approved, rejected
    reason: '已達年限', // 已達年限, 損壞無法修復, 遺失, 其他
    purchaseDate: '2018-05-15',
    damagePhoto: 'https://picsum.photos/seed/damage1/400/300'
  },
  {
    id: 'DA-2024-002',
    school: '復興國小',
    serial: 'FGLR87654321',
    model: 'iPad (第10代)',
    status: 'approved',
    reason: '損壞無法修復',
    purchaseDate: '2022-08-20',
    damagePhoto: 'https://picsum.photos/seed/damage2/400/300'
  },
  {
    id: 'DA-2024-003',
    school: '安平國小',
    serial: 'XCVB44332211',
    model: 'iPad (第9代)',
    status: 'rejected',
    reason: '遺失',
    purchaseDate: '2023-12-10',
    damagePhoto: 'https://picsum.photos/seed/damage3/400/300'
  }
];

const BureauDeviceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('device-list');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [devices, setDevices] = useState(initialDevices);
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [isLostReportModalOpen, setIsLostReportModalOpen] = useState(false);
  const [isFactoryResetModalOpen, setIsFactoryResetModalOpen] = useState(false);
  const [isRecoverModalOpen, setIsRecoverModalOpen] = useState(false);
  const [targetSchool, setTargetSchool] = useState('');
  const [filterSchool, setFilterSchool] = useState('all');
  const [filterModel, setFilterModel] = useState('all');
  const [filterMDM, setFilterMDM] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [startMonth, setStartMonth] = useState('2026-01');
  const [endMonth, setEndMonth] = useState('2026-04');
  
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [deviceDetailTab, setDeviceDetailTab] = useState<'details' | 'usage'>('details');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showTransferRejectInput, setShowTransferRejectInput] = useState(false);
  const [transferRejectionReason, setTransferRejectionReason] = useState('');
  const [disposalRequests, setDisposalRequests] = useState(mockDisposalRequests);
  const [selectedDisposal, setSelectedDisposal] = useState<any>(null);
  const [showDisposalRejectInput, setShowDisposalRejectInput] = useState(false);
  const [disposalRejectionReason, setDisposalRejectionReason] = useState('');
  
  // Calculate filtered usage data based on selected month range
  const filteredUsageData = useMemo(() => {
    if (!selectedDevice || !selectedDevice.usage) return null;
    
    // For mock purposes, we'll generate different data based on the month range
    const startNum = parseInt(startMonth.split('-')[1]);
    const endNum = parseInt(endMonth.split('-')[1]);
    const diff = Math.max(1, endNum - startNum + 1);
    
    // Deterministic factor based on the month range
    const factor = 0.8 + (diff % 5) * 0.1;
    
    const baseThisMonth = selectedDevice.usage.thisMonth || 0;
    const adjustedThisMonth = Math.round(baseThisMonth * factor);
    
    // Generate a new timeCurve based on the range
    const adjustedTimeCurve = (selectedDevice.usage.timeCurve || []).map((item: any, idx: number) => ({
      ...item,
      usage: Math.round(item.usage * (0.9 + ((idx + diff) % 4) * 0.1))
    }));
    
    return {
      thisMonth: adjustedThisMonth,
      timeCurve: adjustedTimeCurve
    };
  }, [selectedDevice, startMonth, endMonth]);

  const calculateYearsUsed = (purchaseDate: string) => {
    const purchase = new Date(purchaseDate);
    const now = new Date('2026-03-24');
    const diff = now.getTime() - purchase.getTime();
    const years = Math.max(0, diff / (1000 * 60 * 60 * 24 * 365.25));
    return years.toFixed(1);
  };

  const handleSyncJamf = () => {
    setIsSyncing(true);
    // Simulate API call
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Jamf 設備同步完成', {
        description: '已從 ASM/Jamf 更新最新設備清單與指派狀態。',
        duration: 3000,
      });
    }, 2000);
  };

  const handleAssignSchool = () => {
    if (!targetSchool) {
      toast.error('請選擇目標學校');
      return;
    }

    // Update status to assigning
    setDevices(prev => prev.map(d => 
      selectedDeviceIds.includes(d.id) 
        ? { ...d, assignmentStatus: 'assigning' } 
        : d
    ));
    
    setShowAssignModal(false);
    toast.info('指派程序啟動', { description: '正在與 Jamf 同步指派資訊...' });

    // Simulate Jamf sync completion
    setTimeout(() => {
      setDevices(prev => prev.map(d => 
        selectedDeviceIds.includes(d.id) 
          ? { ...d, assignmentStatus: 'assigned', school: targetSchool } 
          : d
      ));
      setSelectedDeviceIds([]);
      setTargetSchool('');
      toast.success('指派完成', { description: `已成功將設備指派至 ${targetSchool}` });
    }, 3000);
  };

  const handleExportReport = () => {
    const tabName = activeTab === 'device-list' ? '設備清單' : '設備遺失';
    toast.success(`${tabName} 報表匯出中`, {
      description: '報表正在產生成 Excel 格式，請稍候...',
      duration: 3000,
    });
  };

  const handleFactoryReset = () => {
    toast.success(`已對 ${selectedDeviceIds.length} 台設備發送恢復原廠設定指令`);
    setSelectedDeviceIds([]);
    setIsFactoryResetModalOpen(false);
  };

  const handleLostReport = () => {
    setDevices(prev => prev.map(device => 
      selectedDeviceIds.includes(device.id) ? { ...device, isLost: true } : device
    ));
    toast.warning(`已對 ${selectedDeviceIds.length} 台設備發送遺失通報指令`);
    setSelectedDeviceIds([]);
    setIsLostReportModalOpen(false);
  };

  const handleRecover = () => {
    setDevices(prev => prev.map(device => 
      selectedDeviceIds.includes(device.id) ? { ...device, isLost: false } : device
    ));
    toast.success(`已成功尋回 ${selectedDeviceIds.length} 台設備，設備已回到清單中`);
    setSelectedDeviceIds([]);
    setIsRecoverModalOpen(false);
  };

  const filteredDevices = devices.filter(d => {
    const matchesSearch = d.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.model.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = (filterSchool === 'all' || 
      (filterSchool === 'unassigned' && d.assignmentStatus === 'unassigned') ||
      (filterSchool === 'assigning' && d.assignmentStatus === 'assigning') ||
      d.school === filterSchool) &&
      (filterModel === 'all' || d.model === filterModel) &&
      (filterMDM === 'all' || d.mdm === filterMDM) &&
      (filterStatus === 'all' || d.deviceStatus === filterStatus);

    const matchesTab = activeTab === 'device-list' ? !d.isLost : d.isLost;

    return matchesSearch && matchesFilter && matchesTab;
  });

  const toggleDeviceSelection = (id: string) => {
    const device = devices.find(d => d.id === id);
    if (device?.deviceStatus === 'disposed') return;
    
    setSelectedDeviceIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getTransferStatusLabel = (status: string) => {
    switch (status) {
      case 'waiting': return <span className="text-slate-400 text-xs">等待移轉</span>;
      case 'transferring': return (
        <div className="flex items-center group relative">
          <span className="text-blue-500 text-xs animate-pulse">移轉中...</span>
          <div className="ml-1 cursor-help text-slate-400">
            <Info className="w-3 h-3" />
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-48 p-2 bg-slate-800 text-white text-[10px] rounded shadow-xl z-10">
              正在與 Jamf API 整合中，自動執行站點轉移與設備重新指派。
            </div>
          </div>
        </div>
      );
      case 'completed': return <span className="text-emerald-500 text-xs font-bold">移轉完成</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-20">
      <Toaster position="top-center" expand={true} richColors />
      
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <Tablet className="w-7 h-7 mr-3 text-blue-600" />
            設備管理中心
          </h2>
          <p className="text-slate-500 text-sm mt-1">查看與管理所有設備的使用狀態，包含設備資訊、使用情形。</p>
        </div>
        
        {activeTab === 'device-list' && (
          <button 
            onClick={handleSyncJamf}
            disabled={isSyncing}
            className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg ${
              isSyncing 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100'
            }`}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? '同步中...' : '同步設備'}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-fit">
        <button
          onClick={() => {
            setActiveTab('device-list');
            setSelectedDeviceIds([]);
          }}
          className={`flex items-center px-8 py-3 text-sm font-bold rounded-xl transition-all ${
            activeTab === 'device-list'
              ? 'bg-white text-blue-600 shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-4 h-4 mr-2" />
          設備清單
        </button>
        <button
          onClick={() => {
            setActiveTab('lost-devices');
            setSelectedDeviceIds([]);
          }}
          className={`flex items-center px-8 py-3 text-sm font-bold rounded-xl transition-all ${
            activeTab === 'lost-devices'
              ? 'bg-white text-amber-600 shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          設備遺失
        </button>
      </div>

      {/* Tab Content */}
      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-6">
          {/* Summary Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-500 mb-1">設備總數</p>
                  <h3 className="text-3xl font-black text-slate-800">{devices.length} <span className="text-sm font-normal text-slate-400">台</span></h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Tablet className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-500 mb-1">使用設備數</p>
                  <h3 className="text-3xl font-black text-emerald-600">{devices.filter(d => d.deviceStatus === 'active' && !d.isLost).length} <span className="text-sm font-normal text-slate-400">台</span></h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-500 mb-1">遺失設備數</p>
                  <h3 className="text-3xl font-black text-amber-600">{devices.filter(d => d.isLost).length} <span className="text-sm font-normal text-slate-400">台</span></h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 space-y-4">
                {/* Row 1: Search and Advanced Filter */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative w-full md:w-96">
                    <input 
                      type="text" 
                      placeholder="搜尋序號或型號..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    />
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-2.5" />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      className={`flex items-center px-4 py-2.5 border rounded-xl text-sm font-bold transition-colors ${showAdvancedFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      進階篩選
                    </button>
                    <button 
                      onClick={handleExportReport}
                      className="flex items-center px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      匯出報表
                    </button>
                  </div>
                </div>

                {/* Row 2: Selection Status and Actions (Always Visible) */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className="text-sm font-bold text-blue-600 mr-4">
                    已選取 {selectedDeviceIds.length} 台設備
                  </span>
                  
                  {activeTab === 'device-list' ? (
                    <>
                      <button 
                        onClick={() => setIsLostReportModalOpen(true)}
                        disabled={selectedDeviceIds.length === 0}
                        className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          selectedDeviceIds.length > 0 
                            ? 'bg-amber-500 text-white shadow-lg shadow-amber-100 hover:bg-amber-600' 
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                        遺失通報
                      </button>
                      <button 
                        onClick={() => setIsFactoryResetModalOpen(true)}
                        disabled={selectedDeviceIds.length === 0}
                        className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          selectedDeviceIds.length > 0 
                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-100 hover:bg-rose-600' 
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                        恢復原廠設定
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => setIsRecoverModalOpen(true)}
                        disabled={selectedDeviceIds.length === 0}
                        className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          selectedDeviceIds.length > 0 
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700' 
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                        設備尋回
                      </button>
                      <button 
                        onClick={() => setIsFactoryResetModalOpen(true)}
                        disabled={selectedDeviceIds.length === 0}
                        className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          selectedDeviceIds.length > 0 
                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-100 hover:bg-rose-600' 
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                        恢復原廠設定
                      </button>
                    </>
                  )}
                </div>

                {/* Row 3: Advanced Filters with Divider */}
                <AnimatePresence>
                  {showAdvancedFilters && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 ml-1">指派學校</label>
                          <select 
                            value={filterSchool}
                            onChange={(e) => setFilterSchool(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="all">全部學校</option>
                            <option value="unassigned">未指派</option>
                            {mockSchoolsList.map(school => (
                              <option key={school} value={school}>{school}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 ml-1">設備型號</label>
                          <select 
                            value={filterModel}
                            onChange={(e) => setFilterModel(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="all">全部型號</option>
                            {Array.from(new Set(devices.map(d => d.model))).map(model => (
                              <option key={model} value={model}>{model}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 ml-1">MDM 平台</label>
                          <select 
                            value={filterMDM}
                            onChange={(e) => setFilterMDM(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="all">全部平台</option>
                            <option value="Jamf Pro">Jamf Pro</option>
                            <option value="Intune">Intune</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 ml-1">設備狀態</label>
                          <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="all">全部狀態</option>
                            <option value="active">使用中</option>
                            <option value="disposed">已報廢</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="px-6 py-3 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-600">設備明細清單</h3>
                <span className="text-xs text-slate-500 font-medium tracking-wider">共 {filteredDevices.length} 筆資料</span>
              </div>

              <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-8 py-4 w-10">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedDeviceIds.length === filteredDevices.filter(d => d.deviceStatus !== 'disposed').length && filteredDevices.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            const selectableIds = filteredDevices
                              .filter(d => d.deviceStatus !== 'disposed')
                              .map(d => d.id);
                            setSelectedDeviceIds(selectableIds);
                          } else {
                            setSelectedDeviceIds([]);
                          }
                        }}
                      />
                    </th>
                    <th className="px-6 py-4">設備名稱</th>
                    <th className="px-6 py-4">設備序號</th>
                    <th className="px-6 py-4">設備型號</th>
                    <th className="px-6 py-4">指派學校</th>
                    <th className="px-6 py-4">目前 MDM</th>
                    {activeTab === 'device-list' && <th className="px-6 py-4">狀態</th>}
                    <th className="px-8 py-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDevices.map((device) => (
                    <tr 
                      key={device.id} 
                      className={`hover:bg-slate-50 transition-colors group ${device.deviceStatus === 'disposed' ? 'opacity-60 grayscale-[0.5]' : ''}`}
                    >
                      <td className="px-8 py-4">
                        <input 
                          type="checkbox" 
                          className={`rounded border-slate-300 text-blue-600 focus:ring-blue-500 ${device.deviceStatus === 'disposed' ? 'cursor-not-allowed opacity-50' : ''}`}
                          checked={selectedDeviceIds.includes(device.id)}
                          onChange={() => toggleDeviceSelection(device.id)}
                          disabled={device.deviceStatus === 'disposed'}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{device.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 font-mono">
                          {device.serial}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-700 font-medium">{device.model}</div>
                        <div className="text-xs text-slate-400">{device.os}</div>
                      </td>
                      <td className="px-6 py-4">
                        {device.assignmentStatus === 'assigning' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                            指派中...
                          </span>
                        ) : device.assignmentStatus === 'unassigned' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 italic">
                            未指派
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <School className="w-3 h-3 mr-1" />
                            {device.school}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-600">{device.mdm}</div>
                      </td>
                      {activeTab === 'device-list' && (
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            device.deviceStatus === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {device.deviceStatus === 'active' ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 mr-1.5" />
                                使用中
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-3 h-3 mr-1.5" />
                                已報廢
                              </>
                            )}
                          </div>
                        </td>
                      )}
                      <td className="px-8 py-4 text-right">
                        {activeTab === 'device-list' ? (
                          <button 
                            onClick={() => setSelectedDevice(device)}
                            className="inline-flex items-center px-4 py-2 bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white rounded-xl text-sm font-bold transition-all"
                          >
                            詳細資訊
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </button>
                        ) : (
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => {
                                setSelectedDeviceIds([device.id]);
                                setIsRecoverModalOpen(true);
                              }}
                              className="inline-flex items-center px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white rounded-lg text-xs font-bold transition-all border border-emerald-100"
                            >
                              尋回
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedDeviceIds([device.id]);
                                setIsFactoryResetModalOpen(true);
                              }}
                              className="inline-flex items-center px-3 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-lg text-xs font-bold transition-all border border-rose-100"
                            >
                              恢復原廠
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lost Report Modal */}
      <AnimatePresence>
        {isLostReportModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLostReportModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">確認通報遺失？</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  您即將通報 <span className="font-bold text-slate-800">{selectedDeviceIds.length}</span> 台設備為遺失狀態。通報後，這些設備將被移至「設備遺失」分頁。
                </p>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => setIsLostReportModalOpen(false)}
                    className="flex-1 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleLostReport}
                    className="flex-1 px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-amber-200"
                  >
                    確認通報
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Factory Reset Modal */}
      <AnimatePresence>
        {isFactoryResetModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFactoryResetModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <RefreshCw className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">確認恢復原廠設定？</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  您即將對 <span className="font-bold text-slate-800">{selectedDeviceIds.length}</span> 台設備執行恢復原廠設定。此操作將抹除設備上的所有資料且無法復原。
                </p>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => setIsFactoryResetModalOpen(false)}
                    className="flex-1 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleFactoryReset}
                    className="flex-1 px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-rose-200"
                  >
                    確認執行
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Recover Modal */}
      <AnimatePresence>
        {isRecoverModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRecoverModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">確認設備尋回？</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  您即將將 <span className="font-bold text-slate-800">{selectedDeviceIds.length}</span> 台設備標記為已尋回。這些設備將重新回到「設備清單」中。
                </p>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => setIsRecoverModalOpen(false)}
                    className="flex-1 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleRecover}
                    className="flex-1 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-200"
                  >
                    確認尋回
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Device Detail Drawer */}
      <AnimatePresence>
        {selectedDevice && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDevice(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white shadow-2xl h-full flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mr-3 shadow-lg shadow-blue-100">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{selectedDevice.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">{selectedDevice.serial}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedDevice(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Tabs for Drawer */}
              <div className="flex border-b border-slate-100 px-6 bg-white sticky top-0 z-10">
                <button 
                  onClick={() => setDeviceDetailTab('details')}
                  className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${deviceDetailTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  設備詳細資料
                </button>
                <button 
                  onClick={() => setDeviceDetailTab('usage')}
                  className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${deviceDetailTab === 'usage' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  使用概況
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {deviceDetailTab === 'details' ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">設備名稱</p>
                        <p className="font-bold text-slate-800">{selectedDevice.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">設備序號</p>
                        <p className="font-mono font-bold text-slate-800">{selectedDevice.serial}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">設備系統</p>
                        <p className="text-slate-700 font-medium">{selectedDevice.os}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">儲存空間</p>
                        <p className="text-slate-700 font-medium">
                          {selectedDevice.usedStorage ? `${selectedDevice.usedStorage} / ${selectedDevice.storage}` : selectedDevice.storage}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">使用者名稱</p>
                        <p className="text-slate-700 font-medium">{selectedDevice.userName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">目前狀態</p>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${selectedDevice.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                          <span className={`font-bold ${selectedDevice.status === 'online' ? 'text-emerald-600' : 'text-slate-500'}`}>
                            {selectedDevice.status === 'online' ? '在線' : '離線'}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">電量</p>
                        <div className="flex items-center text-slate-700 font-medium">
                          <Battery className="w-4 h-4 mr-1.5 text-emerald-500" />
                          {selectedDevice.battery}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">購買日期</p>
                        <div className="flex items-center text-slate-700 font-medium">
                          <Calendar className="w-4 h-4 mr-1.5 text-slate-400" />
                          {selectedDevice.purchaseDate}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">保固時間</p>
                        <div className="flex items-center text-slate-700 font-medium">
                          <ShieldCheck className="w-4 h-4 mr-1.5 text-blue-400" />
                          {selectedDevice.warrantyDate}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">最後連線時間</p>
                        <div className="flex items-center text-slate-700 font-medium">
                          <Clock className="w-4 h-4 mr-1.5 text-slate-400" />
                          {selectedDevice.lastSeen}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-slate-500 text-sm">
                          <School className="w-4 h-4 mr-2" />
                          所屬學校
                        </div>
                        <span className="font-bold text-slate-800">{selectedDevice.school || '未指派'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-slate-500 text-sm">
                          <Activity className="w-4 h-4 mr-2" />
                          目前 MDM
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          selectedDevice.mdm === 'Jamf Pro' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>{selectedDevice.mdm}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Month Filter */}
                    <div className="flex flex-col space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-center text-sm font-bold text-slate-700">
                        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                        篩選月份區間
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="month" 
                          value={startMonth}
                          onChange={(e) => setStartMonth(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-slate-400 text-xs">至</span>
                        <input 
                          type="month" 
                          value={endMonth}
                          onChange={(e) => setEndMonth(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Usage KPIs */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                        <div className="flex items-center text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
                          <Clock className="w-4 h-4 mr-2" /> 平均每日使用時長
                        </div>
                        <div className="text-2xl font-bold text-blue-700">
                          {filteredUsageData?.thisMonth ? Math.round(filteredUsageData.thisMonth / 30) : 0} 
                          <span className="text-sm font-normal text-blue-400"> 分鐘</span>
                        </div>
                        <p className="text-[10px] text-blue-400 mt-1">(總使用時長 / 區間天數)</p>
                      </div>
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <div className="flex items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                          <Clock className="w-4 h-4 mr-2" /> 使用時長
                        </div>
                        <div className="text-2xl font-bold text-slate-800">{filteredUsageData?.thisMonth || 0} <span className="text-sm font-normal text-slate-400">分鐘</span></div>
                      </div>
                    </div>

                    {/* Usage Curve */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-bold text-slate-800 flex items-center">
                          <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                          使用曲線圖
                        </h4>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <div className="w-3 h-0.5 bg-blue-500 mr-2"></div> 使用分鐘數
                          </div>
                        </div>
                      </div>
                      <div className="h-72 bg-white rounded-2xl border border-slate-100 p-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={filteredUsageData?.timeCurve || []}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                              dataKey="time" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: '#94a3b8', fontSize: 10 }} 
                              interval={0}
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: '#94a3b8', fontSize: 12 }} 
                              label={{ value: '分鐘', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} 
                            />
                            <Tooltip 
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="usage" 
                              name="平均使用分鐘數"
                              stroke="#3b82f6" 
                              strokeWidth={4} 
                              dot={{ r: 3, fill: '#3b82f6', strokeWidth: 1, stroke: '#fff' }}
                              activeDot={{ r: 5, strokeWidth: 0 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setSelectedDevice(null)}
                  className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all"
                >
                  關閉
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transfer Review Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRequest(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mr-3 shadow-lg shadow-amber-100">
                    <ArrowRightLeft className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">調撥申請詳情</h3>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                {/* Header Info */}
                <div className="flex items-center justify-between p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="text-center flex-1">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">來源學校</p>
                    <p className="font-bold text-blue-900">{selectedRequest.source}</p>
                  </div>
                  <div className="px-4">
                    <ArrowRightLeft className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">目標學校</p>
                    <p className="font-bold text-blue-900">{selectedRequest.target}</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">申請單號</p>
                        <p className="font-mono font-bold text-slate-800">{selectedRequest.id}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">申請日期</p>
                        <p className="font-bold text-slate-800">{selectedRequest.date}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">申請人</p>
                        <p className="font-bold text-slate-800">{selectedRequest.applicant}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Smartphone className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">需轉移型號</p>
                        <p className="font-bold text-slate-800">{selectedRequest.deviceModel}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Layout className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">申請台數</p>
                        <p className="font-bold text-slate-800">{selectedRequest.quantity} 台</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Activity className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">目前狀態</p>
                        <div className="flex items-center mt-1">
                          {selectedRequest.status === 'pending' ? (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-bold">待核准</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">已核准</span>
                          )}
                          <span className="ml-2">{getTransferStatusLabel(selectedRequest.transferStatus)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reason Section */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">申請原因</p>
                  <p className="text-slate-700 leading-relaxed">{selectedRequest.reason}</p>
                </div>

                {showTransferRejectInput && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-rose-500 uppercase tracking-wider">駁回原因 (必填)</p>
                    <textarea 
                      value={transferRejectionReason}
                      onChange={(e) => setTransferRejectionReason(e.target.value)}
                      placeholder="請輸入駁回原因..."
                      className="w-full px-4 py-3 bg-rose-50/30 border border-rose-100 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all h-24 resize-none"
                    />
                  </div>
                )}

                {/* Transfer Progress (If approved) */}
                {selectedRequest.status === 'approved' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <h4 className="font-bold text-slate-800">移轉進度</h4>
                      <span className="text-sm text-blue-600 font-bold">
                        {selectedRequest.transferStatus === 'completed' ? '100%' : '45%'}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: selectedRequest.transferStatus === 'completed' ? '100%' : '45%' }}
                        className={`h-full rounded-full ${selectedRequest.transferStatus === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                      />
                    </div>
                    <p className="text-xs text-slate-500 italic">
                      {selectedRequest.transferStatus === 'completed' 
                        ? '所有設備已完成 Jamf 站點轉移與 ASM 重新指派，可關閉此申請單。' 
                        : '正在進行 Jamf 站點轉移程序，預計還需 15 分鐘。'}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-4">
                <button 
                  onClick={() => {
                    setSelectedRequest(null);
                    setShowTransferRejectInput(false);
                    setTransferRejectionReason('');
                  }}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all"
                >
                  關閉
                </button>
                {selectedRequest.status === 'pending' && !showTransferRejectInput && (
                  <button 
                    onClick={() => setShowTransferRejectInput(true)}
                    className="px-6 py-2.5 bg-white border border-slate-200 text-rose-600 font-bold rounded-xl hover:bg-rose-50 transition-all"
                  >
                    駁回調撥
                  </button>
                )}
                {showTransferRejectInput && (
                  <button 
                    onClick={() => {
                      if (!transferRejectionReason) {
                        toast.error('請填寫駁回原因');
                        return;
                      }
                      toast.error('申請已駁回', { description: `單號 ${selectedRequest.id} 已駁回。原因：${transferRejectionReason}` });
                      setSelectedRequest(null);
                      setShowTransferRejectInput(false);
                      setTransferRejectionReason('');
                    }}
                    className="px-6 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-100"
                  >
                    確認駁回
                  </button>
                )}
                {selectedRequest.status === 'pending' && !showTransferRejectInput && (
                  <button 
                    onClick={() => {
                      const confirmErase = window.confirm(`是否要在轉移前執行遠端抹除 (EraseDevice)？\n這將清除設備上的所有資料以確保安全。`);

                      toast.info('啟動 Jamf 站點轉移', { 
                        description: `正在將設備站點變更為 ${selectedRequest.target}...`,
                      });

                      if (confirmErase) {
                        setTimeout(() => {
                          toast.warning('執行遠端抹除指令', { 
                            description: '已向 Jamf 發送 EraseDevice 指令。',
                          });
                        }, 1000);
                      }

                      setTimeout(() => {
                        toast.success('審核通過', { 
                          description: `設備已成功轉移至 ${selectedRequest.target} 站點。`,
                        });
                        setSelectedRequest(null);
                      }, 3000);
                    }}
                    className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all flex items-center"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    核准並執行轉移
                  </button>
                )}
                {selectedRequest.transferStatus === 'completed' && (
                  <button 
                    onClick={() => {
                      toast.info('申請單已關閉', { description: `單號 ${selectedRequest.id} 已完成所有流程並存檔。` });
                      setSelectedRequest(null);
                    }}
                    className="px-8 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-all"
                  >
                    關閉申請單
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Disposal Audit Modal */}
      <AnimatePresence>
        {selectedDisposal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedDisposal(null);
              }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center mr-3 shadow-lg shadow-rose-100">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">報廢申請詳情</h3>
                </div>
                <button onClick={() => {
                  setSelectedDisposal(null);
                }} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <School className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">申請學校</p>
                        <p className="font-bold text-slate-800">{selectedDisposal.school}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Smartphone className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">設備型號</p>
                        <p className="font-bold text-slate-800">{selectedDisposal.model}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">設備序號</p>
                        <p className="font-mono font-bold text-slate-800">{selectedDisposal.serial}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">報廢原因</p>
                        <p className="font-bold text-slate-800">{selectedDisposal.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">已使用年限</p>
                        <p className="font-bold text-slate-800">{calculateYearsUsed(selectedDisposal.purchaseDate)} 年</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">購買期間</p>
                        <p className="font-bold text-slate-800">{selectedDisposal.purchaseDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                    <Image className="w-4 h-4 mr-1.5" />
                    損壞照片預覽
                  </p>
                  <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                    <img 
                      src={selectedDisposal.damagePhoto} 
                      alt="Damage Preview" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {showDisposalRejectInput && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-rose-500 uppercase tracking-wider">駁回原因 (必填)</p>
                    <textarea 
                      value={disposalRejectionReason}
                      onChange={(e) => setDisposalRejectionReason(e.target.value)}
                      placeholder="請輸入駁回原因..."
                      className="w-full px-4 py-3 bg-rose-50/30 border border-rose-100 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all h-24 resize-none"
                    />
                  </div>
                )}
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-4">
                <button 
                  onClick={() => {
                    setSelectedDisposal(null);
                    setShowDisposalRejectInput(false);
                    setDisposalRejectionReason('');
                  }}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all"
                >
                  關閉
                </button>
                {selectedDisposal.status === 'pending' && !showDisposalRejectInput && (
                  <button 
                    onClick={() => setShowDisposalRejectInput(true)}
                    className="px-6 py-2.5 bg-white border border-slate-200 text-rose-600 font-bold rounded-xl hover:bg-rose-50 transition-all"
                  >
                    駁回申請
                  </button>
                )}
                {showDisposalRejectInput && (
                  <button 
                    onClick={() => {
                      if (!disposalRejectionReason) {
                        toast.error('請填寫駁回原因');
                        return;
                      }
                      toast.error('報廢申請已駁回', { description: `序號 ${selectedDisposal.serial} 的報廢申請已駁回。` });
                      setSelectedDisposal(null);
                      setShowDisposalRejectInput(false);
                      setDisposalRejectionReason('');
                    }}
                    className="px-6 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-100"
                  >
                    確認駁回
                  </button>
                )}
                {selectedDisposal.status === 'pending' && !showDisposalRejectInput && (
                  <button 
                    onClick={() => {
                      toast.success('報廢申請已核准', { 
                        description: `序號 ${selectedDisposal.serial} 已核准報廢，系統將自動從 Jamf Pro 移除並標記為已報廢。`,
                      });
                      setSelectedDisposal(null);
                    }}
                    className="px-8 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-100 transition-all flex items-center"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    核准報廢
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Assign School Modal */}
      <AnimatePresence>
        {showAssignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAssignModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800">指派學校</h3>
                <button onClick={() => setShowAssignModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <p className="text-sm text-slate-500">
                  您已選擇 <span className="font-bold text-blue-600">{selectedDeviceIds.length}</span> 台設備，請選擇欲指派的目標學校：
                </p>
                
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">目標學校</p>
                  <select 
                    value={targetSchool}
                    onChange={(e) => setTargetSchool(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="">請選擇學校...</option>
                    {mockSchoolsList.map(school => (
                      <option key={school} value={school}>{school}</option>
                    ))}
                  </select>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start">
                  <Info className="w-5 h-5 text-amber-500 mr-3 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    確認指派後，系統將自動與 Jamf Pro 進行站點同步。同步期間設備狀態將顯示為「指派中」。
                  </p>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-4">
                <button 
                  onClick={() => setShowAssignModal(false)}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={handleAssignSchool}
                  className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all"
                >
                  確定指派
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BureauDeviceManagement;
