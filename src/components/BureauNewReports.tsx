import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Search, 
  School, 
  Tablet, 
  Download, 
  RotateCcw,
  Filter,
  CheckCircle2,
  XCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';

// --- Types ---
type TimeType = 'yearMonth' | 'semester' | 'custom';
type ListFilterType = 'all' | 'used' | 'unused';

interface FilterState {
  timeType: TimeType;
  year: string;
  month: string;
  semester: string;
  startDate: string;
  endDate: string;
  schools: string[];
  serialNumber: string;
}

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
}

// --- Mock Data ---
const SCHOOL_OPTIONS = [
  '大安國小', '中山國小', '中正國小', '信義國小', '仁愛國小', 
  '和平國小', '成功國小', '忠孝國小', '博愛國小', '永春國小'
];

const SEMESTER_OPTIONS = [
  '113上學期', '113下學期', '114上學期', '114下學期'
];

const MOCK_DEVICES: DeviceData[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `dev-${i}`,
  name: `EDU-iPad-${String(i + 1).padStart(2, '0')}`,
  serial: `ABC${1000 + i}XYZ`,
  model: i % 2 === 0 ? 'iPad Air (5th Gen)' : 'iPad (9th Gen)',
  os: i % 2 === 0 ? 'iPadOS 17.2' : 'iPadOS 16.2',
  school: SCHOOL_OPTIONS[i % SCHOOL_OPTIONS.length],
  mdm: i % 3 === 0 ? 'Jamf Pro' : 'Intune',
  usageDuration: `${Math.floor(Math.random() * 100) + 10}h ${Math.floor(Math.random() * 60)}m`,
  lastConnection: '2024-03-20 14:30',
  isUsed: Math.random() > 0.3
}));

const BureauNewReports: React.FC = () => {
  // --- State ---
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [listFilter, setListFilter] = useState<ListFilterType>('all');
  
  const [filters, setFilters] = useState<FilterState>({
    timeType: 'yearMonth',
    year: '2024',
    month: '',
    semester: '113上學期',
    startDate: '',
    endDate: '',
    schools: [],
    serialNumber: ''
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterState>(filters);
  const [schoolSearch, setSchoolSearch] = useState('');

  // --- Derived Data ---
  const baseFilteredDevices = useMemo(() => {
    return MOCK_DEVICES.filter(device => {
      const schoolMatch = appliedFilters.schools.length === 0 || appliedFilters.schools.includes(device.school);
      const serialMatch = !appliedFilters.serialNumber || device.serial.toLowerCase().includes(appliedFilters.serialNumber.toLowerCase());
      return schoolMatch && serialMatch;
    });
  }, [appliedFilters]);

  const filteredDevices = useMemo(() => {
    if (listFilter === 'used') return baseFilteredDevices.filter(d => d.isUsed);
    if (listFilter === 'unused') return baseFilteredDevices.filter(d => !d.isUsed);
    return baseFilteredDevices;
  }, [baseFilteredDevices, listFilter]);

  const stats = useMemo(() => {
    const total = baseFilteredDevices.length;
    const used = baseFilteredDevices.filter(d => d.isUsed).length;
    const unused = total - used;
    const usageRate = total > 0 ? ((used / total) * 100).toFixed(1) : '0';

    // School breakdown
    const schoolBreakdown = appliedFilters.schools.map(schoolName => {
      const schoolDevices = baseFilteredDevices.filter(d => d.school === schoolName);
      return {
        name: schoolName,
        count: schoolDevices.length
      };
    });

    return { total, used, unused, usageRate, schoolBreakdown };
  }, [baseFilteredDevices, appliedFilters.schools]);

  // --- Handlers ---
  const handleSearch = () => {
    setAppliedFilters({ ...filters });
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      timeType: 'yearMonth',
      year: '2024',
      month: '',
      semester: '113上學期',
      startDate: '',
      endDate: '',
      schools: [],
      serialNumber: ''
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
  };

  const toggleSchool = (school: string) => {
    setFilters(prev => ({
      ...prev,
      schools: prev.schools.includes(school)
        ? prev.schools.filter(s => s !== school)
        : [...prev.schools, school]
    }));
  };

  const exportToExcel = () => {
    // 1. Prepare Card Data
    const cardData = [
      ['報表統計摘要'],
      ['設備總數', stats.total],
      ['使用率', `${stats.usageRate}%`],
      ['使用設備數', stats.used],
      ['未使用設備數', stats.unused],
      [''],
      ['各校分佈'],
      ...stats.schoolBreakdown.map(s => [s.name, s.count]),
      ['']
    ];

    // 2. Prepare List Data
    const listHeader = ['設備名稱', '設備序號', '設備型號', '指派學校', '目前 MDM', '使用時長', '最後連線時間'];
    const listData = filteredDevices.map(d => [
      d.name,
      d.serial,
      `${d.model}\n${d.os}`,
      d.school,
      d.mdm,
      d.usageDuration,
      d.lastConnection
    ]);

    // 3. Combine
    const finalData = [...cardData, listHeader, ...listData];

    // 4. Create Workbook
    const ws = XLSX.utils.aoa_to_sheet(finalData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '報表資料');

    // 5. Download
    XLSX.writeFile(wb, `報表_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const getFilterSummary = () => {
    const parts = [];
    
    // Time
    if (appliedFilters.timeType === 'yearMonth') {
      parts.push(`${appliedFilters.year}年${appliedFilters.month ? appliedFilters.month + '月' : '(全年)'}`);
    } else if (appliedFilters.timeType === 'semester') {
      parts.push(appliedFilters.semester);
    } else {
      parts.push(`${appliedFilters.startDate || '未設定'} ~ ${appliedFilters.endDate || '未設定'}`);
    }

    // Schools
    if (appliedFilters.schools.length > 0) {
      parts.push(`學校: ${appliedFilters.schools.join(', ')}`);
    } else {
      parts.push('學校: 全區');
    }

    // Serial
    if (appliedFilters.serialNumber) {
      parts.push(`序號: ${appliedFilters.serialNumber}`);
    }

    return parts.join(' | ');
  };

  const getTableTitle = () => {
    if (listFilter === 'used') return '使用設備清單';
    if (listFilter === 'unused') return '未使用設備清單';
    return '設備明細清單';
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-2">
      {/* Page Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">報表 (新)</h2>
            <p className="text-slate-500 text-sm">多維度設備使用狀況分析與數據導出</p>
          </div>
        </div>
        <button 
          onClick={exportToExcel}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4 mr-2" />
          匯出 Excel
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div 
          className="p-4 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <div className="flex items-center space-x-2 text-slate-800 font-bold">
            <Filter className="w-5 h-5 text-blue-600" />
            <span>篩選條件設定</span>
          </div>
          <div className="flex items-center space-x-4">
            {!isFilterOpen && (
              <span className="text-xs text-slate-400 font-medium hidden md:block">
                {getFilterSummary()}
              </span>
            )}
            {isFilterOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </div>
        </div>

        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Time Filter */}
                  <div className="space-y-4 border-r border-slate-100 pr-8">
                    <label className="text-sm font-bold text-slate-700 block">時間範圍</label>
                    <div className="space-y-4">
                      {/* Year/Month */}
                      <div className="flex items-start space-x-3">
                        <input 
                          type="radio" 
                          name="timeType" 
                          checked={filters.timeType === 'yearMonth'} 
                          onChange={() => setFilters(f => ({ ...f, timeType: 'yearMonth' }))}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-2">
                          <span className="text-sm font-medium">年份 / 月份</span>
                          <div className="flex space-x-2">
                            <select 
                              disabled={filters.timeType !== 'yearMonth'}
                              value={filters.year}
                              onChange={(e) => setFilters(f => ({ ...f, year: e.target.value }))}
                              className="flex-1 p-2 border border-slate-200 rounded-md text-sm bg-slate-50 disabled:opacity-50"
                            >
                              <option value="2024">2024年</option>
                              <option value="2025">2025年</option>
                              <option value="2026">2026年</option>
                            </select>
                            <select 
                              disabled={filters.timeType !== 'yearMonth'}
                              value={filters.month}
                              onChange={(e) => setFilters(f => ({ ...f, month: e.target.value }))}
                              className="flex-1 p-2 border border-slate-200 rounded-md text-sm bg-slate-50 disabled:opacity-50"
                            >
                              <option value="">全年</option>
                              {Array.from({ length: 12 }).map((_, i) => (
                                <option key={i + 1} value={String(i + 1)}>{i + 1}月</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Semester */}
                      <div className="flex items-start space-x-3">
                        <input 
                          type="radio" 
                          name="timeType" 
                          checked={filters.timeType === 'semester'} 
                          onChange={() => setFilters(f => ({ ...f, timeType: 'semester' }))}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-2">
                          <span className="text-sm font-medium">學期</span>
                          <select 
                            disabled={filters.timeType !== 'semester'}
                            value={filters.semester}
                            onChange={(e) => setFilters(f => ({ ...f, semester: e.target.value }))}
                            className="w-full p-2 border border-slate-200 rounded-md text-sm bg-slate-50 disabled:opacity-50"
                          >
                            {SEMESTER_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* Custom */}
                      <div className="flex items-start space-x-3">
                        <input 
                          type="radio" 
                          name="timeType" 
                          checked={filters.timeType === 'custom'} 
                          onChange={() => setFilters(f => ({ ...f, timeType: 'custom' }))}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-2">
                          <span className="text-sm font-medium">自定義時間</span>
                          <div className="flex items-center space-x-2">
                            <input 
                              type="date" 
                              disabled={filters.timeType !== 'custom'}
                              value={filters.startDate}
                              onChange={(e) => setFilters(f => ({ ...f, startDate: e.target.value }))}
                              className="flex-1 p-2 border border-slate-200 rounded-md text-sm bg-slate-50 disabled:opacity-50"
                            />
                            <span className="text-slate-400">~</span>
                            <input 
                              type="date" 
                              disabled={filters.timeType !== 'custom'}
                              value={filters.endDate}
                              onChange={(e) => setFilters(f => ({ ...f, endDate: e.target.value }))}
                              className="flex-1 p-2 border border-slate-200 rounded-md text-sm bg-slate-50 disabled:opacity-50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* School Filter - New UI */}
                  <div className="space-y-4 border-r border-slate-100 pr-8">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-slate-700">學校選擇</label>
                      <button 
                        onClick={() => setFilters(f => ({ ...f, schools: [] }))}
                        className="text-xs text-blue-600 hover:underline font-medium"
                      >
                        清除全部
                      </button>
                    </div>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="搜尋學校名稱..." 
                        value={schoolSearch}
                        onChange={(e) => setSchoolSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
                      {SCHOOL_OPTIONS.filter(s => s.includes(schoolSearch)).map(school => {
                        const isSelected = filters.schools.includes(school);
                        return (
                          <button 
                            key={school}
                            onClick={() => toggleSchool(school)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center space-x-1 border ${
                              isSelected 
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                            <span>{school}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Device Serial Filter */}
                  <div className="space-y-4 flex flex-col">
                    <div className="flex-1 space-y-4">
                      <label className="text-sm font-bold text-slate-700 block">設備序號搜尋</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="輸入設備序號..." 
                          value={filters.serialNumber}
                          onChange={(e) => setFilters(f => ({ ...f, serialNumber: e.target.value }))}
                          className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <Tablet className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 pt-4">
                      <button 
                        onClick={handleReset}
                        className="flex-1 flex items-center justify-center px-3 py-1.5 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                        重新設定
                      </button>
                      <button 
                        onClick={handleSearch}
                        className="flex-[1.5] flex items-center justify-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                      >
                        <Search className="w-3.5 h-3.5 mr-1.5" />
                        搜尋確認
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filter Summary Display */}
      <div className="bg-blue-600 text-white p-4 rounded-xl shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-blue-100 font-bold uppercase tracking-wider">目前篩選條件</p>
            <p className="text-lg font-bold">{getFilterSummary()}</p>
          </div>
        </div>
        <div className="hidden md:block px-4 py-1 bg-white/10 rounded-full text-xs font-medium border border-white/20">
          數據更新時間: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Data Cards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div 
          onClick={() => setListFilter('all')}
          className={`p-6 rounded-xl shadow-sm border transition-all cursor-pointer relative overflow-hidden group ${
            listFilter === 'all' ? 'bg-blue-50 text-blue-900 border-blue-500 ring-2 ring-blue-500 ring-offset-2' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Tablet className={`w-16 h-16 ${listFilter === 'all' ? 'text-blue-600' : ''}`} />
          </div>
          <p className={`text-sm font-bold mb-1 ${listFilter === 'all' ? 'text-blue-600' : 'text-slate-500'}`}>設備總數</p>
          <h3 className="text-4xl font-black">{stats.total}</h3>
          {stats.schoolBreakdown.length > 1 && (
            <div className={`mt-4 pt-4 border-t space-y-1 ${listFilter === 'all' ? 'border-blue-200' : 'border-slate-100'}`}>
              {stats.schoolBreakdown.map(s => (
                <div key={s.name} className={`flex justify-between text-xs ${listFilter === 'all' ? 'text-blue-700' : 'text-slate-500'}`}>
                  <span>{s.name}</span>
                  <span className="font-bold">{s.count}</span>
                </div>
              ))}
            </div>
          )}
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
          className={`p-6 rounded-xl shadow-sm border transition-all cursor-pointer relative overflow-hidden group ${
            listFilter === 'used' ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500 ring-offset-2' : 'bg-white border-slate-200 hover:border-emerald-200'
          }`}
        >
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 className="w-16 h-16 text-emerald-500" />
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1">使用設備數</p>
          <h3 className="text-4xl font-black text-emerald-600">{stats.used}</h3>
          <p className="text-xs text-slate-400 mt-2">正常運作中</p>
        </div>

        <div 
          onClick={() => setListFilter('unused')}
          className={`p-6 rounded-xl shadow-sm border transition-all cursor-pointer relative overflow-hidden group ${
            listFilter === 'unused' ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500 ring-offset-2' : 'bg-white border-slate-200 hover:border-rose-200'
          }`}
        >
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <XCircle className="w-16 h-16 text-rose-500" />
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1">未使用設備數</p>
          <h3 className="text-4xl font-black text-rose-600">{stats.unused}</h3>
          <p className="text-xs text-slate-400 mt-2">包含閒置或維修中</p>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">{getTableTitle()}</h3>
          <span className="text-sm text-slate-500">共 {filteredDevices.length} 筆資料</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
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
              {filteredDevices.map((device) => (
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
              {filteredDevices.length === 0 && (
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
      </div>
    </div>
  );
};

export default BureauNewReports;
