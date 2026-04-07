import React, { useState } from 'react';
import { 
  TrendingUp, 
  Download, 
  Calendar, 
  PieChart, 
  Globe, 
  Smartphone,
  Clock,
  Layout,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';

// --- Mock Data ---

// 1. Trends Data
const trendsData = [
  { date: '10/01', hours: 45000 },
  { date: '10/05', hours: 48000 },
  { date: '10/10', hours: 51000 },
  { date: '10/15', hours: 49000 },
  { date: '10/20', hours: 53000 },
  { date: '10/25', hours: 62000 },
  { date: '10/30', hours: 58000 },
];

// 2. Usage Time Distribution Data
const usageTimeData = [
  { time: '07:00', usage: 1200 },
  { time: '08:00', usage: 4500 },
  { time: '09:00', usage: 12000 },
  { time: '10:00', usage: 15600 },
  { time: '11:00', usage: 14200 },
  { time: '12:00', usage: 8900 },
  { time: '13:00', usage: 11000 },
  { time: '14:00', usage: 16800 },
  { time: '15:00', usage: 14500 },
  { time: '16:00', usage: 9200 },
  { time: '17:00', usage: 3500 },
];

// 3. App Category Distribution Data
const appCategoryData = [
  { name: '學習類', value: 45, color: '#3b82f6' },
  { name: '工具類', value: 25, color: '#8b5cf6' },
  { name: '創意類', value: 15, color: '#10b981' },
  { name: '社交類', value: 10, color: '#f59e0b' },
  { name: '其他', value: 5, color: '#94a3b8' },
];

// 4. Web Traffic Data
const webTrafficList = [
  { rank: 1, name: 'Cool English', url: 'https://www.coolenglish.edu.tw', hours: '15,420 h' },
  { rank: 2, name: 'PaGamO', url: 'https://www.pagamo.org', hours: '12,800 h' },
  { rank: 3, name: 'Google Search', url: 'https://www.google.com', hours: '11,500 h' },
  { rank: 4, name: '均一教育平台', url: 'https://junyiacademy.org', hours: '9,800 h' },
  { rank: 5, name: '學習吧', url: 'https://www.learnmode.net', hours: '8,200 h' },
  { rank: 6, name: 'Scratch', url: 'https://scratch.mit.edu', hours: '7,500 h' },
  { rank: 7, name: 'YouTube Edu', url: 'https://www.youtube.com/education', hours: '6,800 h' },
  { rank: 8, name: 'Wikipedia', url: 'https://wikipedia.org', hours: '5,400 h' },
  { rank: 9, name: '教育部雲端帳號', url: 'https://moe.edu.tw', hours: '4,200 h' },
  { rank: 10, name: 'Canvas LMS', url: 'https://canvas.instructure.com', hours: '3,800 h' },
];

const webWeeklyData = [
  { day: '週一', value: 12000 },
  { day: '週二', value: 14000 },
  { day: '週三', value: 16000 },
  { day: '週四', value: 15000 },
  { day: '週五', value: 17000 },
  { day: '週六', value: 8000 },
  { day: '週日', value: 6000 },
];

// 5. App Traffic Data
const appTrafficList = [
  { rank: 1, name: 'LoiLoNote School', category: 'Productivity', hours: '45,200 h', icon: 'L', color: 'bg-blue-500' },
  { rank: 2, name: 'Canva', category: 'Design & Creativity', hours: '38,500 h', icon: 'C', color: 'bg-purple-500' },
  { rank: 3, name: 'Google Classroom', category: 'Education', hours: '32,100 h', icon: 'G', color: 'bg-emerald-500' },
  { rank: 4, name: 'Minecraft Education', category: 'Game Based Learning', hours: '28,400 h', icon: 'M', color: 'bg-green-600' },
  { rank: 5, name: 'Kahoot!', category: 'Quiz & Trivia', hours: '21,200 h', icon: 'K', color: 'bg-indigo-500' },
  { rank: 6, name: 'Scratch Jr', category: 'Coding', hours: '18,900 h', icon: 'S', color: 'bg-orange-500' },
  { rank: 7, name: 'Google Meet', category: 'Conference', hours: '15,600 h', icon: 'V', color: 'bg-blue-400' },
  { rank: 8, name: 'Pages', category: 'Productivity', hours: '12,400 h', icon: 'P', color: 'bg-orange-400' },
  { rank: 9, name: 'GarageBand', category: 'Music', hours: '9,800 h', icon: 'G', color: 'bg-amber-500' },
  { rank: 10, name: 'Keynote', category: 'Productivity', hours: '8,500 h', icon: 'K', color: 'bg-blue-600' },
];

const appWeeklyData = [
  { day: '週一', value: 35000 },
  { day: '週二', value: 42000 },
  { day: '週三', value: 45000 },
  { day: '週四', value: 43000 },
  { day: '週五', value: 48000 },
  { day: '週六', value: 20000 },
  { day: '週日', value: 40000 },
];

type TabType = 'trends' | 'web' | 'app';

const BureauReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('trends');
  const [selectedWebItem, setSelectedWebItem] = useState(webTrafficList[0]);
  const [selectedAppItem, setSelectedAppItem] = useState(appTrafficList[0]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'trends':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6">全市每日數位學習總時數趨勢</h3>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" axisLine={true} tickLine={true} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis axisLine={true} tickLine={true} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorHours)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6">使用時段分佈</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={usageTimeData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="time" axisLine={true} tickLine={true} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <YAxis axisLine={true} tickLine={true} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="usage" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6">App 類型分佈</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={appCategoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {appCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        );
      case 'web':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Globe className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-800">前十大熱門瀏覽網站 (Top 10 Visited Sites)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-sm font-medium">
                      <th className="pb-3 pl-2 w-16">排名</th>
                      <th className="pb-3">網站名稱 / URL</th>
                      <th className="pb-3 text-right pr-4">總瀏覽時長 (Hours)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {webTrafficList.map((site) => (
                      <tr 
                        key={site.rank} 
                        className={`hover:bg-slate-50 cursor-pointer transition-colors ${selectedWebItem.rank === site.rank ? 'bg-blue-50/50' : ''}`}
                        onClick={() => setSelectedWebItem(site)}
                      >
                        <td className="py-3 pl-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${site.rank <= 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                            {site.rank}
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="font-medium text-slate-800">{site.name}</div>
                          <div className="text-xs text-slate-400 font-mono mt-0.5">{site.url}</div>
                        </td>
                        <td className="py-3 text-right pr-4 font-medium text-slate-700">
                          {site.hours}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Web Detail Sidebar */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
              <h3 className="text-lg font-bold text-slate-800 mb-1">流量趨勢分析</h3>
              <p className="text-sm text-slate-500 mb-6">過去一週每日瀏覽時長統計</p>
              
              <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-100 text-center">
                <div className="text-sm font-medium text-slate-500 mb-2">目前檢視</div>
                <h4 className="text-xl font-bold text-blue-600">{selectedWebItem.name}</h4>
                <p className="text-xs text-slate-400 font-mono mt-1">{selectedWebItem.url}</p>
                
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Weekly Total</div>
                    <div className="text-lg font-bold text-slate-800">{selectedWebItem.hours}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Avg. Session</div>
                    <div className="text-lg font-bold text-slate-800">18 min</div>
                  </div>
                </div>
              </div>

              <div className="flex-grow min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={webWeeklyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      case 'app':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Smartphone className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-800">前十大熱門 App (Top 10 Most Used Apps)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-sm font-medium">
                      <th className="pb-3 pl-2 w-16">排名</th>
                      <th className="pb-3">App 名稱</th>
                      <th className="pb-3">類別</th>
                      <th className="pb-3 text-right pr-4">總使用時長 (Hours)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appTrafficList.map((app) => (
                      <tr 
                        key={app.rank} 
                        className={`hover:bg-slate-50 cursor-pointer transition-colors ${selectedAppItem.rank === app.rank ? 'bg-indigo-50/50' : ''}`}
                        onClick={() => setSelectedAppItem(app)}
                      >
                        <td className="py-3 pl-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${app.rank <= 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                            {app.rank}
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${app.color}`}>
                              {app.icon}
                            </div>
                            <span className="font-medium text-slate-800">{app.name}</span>
                          </div>
                        </td>
                        <td className="py-3 text-sm text-slate-500">
                          {app.category}
                        </td>
                        <td className="py-3 text-right pr-4 font-medium text-slate-700">
                          {app.hours}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* App Detail Sidebar */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
              <h3 className="text-lg font-bold text-slate-800 mb-1">App 使用趨勢</h3>
              <p className="text-sm text-slate-500 mb-6">過去一週每日使用時長統計</p>
              
              <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-100 text-center">
                <div className="text-sm font-medium text-slate-500 mb-4">目前檢視</div>
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${selectedAppItem.color}`}>
                    {selectedAppItem.icon}
                  </div>
                  <h4 className="text-xl font-bold text-slate-800">{selectedAppItem.name}</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Weekly Total</div>
                    <div className="text-lg font-bold text-slate-800">{selectedAppItem.hours}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Category</div>
                    <div className="text-sm font-medium text-slate-800 mt-1">{selectedAppItem.category}</div>
                  </div>
                </div>
              </div>

              <div className="flex-grow min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={appWeeklyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} />
                    <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
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
          <div className="mt-1 text-blue-600">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">報表 (Reports)</h2>
            <p className="text-slate-500 mt-1 text-sm">提供全市數位學習成效分析、使用時段分佈及 App 類型統計。</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium shadow-sm">
            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
            本月 (Oct 2023)
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            匯出 PDF 報告
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">每日使用時長</p>
          <div className="flex items-baseline space-x-1">
            <h3 className="text-3xl font-bold text-slate-800">4.2</h3>
            <span className="text-sm font-medium text-slate-500">hrs</span>
          </div>
          <div className="mt-2 text-emerald-600 text-sm font-medium flex items-center">
            ▲ 12.5% vs last month
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">App 類別使用分佈</p>
          <div className="flex items-baseline space-x-1">
            <h3 className="text-xl font-bold text-slate-800">學習類 (45%)</h3>
          </div>
          <div className="mt-2 text-slate-400 text-sm font-medium flex items-center">
            主要使用類別
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">平均設備使用率</p>
          <div className="flex items-baseline space-x-1">
            <h3 className="text-3xl font-bold text-slate-800">88.5%</h3>
          </div>
          <div className="mt-2 text-emerald-600 text-sm font-medium flex items-center">
            ▲ 5.2% vs last month
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">閒置設備比例</p>
          <div className="flex items-baseline space-x-1">
            <h3 className="text-3xl font-bold text-amber-500">11.5%</h3>
          </div>
          <div className="mt-2 text-amber-600 text-sm font-medium flex items-center">
            需注意閒置設備回收
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto bg-slate-200/50 p-1 rounded-xl">
        <button 
          onClick={() => setActiveTab('trends')}
          className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${activeTab === 'trends' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200/50'}`}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          使用趨勢 (Trends)
        </button>
        <button 
          onClick={() => setActiveTab('web')}
          className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${activeTab === 'web' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200/50'}`}
        >
          <Globe className="w-4 h-4 mr-2" />
          熱門網站 (Web Traffic)
        </button>
        <button 
          onClick={() => setActiveTab('app')}
          className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${activeTab === 'app' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200/50'}`}
        >
          <Smartphone className="w-4 h-4 mr-2" />
          熱門 App (App Traffic)
        </button>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default BureauReports;
