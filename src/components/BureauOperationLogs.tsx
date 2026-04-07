import React, { useState, useMemo } from 'react';
import { 
  History, 
  Search, 
  Download, 
  Calendar,
  User,
  Monitor,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { motion } from 'motion/react';

interface OperationLog {
  id: string;
  user: string;
  account: string;
  ip: string;
  operation: string;
  time: string;
}

const INITIAL_LOGS: OperationLog[] = [
  { id: '1', user: '王大同', account: 'datong.wang@tn.edu.tw', ip: '163.26.1.10', operation: 'Login Success', time: '2026-04-05 09:49' },
  { id: '2', user: '李小美', account: 'xiaomei.li@tn.edu.tw', ip: '163.26.5.22', operation: '學校管理：Edit', time: '2026-04-05 09:45' },
  { id: '4', user: '張主任', account: 'director.chang@tn.edu.tw', ip: '163.26.10.5', operation: '設備管理：Export', time: '2026-04-05 09:15' },
  { id: '5', user: '陳老師', account: 'teacher.chen@tn.edu.tw', ip: '163.26.15.8', operation: '報表中心：View', time: '2026-04-05 08:50' },
  { id: '6', user: '王大同', account: 'datong.wang@tn.edu.tw', ip: '163.26.1.10', operation: '公告管理：Create', time: '2026-04-05 08:30' },
  { id: '7', user: '李小美', account: 'xiaomei.li@tn.edu.tw', ip: '163.26.5.22', operation: '帳號權限：Delete', time: '2026-04-05 08:15' },
  { id: '9', user: '張主任', account: 'director.chang@tn.edu.tw', ip: '163.26.10.5', operation: 'Login Success', time: '2026-04-05 07:30' },
  { id: '10', user: '陳老師', account: 'teacher.chen@tn.edu.tw', ip: '163.26.15.8', operation: 'Login Success', time: '2026-04-05 07:15' },
];

const BureauOperationLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('2026-04-01');
  const [endDate, setEndDate] = useState('2026-04-05');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLogs = useMemo(() => {
    return INITIAL_LOGS.filter(log => {
      const matchesSearch = 
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.operation.toLowerCase().includes(searchTerm.toLowerCase());
      
      const logDate = log.time.split(' ')[0];
      const matchesDate = logDate >= startDate && logDate <= endDate;
      
      return matchesSearch && matchesDate;
    });
  }, [searchTerm, startDate, endDate]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = () => {
    // Simulate Excel export
    alert('正在準備匯出 Excel 報表...');
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-20">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <History className="w-7 h-7 mr-3 text-blue-600" />
            操作記錄
          </h2>
          <p className="text-slate-500 text-sm mt-1">追蹤並審核平台使用者的所有操作行為，確保系統安全性與透明度。</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
        >
          <Download className="w-4 h-4 mr-2" />
          匯出 Excel
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">關鍵字搜尋</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="搜尋使用者、帳號或操作內容..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-2.5" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">開始時間</label>
            <div className="relative">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <Calendar className="w-5 h-5 text-slate-400 absolute left-4 top-2.5" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">結束時間</label>
            <div className="relative">
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <Calendar className="w-5 h-5 text-slate-400 absolute left-4 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">使用者</th>
                <th className="px-6 py-4">IP 位址</th>
                <th className="px-6 py-4">操作記錄</th>
                <th className="px-6 py-4">時間</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-800">{log.user}</p>
                        <p className="text-xs text-slate-400">{log.account}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-slate-500">
                        <Monitor className="w-4 h-4 mr-2 text-slate-300" />
                        {log.ip}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700 font-medium">{log.operation}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                        {log.time}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center">
                      <Filter className="w-12 h-12 mb-3 opacity-20" />
                      <p>查無符合條件的操作記錄</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50/30">
            <p className="text-sm text-slate-500">
              顯示第 {(currentPage - 1) * itemsPerPage + 1} 至 {Math.min(currentPage * itemsPerPage, filteredLogs.length)} 筆，共 {filteredLogs.length} 筆
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                    currentPage === i + 1 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'hover:bg-white border border-transparent hover:border-slate-200 text-slate-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BureauOperationLogs;
