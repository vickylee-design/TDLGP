import React, { useState } from 'react';
import { 
  School,
  Search,
  Filter,
  ChevronRight,
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  Monitor,
  Clock,
  Users,
  X,
  TrendingUp,
  Smartphone,
  Layout,
  ChevronDown,
  FileText,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'sonner';

interface SchoolData {
  id: string;
  name: string;
  deviceCount: number;
  usedDeviceCount: number;
  offlineAlerts: number;
  avgUsageTime: number; // in hours (for the list view)
  violationRate: number; // percentage
  avgDailyUsage: number; // in minutes
  todayUsage: number; // in minutes
  weekUsage: number; // in minutes
  monthUsage: number; // in minutes
  usageTrend: { time: string; value: number }[];
  modelDistribution: { name: string; value: number; color: string }[];
  mdmDistribution: { name: string; value: number; color: string }[];
  topApps: { name: string; count: number }[];
}

const mockSchools: SchoolData[] = [
  {
    id: '1',
    name: '永康國小',
    deviceCount: 1250,
    usedDeviceCount: 1180,
    offlineAlerts: 12,
    avgUsageTime: 3.5,
    violationRate: 1.2,
    avgDailyUsage: 210,
    todayUsage: 185,
    weekUsage: 1450,
    monthUsage: 5800,
    usageTrend: [
      { time: '08:00前', value: 15 },
      { time: '08:00', value: 20 },
      { time: '09:00', value: 45 },
      { time: '10:00', value: 85 },
      { time: '11:00', value: 60 },
      { time: '12:00', value: 30 },
      { time: '13:00', value: 40 },
      { time: '14:00', value: 92 },
      { time: '15:00', value: 75 },
      { time: '16:00', value: 35 },
      { time: '17:00', value: 15 },
      { time: '18:00', value: 5 },
      { time: '18:00後', value: 2 }
    ],
    modelDistribution: [
      { name: 'iPad (9th Gen)', value: 800, color: '#3b82f6' },
      { name: 'iPad (10th Gen)', value: 350, color: '#60a5fa' },
      { name: 'iPad Air 5', value: 100, color: '#93c5fd' }
    ],
    mdmDistribution: [
      { name: 'Jamf Pro', value: 1100, color: '#8b5cf6' },
      { name: 'Intune', value: 150, color: '#a78bfa' }
    ],
    topApps: [
      { name: 'LoiLoNote', count: 850 },
      { name: 'Pagamo', count: 720 },
      { name: 'Quizizz', count: 640 },
      { name: 'Nearpod', count: 510 },
      { name: 'Canva', count: 420 }
    ]
  },
  {
    id: '2',
    name: '復興國小',
    deviceCount: 980,
    usedDeviceCount: 750,
    offlineAlerts: 45,
    avgUsageTime: 2.1,
    violationRate: 3.8,
    avgDailyUsage: 126,
    todayUsage: 110,
    weekUsage: 880,
    monthUsage: 3500,
    usageTrend: [
      { time: '08:00前', value: 10 },
      { time: '08:00', value: 15 },
      { time: '09:00', value: 30 },
      { time: '10:00', value: 42 },
      { time: '11:00', value: 35 },
      { time: '12:00', value: 20 },
      { time: '13:00', value: 25 },
      { time: '14:00', value: 45 },
      { time: '15:00', value: 38 },
      { time: '16:00', value: 15 },
      { time: '17:00', value: 8 },
      { time: '18:00', value: 3 },
      { time: '18:00後', value: 1 }
    ],
    modelDistribution: [
      { name: 'iPad (9th Gen)', value: 600, color: '#3b82f6' },
      { name: 'iPad (8th Gen)', value: 380, color: '#f87171' }
    ],
    mdmDistribution: [
      { name: 'Jamf Pro', value: 980, color: '#8b5cf6' }
    ],
    topApps: [
      { name: 'Youtube', count: 450 },
      { name: 'Pagamo', count: 320 },
      { name: 'LoiLoNote', count: 280 },
      { name: 'Roblox', count: 150 },
      { name: 'Safari', count: 120 }
    ]
  },
  {
    id: '3',
    name: '安平國小',
    deviceCount: 750,
    usedDeviceCount: 720,
    offlineAlerts: 5,
    avgUsageTime: 4.2,
    violationRate: 0.5,
    avgDailyUsage: 252,
    todayUsage: 230,
    weekUsage: 1750,
    monthUsage: 7200,
    usageTrend: [
      { time: '08:00前', value: 18 },
      { time: '08:00', value: 25 },
      { time: '09:00', value: 55 },
      { time: '10:00', value: 95 },
      { time: '11:00', value: 70 },
      { time: '12:00', value: 40 },
      { time: '13:00', value: 50 },
      { time: '14:00', value: 105 },
      { time: '15:00', value: 85 },
      { time: '16:00', value: 45 },
      { time: '17:00', value: 20 },
      { time: '18:00', value: 8 },
      { time: '18:00後', value: 3 }
    ],
    modelDistribution: [
      { name: 'iPad (10th Gen)', value: 500, color: '#60a5fa' },
      { name: 'iPad Air 5', value: 250, color: '#93c5fd' }
    ],
    mdmDistribution: [
      { name: 'Jamf Pro', value: 400, color: '#8b5cf6' },
      { name: 'Intune', value: 350, color: '#a78bfa' }
    ],
    topApps: [
      { name: 'LoiLoNote', count: 690 },
      { name: 'Quizizz', count: 610 },
      { name: 'Canva', count: 580 },
      { name: 'Keynote', count: 420 },
      { name: 'Swift Playgrounds', count: 310 }
    ]
  },
  {
    id: '4',
    name: '海東國小',
    deviceCount: 1100,
    usedDeviceCount: 950,
    offlineAlerts: 28,
    avgUsageTime: 2.8,
    violationRate: 1.5,
    avgDailyUsage: 168,
    todayUsage: 150,
    weekUsage: 1150,
    monthUsage: 4600,
    usageTrend: [
      { time: '08:00前', value: 12 },
      { time: '08:00', value: 18 },
      { time: '09:00', value: 40 },
      { time: '10:00', value: 72 },
      { time: '11:00', value: 55 },
      { time: '12:00', value: 30 },
      { time: '13:00', value: 35 },
      { time: '14:00', value: 75 },
      { time: '15:00', value: 65 },
      { time: '16:00', value: 30 },
      { time: '17:00', value: 12 },
      { time: '18:00', value: 4 },
      { time: '18:00後', value: 2 }
    ],
    modelDistribution: [
      { name: 'iPad (9th Gen)', value: 900, color: '#3b82f6' },
      { name: 'iPad (10th Gen)', value: 200, color: '#60a5fa' }
    ],
    mdmDistribution: [
      { name: 'Jamf Pro', value: 1100, color: '#8b5cf6' }
    ],
    topApps: [
      { name: 'Pagamo', count: 810 },
      { name: 'LoiLoNote', count: 740 },
      { name: 'Quizizz', count: 520 },
      { name: 'Nearpod', count: 480 },
      { name: 'Classroom', count: 320 }
    ]
  }
];

const BureauSchoolManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<SchoolData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [startMonth, setStartMonth] = useState('2026-01');
  const [endMonth, setEndMonth] = useState('2026-04');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Simulated dynamic data based on month range
  const getDynamicValue = (baseValue: number) => {
    const startNum = parseInt(startMonth.split('-')[1]);
    const endNum = parseInt(endMonth.split('-')[1]);
    const diff = Math.max(1, endNum - startNum + 1);
    return Math.floor(baseValue * (0.8 + (diff % 5) * 0.1));
  };

  const handleSyncData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('數據同步完成', {
        description: '已更新各校最新設備使用數據。',
        duration: 3000,
      });
    }, 1500);
  };

  const handleExportReport = () => {
    toast.success('學校管理報表匯出中', {
      description: '報表正在產生成 Excel 格式，請稍候...',
      duration: 3000,
    });
  };

  const filteredSchools = mockSchools.filter(school => 
    school.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSchools = 274;
  const totalDevices = mockSchools.reduce((acc, s) => acc + s.deviceCount, 0) * 60; // Scaling for demo
  const totalOffline = mockSchools.reduce((acc, s) => acc + s.offlineAlerts, 0) * 45; // Scaling for demo
  const avgUsageRate = 82.5;

  const openDetails = (school: SchoolData) => {
    setSelectedSchool(school);
    setIsSidebarOpen(true);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-20">
      <Toaster position="top-center" expand={true} richColors />
      
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <School className="w-7 h-7 mr-3 text-blue-600" />
            學校管理中心
          </h2>
          <p className="text-slate-500 text-sm mt-1">監控全市各校設備使用率與資源分配差異，分析數位學習成效。</p>
        </div>
        
        <button 
          onClick={handleSyncData}
          disabled={isSyncing}
          className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg ${
            isSyncing 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100'
          }`}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? '同步中...' : '同步數據'}
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">學校總數</p>
            <h3 className="text-3xl font-black text-slate-800">{totalSchools} <span className="text-sm font-normal text-slate-400">所</span></h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <School className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">設備總數</p>
            <h3 className="text-3xl font-black text-slate-800">{totalDevices.toLocaleString()} <span className="text-sm font-normal text-slate-400">台</span></h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Smartphone className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">未使用設備數</p>
            <h3 className="text-3xl font-black text-rose-600">{totalOffline.toLocaleString()} <span className="text-sm font-normal text-slate-400">台</span></h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">平均使用率</p>
            <h3 className="text-3xl font-black text-emerald-600">{avgUsageRate}%</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 flex-1">
            <div className="relative w-full md:w-80">
              <input 
                type="text" 
                placeholder="搜尋學校名稱..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3" />
            </div>
          </div>
          
          <button 
            onClick={handleExportReport}
            className="flex items-center px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
          >
            <FileText className="w-4 h-4 mr-2" />
            匯出報表
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-8 py-5">學校名稱</th>
                <th className="px-6 py-5">設備總數</th>
                <th className="px-6 py-5">使用設備數</th>
                <th className="px-6 py-5">使用率</th>
                <th className="px-6 py-5">未使用設備數</th>
                <th className="px-8 py-5 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSchools.map((school) => (
                <tr key={school.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mr-4 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        <School className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-800">{school.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center text-slate-700 font-medium">
                      <Smartphone className="w-4 h-4 mr-2 text-slate-400" />
                      {school.deviceCount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center text-slate-700 font-medium">
                      <Monitor className="w-4 h-4 mr-2 text-slate-400" />
                      {school.usedDeviceCount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="w-full max-w-[120px]">
                      <div className="flex justify-between text-[10px] mb-1 font-bold">
                        <span className="text-blue-600">{Math.round((school.usedDeviceCount / school.deviceCount) * 100)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(school.usedDeviceCount / school.deviceCount) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      school.offlineAlerts > 30 ? 'bg-rose-100 text-rose-700' : 
                      school.offlineAlerts > 10 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {school.offlineAlerts} 台
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => openDetails(school)}
                      className="inline-flex items-center px-4 py-2 bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white rounded-xl text-sm font-bold transition-all"
                    >
                      詳細資訊
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Sidebar / Popup Overlay */}
      {isSidebarOpen && selectedSchool && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          
          {/* Sidebar Content */}
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mr-4 shadow-lg shadow-blue-200">
                  <School className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{selectedSchool.name}</h3>
                  <p className="text-sm text-slate-500">學校表現詳細分析報告</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Sidebar Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Month Filter */}
              <div className="flex flex-col space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center text-sm font-bold text-slate-700">
                  <Clock className="w-4 h-4 mr-2 text-blue-500" />
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

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <div className="flex items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                    <Smartphone className="w-4 h-4 mr-2" /> 設備總數
                  </div>
                  <div className="text-2xl font-black text-slate-800">{selectedSchool.deviceCount.toLocaleString()} <span className="text-sm font-normal text-slate-400">台</span></div>
                </div>
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                  <div className="flex items-center text-blue-600 text-xs font-bold uppercase tracking-wider mb-2 leading-tight">
                    <Monitor className="w-4 h-4 mr-2" /> 使用設備數
                  </div>
                  <div className="text-2xl font-black text-blue-700">{selectedSchool.usedDeviceCount.toLocaleString()} <span className="text-sm font-normal text-blue-400">台</span></div>
                </div>
                <div className="bg-rose-50 p-5 rounded-xl border border-rose-100">
                  <div className="text-rose-600 text-xs font-bold uppercase tracking-wider mb-2 leading-tight">
                    未使用設備數
                  </div>
                  <div className="text-2xl font-black text-rose-700">{selectedSchool.offlineAlerts} <span className="text-sm font-normal text-rose-400">台</span></div>
                </div>
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                  <div className="flex items-center text-blue-600 text-xs font-bold uppercase tracking-wider mb-2 leading-tight">
                    <TrendingUp className="w-4 h-4 mr-2" /> 使用率
                  </div>
                  <div className="text-2xl font-black text-blue-700">{Math.round((selectedSchool.usedDeviceCount / selectedSchool.deviceCount) * 100)}%</div>
                </div>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <div className="flex items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2 leading-tight">
                    <Clock className="w-4 h-4 mr-2" /> 使用時長
                  </div>
                  <div className="text-2xl font-black text-slate-800">{getDynamicValue(selectedSchool.monthUsage)} <span className="text-sm font-normal text-slate-400">分鐘</span></div>
                </div>
              </div>

              {/* Usage Curve Chart */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-bold text-slate-800 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                    使用曲線圖
                  </h4>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <div className="w-3 h-0.5 bg-blue-500 mr-2"></div> 平均使用分鐘數
                    </div>
                  </div>
                </div>
                <div className="h-72 bg-white rounded-2xl border border-slate-100 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedSchool.usageTrend.map(t => ({ ...t, value: getDynamicValue(t.value) }))}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="time" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 10 }} 
                      />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} label={{ value: '平均使用分鐘數', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        name="平均使用分鐘數"
                        stroke="#3b82f6" 
                        strokeWidth={4} 
                        dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Distributions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Model Pie Chart */}
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                    <Layout className="w-5 h-5 mr-2 text-blue-500" />
                    設備型號分布
                  </h4>
                  <div className="h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={selectedSchool.modelDistribution}
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {selectedSchool.modelDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xl font-bold text-slate-800">{selectedSchool.deviceCount}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Total</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {selectedSchool.modelDistribution.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                          <span className="text-slate-600">{item.name}</span>
                        </div>
                        <span className="font-bold text-slate-800">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MDM Pie Chart */}
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                    <ShieldCheck className="w-5 h-5 mr-2 text-purple-500" />
                    MDM 分布
                  </h4>
                  <div className="h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={selectedSchool.mdmDistribution}
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {selectedSchool.mdmDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xl font-bold text-slate-800">{selectedSchool.deviceCount}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Total</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {selectedSchool.mdmDistribution.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                          <span className="text-slate-600">{item.name}</span>
                        </div>
                        <span className="font-bold text-slate-800">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BureauSchoolManagement;
