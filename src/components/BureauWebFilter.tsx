import React, { useState } from 'react';
import { 
  Globe, 
  ExternalLink, 
  RefreshCw, 
  Server, 
  Activity, 
  ShieldCheck, 
  Lock, 
  Plus, 
  Trash2 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const chartData = [
  { time: '08:00', total: 17, highRisk: 12 },
  { time: '10:00', total: 32, highRisk: 24 },
  { time: '12:00', total: 52, highRisk: 40 },
  { time: '14:00', total: 48, highRisk: 35 },
  { time: '16:00', total: 30, highRisk: 20 },
];

const initialBlocklist = [
  { id: 1, url: 'game-cheat-hacks.com', category: 'Gaming/Cheat', source: 'System (RPZ)', date: '2023-10-27', canDelete: false },
  { id: 2, url: 'illegal-movie-stream.net', category: 'Piracy', source: 'Admin', date: '2023-10-26', canDelete: true },
  { id: 3, url: 'betting-online-casino.org', category: 'Gambling', source: 'System (RPZ)', date: '2023-10-25', canDelete: false },
  { id: 4, url: 'adult-content-site.xyz', category: 'Pornography', source: 'System (RPZ)', date: '2023-10-25', canDelete: false },
];

const BureauWebFilter: React.FC = () => {
  const [blocklist, setBlocklist] = useState(initialBlocklist);
  const [newUrl, setNewUrl] = useState('');

  const handleAddUrl = () => {
    if (!newUrl) return;
    const newItem = {
      id: Date.now(),
      url: newUrl,
      category: 'Manual/Admin',
      source: 'Admin',
      date: new Date().toISOString().split('T')[0],
      canDelete: true
    };
    setBlocklist([newItem, ...blocklist]);
    setNewUrl('');
  };

  const handleDelete = (id: number) => {
    setBlocklist(blocklist.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">不當網站管理 (Web Filter & RPZ)</h2>
            <p className="text-slate-500 mt-1 text-sm">整合中山大學 RPZ (Response Policy Zone) 服務，透過 MDM 強制派送安全 DNS 設定，即時阻擋惡意與不當內容。</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none inline-flex items-center justify-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap">
            <ExternalLink className="w-4 h-4 mr-2" />
            中山大學 RPZ 官網
          </button>
          <button className="flex-1 lg:flex-none inline-flex items-center justify-center px-4 py-2 bg-[#5468ff] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap">
            <RefreshCw className="w-4 h-4 mr-2" />
            更新情資資料庫
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-1">
          {/* RPZ Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center space-x-2">
              <Server className="w-5 h-5 text-slate-500" />
              <h3 className="text-base font-bold text-slate-800">RPZ 連線狀態</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800">系統運作正常</h4>
                  <p className="text-xs text-slate-500 mt-0.5">資料來源: 國立中山大學網路安全實驗室</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">PRIMARY SECURE DNS IP</label>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    readOnly 
                    value="140.117.11.2" 
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-mono focus:outline-none"
                  />
                  <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors">
                    Test
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 flex items-start space-x-3 border border-blue-100">
                <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700 font-medium">MDM 已將此 DNS 派送至 85,420 台設備</p>
              </div>
            </div>
          </div>

          {/* Manual Add Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center space-x-2">
              <Lock className="w-5 h-5 text-[#e04f33]" />
              <h3 className="text-base font-bold text-slate-800">手動新增阻擋網址</h3>
            </div>
            <div className="p-6 space-y-4">
              <input 
                type="text" 
                placeholder="例如: www.bad-site.com" 
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#e04f33] focus:border-[#e04f33] outline-none transition-all"
              />
              <button 
                onClick={handleAddUrl}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-[#e04f33] text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                加入黑名單
              </button>
              <p className="text-xs text-slate-400">* 手動加入的網址將在 5 分鐘內同步至所有設備。</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Chart Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-800">即時攔截類別統計 (Real-time Blocks)</h3>
            </div>
            <div className="p-6">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorHighRisk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      ticks={[0, 15, 30, 45, 60]}
                      domain={[0, 60]}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorTotal)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="highRisk" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorHighRisk)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
              <h3 className="text-base font-bold text-slate-800">阻擋清單 (Blocklist)</h3>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md border border-slate-200">
                Total: {blocklist.length}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">網址 (URL)</th>
                    <th className="px-6 py-4">類別</th>
                    <th className="px-6 py-4">來源</th>
                    <th className="px-6 py-4">日期</th>
                    <th className="px-6 py-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {blocklist.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-slate-800">{item.url}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.source}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {item.date}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {item.canDelete && (
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="刪除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {blocklist.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500 text-sm">
                        目前沒有阻擋名單
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BureauWebFilter;