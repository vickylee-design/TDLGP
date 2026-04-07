import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Search, 
  School, 
  Tablet, 
  Clock,
  CheckCircle2,
  XCircle,
  Info,
  ChevronDown,
  Smartphone,
  LayoutGrid,
  TrendingUp,
  TrendingDown,
  X,
  Download
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';

// --- Types ---
type ListFilterType = 'all' | 'used' | 'unused' | 'violating';

interface DeviceData {
  id: string;
  name: string;
  serial: string;
  model: string;
  os: string;
  school: string;
  mdm: string;
  usageDuration: string;
  lastConnection: string;
  isUsed: boolean;
  isViolating?: boolean;
}

// --- Mock Data ---
const SCHOOL_NAME = '大安國小';

const MOCK_DEVICES: DeviceData[] = Array.from({ length: 45 }).map((_, i) => ({
  id: `dev-${i}`,
  name: `DAAN-iPad-${String(i + 1).padStart(2, '0')}`,
  serial: `DAAN${2000 + i}XYZ`,
  model: i % 2 === 0 ? 'iPad Air (5th Gen)' : 'iPad (9th Gen)',
  os: i % 2 === 0 ? 'iPadOS 17.2' : 'iPadOS 16.2',
  school: SCHOOL_NAME,
  mdm: i % 3 === 0 ? 'Jamf Pro' : 'Intune',
  usageDuration: `${Math.floor(Math.random() * 80) + 20}h ${Math.floor(Math.random() * 60)}m`,
  lastConnection: '2024-03-20 14:30',
  isUsed: Math.random() > 0.2,
  isViolating: Math.random() < 0.08
}));

const SchoolDashboard: React.FC = () => {
  // --- State ---
  const [monthRange, setMonthRange] = useState({ start: '2024-03', end: '2024-03' });
  const [listFilter, setListFilter] = useState<ListFilterType | null>(null);
  const [modalSearch, setModalSearch] = useState('');

  // --- Derived Data ---
  const baseFilteredDevices = useMemo(() => {
    return MOCK_DEVICES; // Already filtered by SCHOOL_NAME in mock generation
  }, []);

  const stats = useMemo(() => {
    const total = baseFilteredDevices.length;
    const used = baseFilteredDevices.filter(d => d.isUsed).length;
    const unused = total - used;
    const usageRate = total > 0 ? ((used / total) * 100).toFixed(1) : '0';
    const violating = baseFilteredDevices.filter(d => d.isViolating).length;

    return { total, used, unused, usageRate, violating };
  }, [baseFilteredDevices]);

  // Chart Data
  const deviceTypeData = [
    { name: 'iPad', value: Math.floor(stats.total * 0.8), color: '#3b82f6' },
    { name: 'Android', value: Math.floor(stats.total * 0.2), color: '#10b981' },
  ];

  const appCategoryData = [
    { name: '學習類', value: 50, color: '#3b82f6' },
    { name: '工具類', value: 20, color: '#10b981' },
    { name: '創造力', value: 15, color: '#8b5cf6' },
    { name: '娛樂', value: 10, color: '#f59e0b' },
    { name: '封鎖', value: 5, color: '#ef4444' },
  ];

  const modalDevices = useMemo(() => {
    if (!listFilter) return [];
    let list = baseFilteredDevices;
    if (listFilter === 'used') list = baseFilteredDevices.filter(d => d.isUsed);
    if (listFilter === 'unused') list = baseFilteredDevices.filter(d => !d.isUsed);
    if (listFilter === 'violating') list = baseFilteredDevices.filter(d => d.isViolating);

    if (modalSearch) {
      const search = modalSearch.toLowerCase();
      list = list.filter(d => 
        d.name.toLowerCase().includes(search) || 
        d.model.toLowerCase().includes(search) || 
        d.mdm.toLowerCase().includes(search) ||
        d.serial.toLowerCase().includes(search)
      );
    }
    return list;
  }, [baseFilteredDevices, listFilter, modalSearch]);

  const getModalTitle = () => {
    if (listFilter === 'used') return '使用設備清單';
    if (listFilter === 'unused') return '未使用設備清單';
    if (listFilter === 'violating') return '違反政策設備清單';
    return '設備明細清單';
  };

  const exportToExcel = () => {
    const listHeader = ['設備名稱', '設備序號', '設備型號', '指派學校', '目前 MDM', '使用時長', '最後連線時間'];
    const listData = modalDevices.map(d => [
      d.name,
      d.serial,
      `${d.model}\n${d.os}`,
      d.school,
      d.mdm,
      d.usageDuration,
      d.lastConnection
    ]);

    const finalData = [listHeader, ...listData];
    const ws = XLSX.utils.aoa_to_sheet(finalData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '設備清單');
    XLSX.writeFile(wb, `${getModalTitle()}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-2">
      {/* Header & Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 w-full md:w-auto">
            {/* School Info (Read-only for school view) */}
            <div className="w-full md:w-72">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">當前學校</label>
              <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold flex items-center">
                <School className="w-4 h-4 mr-2 text-blue-500" />
                {SCHOOL_NAME}
              </div>
            </div>

            {/* Month Range Filter */}
            <div className="w-full md:w-auto">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">篩選月份區間</label>
              <div className="flex items-center gap-2">
                <input 
                  type="month" 
                  value={monthRange.start}
                  onChange={(e) => setMonthRange(prev => ({ ...prev, start: e.target.value }))}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-slate-400">至</span>
                <input 
                  type="month" 
                  value={monthRange.end}
                  onChange={(e) => setMonthRange(prev => ({ ...prev, end: e.target.value }))}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="hidden xl:flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-tight">Jamf API Sync Active</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 ml-1 animate-pulse"></div>
          </div>
        </div>

        {/* Filter Summary Banner */}
        <div className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center justify-between shadow-lg shadow-blue-200">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">當前篩選期間</p>
              <h3 className="text-lg font-black">{monthRange.start} ~ {monthRange.end}</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">統計範圍</p>
            <h3 className="text-lg font-black">{SCHOOL_NAME}</h3>
          </div>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div 
          onClick={() => setListFilter('all')}
          className="p-6 rounded-xl shadow-sm border bg-white border-slate-200 hover:border-blue-300 transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Tablet className="w-16 h-16" />
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1">設備總數</p>
          <h3 className="text-4xl font-black">{stats.total}</h3>
          <p className="text-[10px] font-bold text-blue-600 mt-2 flex items-center">點擊查看清單 <TrendingUp className="w-3 h-3 ml-1" /></p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BarChart3 className="w-16 h-16" />
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1">使用率</p>
          <h3 className="text-4xl font-black text-blue-600">{stats.usageRate}%</h3>
          <div className="mt-4 w-full bg-slate-100 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
              style={{ width: `${stats.usageRate}%` }}
            ></div>
          </div>
        </div>

        <div 
          onClick={() => setListFilter('used')}
          className="p-6 rounded-xl shadow-sm border bg-white border-slate-200 hover:border-emerald-300 transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 className="w-16 h-16 text-emerald-500" />
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1">使用設備數</p>
          <h3 className="text-4xl font-black text-emerald-600">{stats.used}</h3>
          <p className="text-[10px] font-bold text-emerald-600 mt-2 flex items-center">點擊查看清單 <TrendingUp className="w-3 h-3 ml-1" /></p>
        </div>

        <div 
          onClick={() => setListFilter('unused')}
          className="p-6 rounded-xl shadow-sm border bg-white border-slate-200 hover:border-rose-300 transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <XCircle className="w-16 h-16 text-rose-500" />
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1">未使用設備數</p>
          <h3 className="text-4xl font-black text-rose-600">{stats.unused}</h3>
          <p className="text-[10px] font-bold text-rose-600 mt-2 flex items-center">點擊查看清單 <TrendingDown className="w-3 h-3 ml-1" /></p>
        </div>
      </div>

      {/* KPI Cards Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-500">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">使用時長</p>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-800 tabular-nums">{(stats.used * 120).toLocaleString()}</h3>
            <span className="text-sm font-bold text-slate-400">小時</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-500">
              <Smartphone className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">平均每日單機使用</p>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-800 tabular-nums">4.2</h3>
            <span className="text-sm font-bold text-slate-400">小時/台</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">(總使用時數 / 使用設備數 / 本月天數)</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        {/* Distribution Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Device Type Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center space-x-2 mb-6">
              <Tablet className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-bold text-slate-800">設備類型分佈</h3>
            </div>
            <div className="flex items-center h-64">
              <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 pl-4 space-y-4">
                {deviceTypeData.map((item, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm font-bold text-slate-700">{item.name}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-slate-800 tabular-nums">{item.value.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Devices</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* App Category Donut Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center space-x-2 mb-6">
              <LayoutGrid className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-bold text-slate-800">App 類別分佈</h3>
            </div>
            <div className="flex items-center h-64">
              <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={appCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {appCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `${value}%`}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 pl-4 space-y-2">
                {appCategoryData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-slate-600 font-medium">{item.name}</span>
                    </div>
                    <span className="text-slate-400 font-bold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Section */}
      <AnimatePresence>
        {listFilter && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Tablet className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800">{getModalTitle()}</h3>
                    <p className="text-xs text-slate-500">共 {modalDevices.length} 筆資料</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={exportToExcel}
                    className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm text-sm font-medium"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    匯出 Excel
                  </button>
                  <button 
                    onClick={() => {
                      setListFilter(null);
                      setModalSearch('');
                    }} 
                    className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Modal Search Bar */}
              <div className="p-4 bg-white border-b border-slate-100">
                <div className="relative max-w-md">
                  <input 
                    type="text" 
                    placeholder="搜尋設備名稱、序號、型號或 MDM..." 
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Modal Content - Table */}
              <div className="overflow-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">設備名稱</th>
                      <th className="px-6 py-4">設備序號</th>
                      <th className="px-6 py-4">設備型號</th>
                      <th className="px-6 py-4">指派學校</th>
                      <th className="px-6 py-4">目前 MDM</th>
                      <th className="px-6 py-4">使用時長</th>
                      <th className="px-6 py-4">最後連線時間</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {modalDevices.map((device) => (
                      <tr key={device.id} className="hover:bg-slate-50 transition-colors">
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
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <School className="w-3 h-3 mr-1" />
                            {device.school}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-slate-600">{device.mdm}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                          {device.usageDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {device.lastConnection}
                        </td>
                      </tr>
                    ))}
                    {modalDevices.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SchoolDashboard;
