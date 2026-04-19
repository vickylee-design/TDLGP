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
  Download,
  Calendar,
  LineChart as LineChartIcon
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
  Cell,
  LineChart,
  Line,
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
const SCHOOL_STRUCTURE = {
  '全市': [],
  '台南市全國小': ['復興國小', '忠義國小', '勝利國小', '大同國小', '新興國小'],
  '台南市全國中': ['安南國中', '永康國中', '新東國中', '崇明國中', '後甲國中']
};

const ALL_SCHOOLS = [
  ...SCHOOL_STRUCTURE['台南市全國小'],
  ...SCHOOL_STRUCTURE['台南市全國中']
];

const MOCK_DEVICES: DeviceData[] = Array.from({ length: 100 }).map((_, i) => ({
  id: `dev-${i}`,
  name: `EDU-iPad-${String(i + 1).padStart(2, '0')}`,
  serial: `ABC${1000 + i}XYZ`,
  model: i % 4 === 0 ? 'iPad (10th Gen)' : i % 4 === 1 ? 'iPad (9th Gen)' : i % 4 === 2 ? 'iPad Air (5th Gen)' : 'iPad Pro',
  os: 'iPadOS 17.2',
  school: ALL_SCHOOLS[i % ALL_SCHOOLS.length],
  mdm: i % 3 === 0 ? 'Jamf Pro' : 'Intune',
  usageDuration: `${Math.floor(Math.random() * 100) + 10}h ${Math.floor(Math.random() * 60)}m`,
  lastConnection: '2024-03-20 14:30',
  isUsed: Math.random() > 0.3,
  isViolating: Math.random() < 0.05
}));

const USAGE_CURVE_DATA = Array.from({ length: 30 }).map((_, i) => ({
  date: `03/${String(i + 1).padStart(2, '0')}`,
  duration: Math.floor(Math.random() * 500) + 200,
}));

const BureauDashboard: React.FC = () => {
  // --- State ---
  const [selectedSchool, setSelectedSchool] = useState('全市');
  const [isSchoolSelectOpen, setIsSchoolSelectOpen] = useState(false);
  const [schoolSearch, setSchoolSearch] = useState('');
  const [dateRange, setDateRange] = useState({ start: '2024-03-01', end: '2024-03-31' });
  const [listFilter, setListFilter] = useState<ListFilterType | null>(null);
  const [modalSearch, setModalSearch] = useState('');

  // --- Derived Data ---
  const baseFilteredDevices = useMemo(() => {
    return MOCK_DEVICES.filter(device => {
      if (selectedSchool === '全市') return true;
      if (selectedSchool === '台南市全國小') return SCHOOL_STRUCTURE['台南市全國小'].includes(device.school);
      if (selectedSchool === '台南市全國中') return SCHOOL_STRUCTURE['台南市全國中'].includes(device.school);
      return device.school === selectedSchool;
    });
  }, [selectedSchool]);

  const stats = useMemo(() => {
    const total = baseFilteredDevices.length;
    const used = baseFilteredDevices.filter(d => d.isUsed).length;
    const unused = total - used;
    const usageRate = total > 0 ? ((used / total) * 100).toFixed(1) : '0';
    const violating = baseFilteredDevices.filter(d => d.isViolating).length;

    return { total, used, unused, usageRate, violating };
  }, [baseFilteredDevices]);

  // Chart Data
  const deviceModelData = useMemo(() => {
    const counts: Record<string, number> = {};
    baseFilteredDevices.forEach(d => {
      counts[d.model] = (counts[d.model] || 0) + 1;
    });
    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];
    return Object.entries(counts).map(([name, value], i) => ({
      name,
      value,
      color: colors[i % colors.length]
    }));
  }, [baseFilteredDevices]);

  const appCategoryData = [
    { name: '學習類', value: 45, color: '#3b82f6' },
    { name: '工具類', value: 25, color: '#10b981' },
    { name: '創造力', value: 15, color: '#8b5cf6' },
    { name: '娛樂', value: 10, color: '#f59e0b' },
    { name: '封鎖', value: 5, color: '#ef4444' },
  ];

  const filteredSchoolOptions = useMemo(() => {
    const options: { label: string, isHeader?: boolean, category?: string }[] = [
      { label: '全市' },
      { label: '台南市全國小', isHeader: true },
      ...SCHOOL_STRUCTURE['台南市全國小'].map(s => ({ label: s, category: '台南市全國小' })),
      { label: '台南市全國中', isHeader: true },
      ...SCHOOL_STRUCTURE['台南市全國中'].map(s => ({ label: s, category: '台南市全國中' }))
    ];

    if (!schoolSearch) return options;
    return options.filter(opt => opt.label.toLowerCase().includes(schoolSearch.toLowerCase()));
  }, [schoolSearch]);

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
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">教育局端數據看板</h1>
          <p className="text-slate-500 font-medium">即時監控全市教育設備與政策落實狀況</p>
        </div>
        <div className="bg-white border-2 border-blue-600 px-6 py-3 rounded-2xl shadow-xl shadow-blue-100 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="p-2 bg-blue-50 rounded-xl">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1">數據最後統計時間</p>
            <p className="text-2xl font-black text-slate-800 leading-none">2024-03-20</p>
          </div>
        </div>
      </div>

      {/* Header & Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 w-full md:w-auto">
            {/* School Filter */}
            <div className="relative w-full md:w-72">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">選擇學校範圍</label>
              <button 
                onClick={() => setIsSchoolSelectOpen(!isSchoolSelectOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all text-slate-700 font-medium"
              >
                <div className="flex items-center">
                  <Search className="w-4 h-4 mr-2 text-slate-400" />
                  {selectedSchool}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isSchoolSelectOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSchoolSelectOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
                  <div className="p-2 border-b border-slate-100">
                    <input 
                      type="text"
                      placeholder="搜尋學校名稱..."
                      className="w-full px-3 py-2 text-sm bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={schoolSearch}
                      onChange={(e) => setSchoolSearch(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto p-1">
                    {filteredSchoolOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedSchool(opt.label);
                          setIsSchoolSelectOpen(false);
                          setSchoolSearch('');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          opt.isHeader ? 'font-black text-slate-800 bg-slate-50 cursor-pointer hover:bg-blue-50 hover:text-blue-600' : 
                          selectedSchool === opt.label 
                            ? 'bg-blue-50 text-blue-600 font-bold' 
                            : 'text-slate-600 hover:bg-slate-50 pl-6'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Date Range Filter */}
            <div className="w-full md:w-auto">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">篩選日期區間</label>
              <div className="flex items-center gap-2">
                <input 
                  type="date" 
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-slate-400">至</span>
                <input 
                  type="date" 
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
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
              <h3 className="text-lg font-black">{dateRange.start} ~ {dateRange.end}</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">統計範圍</p>
            <h3 className="text-lg font-black">{selectedSchool}</h3>
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
          <p className="text-[10px] font-bold text-blue-600 mt-2 flex items-center">點擊查看清單</p>
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
          <p className="text-[10px] font-bold text-emerald-600 mt-2 flex items-center">點擊查看清單</p>
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
          <p className="text-[10px] font-bold text-rose-600 mt-2 flex items-center">點擊查看清單</p>
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
        {/* Usage Curve Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center space-x-2 mb-6">
            <LineChartIcon className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-bold text-slate-800">使用曲線圖</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={USAGE_CURVE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  label={{ value: '使用時長 (分鐘)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#64748b', fontSize: 12 } }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="duration" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Device Model Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center space-x-2 mb-6">
              <Tablet className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-bold text-slate-800">設備型號分佈</h3>
            </div>
            <div className="flex items-center h-64">
              <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceModelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceModelData.map((entry, index) => (
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
                {deviceModelData.map((item, index) => (
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

export default BureauDashboard;
