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
  AlertTriangle,
  CheckCircle2, 
  Check,
  Info,
  Calendar,
  History,
  Tablet,
  Smartphone,
  ChevronDown,
  FileSpreadsheet,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';
import { AssetMaster, AssetStatus, AssetHistory, BureauTransferRequest } from '../types';
import { toast } from 'sonner';

// --- Hardcoded Data for Logic Simulation ---
const SCHOOL_ENTITIES = [
  { code: '3001', name: '復興國小', type: '台南市全國小' },
  { code: '3002', name: '忠義國小', type: '台南市全國小' },
  { code: '3003', name: '勝利國小', type: '台南市全國小' },
  { code: '3004', name: '大同國小', type: '台南市全國小' },
  { code: '3005', name: '新興國小', type: '台南市全國小' },
  { code: '4001', name: '安南國中', type: '台南市全國中' },
  { code: '4002', name: '永康國中', type: '台南市全國中' },
  { code: '4003', name: '新東國中', type: '台南市全國中' },
  { code: '4004', name: '崇明國中', type: '台南市全國中' },
  { code: '4005', name: '後甲國中', type: '台南市全國中' },
];

const SCHOOL_STRUCTURE = {
  '全市': [],
  '台南市全國小': SCHOOL_ENTITIES.filter(s => s.type === '台南市全國小').map(s => s.name),
  '台南市全國中': SCHOOL_ENTITIES.filter(s => s.type === '台南市全國中').map(s => s.name)
};

const ALL_SCHOOLS_LIST = SCHOOL_ENTITIES.map(s => s.name);

const PROJECT_OPTIONS = ['生生有平板', '前瞻計畫', '特別專案'];

const INITIAL_TRANSFER_REQUESTS: BureauTransferRequest[] = [
  {
    id: 'TR-2024-001',
    docNo: 'EDU-113-001XT',
    sourceSchool: '永康國中',
    sourceSchoolCode: '4002',
    targetSchool: '復興國小',
    targetSchoolCode: '3001',
    deviceSerials: ['DLX0001XYZ', 'DLX0002XYZ'],
    applicant: '王大同 (資訊組長)',
    requestDate: '2024-03-15',
    reason: '班級擴編，現有設備不足',
    status: 'PENDING'
  },
  {
    id: 'TR-2024-002',
    docNo: 'EDU-113-PB-02',
    sourceSchool: '安南國中',
    sourceSchoolCode: '4001',
    targetSchool: '崇明國中',
    targetSchoolCode: '4004',
    deviceSerials: ['AIR5001ABC'],
    applicant: '李小明',
    requestDate: '2024-03-10',
    approvalDate: '2024-03-12',
    reason: '跨校支援計畫使用',
    status: 'APPROVED'
  }
];

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
    status: AssetStatus.TRANSFER_PENDING,
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
    status: AssetStatus.TRANSFER_APPROVED,
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
  const [activeTab, setActiveTab] = useState<'inventory' | 'transfer' | 'lost'>('inventory');
  const [assets, setAssets] = useState<AssetMaster[]>(INITIAL_ASSETS);
  const [transferRequests, setTransferRequests] = useState<BureauTransferRequest[]>(INITIAL_TRANSFER_REQUESTS);
  
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
  const [showLostModal, setShowLostModal] = useState(false);
  const [showRecoverModal, setShowRecoverModal] = useState(false);
  const [showBatchTransferModal, setShowBatchTransferModal] = useState(false);
  const [showBatchDecommissionModal, setShowBatchDecommissionModal] = useState(false);
  const [showBatchLostModal, setShowBatchLostModal] = useState(false);

  // Batch selection state
  const [selectedSerials, setSelectedSerials] = useState<string[]>([]);
  
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

  // Transfer Management State
  const [selectedTransfer, setSelectedTransfer] = useState<BureauTransferRequest | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Dropdown menu state
  const [openMenuSerial, setOpenMenuSerial] = useState<string | null>(null);

  // Filtered School Options
  const filteredSchoolOptions = useMemo(() => {
    const options: { label: string, code?: string, isHeader?: boolean }[] = [
      { label: '全部學校' },
      { label: '台南市全國小', isHeader: true },
      ...SCHOOL_ENTITIES.filter(s => s.type === '台南市全國小').map(s => ({ label: s.name, code: s.code })),
      { label: '台南市全國中', isHeader: true },
      ...SCHOOL_ENTITIES.filter(s => s.type === '台南市全國中').map(s => ({ label: s.name, code: s.code }))
    ];
    if (!schoolSearch) return options;
    const search = schoolSearch.toLowerCase();
    return options.filter(opt => 
      opt.label.toLowerCase().includes(search) || 
      (opt.code && opt.code.includes(search))
    );
  }, [schoolSearch]);

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      // Tab based filtering
      if (activeTab === 'inventory' && asset.status === AssetStatus.LOST) return false;
      if (activeTab === 'lost' && asset.status !== AssetStatus.LOST) return false;

      const matchesSearch = 
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.schoolCode.toLowerCase().includes(searchQuery.toLowerCase());
      
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
  }, [assets, searchQuery, statusFilter, projectFilter, selectedSchool, activeTab]);

  // Filtered School Options for Add Modal
  const filteredAddSchoolOptions = useMemo(() => {
    const options = SCHOOL_ENTITIES;
    if (!addSchoolSearch) return options;
    const search = addSchoolSearch.toLowerCase();
    return options.filter(s => 
      s.name.toLowerCase().includes(search) || 
      s.code.includes(search)
    );
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
    
    const targetSchool = SCHOOL_ENTITIES.find(s => s.name === transferSchoolId);
    if (!targetSchool) return;

    const newRequest: BureauTransferRequest = {
      id: `TR-S-${Date.now()}`,
      docNo: transferDocNo || 'N/A',
      sourceSchool: targetAsset.assignedSchool,
      sourceSchoolCode: targetAsset.schoolCode,
      targetSchool: targetSchool.name,
      targetSchoolCode: targetSchool.code,
      deviceSerials: [targetAsset.serial],
      applicant: '局端管理員',
      requestDate: new Date().toISOString().split('T')[0],
      reason: transferRemark || '局端發起調撥',
      status: 'PENDING'
    };

    setTransferRequests(prev => [newRequest, ...prev]);
    setAssets(prev => prev.map(a => 
      a.serial === targetAsset.serial 
        ? { ...a, status: AssetStatus.TRANSFER_PENDING }
        : a
    ));

    toast.success('已發起調撥申請', {
      description: '申請單已送至「調撥管理」等候審核',
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

  const handleBatchTransfer = () => {
    if (selectedSerials.length === 0 || !transferSchoolId || !asmConfirmed) return;

    const targetSchool = SCHOOL_ENTITIES.find(s => s.name === transferSchoolId);
    if (!targetSchool) return;

    // We assume all selected assets have the same source school for simplicity in this mock
    const firstAsset = assets.find(a => a.serial === selectedSerials[0]);
    if (!firstAsset) return;

    const newRequest: BureauTransferRequest = {
      id: `TR-B-${Date.now()}`,
      docNo: transferDocNo || 'N/A',
      sourceSchool: firstAsset.assignedSchool,
      sourceSchoolCode: firstAsset.schoolCode,
      targetSchool: targetSchool.name,
      targetSchoolCode: targetSchool.code,
      deviceSerials: [...selectedSerials],
      applicant: '局端管理員',
      requestDate: new Date().toISOString().split('T')[0],
      reason: transferRemark || '局端批次調撥',
      status: 'PENDING'
    };

    setTransferRequests(prev => [newRequest, ...prev]);
    setAssets(prev => prev.map(a => 
      selectedSerials.includes(a.serial) 
        ? { ...a, status: AssetStatus.TRANSFER_PENDING }
        : a
    ));

    toast.success(`已發起 ${selectedSerials.length} 筆設備調撥申請`);
    setShowBatchTransferModal(false);
    setSelectedSerials([]);
    resetForm();
  };

  const handleApproveTransfer = () => {
    if (!selectedTransfer) return;
    
    setAssets(prev => prev.map(asset => {
      if (selectedTransfer.deviceSerials.includes(asset.serial)) {
        return {
          ...asset,
          status: AssetStatus.TRANSFER_APPROVED,
          assignedSchool: selectedTransfer.targetSchool,
          schoolCode: selectedTransfer.targetSchoolCode,
          history: [{
            date: new Date().toISOString().split('T')[0],
            action: '調撥',
            description: `調撥核准：從 ${selectedTransfer.sourceSchool} 移至 ${selectedTransfer.targetSchool}`,
            operator: '局端管理員'
          }, ...asset.history]
        };
      }
      return asset;
    }));

    setTransferRequests(prev => prev.map(r => 
      r.id === selectedTransfer.id ? { ...r, status: 'APPROVED', approvalDate: new Date().toISOString().split('T')[0] } : r
    ));

    toast.success('調撥申請已核准', { description: '主表帳冊已更新。請接續手動進行 ASM 序號移撥作業。' });
    setShowApprovalModal(false);
    setSelectedTransfer(null);
  };

  const handleRejectTransfer = () => {
    if (!selectedTransfer || !rejectionReason) {
      toast.error('請填寫退回原因');
      return;
    }

    setAssets(prev => prev.map(asset => {
      if (selectedTransfer.deviceSerials.includes(asset.serial)) {
        return { ...asset, status: AssetStatus.NORMAL };
      }
      return asset;
    }));

    setTransferRequests(prev => prev.map(r => 
      r.id === selectedTransfer.id ? { ...r, status: 'REJECTED', rejectionReason } : r
    ));

    toast.info('申請已退回，狀態已恢復正常');
    setShowApprovalModal(false);
    setSelectedTransfer(null);
    setRejectionReason('');
  };

  const handleConfirmTransferComplete = (request: BureauTransferRequest) => {
    setAssets(prev => prev.map(asset => {
      if (request.deviceSerials.includes(asset.serial)) {
        return { ...asset, status: AssetStatus.NORMAL };
      }
      return asset;
    }));

    setTransferRequests(prev => prev.map(r => 
      r.id === request.id ? { ...r, status: 'COMPLETED', completionDate: new Date().toISOString().split('T')[0] } : r
    ));

    toast.success('移撥作業已完成通知確認。');
  };

  const handleBatchDecommission = () => {
    if (selectedSerials.length === 0 || !asmConfirmed) return;

    setAssets(prev => prev.map(a => 
      selectedSerials.includes(a.serial) 
        ? { 
            ...a, 
            status: AssetStatus.SCRAPPED, 
            history: [{
              date: new Date().toISOString().split('T')[0],
              action: '報廢',
              description: '設備已批次報廢除帳',
              operator: '目前登入者'
            }, ...a.history] 
          }
        : a
    ));

    toast.success(`已完成 ${selectedSerials.length} 筆設備報廢`);
    setShowBatchDecommissionModal(false);
    setSelectedSerials([]);
    resetForm();
  };

  const handleReportLost = () => {
    if (!targetAsset && selectedSerials.length === 0) return;
    
    const serialsToMark = targetAsset ? [targetAsset.serial] : selectedSerials;

    setAssets(prev => prev.map(a => 
      serialsToMark.includes(a.serial) 
        ? { 
            ...a, 
            status: AssetStatus.LOST, 
            history: [{
              date: new Date().toISOString().split('T')[0],
              action: '其他',
              description: '通報設備遺失',
              operator: '目前登入者'
            }, ...a.history] 
          }
        : a
    ));

    toast.warning(`已完成 ${serialsToMark.length} 筆設備遺失通報`);
    setShowLostModal(false);
    setShowBatchLostModal(false);
    setSelectedSerials([]);
    resetForm();
  };

  const handleRecover = () => {
    if (!targetAsset && selectedSerials.length === 0) return;
    
    const serialsToMark = targetAsset ? [targetAsset.serial] : selectedSerials;

    setAssets(prev => prev.map(a => 
      serialsToMark.includes(a.serial) 
        ? { 
            ...a, 
            status: AssetStatus.NORMAL, 
            history: [{
              date: new Date().toISOString().split('T')[0],
              action: '其他',
              description: '設備尋回恢復正常狀態',
              operator: '目前登入者'
            }, ...a.history] 
          }
        : a
    ));

    toast.success(`已完成 ${serialsToMark.length} 筆設備尋回恢復`);
    setShowRecoverModal(false);
    setSelectedSerials([]);
    resetForm();
  };

  const toggleSelectAll = () => {
    if (selectedSerials.length === filteredAssets.length) {
      setSelectedSerials([]);
    } else {
      setSelectedSerials(filteredAssets.map(a => a.serial));
    }
  };

  const toggleSelectAsset = (serial: string) => {
    setSelectedSerials(prev => 
      prev.includes(serial) ? prev.filter(s => s !== serial) : [...prev, serial]
    );
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
    <div className="space-y-6 pb-40">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-800">設備總表管理</h2>
          <p className="text-sm text-slate-500 mt-1">Asset Master - 教育局行政主工作台</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => setActiveTab('inventory')}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
            activeTab === 'inventory' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
              : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Tablet className="w-4 h-4" /> 設備總表
        </button>
        <button 
          onClick={() => setActiveTab('transfer')}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
            activeTab === 'transfer' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
              : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" /> 調撥管理
        </button>
        <button 
          onClick={() => setActiveTab('lost')}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
            activeTab === 'lost' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
              : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" /> 設備遺失
        </button>
      </div>

      {activeTab === 'inventory' || activeTab === 'lost' ? (
        <>
          <div className="flex justify-end gap-2">
            {selectedSerials.length > 0 && (
              <div className="flex gap-2 mr-4 border-r border-slate-200 pr-4">
                {activeTab === 'inventory' && (
                  <>
                    <button 
                      onClick={() => setShowBatchTransferModal(true)}
                      className="flex items-center px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors font-bold text-sm"
                    >
                      <ArrowRightLeft className="w-4 h-4 mr-2" /> 批次調撥 ({selectedSerials.length})
                    </button>
                    <button 
                      onClick={() => setShowBatchDecommissionModal(true)}
                      className="flex items-center px-4 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors font-bold text-sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> 批次報廢 ({selectedSerials.length})
                    </button>
                    <button 
                      onClick={() => setShowBatchLostModal(true)}
                      className="flex items-center px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors font-bold text-sm"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" /> 批次遺失 ({selectedSerials.length})
                    </button>
                  </>
                )}
                {activeTab === 'lost' && (
                  <button 
                    onClick={() => handleRecover()}
                    className="flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors font-bold text-sm"
                  >
                        <CheckCircle2 className="w-4 h-4 mr-2" /> 批次尋回 ({selectedSerials.length})
                  </button>
                )}
              </div>
            )}
            {activeTab === 'inventory' && (
              <>
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
              </>
            )}
          </div>

          {activeTab !== 'lost' && (
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
                              {opt.isHeader || opt.label === '全部學校' ? opt.label : `${opt.code} ${opt.label}`}
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
                  <option value={AssetStatus.TRANSFER_PENDING}>調撥中(待審核)</option>
                  <option value={AssetStatus.TRANSFER_APPROVED}>調撥中(已核准)</option>
                  <option value={AssetStatus.REPLACEMENT}>汰換</option>
                  <option value={AssetStatus.SCRAPPED}>報廢</option>
                  <option value={AssetStatus.LOST}>遺失</option>
                </select>
              </div>
            </div>
          )}

      {/* Main Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-visible">
        <table className="w-full text-left border-collapse table-fixed min-w-[1100px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider leading-none">
              <th className="px-6 py-4 w-[60px]">
                <input 
                  type="checkbox" 
                  checked={filteredAssets.length > 0 && selectedSerials.length === filteredAssets.length}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="px-6 py-4 w-[14%]">設備名稱</th>
              <th className="px-6 py-4 w-[16%]">設備序號 (SN)</th>
              <th className="px-6 py-4 w-[150px]">型號 (OS)</th>
              <th className="px-6 py-4 w-[150px]">指派學校</th>
              <th className="px-6 py-4 w-[101px] text-center">目前狀態</th>
              <th className="px-6 py-4 w-[150px] text-center">計畫別</th>
              {activeTab !== 'lost' && (
                <th className="px-6 py-4 w-[80px] text-center">MDM同步</th>
              )}
              <th className="px-6 py-4 w-[60px] text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 overflow-y-visible">
            {filteredAssets.map((asset) => {
              const isMismatch = asset.mdmReportedSchoolId && asset.mdmReportedSchoolId !== asset.schoolCode;
              const isSelected = selectedSerials.includes(asset.serial);
              
              return (
                <tr 
                  key={asset.serial} 
                  className={`hover:bg-slate-50 transition-colors group overflow-y-visible ${asset.status === AssetStatus.SCRAPPED ? 'bg-slate-50 opacity-60' : ''} ${isSelected ? 'bg-blue-50/50' : ''}`}
                >
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => toggleSelectAsset(asset.serial)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 text-sm truncate" title={asset.name}>{asset.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono text-slate-600 block w-fit">
                      {asset.serial}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-700 font-bold truncate">{asset.model}</span>
                      <span className="text-xs text-slate-400 font-medium">{asset.osVersion}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                       <span className="text-slate-700 font-bold text-sm truncate">
                         {asset.schoolCode} {asset.assignedSchool}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold tracking-tight ${
                      asset.status === AssetStatus.NORMAL ? 'bg-emerald-50 text-emerald-600' :
                      asset.status === AssetStatus.TRANSFER_PENDING ? 'bg-amber-50 text-amber-600' :
                      asset.status === AssetStatus.TRANSFER_APPROVED ? 'bg-blue-50 text-blue-600' :
                      asset.status === AssetStatus.REPLACEMENT ? 'bg-indigo-50 text-indigo-600' :
                      asset.status === AssetStatus.LOST ? 'bg-rose-50 text-rose-600' :
                      'bg-slate-200 text-slate-600'
                    }`}>
                      {asset.status === AssetStatus.NORMAL ? '正常' :
                       asset.status === AssetStatus.TRANSFER_PENDING ? '待審核' :
                       asset.status === AssetStatus.TRANSFER_APPROVED ? '已核准' :
                       asset.status === AssetStatus.REPLACEMENT ? '汰換' : 
                       asset.status === AssetStatus.LOST ? '遺失' : '報廢'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-tight">
                      {asset.project}
                    </span>
                  </td>
                  {activeTab !== 'lost' && (
                    <td className="px-6 py-4 text-center">
                      {isMismatch ? (
                        <div className="flex items-center justify-center text-rose-500" title="ASM 設定尚未手動對齊">
                          <X className="w-5 h-5 stroke-[4px]" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center text-emerald-500">
                          <Check className="w-5 h-5 stroke-[4px]" />
                        </div>
                      )}
                    </td>
                  )}
                  <td className="px-6 py-4 text-right">
                    <div className={`flex justify-end relative ${openMenuSerial === asset.serial ? 'z-50' : 'z-auto'}`}>
                      <button 
                        onClick={() => setOpenMenuSerial(openMenuSerial === asset.serial ? null : asset.serial)}
                        className={`p-2 transition-all rounded-lg ${openMenuSerial === asset.serial ? 'bg-slate-100 text-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      <AnimatePresence>
                        {openMenuSerial === asset.serial && (
                          <>
                            <div className="fixed inset-0 z-20" onClick={() => setOpenMenuSerial(null)} />
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 10 }}
                              className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden py-1 text-left"
                            >
                              <button 
                                onClick={() => { setSelectedAsset(asset); setOpenMenuSerial(null); }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-blue-50 flex items-center gap-2 font-bold"
                              >
                                <Info className="w-4 h-4 text-blue-600" />
                                資訊詳情
                              </button>
                              
                              {activeTab === 'lost' ? (
                                <button 
                                  onClick={() => { setTargetAsset(asset); setShowRecoverModal(true); setOpenMenuSerial(null); }}
                                  className="w-full px-4 py-2 text-left text-sm text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 font-bold"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  設備尋回
                                </button>
                              ) : (
                                asset.status !== AssetStatus.SCRAPPED && (
                                  <>
                                    <button 
                                      onClick={() => { setTargetAsset(asset); setShowTransferModal(true); setOpenMenuSerial(null); }}
                                      className="w-full px-4 py-2 text-left text-sm text-amber-700 hover:bg-amber-50 flex items-center gap-2 font-bold border-t border-slate-50"
                                    >
                                      <ArrowRightLeft className="w-4 h-4" />
                                      設備調撥
                                    </button>
                                    <button 
                                      onClick={() => { setTargetAsset(asset); setShowReplacmentModal(true); setOpenMenuSerial(null); }}
                                      className="w-full px-4 py-2 text-left text-sm text-indigo-700 hover:bg-indigo-50 flex items-center gap-2 font-bold"
                                    >
                                      <RefreshCcw className="w-4 h-4" />
                                      設備汰換
                                    </button>
                                    <button 
                                      onClick={() => { setTargetAsset(asset); setShowDecommissionModal(true); setOpenMenuSerial(null); }}
                                      className="w-full px-4 py-2 text-left text-sm text-rose-700 hover:bg-rose-50 flex items-center gap-2 font-bold border-t border-slate-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      報廢處理
                                    </button>
                                    <button 
                                      onClick={() => { setTargetAsset(asset); setShowLostModal(true); setOpenMenuSerial(null); }}
                                      className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-bold"
                                    >
                                      <AlertTriangle className="w-4 h-4" />
                                      遺失通報
                                    </button>
                                  </>
                                )
                              )}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
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
      </>
      ) : (
        /* Tab 2: Transfer Management */
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4 w-[15%]">申請日期</th>
                <th className="px-6 py-4 w-[30%]">調撥方向 (原校 → 接收校)</th>
                <th className="px-6 py-4 w-[100px]">設備數量</th>
                <th className="px-6 py-4 w-[15%]">申請人 / 原因</th>
                <th className="px-6 py-4 w-[15%] text-center">狀態</th>
                <th className="px-6 py-4 text-right">操作項目</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {transferRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                    {req.requestDate}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-black uppercase">FROM</span>
                        <span className="text-sm font-bold text-slate-700 leading-tight">{req.sourceSchoolCode}<br/>{req.sourceSchool}</span>
                      </div>
                      <ArrowRightLeft className="w-4 h-4 text-slate-300 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-black uppercase">TO</span>
                        <span className="text-sm font-bold text-blue-600 leading-tight">{req.targetSchoolCode}<br/>{req.targetSchool}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 rounded text-slate-700 text-sm font-black">
                      {req.deviceSerials.length} 台
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-800 font-bold">{req.applicant}</p>
                    <p className="text-xs text-slate-400 truncate max-w-[150px]">{req.reason}</p>
                  </td>
                  <td className="px-6 py-4 text-center space-y-1">
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-black ${
                        req.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                        req.status === 'APPROVED' ? 'bg-blue-100 text-blue-700' :
                        req.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {req.status === 'PENDING' ? '待審核' :
                         req.status === 'APPROVED' ? '已核准' :
                         req.status === 'COMPLETED' ? '已移撥' : '已退回'}
                      </span>
                    </div>
                    {req.status === 'APPROVED' && req.approvalDate && (
                      <div className="text-xs text-slate-400 font-mono italic">{req.approvalDate} 核准</div>
                    )}
                    {req.status === 'COMPLETED' && req.completionDate && (
                      <div className="text-xs text-slate-400 font-mono italic">{req.completionDate} 移撥</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {req.status === 'PENDING' && (
                      <button 
                        onClick={() => { setSelectedTransfer(req); setShowApprovalModal(true); }}
                        className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-black hover:bg-blue-700 transition-all shadow-sm"
                      >
                        進行核准
                      </button>
                    )}
                    {req.status === 'APPROVED' && (
                      <button 
                        onClick={() => handleConfirmTransferComplete(req)}
                        className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-black hover:bg-emerald-700 transition-all shadow-sm"
                      >
                        移撥完成確認
                      </button>
                    )}
                    {req.status === 'REJECTED' && (
                      <span className="text-xs text-rose-400 font-bold">原因: {req.rejectionReason}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transferRequests.length === 0 && (
            <div className="p-20 text-center text-slate-400">
              <RefreshCcw className="w-16 h-16 mx-auto mb-4 opacity-10" />
              <p className="font-bold">目前無調撥申請案件</p>
            </div>
          )}
        </div>
      )}

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
                                 key={school.code}
                                 onClick={() => {
                                   setNewItem({ ...newItem, school: school.name });
                                   setIsAddSchoolSelectOpen(false);
                                   setAddSchoolSearch('');
                                 }}
                                 className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                                   newItem.school === school.name ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
                                 }`}
                               >
                                 <span className="font-mono text-slate-400 mr-2">{school.code}</span>
                                 {school.name}
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

        {/* Batch Transfer Modal */}
        {showBatchTransferModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden p-8">
              <h3 className="text-xl font-black text-slate-800 mb-2">批次設備調撥</h3>
              <p className="text-sm text-slate-500 mb-6">正在調撥 <span className="font-black text-blue-600">{selectedSerials.length}</span> 筆設備</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">目標學校</label>
                  <select 
                    value={transferSchoolId}
                    onChange={(e) => setTransferSchoolId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="">請選擇目標學校</option>
                    {SCHOOL_ENTITIES.map(school => (
                      <option key={school.code} value={school.name}>{school.code} {school.name}</option>
                    ))}
                  </select>
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
                      id="batch-asm-check" 
                      checked={asmConfirmed}
                      onChange={(e) => setAsmConfirmed(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                    />
                  </div>
                  <label htmlFor="batch-asm-check" className="text-xs text-amber-800 font-medium leading-relaxed">
                    我已知曉此操作僅為行政紀錄，需另行登入 <span className="font-black underline">ASM</span> 完成實際搬移。
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button onClick={() => setShowBatchTransferModal(false)} className="flex-1 px-6 py-3 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-200">取消</button>
                <button 
                  disabled={!transferSchoolId || !asmConfirmed}
                  onClick={handleBatchTransfer}
                  className="flex-1 px-6 py-3 bg-amber-500 rounded-xl font-black text-white hover:bg-amber-600 shadow-lg shadow-amber-200 disabled:opacity-50 disabled:shadow-none"
                >
                  確認批次調撥
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Batch Decommission Modal */}
        {showBatchDecommissionModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden p-8 text-center text-balance">
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">批次設備報廢確認</h3>
              <p className="text-sm text-slate-500 mb-6">您確定要將這 <span className="font-black text-rose-600">{selectedSerials.length}</span> 筆設備進行報廢處理嗎？此操作不可撤銷。</p>
              
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3 text-left mb-8">
                <div className="flex-shrink-0">
                  <input 
                    type="checkbox" 
                    id="batch-decom-check" 
                    checked={asmConfirmed}
                    onChange={(e) => setAsmConfirmed(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                  />
                </div>
                <label htmlFor="batch-decom-check" className="text-xs text-amber-800 font-medium leading-relaxed">
                  我確認已完成實體資產清查，並將在行政程序完成後於 <span className="font-black underline">ASM</span> 解除授權。
                </label>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setShowBatchDecommissionModal(false)} className="flex-1 px-6 py-3 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-200">取消</button>
                <button 
                  disabled={!asmConfirmed}
                  onClick={handleBatchDecommission}
                  className="flex-1 px-6 py-3 bg-rose-600 rounded-xl font-black text-white hover:bg-rose-700 shadow-lg shadow-rose-200 disabled:opacity-50"
                >
                  確認批次報廢
                </button>
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

        {/* Transfer Approval Modal */}
        {showApprovalModal && selectedTransfer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-800">調撥申請審核</h3>
                <button onClick={() => { setShowApprovalModal(false); setRejectionReason(''); }} className="p-2 hover:bg-slate-100 rounded-full">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-2 gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">申請人</label>
                    <p className="font-bold text-slate-700">{selectedTransfer.applicant}</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">申請公文編號</label>
                    <p className="font-bold text-slate-700">{selectedTransfer.docNo || '無'}</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">調撥來源</label>
                    <p className="font-bold text-slate-700">{selectedTransfer.sourceSchoolCode} {selectedTransfer.sourceSchool}</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">接收學校</label>
                    <p className="font-bold text-blue-600">{selectedTransfer.targetSchoolCode} {selectedTransfer.targetSchool}</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">申請日期</label>
                    <p className="font-bold text-slate-700">{selectedTransfer.requestDate}</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">申請台數</label>
                    <p className="font-black text-slate-700">{selectedTransfer.deviceSerials.length} 台</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">申請原因</label>
                    <p className="text-sm text-slate-600 leading-relaxed">{selectedTransfer.reason}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center">
                    <Tablet className="w-4 h-4 mr-2" /> 待調撥設備清單
                  </h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                        <tr>
                          <th className="px-4 py-2">序號 (SN)</th>
                          <th className="px-4 py-2">設備名稱</th>
                          <th className="px-4 py-2">型號</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedTransfer.deviceSerials.map(sn => {
                          const asset = assets.find(a => a.serial === sn);
                          return (
                            <tr key={sn}>
                              <td className="px-4 py-2 font-mono text-blue-600 font-bold">{sn}</td>
                              <td className="px-4 py-2 text-slate-700">{asset?.name || '未知設備'}</td>
                              <td className="px-4 py-2 text-slate-400">{asset?.model || '-'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-rose-600 mb-2 uppercase flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> 若需退回請填寫原因
                  </label>
                  <textarea 
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="請輸入退回申請的具體原因..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-rose-500 min-h-[80px]"
                  />
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                <button 
                  onClick={handleRejectTransfer}
                  className="px-6 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg font-bold hover:bg-rose-50 transition-all"
                >
                  退回申請
                </button>
                <button 
                  onClick={handleApproveTransfer}
                  className="px-8 py-2 bg-blue-600 text-white rounded-lg font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                >
                  核准申請
                </button>
              </div>
            </motion.div>
          </div>
        )}
        {/* Lost Confirmation Modal */}
        {showLostModal && targetAsset && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-50 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-black text-slate-800">設備遺失通報</h3>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl mb-8 font-medium text-amber-800 space-y-2">
                <p>您即將通報設備為遺失狀態：</p>
                <div className="bg-white/50 p-2 rounded border border-amber-200 font-mono text-sm">
                  {targetAsset.serial} ({targetAsset.name})
                </div>
                <p className="text-xs">通報後設備將移至「設備遺失」分頁管理。</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setShowLostModal(false)} className="flex-1 px-6 py-3 bg-slate-100 rounded-xl font-bold text-slate-600">取消</button>
                <button onClick={handleReportLost} className="flex-1 px-6 py-3 bg-amber-600 rounded-xl font-black text-white shadow-lg shadow-amber-200">確認通報</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Batch Lost Confirmation Modal */}
        {showBatchLostModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-50 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-black text-slate-800">批次遺失通報</h3>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl mb-8 font-medium text-amber-800">
                您即將通報 <span className="font-black text-amber-900">{selectedSerials.length}</span> 台設備為遺失狀態。
              </div>
              <div className="flex gap-4">
                <button onClick={() => setShowBatchLostModal(false)} className="flex-1 px-6 py-3 bg-slate-100 rounded-xl font-bold text-slate-600">取消</button>
                <button onClick={handleReportLost} className="flex-1 px-6 py-3 bg-amber-600 rounded-xl font-black text-white shadow-lg shadow-amber-200">確認通報</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Recover Confirmation Modal */}
        {showRecoverModal && targetAsset && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-black text-slate-800">設備尋回恢復</h3>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl mb-8 font-medium text-emerald-800 space-y-2">
                <p>確認已尋回設備並恢復為正常狀態：</p>
                <div className="bg-white/50 p-2 rounded border border-emerald-200 font-mono text-sm text-center">
                  {targetAsset.serial}
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setShowRecoverModal(false)} className="flex-1 px-6 py-3 bg-slate-100 rounded-xl font-bold text-slate-600">取消</button>
                <button onClick={handleRecover} className="flex-1 px-6 py-3 bg-emerald-600 rounded-xl font-black text-white shadow-lg shadow-emerald-200">確認尋回</button>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default BureauDeviceManagementNew;
