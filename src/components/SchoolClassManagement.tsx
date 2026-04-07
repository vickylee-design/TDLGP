import React, { useState } from 'react';
import { 
  Users, 
  RefreshCw, 
  Plus, 
  Search, 
  MoreHorizontal, 
  BookOpen, 
  Signal, 
  AlertCircle, 
  Lock, 
  Unlock, 
  Battery, 
  Monitor 
} from 'lucide-react';

type ClassMode = 'normal' | 'strict' | 'exam';
type ClassStatus = 'good' | 'alert' | 'locked';

interface ClassData {
  id: string;
  name: string;
  grade: number;
  mode: ClassMode;
  teacher: string;
  onlineCount: number;
  totalCount: number;
  battery: number;
  violations: number;
  status: ClassStatus;
  isLocked: boolean;
}

const mockClasses: ClassData[] = [
  { id: '1', name: '一年一班', grade: 1, mode: 'normal', teacher: '陳小美', onlineCount: 28, totalCount: 28, battery: 85, violations: 0, status: 'good', isLocked: false },
  { id: '2', name: '一年二班', grade: 1, mode: 'normal', teacher: '林志豪', onlineCount: 25, totalCount: 27, battery: 78, violations: 1, status: 'good', isLocked: false },
  { id: '3', name: '三年五班', grade: 3, mode: 'normal', teacher: '張惠婷', onlineCount: 0, totalCount: 25, battery: 92, violations: 0, status: 'good', isLocked: false },
  { id: '4', name: '四年二班', grade: 4, mode: 'strict', teacher: '黃國榮', onlineCount: 29, totalCount: 29, battery: 65, violations: 0, status: 'locked', isLocked: true },
  { id: '5', name: '五年三班', grade: 5, mode: 'exam', teacher: '李雅君', onlineCount: 28, totalCount: 30, battery: 45, violations: 5, status: 'alert', isLocked: false },
  { id: '6', name: '六年一班', grade: 6, mode: 'normal', teacher: '王大文', onlineCount: 26, totalCount: 26, battery: 50, violations: 2, status: 'good', isLocked: false },
  { id: '7', name: '六年二班', grade: 6, mode: 'normal', teacher: '蔡淑芬', onlineCount: 15, totalCount: 28, battery: 60, violations: 8, status: 'alert', isLocked: false },
];

const SchoolClassManagement: React.FC = () => {
  const [activeGrade, setActiveGrade] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClasses = mockClasses.filter(cls => {
    const matchesGrade = activeGrade === 'all' || cls.grade === activeGrade;
    const matchesSearch = cls.name.includes(searchQuery) || cls.teacher.includes(searchQuery);
    return matchesGrade && matchesSearch;
  });

  const getModeBadge = (mode: ClassMode) => {
    switch (mode) {
      case 'normal':
        return <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-bold">一般模式</span>;
      case 'strict':
        return <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-xs font-bold">嚴格限制</span>;
      case 'exam':
        return <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-xs font-bold">考試模式</span>;
    }
  };

  const getStatusIcon = (status: ClassStatus) => {
    switch (status) {
      case 'good':
        return <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center"><Signal className="w-4 h-4 text-emerald-500" /></div>;
      case 'alert':
        return <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center"><AlertCircle className="w-4 h-4 text-rose-500" /></div>;
      case 'locked':
        return <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><Lock className="w-4 h-4 text-slate-500" /></div>;
    }
  };

  const getProgressBarColor = (status: ClassStatus) => {
    return status === 'alert' ? 'bg-rose-500' : 'bg-blue-500';
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto bg-slate-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-start space-x-3">
          <div className="mt-1 text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">班級管理中心 (Classroom Admin)</h2>
            <p className="text-slate-500 mt-1 text-sm">管理全校班級裝置狀態、派送班級政策與同步學生名單。</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            同步學籍資料 (Sync Rosters)
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            新增班級
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex bg-slate-200/50 p-1 rounded-lg w-fit">
          <button 
            onClick={() => setActiveGrade('all')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeGrade === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
          >
            全部年級
          </button>
          {[1, 2, 3, 4, 5, 6].map(grade => (
            <button 
              key={grade}
              onClick={() => setActiveGrade(grade)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeGrade === grade ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
            >
              {grade} 年級
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input 
            type="text" 
            placeholder="搜尋班級或導師..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Class Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredClasses.map(cls => (
          <div key={cls.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-5 flex-grow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-slate-800">{cls.name}</h3>
                  {getModeBadge(cls.mode)}
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center text-slate-500 text-sm mb-6">
                <BookOpen className="w-4 h-4 mr-2" />
                導師：{cls.teacher}
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">上線率</div>
                    <div className="text-2xl font-bold text-slate-800">
                      {cls.onlineCount} <span className="text-sm font-normal text-slate-400">/ {cls.totalCount}</span>
                    </div>
                  </div>
                  {getStatusIcon(cls.status)}
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getProgressBarColor(cls.status)}`} 
                    style={{ width: `${(cls.onlineCount / cls.totalCount) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center py-3 border-t border-slate-100 mt-4">
                <div className="flex items-center space-x-6">
                  <div>
                    <span className="text-xs text-slate-500 mr-2">平均電量</span>
                    <span className="text-sm font-bold text-slate-800 inline-flex items-center">
                      <Battery className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {cls.battery}%
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 mr-2">違規紀錄</span>
                    <span className={`text-sm font-bold ${cls.violations > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {cls.violations} 次
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 border-t border-slate-100 bg-slate-50/50">
              <button className="py-3 flex items-center justify-center text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors border-r border-slate-100">
                <Monitor className="w-4 h-4 mr-2" />
                監控畫面
              </button>
              <button className="py-3 flex items-center justify-center text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                {cls.isLocked ? (
                  <>
                    <Unlock className="w-4 h-4 mr-2" />
                    解除鎖定
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    鎖定班級
                  </>
                )}
              </button>
            </div>
          </div>
        ))}

        {/* Add New Class Card */}
        <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center min-h-[280px] cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-all group">
          <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6 text-slate-400" />
          </div>
          <div className="font-bold text-slate-600 mb-1">新增班級</div>
          <div className="text-xs text-slate-400">手動建立或匯入 CSV</div>
        </div>
      </div>
    </div>
  );
};

export default SchoolClassManagement;