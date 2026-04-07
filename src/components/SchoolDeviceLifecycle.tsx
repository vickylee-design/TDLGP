import React, { useState } from 'react';
import { 
  Package, 
  CheckCircle2, 
  Truck, 
  RefreshCw, 
  QrCode, 
  Download, 
  Search, 
  Plus, 
  ArrowRight, 
  FileText, 
  CheckCircle, 
  Upload, 
  Filter,
  AlertCircle
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

type TabType = 'inventory' | 'transfers' | 'retirement';

const ageDistributionData = [
  { age: '< 1 年', count: 350 },
  { age: '1-2 年', count: 120 },
  { age: '2-3 年', count: 80 },
  { age: '3-4 年', count: 45 },
  { age: '> 4 年', count: 20 },
];

const inventoryData = [
  { id: '1', status: 'ACTIVE', serial: 'SN-2023-001', model: 'iPad (9th Gen)', purchaseDate: '2023-01-15', warranty: '2026-01-15', assignedTo: '五年三班', funding: '生生用平板專案' },
  { id: '2', status: 'ACTIVE', serial: 'SN-2023-045', model: 'iPad (9th Gen)', purchaseDate: '2023-01-15', warranty: '2026-01-15', assignedTo: '六年一班', funding: '生生用平板專案' },
  { id: '3', status: 'IN_STOCK', serial: 'SN-2023-102', model: 'iPad (9th Gen)', purchaseDate: '2023-01-15', warranty: '2026-01-15', assignedTo: '-', funding: '生生用平板專案' },
  { id: '4', status: 'RETIRED', serial: 'SN-2020-888', model: 'iPad (7th Gen)', purchaseDate: '2020-05-20', warranty: '2023-05-20', assignedTo: '報廢區', funding: '前瞻基礎建設' },
  { id: '5', status: 'TRANSIT', serial: 'SN-2021-333', model: 'iPad (8th Gen)', purchaseDate: '2021-08-10', warranty: '2024-08-10', assignedTo: '-', funding: '校務基金' },
];

const transferData = [
  { id: 't1', to: '偏鄉A國小', status: '待教育局審核', items: '15 台 iPad (9th Gen)', date: '2023-10-20', doc: '核章申請書.pdf', action: 'view' },
  { id: 't2', to: '本校', status: '已結案', items: '5 台 iPad Air 5', date: '2023-10-15', doc: '核章申請書.pdf', action: 'view' },
  { id: 't3', to: '偏鄉B國小', status: '審核通過 (待移轉)', items: '10 台 iPad (9th Gen)', date: '2023-11-01', doc: '核章申請書_v2.pdf', action: 'upload' },
  { id: 't4', to: '本校', status: '待接收', items: '20 台 iPad (9th Gen)', date: '2024-03-24', doc: '移轉證明.pdf', action: 'receive' },
];

const retirementData = [
  { id: 'r1', serial: 'SN-2020-888', model: 'iPad (7th Gen)', purchaseDate: '2020-05-20', reason: '已達年限', funding: '前瞻基礎建設' },
  { id: 'r2', serial: 'SN-2018-100', model: 'iPad (6th Gen)', purchaseDate: '2018-06-01', reason: '損壞無法修復', funding: '生生用平板專案' },
  { id: 'r3', serial: 'SN-2018-101', model: 'iPad (7th Gen)', purchaseDate: '2018-06-01', reason: '已達年限', funding: '生生用平板專案' },
  { id: 'r4', serial: 'SN-2018-102', model: 'iPad (7th Gen)', purchaseDate: '2018-06-01', reason: '已達年限', funding: '校務基金' },
  { id: 'r5', serial: 'SN-2018-103', model: 'iPad (6th Gen)', purchaseDate: '2018-06-01', reason: '已達年限', funding: '校務基金' },
  { id: 'r6', serial: 'SN-2018-104', model: 'iPad (7th Gen)', purchaseDate: '2018-06-01', reason: '損壞無法修復', funding: '前瞻基礎建設' },
  { id: 'r7', serial: 'SN-2018-105', model: 'iPad (7th Gen)', purchaseDate: '2018-06-01', reason: '遺失', funding: '前瞻基礎建設' },
];

const SchoolDeviceLifecycle: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('inventory');
  const [selectedRetirementItems, setSelectedRetirementItems] = useState<string[]>([]);
  const [selectedInventoryIds, setSelectedInventoryIds] = useState<string[]>([]);
  const [isNewTransferModalOpen, setIsNewTransferModalOpen] = useState(false);
  const [isCloseCaseModalOpen, setIsCloseCaseModalOpen] = useState(false);
  const [isRetirementModalOpen, setIsRetirementModalOpen] = useState(false);
  const [retiringItemId, setRetiringItemId] = useState<string | null>(null);
  const [retirementFilter, setRetirementFilter] = useState<string>('all');

  const retiringItemData = retiringItemId 
    ? retirementData.find(item => item.id === retiringItemId)
    : null;

  const filteredRetirementData = retirementFilter === 'all' 
    ? retirementData 
    : retirementData.filter(item => item.reason === retirementFilter);

  const handleSelectAllRetirement = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRetirementItems(filteredRetirementData.map(item => item.id));
    } else {
      setSelectedRetirementItems([]);
    }
  };

  const handleSelectRetirementItem = (id: string) => {
    setSelectedRetirementItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectAllInventory = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedInventoryIds(inventoryData.filter(item => item.status !== 'RETIRED' && item.status !== 'TRANSIT').map(item => item.id));
    } else {
      setSelectedInventoryIds([]);
    }
  };

  const handleSelectInventoryItem = (id: string) => {
    setSelectedInventoryIds(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-bold">ACTIVE</span>;
      case 'IN_STOCK':
        return <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold">IN_STOCK</span>;
      case 'RETIRED':
        return <span className="px-2 py-1 rounded bg-slate-200 text-slate-700 text-xs font-bold">RETIRED</span>;
      case 'TRANSIT':
        return <span className="px-2 py-1 rounded bg-amber-100 text-amber-700 text-xs font-bold">TRANSIT</span>;
      default:
        return null;
    }
  };

  const getTransferStatusBadge = (status: string) => {
    if (status.includes('待教育局審核')) return <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-xs font-bold ml-2">待教育局審核</span>;
    if (status.includes('已結案')) return <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-xs font-bold ml-2">已結案</span>;
    if (status.includes('審核通過')) return <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-bold ml-2">審核通過 (待移轉)</span>;
    if (status.includes('待接收')) return <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-bold ml-2">待接收</span>;
    return null;
  };

  const getReasonBadge = (reason: string) => {
    if (reason === '已達年限') return <span className="px-2 py-1 rounded bg-amber-100 text-amber-700 text-xs font-bold">已達年限</span>;
    if (reason === '損壞無法修復') return <span className="px-2 py-1 rounded bg-rose-100 text-rose-700 text-xs font-bold">損壞無法修復</span>;
    if (reason === '遺失') return <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-bold">遺失</span>;
    return null;
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto bg-slate-50 min-h-screen p-6">
      <Toaster />
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-start space-x-3">
          <div className="mt-1 text-blue-600">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">設備生命週期管理 (Lifecycle)</h2>
            <p className="text-slate-500 mt-1 text-sm">管理設備從入庫納管、跨校調撥到報廢汰除的全流程作業。</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            <QrCode className="w-4 h-4 mr-2" />
            掃碼盤點
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            匯出財產清冊
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-slate-500">總資產數</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-2">615</div>
          <p className="text-sm text-slate-500">包含 450 台 iPad 與週邊配件</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-slate-500">在庫備用 (SPARE)</h3>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-emerald-600 mb-2">42</div>
          <p className="text-sm text-emerald-600 font-medium">充足 (建議水位: 30)</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-slate-500">調撥中 (TRANSIT)</h3>
            <div className="p-2 bg-amber-50 rounded-lg">
              <Truck className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-amber-600 mb-2">15</div>
          <p className="text-sm text-amber-600 font-medium flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            2 筆待簽收
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-slate-500">待報廢 (RETIRE)</h3>
            <div className="p-2 bg-slate-100 rounded-lg">
              <RefreshCw className="w-5 h-5 text-slate-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-600 mb-2">20</div>
          <p className="text-sm text-slate-500">已達年限，建議啟動流程</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-200/50 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center ${
            activeTab === 'inventory' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4 mr-2" />
          資產總表 (Inventory)
        </button>
        <button
          onClick={() => setActiveTab('transfers')}
          className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center ${
            activeTab === 'transfers' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <Truck className="w-4 h-4 mr-2" />
          跨校調撥 (Transfers)
        </button>
        <button
          onClick={() => setActiveTab('retirement')}
          className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center ${
            activeTab === 'retirement' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          報廢汰除 (Retirement)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Inventory Tab Content */}
          {activeTab === 'inventory' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-bold text-slate-800">資產明細清單</h3>
                  <button 
                    onClick={() => setIsNewTransferModalOpen(true)}
                    disabled={selectedInventoryIds.length === 0}
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm ${
                      selectedInventoryIds.length > 0 
                        ? 'bg-amber-500 text-white hover:bg-amber-600' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    申請調撥 {selectedInventoryIds.length > 0 && `(${selectedInventoryIds.length})`}
                  </button>
                </div>
                <div className="relative w-full sm:w-64">
                  <input 
                    type="text" 
                    placeholder="搜尋序號或型號..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider bg-slate-50/50">
                      <th className="p-4 pl-6 w-12">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          onChange={handleSelectAllInventory}
                          checked={selectedInventoryIds.length === inventoryData.filter(item => item.status !== 'RETIRED' && item.status !== 'TRANSIT').length && inventoryData.length > 0}
                        />
                      </th>
                      <th className="p-4">STATUS</th>
                      <th className="p-4">SERIAL / MODEL</th>
                      <th className="p-4">PURCHASE DATE</th>
                      <th className="p-4">ASSIGNED TO</th>
                      <th className="p-4">FUNDING</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inventoryData.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 pl-6">
                          <input 
                            type="checkbox" 
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:opacity-30"
                            checked={selectedInventoryIds.includes(item.id)}
                            onChange={() => handleSelectInventoryItem(item.id)}
                            disabled={item.status === 'RETIRED' || item.status === 'TRANSIT'}
                          />
                        </td>
                        <td className="p-4">{getStatusBadge(item.status)}</td>
                        <td className="p-4">
                          <div className="font-bold text-slate-800">{item.serial}</div>
                          <div className="text-sm text-slate-500">{item.model}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-slate-800">{item.purchaseDate}</div>
                          <div className="text-xs text-slate-400">保固至: {item.warranty}</div>
                        </td>
                        <td className="p-4 font-medium text-slate-800">{item.assignedTo}</td>
                        <td className="p-4 text-slate-600">{item.funding}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Transfers Tab Content */}
          {activeTab === 'transfers' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-amber-500" />
                  進行中的調撥 (Active Transfers)
                </h3>
                <button 
                  onClick={() => setIsNewTransferModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  建立新調撥單 (New Request)
                </button>
              </div>

              <div className="space-y-4">
                {transferData.map((transfer) => (
                  <div key={transfer.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <ArrowRight className="w-6 h-6 text-amber-500" />
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="font-bold text-slate-800 text-lg">To: {transfer.to}</span>
                          {getTransferStatusBadge(transfer.status)}
                        </div>
                        <div className="text-sm text-slate-500 mb-2">
                          {transfer.items} • {transfer.date}
                        </div>
                        <div className="flex items-center text-xs text-slate-400">
                          <FileText className="w-3.5 h-3.5 mr-1" />
                          {transfer.doc}
                        </div>
                      </div>
                    </div>
                    <div>
                      {transfer.status === '待接收' ? (
                        <button 
                          onClick={() => {
                            toast.success('已確認收貨', { description: `設備已成功納入本校資產清冊。` });
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          確認收貨
                        </button>
                      ) : transfer.action === 'view' ? (
                        <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                          檢視詳情
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setIsCloseCaseModalOpen(true)}
                            className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors flex items-center"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            上傳結案紀錄
                          </button>
                          <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                            檢視詳情
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Retirement Tab Content */}
          {activeTab === 'retirement' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">符合報廢資格設備 (Eligible for Retirement)</h3>
                  <p className="text-sm text-slate-500 mt-1">以下設備已超過使用年限 (4年) 或損壞無法修復，建議申請報廢以釋放管理資源。</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <select
                      value={retirementFilter}
                      onChange={(e) => {
                        setRetirementFilter(e.target.value);
                        setSelectedRetirementItems([]);
                      }}
                      className="appearance-none pl-10 pr-8 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="all">所有原因 (All Reasons)</option>
                      <option value="已達年限">已達年限</option>
                      <option value="損壞無法修復">損壞無法修復</option>
                      <option value="遺失">遺失</option>
                    </select>
                    <Filter className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                    <div className="absolute right-3 top-3 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setRetiringItemId(null);
                      setIsRetirementModalOpen(true);
                    }}
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ${
                      selectedRetirementItems.length > 0 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                    disabled={selectedRetirementItems.length === 0}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    批次報廢 ({selectedRetirementItems.length})
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider bg-slate-50/50">
                      <th className="p-4 pl-6 w-12">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          onChange={handleSelectAllRetirement}
                          checked={selectedRetirementItems.length === filteredRetirementData.length && filteredRetirementData.length > 0}
                        />
                      </th>
                      <th className="p-4">設備序號 (Serial)</th>
                      <th className="p-4">型號 (Model)</th>
                      <th className="p-4">購入日期 (Purchase Date)</th>
                      <th className="p-4">報廢原因 (Reason)</th>
                      <th className="p-4 text-right pr-6">操作 (Action)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRetirementData.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 pl-6">
                          <input 
                            type="checkbox" 
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            checked={selectedRetirementItems.includes(item.id)}
                            onChange={() => handleSelectRetirementItem(item.id)}
                          />
                        </td>
                        <td className="p-4 font-bold text-slate-800">{item.serial}</td>
                        <td className="p-4 text-slate-600">{item.model}</td>
                        <td className="p-4 text-slate-600">{item.purchaseDate}</td>
                        <td className="p-4">{getReasonBadge(item.reason)}</td>
                        <td className="p-4 text-right pr-6">
                          <button 
                            onClick={() => {
                              setRetiringItemId(item.id);
                              setIsRetirementModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors"
                          >
                            個別申請
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Age Distribution Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6">設備機齡分佈 (Age Distribution)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ageDistributionData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="age" type="category" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} width={60} />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                    {ageDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.age === '> 4 年' ? '#ef4444' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-4 text-sm text-slate-500">
              紅色列為建議汰換設備
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">常用功能 (Quick Actions)</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group">
                <span className="font-medium text-slate-700 group-hover:text-blue-700">批次匯入新機 (CSV)</span>
                <FileText className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group">
                <span className="font-medium text-slate-700 group-hover:text-blue-700">下載財產標籤</span>
                <QrCode className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* New Transfer Modal */}
      {isNewTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">建立跨校調撥申請</h3>
              <button onClick={() => setIsNewTransferModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  已選擇設備 ({selectedInventoryIds.length})
                </h4>
                <div className="max-h-24 overflow-y-auto space-y-1">
                  {inventoryData.filter(i => selectedInventoryIds.includes(i.id)).map(device => (
                    <div key={device.id} className="text-xs text-blue-700 flex justify-between">
                      <span>{device.serial}</span>
                      <span>{device.model}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">目標學校 (Target School)</label>
                  <select className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none">
                    <option value="">請選擇目標學校...</option>
                    <option>永康國小</option>
                    <option>復興國小</option>
                    <option>安平國小</option>
                    <option>海東國小</option>
                    <option>樹林國小</option>
                    <option>左鎮國小</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">調撥原因 (Transfer Reason)</label>
                  <select className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none">
                    <option value="">請選擇原因...</option>
                    <option>偏鄉數位資源補強計畫</option>
                    <option>班級增班設備需求</option>
                    <option>跨校資源共享專案</option>
                    <option>其他</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">預計運送日期 (Estimated Shipping Date)</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">上傳核章申請書 (Signed Application)</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer group">
                    <Upload className="w-8 h-8 text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" />
                    <p className="text-sm font-bold text-slate-700 mb-1">點擊或拖曳上傳 PDF</p>
                    <p className="text-xs text-slate-400">請確保已完成校內核章程序</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <button 
                onClick={() => setIsNewTransferModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  setIsNewTransferModalOpen(false);
                  setSelectedInventoryIds([]);
                }}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
              >
                送出申請
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close Case Modal */}
      {isCloseCaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-3">上傳結案紀錄 (Close Case)</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                請確認實體設備已完成移轉，並上傳雙方簽署之財產移轉證明文件。
              </p>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">財產移轉證明文件</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-emerald-400 transition-all cursor-pointer group">
                  <FileText className="w-10 h-10 text-slate-400 mb-3 group-hover:text-emerald-500 transition-colors" />
                  <p className="text-base font-bold text-slate-700 mb-1">點擊上傳已簽署文件</p>
                  <p className="text-sm text-slate-400">支援 PDF, JPG</p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <button 
                onClick={() => setIsCloseCaseModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => setIsCloseCaseModalOpen(false)}
                className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm"
              >
                確認結案
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Retirement Modal */}
      {isRetirementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">設備報廢申請 (Retirement Process)</h3>
                <AlertCircle className="w-5 h-5 text-slate-400" />
              </div>

              {/* Device Info */}
              <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-3">
                {retiringItemId ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-sm">設備序號</span>
                      <span className="font-bold text-slate-800">{retiringItemData?.serial}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-sm">設備型號</span>
                      <span className="font-bold text-slate-800">{retiringItemData?.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-sm">經費來源</span>
                      <span className="font-bold text-slate-800">{retiringItemData?.funding}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-sm">批次報廢數量</span>
                    <span className="font-bold text-slate-800">共 {selectedRetirementItems.length} 台設備</span>
                  </div>
                )}
              </div>

              {/* Warning Box */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
                <h4 className="font-bold text-amber-800 mb-2">報廢流程說明</h4>
                <p className="text-sm text-amber-700 mb-3 font-medium">報廢後通報教育局是為了核准與進行財產清冊的更新。</p>
                <ol className="text-sm text-amber-700/80 space-y-2 list-decimal list-inside">
                  <li>請依校內財產管理規定，填寫財產報廢單（可批次列表）。</li>
                  <li>完成校內核章程序（總務處、校長）。</li>
                  <li>將核章後之報廢單掃描或拍照上傳至本系統。</li>
                  <li>教育局審核通過後，始得進行實體廢棄物處理。</li>
                </ol>
              </div>

              {/* Upload */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">上傳核章報廢單 (Signed Document)</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer group">
                  <Upload className="w-8 h-8 text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" />
                  <p className="text-sm font-bold text-slate-700 mb-1">點擊上傳檔案</p>
                  <p className="text-xs text-slate-400">支援 PDF, JPG, PNG (Max 10MB)</p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <button 
                onClick={() => setIsRetirementModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  setIsRetirementModalOpen(false);
                  if (!retiringItemId) setSelectedRetirementItems([]);
                }}
                className="px-5 py-2.5 bg-[#e04f33] text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors shadow-sm flex items-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                送出申請
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolDeviceLifecycle;