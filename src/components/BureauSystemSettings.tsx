import React, { useState } from 'react';
import { 
  Settings, 
  RefreshCw, 
  Save, 
  Database, 
  Users, 
  Link as LinkIcon, 
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Server,
  Globe,
  Plus,
  Shield,
  Calendar
} from 'lucide-react';

type TabType = 'general' | 'accounts' | 'integrations' | 'audit';

const BureauSystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('general');

  // General Settings State
  const [platformName, setPlatformName] = useState('臺南市教學平板治理平台');
  const [supportEmail, setSupportEmail] = useState('support@edu.tainan.gov.tw');
  const [bannerMessage, setBannerMessage] = useState('');
  const [learningDataRetention, setLearningDataRetention] = useState('3_years');
  const [locationDataRetention, setLocationDataRetention] = useState('30_days');

  // Integrations State
  const [ssoEnabled, setSsoEnabled] = useState(true);
  const [sisSyncEnabled, setSisSyncEnabled] = useState(true);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6">平台基本資訊</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">平台名稱</label>
                <input 
                  type="text" 
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">聯絡支援 EMAIL</label>
                <input 
                  type="email" 
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="mb-10">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">系統公告 (BANNER MESSAGE)</label>
              <textarea 
                placeholder="輸入全域公告訊息..."
                value={bannerMessage}
                onChange={(e) => setBannerMessage(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none h-24"
              />
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-6">資料保留策略 (Data Retention)</h3>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3 mb-6">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                注意：縮短資料保留期限將會永久刪除超過期限的歷史數據。請依照法規要求設定。
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <div className="font-bold text-slate-800 text-sm">學習歷程數據</div>
                  <div className="text-xs text-slate-500 mt-1">包含 App 使用時數、網頁瀏覽紀錄</div>
                </div>
                <select 
                  value={learningDataRetention}
                  onChange={(e) => setLearningDataRetention(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1_year">保留 1 年</option>
                  <option value="3_years">保留 3 年 (標準)</option>
                  <option value="5_years">保留 5 年</option>
                  <option value="forever">永久保留</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <div className="font-bold text-slate-800 text-sm">資產位置追蹤</div>
                  <div className="text-xs text-slate-500 mt-1">GPS 定位紀錄</div>
                </div>
                <select 
                  value={locationDataRetention}
                  onChange={(e) => setLocationDataRetention(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="7_days">保留 7 天</option>
                  <option value="30_days">保留 30 天</option>
                  <option value="90_days">保留 90 天</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 'accounts':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">管理員列表</h3>
              <button className="inline-flex items-center px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                新增帳號
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="pb-3 pl-2">User</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Last Login</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 pl-2">
                      <div className="font-bold text-slate-800 text-sm">系統管理員 (Root)</div>
                      <div className="text-xs text-slate-400 mt-0.5">admin@edu.tainan.gov.tw</div>
                    </td>
                    <td className="py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                        <Shield className="w-3 h-3 mr-1" /> Super Admin
                      </span>
                    </td>
                    <td className="py-4 text-sm text-slate-600">2023-10-27 09:30</td>
                    <td className="py-4">
                      <span className="text-sm font-bold text-emerald-600">Active</span>
                    </td>
                    <td className="py-4 text-right pr-4">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 pl-2">
                      <div className="font-bold text-slate-800 text-sm">資科科長</div>
                      <div className="text-xs text-slate-400 mt-0.5">chief@edu.tainan.gov.tw</div>
                    </td>
                    <td className="py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        Editor
                      </span>
                    </td>
                    <td className="py-4 text-sm text-slate-600">2023-10-26 14:15</td>
                    <td className="py-4">
                      <span className="text-sm font-bold text-emerald-600">Active</span>
                    </td>
                    <td className="py-4 text-right pr-4">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 pl-2">
                      <div className="font-bold text-slate-800 text-sm">外部督導</div>
                      <div className="text-xs text-slate-400 mt-0.5">audit@moe.gov.tw</div>
                    </td>
                    <td className="py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        Viewer
                      </span>
                    </td>
                    <td className="py-4 text-sm text-slate-600">2023-10-20 10:00</td>
                    <td className="py-4">
                      <span className="text-sm font-bold text-slate-400">Inactive</span>
                    </td>
                    <td className="py-4 text-right pr-4">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'integrations':
        return (
          <div className="space-y-6">
            {/* MDM Connections */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Server className="w-5 h-5 text-slate-700" />
                <h3 className="text-lg font-bold text-slate-800">MDM 服務連線</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-700">J</div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">Jamf Pro</div>
                      <div className="text-xs text-slate-500">iOS/macOS Management</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Connected
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">Ping: 45ms</div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-700">G</div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">Google Workspace</div>
                      <div className="text-xs text-slate-500">User & Chromebook Sync</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Connected
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">Ping: 32ms</div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">API ENDPOINT CONFIGURATION</label>
                <div className="flex space-x-3">
                  <input 
                    type="text" 
                    value="https://api.jamfcloud.com/v1/"
                    readOnly
                    className="flex-grow px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 font-mono outline-none"
                  />
                  <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
                    Test Connection
                  </button>
                </div>
              </div>
            </div>

            {/* Identity & Sync */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Globe className="w-5 h-5 text-slate-700" />
                <h3 className="text-lg font-bold text-slate-800">身份認證與學籍同步</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-bold text-slate-800 text-sm">OpenID Connect (SSO)</div>
                      <div className="text-xs text-slate-500 mt-0.5">用於全市師生單一登入</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSsoEnabled(!ssoEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${ssoEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${ssoEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <Database className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-bold text-slate-800 text-sm">學籍系統 (SIS) 自動同步</div>
                      <div className="text-xs text-slate-500 mt-0.5">每日 02:00 自動同步班級名單</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSisSyncEnabled(!sisSyncEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${sisSyncEnabled ? 'bg-purple-600' : 'bg-slate-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${sisSyncEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'audit':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">系統稽核紀錄 (System Logs)</h3>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="dd/mm/yyyy"
                    className="pl-3 pr-10 py-1.5 border border-slate-300 rounded-lg text-sm text-slate-600 w-36 outline-none focus:border-blue-500"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-2" />
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center">
                  匯出 CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="pb-3 pl-2">Timestamp</th>
                    <th className="pb-3">User</th>
                    <th className="pb-3">Action</th>
                    <th className="pb-3">Resource</th>
                    <th className="pb-3 text-right pr-4">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 pl-2 text-sm font-mono text-slate-600">2023-10-27 10:23:45</td>
                    <td className="py-4 text-sm font-bold text-slate-800">系統管理員</td>
                    <td className="py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-mono border border-slate-200">Update Policy</span>
                    </td>
                    <td className="py-4 text-sm text-slate-600">Global Filter Rules</td>
                    <td className="py-4 text-right pr-4 font-bold text-sm text-emerald-600">Success</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 pl-2 text-sm font-mono text-slate-600">2023-10-27 09:15:20</td>
                    <td className="py-4 text-sm font-bold text-slate-800">資科科長</td>
                    <td className="py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-mono border border-slate-200">Export Report</span>
                    </td>
                    <td className="py-4 text-sm text-slate-600">Asset_Inventory_Q3.pdf</td>
                    <td className="py-4 text-right pr-4 font-bold text-sm text-emerald-600">Success</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 pl-2 text-sm font-mono text-slate-600">2023-10-26 16:40:11</td>
                    <td className="py-4 text-sm font-bold text-slate-800">Unknown</td>
                    <td className="py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-mono border border-slate-200">Login Attempt</span>
                    </td>
                    <td className="py-4 text-sm text-slate-600">Admin Portal</td>
                    <td className="py-4 text-right pr-4 font-bold text-sm text-rose-600">Failed</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 pl-2 text-sm font-mono text-slate-600">2023-10-26 14:20:05</td>
                    <td className="py-4 text-sm font-bold text-slate-800">資科科長</td>
                    <td className="py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-mono border border-slate-200">Unlock Device</span>
                    </td>
                    <td className="py-4 text-sm text-slate-600">iPad-SN-99882</td>
                    <td className="py-4 text-right pr-4 font-bold text-sm text-emerald-600">Success</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto bg-slate-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-start space-x-3">
          <div className="mt-1 text-slate-700">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">系統設定與組態 (System Settings)</h2>
            <p className="text-slate-500 mt-1 text-sm">管理平台全域設定、外部系統整合連線與管理員權限配置。</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            重置快取
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors shadow-sm">
            <Save className="w-4 h-4 mr-2" />
            儲存變更
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Tabs & Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto bg-slate-200/50 p-1 rounded-xl w-fit">
            <button 
              onClick={() => setActiveTab('general')}
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${activeTab === 'general' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200/50'}`}
            >
              <Database className="w-4 h-4 mr-2" />
              一般設定 (General)
            </button>
            <button 
              onClick={() => setActiveTab('accounts')}
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${activeTab === 'accounts' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200/50'}`}
            >
              <Users className="w-4 h-4 mr-2" />
              帳號權限 (Accounts)
            </button>
            <button 
              onClick={() => setActiveTab('integrations')}
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${activeTab === 'integrations' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200/50'}`}
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              外部整合 (Integrations)
            </button>
            <button 
              onClick={() => setActiveTab('audit')}
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${activeTab === 'audit' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200/50'}`}
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              稽核軌跡 (Audit Logs)
            </button>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>

        {/* Right Column: System Status & Alerts */}
        <div className="space-y-6">
          {/* System Health */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6">系統健康度 (System Health)</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-slate-600">
                  <Server className="w-4 h-4 mr-2" /> API 服務
                </div>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-slate-600">
                  <Database className="w-4 h-4 mr-2" /> 資料庫
                </div>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-slate-600">
                  <Globe className="w-4 h-4 mr-2" /> CDN 節點
                </div>
                <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded">High Load</span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-400 mb-1">Version Info</div>
              <div className="text-sm font-mono text-slate-600">
                Build: v2.4.1-stable<br/>
                Last Commit: 8f29a1c
              </div>
            </div>
          </div>

          {/* Security Alert */}
          <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
            <div className="flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-blue-900 mb-1">資安合規提醒</h4>
                <p className="text-xs text-blue-800 leading-relaxed mb-4">
                  系統偵測到距離上次變更管理員密碼已超過 90 天。為了符合資安規範，建議您立即更新密碼。
                </p>
                <button className="px-3 py-1.5 bg-white border border-blue-200 text-blue-700 rounded text-xs font-bold hover:bg-blue-50 transition-colors">
                  前往變更密碼
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BureauSystemSettings;