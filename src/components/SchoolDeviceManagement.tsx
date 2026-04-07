import React, { useState, useMemo } from 'react';
import { 
  Tablet, 
  Search, 
  RefreshCw, 
  Smartphone, 
  ChevronRight, 
  X, 
  Battery, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  School, 
  Activity, 
  TrendingUp,
  CheckCircle2,
  Trash2,
  Users,
  Filter,
  RotateCcw,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { INITIAL_GROUPS } from './SchoolGroupManagement';

// --- Types ---
interface Device {
  id: string;
  name: string;
  serial: string;
  model: string;
  os: string;
  storage: string;
  usedStorage?: string;
  group: string; // Changed from school to group
  mdm: string;
  status: 'online' | 'offline';
  battery: string;
  lastSeen: string;
  purchaseDate: string;
  warrantyDate: string;
  userName: string;
  deviceStatus: 'active' | 'disposed';
  assignmentStatus: 'assigned' | 'unassigned' | 'assigning';
  isLost?: boolean;
}

// --- Mock Data ---
const GROUPS = INITIAL_GROUPS.map(g => g.name);

const MOCK_DEVICES: Device[] = Array.from({ length: 40 }).map((_, i) => ({
  id: `dev-${i}`,
  name: `DAAN-iPad-${String(i + 1).padStart(2, '0')}`,
  serial: `DAAN${2000 + i}XYZ`,
  model: i % 2 === 0 ? 'iPad Air (5th Gen)' : 'iPad (9th Gen)',
  os: i % 2 === 0 ? 'iPadOS 17.2' : 'iPadOS 16.2',
  storage: '64GB',
  usedStorage: i % 3 === 0 ? '42GB' : '18GB',
  group: i % 10 === 0 ? '' : GROUPS[i % GROUPS.length], // Some unassigned
  mdm: i % 3 === 0 ? 'Jamf Pro' : 'Intune',
  status: Math.random() > 0.3 ? 'online' : 'offline',
  battery: `${Math.floor(Math.random() * 100)}%`,
  lastSeen: '2024-03-20 14:30',
  purchaseDate: '2023-09-01',
  warrantyDate: '2025-09-01',
  userName: i % 10 === 0 ? '-' : `學生 ${100 + i}`,
  deviceStatus: 'active',
  assignmentStatus: i % 10 === 0 ? 'unassigned' : 'assigned',
  isLost: i % 15 === 0
}));

const USAGE_DATA = {
  '2024-03': {
    thisMonth: 45200,
    timeCurve: [
      { time: '03-01', usage: 1200 },
      { time: '03-05', usage: 1800 },
      { time: '03-10', usage: 1500 },
      { time: '03-15', usage: 2200 },
      { time: '03-20', usage: 1900 },
      { time: '03-25', usage: 2500 },
      { time: '03-31', usage: 2100 },
    ]
  }
};

const SchoolDeviceManagement: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [deviceDetailTab, setDeviceDetailTab] = useState<'details' | 'usage'>('details');
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState<'list' | 'lost'>('list');
  
  // Bulk Assign State
  const [isBulkAssignModalOpen, setIsBulkAssignModalOpen] = useState(false);
  const [isFactoryResetModalOpen, setIsFactoryResetModalOpen] = useState(false);
  const [isLostReportModalOpen, setIsLostReportModalOpen] = useState(false);
  const [isRecoverModalOpen, setIsRecoverModalOpen] = useState(false);
  const [targetGroup, setTargetGroup] = useState<string>('');

  // Advanced Filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterModel, setFilterModel] = useState('all');
  const [filterMDM, setFilterMDM] = useState('all');
  const [filterGroup, setFilterGroup] = useState('all');

  // Usage chart filters
  const [startMonth, setStartMonth] = useState('2024-03');
  const [endMonth, setEndMonth] = useState('2024-03');

  const handleSync = () => {
    setIsSyncing(true);
    toast.info('正在同步設備資料...', { description: '正在從 Jamf 與 ASM 獲取最新設備狀態。' });
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('同步完成', { description: '已成功同步 40 台設備資料。' });
    }, 2000);
  };

  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      const matchesTab = currentTab === 'list' ? !device.isLost : device.isLost;
      if (!matchesTab) return false;

      const matchesSearch = device.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           device.model.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesModel = filterModel === 'all' || device.model === filterModel;
      const matchesMDM = filterMDM === 'all' || device.mdm === filterMDM;
      const matchesGroup = filterGroup === 'all' || 
                          (filterGroup === 'unassigned' && !device.group) || 
                          device.group === filterGroup;

      return matchesSearch && matchesModel && matchesMDM && matchesGroup;
    });
  }, [searchQuery, filterModel, filterMDM, filterGroup, currentTab, devices]);

  const toggleDeviceSelection = (id: string) => {
    setSelectedDeviceIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkAssign = () => {
    if (!targetGroup) {
      toast.error('請選擇目標群組');
      return;
    }

    const isUnassign = targetGroup === 'unassigned';
    const groupName = isUnassign ? '' : targetGroup;

    setDevices(prev => prev.map(device => 
      selectedDeviceIds.includes(device.id) 
        ? { 
            ...device, 
            group: groupName, 
            assignmentStatus: isUnassign ? 'unassigned' as const : 'assigned' as const 
          } 
        : device
    ));

    toast.success(isUnassign ? `已將 ${selectedDeviceIds.length} 台設備取消指派` : `已將 ${selectedDeviceIds.length} 台設備指派至 ${targetGroup}`);
    setSelectedDeviceIds([]);
    setIsBulkAssignModalOpen(false);
    setTargetGroup('');
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

  const handleExportReport = () => {
    const tabName = currentTab === 'list' ? '設備清單' : '設備遺失';
    toast.success(`${tabName} 報表匯出中`, {
      description: '報表正在產生成 Excel 格式，請稍候...',
      duration: 3000,
    });
  };

  const filteredUsageData = USAGE_DATA['2024-03'];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-2">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <Tablet className="w-7 h-7 mr-3 text-blue-600" />
            設備管理
            <span className="ml-4 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold border border-blue-100">
              設備總數: {devices.length} 台
            </span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">查看與管理校內所有設備的使用狀態與指派群組。</p>
        </div>
        
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-100 ${
            isSyncing ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
          }`}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? '同步中...' : '同步設備'}
        </button>
      </div>

      {/* Tabs Section */}
      <div className="flex bg-white p-2 rounded-xl border border-slate-200 shadow-sm w-fit">
        <button 
          onClick={() => {
            setCurrentTab('list');
            setSelectedDeviceIds([]);
          }}
          className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${currentTab === 'list' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          設備清單
        </button>
        <button 
          onClick={() => {
            setCurrentTab('lost');
            setSelectedDeviceIds([]);
          }}
          className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${currentTab === 'lost' ? 'bg-amber-500 text-white shadow-lg shadow-amber-100' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          設備遺失
        </button>
      </div>

      {/* Main Content Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
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
          {/* Table Filters */}
          <div className="p-6 border-b border-slate-100 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="搜尋序號或型號" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleExportReport}
                  className="flex items-center px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  <FileText className="w-4 h-4 mr-2 text-slate-400" />
                  匯出報表
                </button>
                <button 
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`flex items-center px-4 py-2.5 border rounded-xl text-sm font-bold transition-colors ${
                    showAdvancedFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  進階篩選
                </button>
              </div>
            </div>

            {/* Row 2: Bulk Actions (Always Visible) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-sm font-bold text-blue-600 mr-2">
                已選取 {selectedDeviceIds.length} 台設備
              </span>
              {currentTab === 'list' ? (
                <>
                  <button 
                    onClick={() => setIsBulkAssignModalOpen(true)}
                    disabled={selectedDeviceIds.length === 0}
                    className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedDeviceIds.length > 0 
                        ? 'bg-slate-800 text-white hover:bg-slate-900' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 mr-1.5" />
                    批次指派群組
                  </button>
                  <button 
                    onClick={() => setIsLostReportModalOpen(true)}
                    disabled={selectedDeviceIds.length === 0}
                    className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedDeviceIds.length > 0 
                        ? 'bg-amber-500 text-white hover:bg-amber-600' 
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
                        ? 'bg-rose-500 text-white hover:bg-rose-600' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                    恢復原廠設定
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setIsRecoverModalOpen(true)}
                    disabled={selectedDeviceIds.length === 0}
                    className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedDeviceIds.length > 0 
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
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
                        ? 'bg-rose-500 text-white hover:bg-rose-600' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                    恢復原廠設定
                  </button>
                </div>
              )}
            </div>

            {/* Advanced Filters Panel */}
            <AnimatePresence>
              {showAdvancedFilters && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1">設備型號</label>
                      <select 
                        value={filterModel}
                        onChange={(e) => setFilterModel(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">全部型號</option>
                        <option value="iPad Air (5th Gen)">iPad Air (5th Gen)</option>
                        <option value="iPad (9th Gen)">iPad (9th Gen)</option>
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
                      <label className="text-xs font-bold text-slate-500 ml-1">指派群組</label>
                      <select 
                        value={filterGroup}
                        onChange={(e) => setFilterGroup(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">全部群組</option>
                        <option value="unassigned">未指派</option>
                        {GROUPS.map(group => (
                          <option key={group} value={group}>{group}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Device Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-8 py-4 w-10">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedDeviceIds.length === filteredDevices.length && filteredDevices.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDeviceIds(filteredDevices.map(d => d.id));
                        } else {
                          setSelectedDeviceIds([]);
                        }
                      }}
                    />
                  </th>
                  <th className="px-6 py-4">設備名稱</th>
                  <th className="px-6 py-4">設備序號</th>
                  <th className="px-6 py-4">設備型號</th>
                  <th className="px-6 py-4">指派群組</th>
                  <th className="px-6 py-4">目前 MDM</th>
                  <th className="px-6 py-4">狀態</th>
                  <th className="px-8 py-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDevices.map((device) => (
                  <tr key={device.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedDeviceIds.includes(device.id)}
                        onChange={() => toggleDeviceSelection(device.id)}
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        device.group ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <Users className="w-3 h-3 mr-1" />
                        {device.group || '未指派'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-600">{device.mdm}</div>
                    </td>
                    <td className="px-6 py-4">
                      {currentTab === 'list' ? (
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                          使用中
                        </div>
                      ) : (
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                          <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                          遺失
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-4 text-right">
                      {currentTab === 'list' ? (
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
                {filteredDevices.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-8 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center">
                        <Search className="w-12 h-12 mb-2 opacity-20" />
                        <p>查無符合條件的設備資料</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Bulk Assign Modal */}
      <AnimatePresence>
        {isBulkAssignModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBulkAssignModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">批次指派群組</h3>
                <button onClick={() => setIsBulkAssignModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-700 font-medium">
                    您已選取 <span className="font-bold">{selectedDeviceIds.length}</span> 台設備，請選擇要指派的目標群組。
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700">選擇目標群組</label>
                  <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {GROUPS.map(group => (
                      <button
                        key={group}
                        onClick={() => setTargetGroup(group)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                          targetGroup === group 
                            ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/10' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <Users className={`w-4 h-4 mr-3 ${targetGroup === group ? 'text-blue-500' : 'text-slate-400'}`} />
                          <span className="font-bold text-sm">{group}</span>
                        </div>
                        {targetGroup === group && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                      </button>
                    ))}
                    <button
                      onClick={() => setTargetGroup('unassigned')}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                        targetGroup === 'unassigned' 
                          ? 'bg-slate-100 border-slate-400 text-slate-700' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <X className={`w-4 h-4 mr-3 ${targetGroup === 'unassigned' ? 'text-slate-500' : 'text-slate-400'}`} />
                        <span className="font-bold text-sm">取消指派 (未指派)</span>
                      </div>
                      {targetGroup === 'unassigned' && <CheckCircle2 className="w-4 h-4 text-slate-500" />}
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex space-x-3">
                  <button 
                    onClick={() => setIsBulkAssignModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleBulkAssign}
                    className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                  >
                    確認轉移
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFactoryResetModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center text-rose-600">
                  <RotateCcw className="w-6 h-6 mr-2" />
                  <h3 className="text-xl font-bold">恢復原廠設定</h3>
                </div>
                <button onClick={() => setIsFactoryResetModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                  <p className="text-sm text-rose-700 font-medium">
                    警告：恢復原廠設定將清除設備上的所有資料且無法復原。
                  </p>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed">
                  您確定要對選取的 <span className="font-bold text-slate-800">{selectedDeviceIds.length}</span> 台設備執行恢復原廠設定嗎？
                </p>

                <div className="pt-4 flex space-x-3">
                  <button 
                    onClick={() => setIsFactoryResetModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleFactoryReset}
                    className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-100"
                  >
                    確認恢復
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lost Report Modal */}
      <AnimatePresence>
        {isLostReportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLostReportModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center text-amber-600">
                  <AlertTriangle className="w-6 h-6 mr-2" />
                  <h3 className="text-xl font-bold">遺失通報</h3>
                </div>
                <button onClick={() => setIsLostReportModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                  <p className="text-sm text-amber-700 font-medium">
                    通報遺失後，設備將會被鎖定並顯示遺失訊息。
                  </p>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed">
                  您確定要對選取的 <span className="font-bold text-slate-800">{selectedDeviceIds.length}</span> 台設備進行遺失通報嗎？
                </p>

                <div className="pt-4 flex space-x-3">
                  <button 
                    onClick={() => setIsLostReportModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleLostReport}
                    className="flex-1 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-100"
                  >
                    確認通報
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Recover Device Modal */}
      <AnimatePresence>
        {isRecoverModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRecoverModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center text-emerald-600">
                  <CheckCircle2 className="w-6 h-6 mr-2" />
                  <h3 className="text-xl font-bold">設備尋回</h3>
                </div>
                <button onClick={() => setIsRecoverModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <p className="text-sm text-emerald-700 font-medium">
                    尋回後，設備將解除鎖定並回到設備清單中。
                  </p>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed">
                  您確定要尋回選取的 <span className="font-bold text-slate-800">{selectedDeviceIds.length}</span> 台設備嗎？
                </p>

                <div className="pt-4 flex space-x-3">
                  <button 
                    onClick={() => setIsRecoverModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleRecover}
                    className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
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
                          <Users className="w-4 h-4 mr-2" />
                          所屬群組
                        </div>
                        <span className="font-bold text-slate-800">{selectedDevice.group || '未指派'}</span>
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
    </div>
  );
};

export default SchoolDeviceManagement;
