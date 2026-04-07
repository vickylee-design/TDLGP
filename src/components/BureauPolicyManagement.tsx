import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Smartphone, 
  Clock, 
  Wifi, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  Settings2,
  X
} from 'lucide-react';

// Mock Data
const policyStats = [
  { label: '總政策數', value: 24, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { label: '執行中', value: 18, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  { label: '派發中', value: 2, color: 'text-amber-600', bgColor: 'bg-amber-50' },
  { label: '異常/失敗', value: 4, color: 'text-rose-600', bgColor: 'bg-rose-50' },
];

const initialPolicies = [
  { 
    id: 'POL-001', 
    name: '全市預設教學 App 白名單', 
    category: 'apps', 
    target: '全市所有學校 (國中小)', 
    status: 'active', 
    updatedAt: '2026-03-01 10:00',
    successRate: 99.2
  },
  { 
    id: 'POL-002', 
    name: '深夜時段禁用政策 (22:00-06:00)', 
    category: 'time', 
    target: '全市所有學校 (國中小)', 
    status: 'active', 
    updatedAt: '2026-02-15 14:30',
    successRate: 98.5
  },
  { 
    id: 'POL-003', 
    name: '禁止安裝非授權描述檔', 
    category: 'features', 
    target: '全市所有學校 (國中小)', 
    status: 'active', 
    updatedAt: '2026-01-20 09:15',
    successRate: 99.8
  },
  { 
    id: 'POL-004', 
    name: '校園公用 Wi-Fi 自動連線設定', 
    category: 'network', 
    target: '全市所有學校 (國中小)', 
    status: 'deploying', 
    updatedAt: '2026-03-10 08:00',
    successRate: 45.0
  },
  { 
    id: 'POL-005', 
    name: '段考模式 (鎖定單一測驗 App)', 
    category: 'features', 
    target: '指定學校 (共 15 所)', 
    status: 'inactive', 
    updatedAt: '2026-03-05 16:45',
    successRate: 0
  },
  { 
    id: 'POL-006', 
    name: '社群媒體與遊戲類 App 封鎖', 
    category: 'apps', 
    target: '全市所有學校 (國中小)', 
    status: 'error', 
    updatedAt: '2026-03-09 11:20',
    successRate: 82.4
  },
];

const categories = [
  { id: 'all', label: '全部政策', icon: ShieldCheck },
  { id: 'apps', label: '應用程式', icon: Smartphone },
  { id: 'time', label: '使用時間', icon: Clock },
  { id: 'features', label: '設備功能', icon: Settings2 },
  { id: 'network', label: '網路設定', icon: Wifi },
];

const mockApps = [
  { id: 'app1', name: 'Google Classroom' },
  { id: 'app2', name: 'Kahoot!' },
  { id: 'app3', name: '均一教育平台' },
  { id: 'app4', name: 'YouTube' },
  { id: 'app5', name: 'TikTok' },
  { id: 'app6', name: 'Facebook' },
  { id: 'app7', name: 'Instagram' },
];

const mockSchools = [
  { id: 'sch1', name: '市立第一國民中學' },
  { id: 'sch2', name: '市立第二國民中學' },
  { id: 'sch3', name: '市立第三國民中學' },
  { id: 'sch4', name: '市立第一國民小學' },
  { id: 'sch5', name: '市立第二國民小學' },
];

const BureauPolicyManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [policies, setPolicies] = useState(initialPolicies);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'apps',
    target: 'all',
    selectedSchools: [] as string[],
    // Apps specific
    appMode: 'blacklist',
    selectedApps: [] as string[],
    // Time specific
    timeMode: 'block',
    startTime: '22:00',
    endTime: '06:00',
    // Features specific
    featureCamera: true,
    featureAppStore: false,
    featureScreenCapture: true,
    featureFactoryReset: false,
    // Network specific
    wifiSsid: '',
    wifiPassword: '',
    wifiAutoJoin: true,
  });

  const filteredPolicies = policies.filter(policy => {
    const matchesTab = activeTab === 'all' || policy.category === activeTab;
    const matchesSearch = policy.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          policy.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle2 className="w-3 h-3 mr-1" /> 執行中</span>;
      case 'deploying':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><PlayCircle className="w-3 h-3 mr-1" /> 派發中</span>;
      case 'inactive':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800"><PauseCircle className="w-3 h-3 mr-1" /> 已停用</span>;
      case 'error':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800"><AlertCircle className="w-3 h-3 mr-1" /> 派發異常</span>;
      default:
        return null;
    }
  };

  const getCategoryLabel = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.label : categoryId;
  };

  const handleAppToggle = (appId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedApps: prev.selectedApps.includes(appId)
        ? prev.selectedApps.filter(id => id !== appId)
        : [...prev.selectedApps, appId]
    }));
  };

  const handleSchoolToggle = (schoolId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSchools: prev.selectedSchools.includes(schoolId)
        ? prev.selectedSchools.filter(id => id !== schoolId)
        : [...prev.selectedSchools, schoolId]
    }));
  };

  const handleSavePolicy = () => {
    if (!formData.name) {
      alert('請輸入政策名稱');
      return;
    }
    
    if (formData.target === 'specific' && formData.selectedSchools.length === 0) {
      alert('請至少選擇一所學校');
      return;
    }

    const newPolicy = {
      id: `POL-00${policies.length + 1}`,
      name: formData.name,
      category: formData.category,
      target: formData.target === 'all' ? '全市所有學校 (國中小)' : `指定學校 (共 ${formData.selectedSchools.length} 所)`,
      status: 'deploying',
      updatedAt: new Date().toLocaleString('zh-TW', { hour12: false }).slice(0, 16),
      successRate: 0
    };

    setPolicies([newPolicy, ...policies]);
    setIsModalOpen(false);
    // Reset form
    setFormData({
      ...formData,
      name: '',
      category: 'apps',
      target: 'all',
      selectedSchools: [],
      selectedApps: [],
      wifiSsid: '',
      wifiPassword: ''
    });
  };

  const renderDynamicFields = () => {
    switch (formData.category) {
      case 'apps':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">管制模式</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="appMode" 
                    value="blacklist" 
                    checked={formData.appMode === 'blacklist'}
                    onChange={(e) => setFormData({...formData, appMode: e.target.value})}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">黑名單 (禁止安裝/執行)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="appMode" 
                    value="whitelist" 
                    checked={formData.appMode === 'whitelist'}
                    onChange={(e) => setFormData({...formData, appMode: e.target.value})}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">白名單 (僅允許安裝/執行)</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">選擇應用程式</label>
              <div className="border border-slate-200 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2 bg-slate-50">
                {mockApps.map(app => (
                  <label key={app.id} className="flex items-center space-x-3 p-2 hover:bg-white rounded-md cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={formData.selectedApps.includes(app.id)}
                      onChange={() => handleAppToggle(app.id)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">{app.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      case 'time':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">時間管制模式</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="timeMode" 
                    value="block" 
                    checked={formData.timeMode === 'block'}
                    onChange={(e) => setFormData({...formData, timeMode: e.target.value})}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">禁用時段 (鎖定設備)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="timeMode" 
                    value="allow" 
                    checked={formData.timeMode === 'allow'}
                    onChange={(e) => setFormData({...formData, timeMode: e.target.value})}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">准用時段 (僅此時段可用)</span>
                </label>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">開始時間</label>
                <input 
                  type="time" 
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">結束時間</label>
                <input 
                  type="time" 
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        );
      case 'features':
        return (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <div>
                <div className="text-sm font-medium text-slate-800">允許使用相機</div>
                <div className="text-xs text-slate-500">學生可使用設備的相機功能</div>
              </div>
              <input 
                type="checkbox" 
                checked={formData.featureCamera}
                onChange={(e) => setFormData({...formData, featureCamera: e.target.checked})}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <div>
                <div className="text-sm font-medium text-slate-800">允許存取 App Store / Google Play</div>
                <div className="text-xs text-slate-500">學生可自行瀏覽與下載應用程式</div>
              </div>
              <input 
                type="checkbox" 
                checked={formData.featureAppStore}
                onChange={(e) => setFormData({...formData, featureAppStore: e.target.checked})}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <div>
                <div className="text-sm font-medium text-slate-800">允許螢幕截圖 / 錄影</div>
                <div className="text-xs text-slate-500">學生可擷取設備畫面</div>
              </div>
              <input 
                type="checkbox" 
                checked={formData.featureScreenCapture}
                onChange={(e) => setFormData({...formData, featureScreenCapture: e.target.checked})}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <div>
                <div className="text-sm font-medium text-slate-800">允許重設為原廠設定</div>
                <div className="text-xs text-rose-500">警告：開啟此功能可能導致設備脫管</div>
              </div>
              <input 
                type="checkbox" 
                checked={formData.featureFactoryReset}
                onChange={(e) => setFormData({...formData, featureFactoryReset: e.target.checked})}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        );
      case 'network':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Wi-Fi 名稱 (SSID)</label>
              <input 
                type="text" 
                value={formData.wifiSsid}
                onChange={(e) => setFormData({...formData, wifiSsid: e.target.value})}
                placeholder="例如: TANetRoaming"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Wi-Fi 密碼</label>
              <input 
                type="password" 
                value={formData.wifiPassword}
                onChange={(e) => setFormData({...formData, wifiPassword: e.target.value})}
                placeholder="輸入密碼 (若無則留空)"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.wifiAutoJoin}
                onChange={(e) => setFormData({...formData, wifiAutoJoin: e.target.checked})}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">自動連線至此網路</span>
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">全域政策管理</h2>
          <p className="text-slate-500 mt-1">管理與派發全市層級的 MDM 設備管控政策</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          新增全域政策
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {policyStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.bgColor} ${stat.color}`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
          {/* Tabs */}
          <div className="flex space-x-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === category.id 
                    ? 'bg-white text-blue-600 shadow-sm border border-slate-200' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <category.icon className="w-4 h-4 mr-2" />
                {category.label}
              </button>
            ))}
          </div>

          {/* Search & Filter */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input 
                type="text" 
                placeholder="搜尋政策名稱或 ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <button className="p-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Policy Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">政策名稱 / ID</th>
                <th className="px-6 py-4 font-medium">類別</th>
                <th className="px-6 py-4 font-medium">套用範圍</th>
                <th className="px-6 py-4 font-medium">狀態</th>
                <th className="px-6 py-4 font-medium">派發成功率</th>
                <th className="px-6 py-4 font-medium">最後更新</th>
                <th className="px-6 py-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPolicies.length > 0 ? (
                filteredPolicies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{policy.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{policy.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                        {getCategoryLabel(policy.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {policy.target}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(policy.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-slate-200 rounded-full h-1.5 max-w-[100px]">
                          <div 
                            className={`h-1.5 rounded-full ${
                              policy.successRate > 95 ? 'bg-emerald-500' : 
                              policy.successRate > 50 ? 'bg-amber-500' : 
                              policy.successRate === 0 ? 'bg-slate-300' : 'bg-rose-500'
                            }`} 
                            style={{ width: `${policy.successRate}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-slate-600">{policy.successRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {policy.updatedAt}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-base font-medium text-slate-900">找不到符合的政策</p>
                    <p className="text-sm mt-1">請嘗試調整搜尋關鍵字或篩選條件</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (Mock) */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50">
          <div>顯示 1 至 {filteredPolicies.length} 筆，共 {filteredPolicies.length} 筆</div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-slate-300 rounded bg-white text-slate-400 cursor-not-allowed">上一頁</button>
            <button className="px-3 py-1 border border-blue-600 rounded bg-blue-600 text-white">1</button>
            <button className="px-3 py-1 border border-slate-300 rounded bg-white hover:bg-slate-50">下一頁</button>
          </div>
        </div>
      </div>

      {/* Create Policy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">新增全域政策</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">政策名稱 <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="例如：全市國中考試模式"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">政策類別</label>
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      >
                        {categories.filter(c => c.id !== 'all').map(c => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">套用範圍</label>
                      <select 
                        value={formData.target}
                        onChange={(e) => setFormData({...formData, target: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      >
                        <option value="all">全市所有學校 (國中小)</option>
                        <option value="specific">指定學校 / 群組</option>
                      </select>
                    </div>
                  </div>

                  {formData.target === 'specific' && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="block text-sm font-medium text-slate-700 mb-2">選擇指定學校 <span className="text-rose-500">*</span></label>
                      <div className="border border-slate-200 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2 bg-slate-50">
                        {mockSchools.map(school => (
                          <label key={school.id} className="flex items-center space-x-3 p-2 hover:bg-white rounded-md cursor-pointer transition-colors">
                            <input 
                              type="checkbox" 
                              checked={formData.selectedSchools.includes(school.id)}
                              onChange={() => handleSchoolToggle(school.id)}
                              className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-slate-700">{school.name}</span>
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 mt-2">已選擇 {formData.selectedSchools.length} 所學校</p>
                    </div>
                  )}
                </div>

                <hr className="border-slate-200" />

                {/* Dynamic Configuration Area */}
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center">
                    <Settings2 className="w-4 h-4 mr-2 text-blue-500" />
                    詳細設定 ({getCategoryLabel(formData.category)})
                  </h4>
                  {renderDynamicFields()}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3 bg-slate-50 rounded-b-xl">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleSavePolicy}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                儲存並派發
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BureauPolicyManagement;