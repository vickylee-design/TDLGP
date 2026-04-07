import React, { useState } from 'react';
import { 
  BarChart2, 
  Clock, 
  BookOpen, 
  MonitorPlay, 
  FileText, 
  AlertTriangle 
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

type TimeRange = 'Today' | 'Week' | 'Month';

interface SessionRecord {
  id: string;
  dateLabel: string;
  time: string;
  subject: string;
  subjectEn: string;
  topApp: string;
  activeDevices: string;
  violations: number;
  focusLevel: 'High' | 'Medium' | 'Low';
}

const mockSessions: SessionRecord[] = [
  {
    id: 's1',
    dateLabel: 'TODAY',
    time: '10:00',
    subject: '數學',
    subjectEn: 'Math',
    topApp: 'GeoGebra',
    activeDevices: '30/30',
    violations: 2,
    focusLevel: 'High'
  },
  {
    id: 's2',
    dateLabel: 'TODAY',
    time: '09:00',
    subject: '英文',
    subjectEn: 'English',
    topApp: 'Cool English',
    activeDevices: '28/30',
    violations: 0,
    focusLevel: 'High'
  },
  {
    id: 's3',
    dateLabel: 'YESTERDAY',
    time: '14:00',
    subject: '社會',
    subjectEn: 'Social',
    topApp: 'Chrome',
    activeDevices: '30/30',
    violations: 5,
    focusLevel: 'High'
  },
  {
    id: 's4',
    dateLabel: 'YESTERDAY',
    time: '11:00',
    subject: '自然',
    subjectEn: 'Science',
    topApp: 'Camera',
    activeDevices: '29/30',
    violations: 1,
    focusLevel: 'High'
  }
];

const pieData = [
  { name: '學習工具 (Edu)', value: 65, color: '#4F46E5' }, // Indigo-600
  { name: '瀏覽器 (Web)', value: 20, color: '#3B82F6' }, // Blue-500
  { name: '系統設定 (Sys)', value: 10, color: '#94A3B8' }, // Slate-400
  { name: '閒置 (Idle)', value: 5, color: '#E2E8F0' } // Slate-200
];

const barData = [
  { name: 'Mon', compliant: 95, violation: 5 },
  { name: 'Tue', compliant: 98, violation: 2 },
  { name: 'Wed', compliant: 92, violation: 8 },
  { name: 'Thu', compliant: 96, violation: 4 },
  { name: 'Fri', compliant: 99, violation: 1 }
];

const TeacherLearningHistory: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('Week');

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <BarChart2 className="w-6 h-6 mr-2 text-blue-600" />
            課堂使用紀錄 (Class Session Reports)
          </h2>
          <p className="text-sm text-slate-500 mt-1">檢視班級平板在各節課程中的整體使用狀況、App 分佈與違規統計。</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 w-fit">
          {(['Today', 'Week', 'Month'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${
                timeRange === range
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Sessions & Trend */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Sessions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 flex items-center mb-6">
              <Clock className="w-5 h-5 mr-2 text-slate-500" />
              近期課程紀錄 (Recent Sessions)
            </h3>
            
            <div className="space-y-4">
              {mockSessions.map((session) => (
                <div key={session.id} className="flex items-center p-4 border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all bg-white">
                  {/* Date/Time Badge */}
                  <div className="flex flex-col items-center justify-center w-16 h-16 bg-slate-50 rounded-lg border border-slate-100 shrink-0 mr-4">
                    <span className="text-[10px] font-bold text-slate-400">{session.dateLabel}</span>
                    <span className="text-sm font-black text-slate-700">{session.time}</span>
                  </div>
                  
                  {/* Session Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-slate-800 mb-1">
                      {session.subject} <span className="text-slate-500 font-medium text-sm">({session.subjectEn})</span>
                    </h4>
                    <div className="flex items-center text-xs text-slate-500 space-x-4">
                      <span className="flex items-center">
                        <BookOpen className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                        Top App: <span className="font-bold text-slate-700 ml-1">{session.topApp}</span>
                      </span>
                      <span className="flex items-center">
                        <MonitorPlay className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                        Active Devices: <span className="font-bold text-slate-700 ml-1">{session.activeDevices}</span>
                      </span>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center space-x-6 ml-4 shrink-0">
                    <div className="text-center">
                      <div className="text-[10px] font-bold text-slate-400 mb-0.5">違規次數</div>
                      <div className={`text-xl font-black ${session.violations > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                        {session.violations}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] font-bold text-slate-400 mb-0.5">專注度</div>
                      <div className="text-lg font-black text-blue-600">
                        {session.focusLevel}
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <FileText className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Trend */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6">本週合規率趨勢 (Class Compliance)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 12 }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    cursor={{ fill: '#F1F5F9' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="compliant" stackId="a" fill="#4ADE80" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="violation" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Column - Charts & Alerts */}
        <div className="space-y-6">
          
          {/* App Categories */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6">應用程式類別分佈 (App Categories)</h3>
            
            <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#1E293B', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-6">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-sm mr-1.5" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs font-medium text-slate-600">{item.name}</span>
                </div>
              ))}
            </div>

            {/* Insight Box */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm">
              <span className="font-bold text-slate-700">Insight: </span>
              <span className="text-slate-600">本週學生在瀏覽器的使用時間略高，建議在非查詢課程中鎖定 Chrome。</span>
            </div>
          </div>

          {/* Maintenance Alert */}
          <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-800 mb-1">設備維護提醒</h4>
              <p className="text-xs text-amber-700 leading-relaxed">
                <span className="font-bold">T-07, T-12</span> 兩台設備在本週課程中多次出現電量過低警告，建議檢查充電車接觸點或報修電池。
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeacherLearningHistory;