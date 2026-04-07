import React, { useState } from 'react';
import { Settings2, RefreshCw, Save, ShieldAlert, Clock, Smartphone, FileText, Search, Lock, Unlock, AlertTriangle } from 'lucide-react';

type TabType = 'routine' | 'apps' | 'exam';

interface AppPolicy {
  id: string;
  name: string;
  category: string;
  bureauPolicy: '強制安裝' | '禁止使用' | '開放自訂';
  schoolAction: '無法變更' | '允許使用' | '校內封鎖';
  icon: string;
}

const mockApps: AppPolicy[] = [
  { id: '1', name: 'Google Classroom', category: 'Education', bureauPolicy: '強制安裝', schoolAction: '無法變更', icon: 'G' },
  { id: '2', name: 'YouTube', category: 'Video', bureauPolicy: '禁止使用', schoolAction: '無法變更', icon: 'Y' },
  { id: '3', name: 'Chrome', category: 'Browser', bureauPolicy: '開放自訂', schoolAction: '允許使用', icon: 'C' },
  { id: '4', name: 'Minecraft Edu', category: 'Game', bureauPolicy: '開放自訂', schoolAction: '校內封鎖', icon: 'M' },
  { id: '5', name: 'Calculator', category: 'Tools', bureauPolicy: '開放自訂', schoolAction: '允許使用', icon: '=' },
  { id: '6', name: 'Netflix', category: 'Entertainment', bureauPolicy: '禁止使用', schoolAction: '無法變更', icon: 'N' },
  { id: '7', name: 'Zoom', category: 'Communication', bureauPolicy: '開放自訂', schoolAction: '允許使用', icon: 'Z' },
];

const SchoolPolicyAdjustment: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('routine');
  const [isNapTimeLocked, setIsNapTimeLocked] = useState(true);
  const [isExamModeEnabled, setIsExamModeEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = mockApps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getBureauPolicyBadge = (policy: string) => {
    switch (policy) {
      case '強制安裝':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700"><Lock className="w-3 h-3 mr-1" />{policy}</span>;
      case '禁止使用':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700"><Lock className="w-3 h-3 mr-1" />{policy}</span>;
      case '開放自訂':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700"><Unlock className="w-3 h-3 mr-1" />{policy}</span>;
      default:
        return null;
    }
  };

  const getSchoolActionBadge = (action: string) => {
    switch (action) {
      case '無法變更':
        return <span className="text-xs font-medium text-slate-400">{action}</span>;
      case '允許使用':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700">{action}</span>;
      case '校內封鎖':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700">{action}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <Settings2 className="w-6 h-6 mr-2 text-blue-600" />
            校內政策微調 (Policy Adjustment)
          </h2>
          <p className="text-sm text-slate-500 mt-1">在教育局規範的框架下，制定符合本校需求的管理規則與考試模式。</p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            同步局端政策
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <Save className="w-4 h-4 mr-2" />
            儲存設定
          </button>
        </div>
      </div>

      {/* Policy Explanation Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start">
        <ShieldAlert className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-blue-900 mb-1">政策權限說明</h4>
          <p className="text-xs text-blue-700">
            本頁面僅能調整「教育局授權 (OPEN)」的項目。標示為 <Lock className="w-3 h-3 inline mx-0.5" /> 的項目為全市統一規範，學校無法變更。若有特殊需求，請向教育局資科科提出例外申請。
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100/50 p-1 rounded-xl w-fit border border-slate-200">
        <button
          onClick={() => setActiveTab('routine')}
          className={`flex items-center px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'routine'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
          }`}
        >
          <Clock className="w-4 h-4 mr-2" />
          作息與圍籬 (Routine)
        </button>
        <button
          onClick={() => setActiveTab('apps')}
          className={`flex items-center px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'apps'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
          }`}
        >
          <Smartphone className="w-4 h-4 mr-2" />
          應用程式權限 (Apps)
        </button>
        <button
          onClick={() => setActiveTab('exam')}
          className={`flex items-center px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'exam'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
          }`}
        >
          <FileText className="w-4 h-4 mr-2" />
          考試模式 (Exam Mode)
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <div className="flex-1">
          {activeTab === 'routine' && (
            <div className="space-y-6">
              {/* Quiet Hours */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center">
                    <div className="w-1.5 h-6 bg-amber-500 rounded-full mr-3"></div>
                    午休與晨讀鎖定 (Quiet Hours)
                  </h3>
                </div>
                <div className="p-6 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-bold text-slate-700">午休自動鎖定 (Nap Time Lock)</span>
                    <button 
                      onClick={() => setIsNapTimeLocked(!isNapTimeLocked)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isNapTimeLocked ? 'bg-amber-500' : 'bg-slate-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isNapTimeLocked ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">開始</label>
                      <div className="relative">
                        <input 
                          type="time" 
                          defaultValue="12:30"
                          disabled={!isNapTimeLocked}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
                        />
                      </div>
                    </div>
                    <div className="text-slate-400 mt-6">-</div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">結束</label>
                      <div className="relative">
                        <input 
                          type="time" 
                          defaultValue="13:30"
                          disabled={!isNapTimeLocked}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">* 鎖定期間設備將黑屏靜音，僅允許緊急通話。</p>
                </div>
              </div>

              {/* Geofence */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></div>
                    校園地理圍籬 (Geofence)
                  </h3>
                </div>
                <div className="p-6">
                  <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-300 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400 font-medium border border-slate-200">
                        Map Img
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 mb-1">校本部範圍</h4>
                        <p className="text-xs text-slate-500">當設備離開校園範圍時，自動觸發「遺失模式」或發送警報通知管理員。</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-md">Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apps' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">應用程式權限管理</h3>
                <div className="relative w-64">
                  <input
                    type="text"
                    placeholder="搜尋 App..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider bg-slate-50/50">
                      <th className="p-4 pl-6">App Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Bureau Policy</th>
                      <th className="p-4 text-right pr-6">School Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredApps.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-md bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                              {app.icon}
                            </div>
                            <span className="font-bold text-slate-700">{app.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-slate-500">{app.category}</td>
                        <td className="p-4">{getBureauPolicyBadge(app.bureauPolicy)}</td>
                        <td className="p-4 text-right pr-6">{getSchoolActionBadge(app.schoolAction)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'exam' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 bg-purple-50/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-purple-900 mb-1">考試模式 (Exam Mode)</h3>
                    <p className="text-xs text-purple-700/70">啟用後，全校或指定班級將進入單一應用或白名單模式，並停用截圖與網路搜尋功能。</p>
                  </div>
                  <button 
                    onClick={() => setIsExamModeEnabled(!isExamModeEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${isExamModeEnabled ? 'bg-purple-600' : 'bg-slate-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isExamModeEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Active Profile Summary */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-4">當前生效政策 (Active Profile)</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-sm text-slate-500">局端規範</span>
                <span className="text-sm font-bold text-slate-800">v2023.10 (Standard)</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-sm text-slate-500">校內微調</span>
                <span className="text-sm font-bold text-blue-600">+12 項規則</span>
              </div>
              
              <div>
                <span className="block text-xs text-slate-400 mb-2">特別限制 (Exceptions)</span>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-600 border border-red-100">
                    封鎖 Minecraft
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100">
                    午休 12:30-13:30
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-800">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">政策衝突檢測</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  系統未偵測到與局端政策衝突的設定。您的校內微調均在授權範圍內。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolPolicyAdjustment;