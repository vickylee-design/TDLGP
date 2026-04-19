import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  ArrowRightLeft, 
  RefreshCcw, 
  Trash2, 
  X, 
  Download, 
  Upload, 
  Filter, 
  School,
  AlertCircle, 
  CheckCircle2, 
  Check,
  Info,
  Calendar,
  History,
  Tablet,
  Smartphone,
  ChevronDown,
  FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';
import { AssetMaster, AssetStatus, AssetHistory } from '../types';
import { toast } from 'sonner';

// --- Hardcoded Data for Logic Simulation ---
const SCHOOL_STRUCTURE = {
  '全市': [],
  '台南市全國小': ['復興國小', '忠義國小', '勝利國小', '大同國小', '新興國小'],
  '台南市全國中': ['安南國中', '永康國中', '新東國中', '崇明國中', '後甲國中']
};

const ALL_SCHOOLS_LIST = [
  ...SCHOOL_STRUCTURE['台南市全國小'],
  ...SCHOOL_STRUCTURE['台南市全國中']
];

const PROJECT_OPTIONS = ['生生有平板', '前瞻計畫', '特別專案'];

const INITIAL_ASSETS: AssetMaster[] = [
  {
    name: 'EDU-iPad-02',
    serial: 'DLX0001XYZ',
    model: 'iPad (第10代)',
    assignedSchool: '復興國小',
    schoolCode: '3001',
    osVersion: 'iPadOS 17.2',
    storageTotal: '64GB',
    storageRemaining: '42GB',
    battery: 88,
    lastConnection: '2024-03-20 14:30',
    arrivalDate: '2022-09-01',
    warrantyDate: '2025-08-31',
    status: AssetStatus.NORMAL,
    project: '生生有平板',
    mdmReportedSchoolId: '3001',
    usageHoursInherited: 0,
    currentUsageHours: 450,
    history: [
      { date: '2022-09-01', action: '入庫', description: '初始入庫並指派至復興國小', operator: '系統管理員' }
    ]
  },
  {
    name: 'EDU-iPad-05',
    serial: 'DLX0002XYZ',
    model: 'iPad (第9代)',
    assignedSchool: '忠義國小',
    schoolCode: '3002',
    osVersion: 'iPadOS 17.1',
    storageTotal: '64GB',
    storageRemaining: '55GB',
    battery: 95,
    lastConnection: '2024-03-19 10:15',
    arrivalDate: '2022-09-01',
    warrantyDate: '2025-08-31',
    status: AssetStatus.NORMAL,
    project: '前瞻計畫',
    mdmReportedSchoolId: '3003', // MISMATCH!
    usageHoursInherited: 0,
    currentUsageHours: 120,
    history: [
      { date: '2022-09-01', action: '入庫', description: '初始入庫', operator: '系統管理員' }
    ]
  },
  {
    name: 'EDU-Air-01',
    serial: 'AIR5001ABC',
    model: 'iPad Air (5th Gen)',
    assignedSchool: '勝利國小',
    schoolCode: '3003',
    osVersion: 'iPadOS 17.2',
    storageTotal: '256GB',
    storageRemaining: '180GB',
    battery: 92,
    lastConnection: '2024-03-20 15:00',
    arrivalDate: '2023-05-15',
    warrantyDate: '2026-05-14',
    status: AssetStatus.NORMAL,
    project: '生生有平板',
    mdmReportedSchoolId: '3003',
    usageHoursInherited: 500, // Inherited from a scrapped device
    currentUsageHours: 230,
    history: [
      { date: '2023-05-15', action: '入庫', description: '初始入庫', operator: '系統管理員' },
      { date: '2023-11-20', action: '汰換', description: '繼承原 DLX9999XYZ 使用數據', operator: '系統管理員' }
    ]
  },
];

const BureauDeviceManagementNew: React.FC = () => {
  const [assets, setAssets] = useState<AssetMaster[]>(INITIAL_ASSETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AssetStatus | 'ALL'>('ALL');
  const [projectFilter, setProjectFilter] = useState<string>('ALL');
  const [selectedSchool, setSelectedSchool] = useState('全部學校');
  const [isSchoolSelectOpen, setIsSchoolSelectOpen] = useState(false);
  const [schoolSearch, setSchoolSearch] = useState('');
  
  // Modals state
  const [selectedAsset, setSelectedAsset] = useState<AssetMaster | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showReplacmentModal, setShowReplacmentModal] = useState(false);
  const [showDecommissionModal, setShowDecommissionModal] = useState(false);
  
  // Add Asset Form State
  const [newItem, setNewItem] = useState({
    serial: '',
    name: '',
    model: '',
    arrivalDate: new Date().toISOString().split('T')[0],
    warrantyDate: '',
    project: '生生有平板',
    school: ALL_SCHOOLS_LIST[0]
  });
  const [isAddSchoolSelectOpen, setIsAddSchoolSelectOpen] = useState(false);
  const [addSchoolSearch, setAddSchoolSearch] = useState('');

  // Selected IDs for batch
  const [targetAsset, setTargetAsset] = useState<AssetMaster | null>(null);

  // Administrative Actions State
  const [transferSchoolId, setTransferSchoolId] = useState('');
  const [transferDocNo, setTransferDocNo] = useState('');
  const [transferRemark, setTransferRemark] = useState('');
  const [asmConfirmed, setAsmConfirmed] = useState(false);

  const [replacementNewSN, setReplacementNewSN] = useState('');
  const [replacementInherit, setReplacementInherit] = useState(true);

  // Filtered School Options
  const filteredSchoolOptions = useMemo(() => {
    const options: { label: string, isHeader?: boolean }[] = [
      { label: '全部學校' },
      { label: '台南市全國小', isHeader: true },
      ...SCHOOL_STRUCTURE['台南市全國小'].map(s => ({ label: s })),
      { label: '台南市全國中', isHeader: true },
      ...SCHOOL_STRUCTURE['台南市全國中'].map(s => ({ label: s }))
    ];
    if (!schoolSearch) return options;
    return options.filter(opt => opt.label.toLowerCase().includes(schoolSearch.toLowerCase()));
  }, [schoolSearch]);

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = 
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.model.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || asset.status === statusFilter;
      const matchesProject = projectFilter === 'ALL' || asset.project === projectFilter;
      
      let matchesSchool = selectedSchool === '全部學校';
      if (!matchesSchool) {
        if (selectedSchool === '台南市全國小') {
          matchesSchool = SCHOOL_STRUCTURE['台南市全國小'].includes(asset.assignedSchool);
        } else if (selectedSchool === '台南市全國中') {
          matchesSchool = SCHOOL_STRUCTURE['台南市全國中'].includes(asset.assignedSchool);
        } else {
          matchesSchool = asset.assignedSchool === selectedSchool;
        }
      }
      
      return matchesSearch && matchesStatus && matchesProject && matchesSchool;
    });
  }, [assets, searchQuery, statusFilter, projectFilter, selectedSchool]);

  // Filtered School Options for Add Modal
  const filteredAddSchoolOptions = useMemo(() => {
    const options = ALL_SCHOOLS_LIST;
    if (!addSchoolSearch) return options;
    return options.filter(s => s.toLowerCase().includes(addSchoolSearch.toLowerCase()));
  }, [addSchoolSearch]);

  // Actions
  const handleAddAsset = () => {
    if (!newItem.serial || !newItem.name) return;
    
    const asset: AssetMaster = {
      ...newItem,
      assignedSchool: newItem.school,
      schoolCode: 'MOCK', // In real app, look up from school list
      osVersion: 'iPadOS 17.0',
      storageTotal: '64GB',
      storageRemaining: '64GB',
      battery: 100,
      lastConnection: '-',
      status: AssetStatus.NORMAL,
      usageHoursInherited: 0,
      currentUsageHours: 0,
      history: [{
        date: new Date().toISOString().split('T')[0],
        action: '入庫',
        description: `手動新增入庫並指派至 ${newItem.school}`,
        operator: '目前登入者'
      }]
    };

    setAssets([asset, ...assets]);
    toast.success('設備新增成功');
    setShowAddModal(false);
    resetNewItem();
  };

  const handleTransfer = () => {
    if (!targetAsset || !transferSchoolId || !asmConfirmed) return;
    
    const targetSchoolName = transferSchoolId; // Simplified for this dropdown

    const newHistory: AssetHistory = {
      date: new Date().toISOString().split('T')[0],
      action: '調撥',
      description: `從 ${targetAsset.assignedSchool} 調撥至 ${targetSchoolName}`,
      remark: `公文編號: ${transferDocNo} | 備註: ${transferRemark}`,
      operator: '目前登入者'
    };

    setAssets(prev => prev.map(a => 
      a.serial === targetAsset.serial 
        ? { ...a, assignedSchool: targetSchoolName, schoolCode: 'MOCK', history: [newHistory, ...a.history] }
        : a
    ));

    toast.success('行政異動已完成', {
      description: '請記得手動至 Apple School Manager (ASM) 進行搬移作業',
    });
    setShowTransferModal(false);
    resetForm();
  };

  const resetNewItem = () => {
    setNewItem({
      serial: '',
      name: '',
      model: '',
      arrivalDate: new Date().toISOString().split('T')[0],
      warrantyDate: '',
      project: '生生有平板',
      school: ALL_SCHOOLS_LIST[0]
    });
  };

  const handleReplacement = () => {
    if (!targetAsset || !replacementNewSN || !asmConfirmed) return;
    
    // Create new device (Simplified logic: keeping same name/model for mock)
    const newDevice: AssetMaster = {
      ...targetAsset,
      serial: replacementNewSN,
      usageHoursInherited: replacementInherit ? (targetAsset.usageHoursInherited + targetAsset.currentUsageHours) : 0,
      currentUsageHours: 0,
      status: AssetStatus.NORMAL,
      history: [{
        date: new Date().toISOString().split('T')[0],
        action: '入庫',
        description: `由 ${targetAsset.serial} 汰換入庫`,
        operator: '目前登入者'
      }]
    };

    // Mark old as replaced
    setAssets(prev => {
      const filtered = prev.filter(a => a.serial !== targetAsset.serial);
      const oldReplaced: AssetMaster = {
        ...targetAsset,
        status: AssetStatus.SCRAPPED,
        history: [{
          date: new Date().toISOString().split('T')[0],
          action: '汰換',
          description: `已汰換出庫，新設備序號: ${replacementNewSN}`,
          operator: '目前登入者'
        }, ...targetAsset.history]
      };
      return [...filtered, oldReplaced, newDevice];
    });

    toast.success('設備汰換成功', {
      description: `數據已${replacementInherit ? '完成' : '取消'}繼承。請手動更新 ASM 狀態。`,
    });
    setShowReplacmentModal(false);
    resetForm();
  };

  const handleDecommission = () => {
    if (!targetAsset || !asmConfirmed) return;

    setAssets(prev => prev.map(a => 
      a.serial === targetAsset.serial 
        ? { 
            ...a, 
            status: AssetStatus.SCRAPPED, 
            history: [{
              date: new Date().toISOString().split('T')[0],
              action: '報廢',
              description: '設備已報廢除帳',
              operator: '目前登入者'
            }, ...a.history] 
          }
        : a
    ));

    toast.success('設備已報廢');
    setShowDecommissionModal(false);
    resetForm();
  };

  const resetForm = () => {
    setTargetAsset(null);
    setTransferSchoolId('');
    setTransferDocNo('');
    setTransferRemark('');
    setReplacementNewSN('');
    setReplacementInherit(true);
    setAsmConfirmed(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-800">設備總表管理</h2>
          <p className="text-sm text-slate-500 mt-1">Asset Master - 教育局行政主工作台</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-bold text-sm"
          >
            <Plus className="w-4 h-4 mr-2" /> 新增設備
          </button>
          <button 
            onClick={() => setShowImportModal(true)}
            className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-bold text-sm"
          >
            <Upload className="w-4 h-4 mr-2" /> 批次匯入
          </button>
          <button className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-bold text-sm">
            <Download className="w-4 h-4 mr-2" /> 匯出總表
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="搜尋名稱、序號、型號..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />
        </div>
        
        {/* School Filter Dropdown */}
        <div className="relative w-64">
          <button 
            onClick={() => setIsSchoolSelectOpen(!isSchoolSelectOpen)}
            className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all text-slate-700 text-sm font-medium"
          >
            <div className="flex items-center truncate">
              <School className="w-4 h-4 mr-2 text-slate-400" />
              {selectedSchool}
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isSchoolSelectOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isSchoolSelectOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsSchoolSelectOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
                >
                  <div className="p-2 border-b border-slate-100">
                    <input 
                      type="text"
                      placeholder="關鍵字搜尋..."
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border-none rounded focus:ring-1 focus:ring-blue-500 outline-none"
                      value={schoolSearch}
                      onChange={(e) => setSchoolSearch(e.target.value)}
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto p-1">
                    {filteredSchoolOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (opt.isHeader) {
                            setSelectedSchool(opt.label);
                          } else {
                            setSelectedSchool(opt.label);
                          }
                          setIsSchoolSelectOpen(false);
                          setSchoolSearch('');
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                          opt.isHeader ? 'font-black text-slate-800 bg-slate-50 hover:bg-blue-50 hover:text-blue-600' : 
                          selectedSchool === opt.label 
                            ? 'bg-blue-50 text-blue-600 font-bold' 
                            : 'text-slate-600 hover:bg-slate-50 pl-6'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">計畫別:</span>
          <select 
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="ALL">全部計畫</option>
            {PROJECT_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">狀態:</span>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="ALL">全部</option>
            <option value={AssetStatus.NORMAL}>正常</option>
            <option value={AssetStatus.TRANSFERRING}>調撥中</option>
            <option value={AssetStatus.REPLACEMENT}>汰換</option>
            <option value={AssetStatus.SCRAPPED}>報廢</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4 w-[16%]">設備名稱</th>
              <th className="px-6 py-4 w-[16%]">設備序號 (SN)</th>
              <th className="px-6 py-4 w-[18%]">型號 (OS)</th>
              <th className="px-6 py-4 w-[14%]">指派學校</th>
              <th className="px-6 py-4 w-[12%]">計畫別</th>
              <th className="px-6 py-4 w-[8%] text-center">MDM同步</th>
              <th className="px-6 py-4 w-[16%] text-right">操作項目</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAssets.map((asset) => {
              const isMismatch = asset.mdmReportedSchoolId && asset.mdmReportedSchoolId !== asset.schoolCode;
              
              return (
                <tr 
                  key={asset.serial} 
                  className={`hover:bg-slate-50 transition-colors group ${asset.status === AssetStatus.SCRAPPED ? 'bg-slate-50 opacity-60' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 text-base">{asset.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono text-slate-600">
                      {asset.serial}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-base text-slate-700 font-bold">{asset.model}</span>
                      <span className="text-xs text-slate-400 font-medium">{asset.osVersion}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-bold ${isMismatch ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                         {asset.assignedSchool}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-bold">
                      {asset.project}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {isMismatch ? (
                      <div className="flex items-center justify-center text-rose-500" title="ASM 設定尚未手動對齊">
                        <X className="w-5 h-5 stroke-[3px]" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center text-emerald-500">
                        <Check className="w-5 h-5 stroke-[3px]" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => setSelectedAsset(asset)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="查看詳情"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                      {asset.status !== AssetStatus.SCRAPPED && (
                        <>
                          <button 
                            onClick={() => { setTargetAsset(asset); setShowTransferModal(true); }}
                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            title="設備調撥"
                          >
                            <ArrowRightLeft className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { setTargetAsset(asset); setShowReplacmentModal(true); }}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="設備汰換"
                          >
                            <RefreshCcw className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { setTargetAsset(asset); setShowDecommissionModal(true); }}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="報廢處理"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredAssets.length === 0 && (
          <div className="p-20 text-center text-slate-400">
            <Smartphone className="w-16 h-16 mx-auto mb-4 opacity-10" />
            <p className="font-bold">查無符合條件的資產資料</p>
          </div>
        )}
      </div>

      {/* --- Modals --- */}
      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Tablet className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800">{selectedAsset.name}</h3>
                    <p className="text-xs text-slate-500 font-mono">SN: {selectedAsset.serial}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedAsset(null)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left: Tech Stats */}
                  <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                        <CheckCircle2 className="w-4 h-4 mr-2" /> 技術數據 (API 提供)
                      </h4>
                      <div className="space-y-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">iOS 版本</span>
                          <span className="font-bold text-slate-800">{selectedAsset.osVersion}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">儲存空間</span>
                          <span className="font-bold text-slate-800">{selectedAsset.storageTotal} (剩餘 {selectedAsset.storageRemaining})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">目前電量</span>
                          <span className="font-bold text-slate-800">{selectedAsset.battery}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">最後連線</span>
                          <span className="font-bold text-slate-800 tracking-tight">{selectedAsset.lastConnection}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" /> 行政紀錄
                      </h4>
                      <div className="space-y-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">入庫日期</span>
                          <span className="font-bold text-slate-800">{selectedAsset.arrivalDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">保固截止</span>
                          <span className="font-bold text-slate-800">{selectedAsset.warrantyDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">指派學校</span>
                          <span className="font-bold text-blue-600">{selectedAsset.assignedSchool}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">計畫別</span>
                          <span className="font-bold text-slate-800">{selectedAsset.project}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: History */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center">
                      <History className="w-4 h-4 mr-2" /> 異動履歷
                    </h4>
                    <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-100">
                      {selectedAsset.history.map((log, idx) => (
                        <div key={idx} className="relative pl-8">
                          <div className={`absolute left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                            log.action === '調撥' ? 'bg-amber-400' : 
                            log.action === '汰換' ? 'bg-indigo-400' :
                            log.action === '入庫' ? 'bg-emerald-400' : 'bg-slate-400'
                          }`} />
                          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-start mb-1 text-xs">
                              <span className="font-black text-slate-800 underline underline-offset-4 decoration-blue-200">{log.action}</span>
                              <span className="text-slate-400 font-mono">{log.date}</span>
                            </div>
                            <p className="text-sm font-medium text-slate-600 leading-relaxed">{log.description}</p>
                            {log.remark && <p className="text-[10px] text-slate-400 mt-2 bg-slate-50 p-2 rounded italic">註: {log.remark}</p>}
                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">經辦人: {log.operator}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button onClick={() => setSelectedAsset(null)} className="px-6 py-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-50">關閉</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col"
            >
               <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
                 <h3 className="text-xl font-black text-slate-800">新增設備至總表</h3>
                 <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-400" /></button>
               </div>
               <div className="p-8 space-y-6 overflow-y-auto flex-1">
                 <div className="grid grid-cols-2 gap-6">
                   <div>
                     <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">設備序號 (SN)</label>
                     <input type="text" placeholder="輸入序號" value={newItem.serial} onChange={e => setNewItem({...newItem, serial: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">設備名稱</label>
                     <input type="text" placeholder="例如: EDU-iPad-02" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">設備型號</label>
                     <input type="text" placeholder="例如: iPad (第10代)" value={newItem.model} onChange={e => setNewItem({...newItem, model: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">計畫別</label>
                     <select value={newItem.project} onChange={e => setNewItem({...newItem, project: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                       {PROJECT_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">入庫日期</label>
                     <input type="date" value={newItem.arrivalDate} onChange={e => setNewItem({...newItem, arrivalDate: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">保固截止日</label>
                     <input type="date" value={newItem.warrantyDate} onChange={e => setNewItem({...newItem, warrantyDate: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                   </div>
                 </div>
                 <div className="relative pb-4">
                   <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">預計指派學校</label>
                   <button 
                     type="button"
                     onClick={() => setIsAddSchoolSelectOpen(!isAddSchoolSelectOpen)}
                     className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                   >
                     {newItem.school}
                     <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isAddSchoolSelectOpen ? 'rotate-180' : ''}`} />
                   </button>
                   
                   <AnimatePresence>
                     {isAddSchoolSelectOpen && (
                       <>
                         <div className="fixed inset-0 z-[110]" onClick={() => setIsAddSchoolSelectOpen(false)} />
                         <motion.div 
                           initial={{ opacity: 0, y: 5 }} 
                           animate={{ opacity: 1, y: 0 }} 
                           exit={{ opacity: 0, y: 5 }}
                           className="absolute z-[120] bottom-full mb-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
                         >
                           <div className="p-2 border-b border-slate-100">
                             <input 
                               type="text"
                               placeholder="搜尋學校..."
                               className="w-full px-3 py-1.5 text-xs bg-slate-50 border-none rounded focus:ring-1 focus:ring-blue-500 outline-none"
                               value={addSchoolSearch}
                               onChange={(e) => setAddSchoolSearch(e.target.value)}
                               autoFocus
                             />
                           </div>
                           <div className="max-h-60 overflow-y-auto p-1">
                             {filteredAddSchoolOptions.map((school) => (
                               <button
                                 key={school}
                                 onClick={() => {
                                   setNewItem({ ...newItem, school });
                                   setIsAddSchoolSelectOpen(false);
                                   setAddSchoolSearch('');
                                 }}
                                 className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                                   newItem.school === school ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
                                 }`}
                               >
                                 {school}
                               </button>
                             ))}
                           </div>
                         </motion.div>
                       </>
                     )}
                   </AnimatePresence>
                 </div>
               </div>
               <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                 <button onClick={() => setShowAddModal(false)} className="px-6 py-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-600">取消</button>
                 <button onClick={handleAddAsset} className="px-6 py-2 bg-blue-600 rounded-lg font-bold text-white shadow-lg shadow-blue-200">建立資料</button>
               </div>
            </motion.div>
          </div>
        )}

        {/* Batch Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                   <Upload className="w-5 h-5 text-blue-600" />
                   <h3 className="text-xl font-black text-slate-800">批次匯入設備</h3>
                 </div>
                 <button onClick={() => setShowImportModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-400" /></button>
               </div>
               <div className="p-8">
                 <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                   <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                     <FileSpreadsheet className="w-8 h-8" />
                   </div>
                   <h4 className="text-lg font-bold text-slate-800 mb-1">點擊或拖拽檔案至此處</h4>
                   <p className="text-sm text-slate-400 mb-6">僅支援 .xlsx 或 .csv 格式檔案</p>
                   <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">選擇檔案</button>
                 </div>
                 
                 <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                   <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                   <div className="text-xs text-amber-800 leading-relaxed">
                     <p className="font-bold mb-1">匯入說明：</p>
                     <ul className="list-disc list-inside space-y-1">
                       <li>請務必依據範例格式填寫</li>
                       <li>序號 (SN) 為唯一識別值，重複將會更新現有資料</li>
                       <li>單次匯入上限為 1,000 筆</li>
                     </ul>
                   </div>
                 </div>
               </div>
               <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                 <button className="flex items-center text-sm font-bold text-blue-600 hover:underline">
                   <Download className="w-4 h-4 mr-1" /> 下載空白範例檔
                 </button>
                 <div className="flex gap-3">
                   <button onClick={() => setShowImportModal(false)} className="px-6 py-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-600">取消匯入</button>
                   <button disabled className="px-6 py-2 bg-slate-300 rounded-lg font-bold text-white cursor-not-allowed">開始上傳</button>
                 </div>
               </div>
            </motion.div>
          </div>
        )}

        {/* Transfer Modal */}
        {showTransferModal && targetAsset && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden p-8">
              <h3 className="text-xl font-black text-slate-800 mb-2">設備調撥流程</h3>
              <p className="text-sm text-slate-500 mb-6">正在申請調撥設備：<span className="font-bold text-blue-600">{targetAsset.serial} ({targetAsset.name})</span></p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">原歸屬學校</label>
                    <input type="text" readOnly value={targetAsset.assignedSchool} className="w-full bg-slate-100 border border-slate-200 rounded-lg p-3 text-sm text-slate-500 font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">目標學校</label>
                    <select 
                      value={transferSchoolId}
                      onChange={(e) => setTransferSchoolId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      <option value="">請選擇目標學校</option>
                      {ALL_SCHOOLS_LIST.filter(s => s !== targetAsset.assignedSchool).map(schoolName => (
                        <option key={schoolName} value={schoolName}>{schoolName}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">公文編號 / 備註</label>
                  <input 
                    type="text" 
                    placeholder="請輸入公文編號或相關備註"
                    value={transferDocNo}
                    onChange={(e) => setTransferDocNo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
                  <div className="flex-shrink-0">
                    <input 
                      type="checkbox" 
                      id="asm-check" 
                      checked={asmConfirmed}
                      onChange={(e) => setAsmConfirmed(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                    />
                  </div>
                  <label htmlFor="asm-check" className="text-xs text-amber-800 font-medium leading-relaxed">
                    我已知曉此操作僅為行政紀錄，需另行登入 <span className="font-black underline">Apple School Manager (ASM)</span> 完成實際搬移。
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button onClick={() => setShowTransferModal(false)} className="flex-1 px-6 py-3 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-200">取消</button>
                <button 
                  disabled={!transferSchoolId || !asmConfirmed}
                  onClick={handleTransfer}
                  className="flex-1 px-6 py-3 bg-amber-500 rounded-xl font-black text-white hover:bg-amber-600 shadow-lg shadow-amber-200 disabled:opacity-50 disabled:shadow-none"
                >
                  確認調撥
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Replacement Modal */}
        {showReplacmentModal && targetAsset && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden p-8">
              <h3 className="text-xl font-black text-slate-800 mb-2 text-indigo-600">設備汰換 (Replacement)</h3>
              <p className="text-sm text-slate-500 mb-6">更換舊設備：<span className="font-bold text-slate-800 underline decoration-indigo-200">{targetAsset.serial}</span></p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">新設備序號 (SN)</label>
                  <input 
                    type="text" 
                    placeholder="請輸入或掃描新設備序號"
                    value={replacementNewSN}
                    onChange={(e) => setReplacementNewSN(e.target.value)}
                    className="w-full bg-slate-50 border border-indigo-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                  <div className="flex items-center gap-3">
                    <History className="w-5 h-5 text-indigo-500" />
                    <div>
                      <h4 className="text-sm font-bold text-indigo-900">數據繼承</h4>
                      <p className="text-[10px] text-indigo-500 font-medium">繼承原設備歷史使用時數統計</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setReplacementInherit(!replacementInherit)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${replacementInherit ? 'bg-indigo-600' : 'bg-slate-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${replacementInherit ? 'translate-x-6' : ''}`} />
                  </button>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
                  <div className="flex-shrink-0">
                    <input 
                      type="checkbox" 
                      id="asm-check-rep" 
                      checked={asmConfirmed}
                      onChange={(e) => setAsmConfirmed(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                    />
                  </div>
                  <label htmlFor="asm-check-rep" className="text-xs text-amber-800 font-medium leading-relaxed">
                    我已知曉此操作僅為行政紀錄，需另行登入 <span className="font-black underline">Apple School Manager (ASM)</span> 完成實際搬移。
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button onClick={() => setShowReplacmentModal(false)} className="flex-1 px-6 py-3 bg-slate-100 rounded-xl font-bold text-slate-600">取消</button>
                <button 
                  disabled={!replacementNewSN || !asmConfirmed}
                  onClick={handleReplacement}
                  className="flex-1 px-6 py-3 bg-indigo-600 rounded-xl font-black text-white shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none"
                >
                  確認汰換
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Decommission Modal */}
        {showDecommissionModal && targetAsset && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-rose-50 rounded-xl">
                  <Trash2 className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-xl font-black text-slate-800">設備報廢確認</h3>
              </div>
              
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl mb-6">
                <p className="text-sm text-rose-700 leading-relaxed font-medium">
                  您正準備報廢設備：<span className="font-black">{targetAsset.serial}</span>。<br/>
                  此操作將從現有庫存中移除設備，並轉為永久報廢狀態。
                </p>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3 mb-8">
                <div className="flex-shrink-0">
                  <input 
                    type="checkbox" 
                    id="asm-check-dec" 
                    checked={asmConfirmed}
                    onChange={(e) => setAsmConfirmed(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                  />
                </div>
                <label htmlFor="asm-check-dec" className="text-xs text-amber-800 font-medium leading-relaxed">
                  我已知曉此操作僅為行政紀錄，需另行登入 <span className="font-black underline">Apple School Manager (ASM)</span> 完成實際搬移。
                </label>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setShowDecommissionModal(false)} className="flex-1 px-6 py-3 bg-slate-100 rounded-xl font-bold text-slate-600">取消</button>
                <button 
                  disabled={!asmConfirmed}
                  onClick={handleDecommission}
                  className="flex-1 px-6 py-3 bg-rose-600 rounded-xl font-black text-white shadow-lg shadow-rose-200 disabled:opacity-50 disabled:shadow-none"
                >
                  確認報廢
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BureauDeviceManagementNew;
