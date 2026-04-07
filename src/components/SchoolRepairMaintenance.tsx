import React, { useState } from 'react';
import { Wrench, Phone, Plus, PenTool, Truck, Clock, AlertCircle, FileText, History, HelpCircle, ChevronRight, CheckCircle2 } from 'lucide-react';

type TabType = 'active' | 'history' | 'self-help';

interface Ticket {
  id: string;
  serial: string;
  model: string;
  issue: string;
  reporter: string;
  rmaNumber: string;
  status: '維修中心處理中' | '物流收件中' | '修復寄回中';
  expectedDate: string;
  progress: number; // 0 to 4 (SUBMITTED, APPROVED, PICKUP, REPAIR, RETURN, DONE)
}

const mockTickets: Ticket[] = [
  {
    id: 't1',
    serial: 'SN-2023-045',
    model: 'iPad (9th Gen)',
    issue: '螢幕破裂 (Screen Cracked)',
    reporter: '林志豪 (102班導)',
    rmaNumber: 'RMA-2023-8821',
    status: '維修中心處理中',
    expectedDate: '2023-10-30',
    progress: 3,
  },
  {
    id: 't2',
    serial: 'SN-2023-102',
    model: 'iPad (9th Gen)',
    issue: '無法充電 (No Charge)',
    reporter: '王大文 (601班導)',
    rmaNumber: 'RMA-2023-8825',
    status: '物流收件中',
    expectedDate: '2023-11-02',
    progress: 2,
  },
  {
    id: 't3',
    serial: 'SN-2021-333',
    model: 'iPad (8th Gen)',
    issue: '觸控失靈 (Touch Issue)',
    reporter: '陳小美 (503班導)',
    rmaNumber: 'RMA-2023-8801',
    status: '修復寄回中',
    expectedDate: '2023-10-27',
    progress: 4,
  },
];

const SchoolRepairMaintenance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('active');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '維修中心處理中':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">{status}</span>;
      case '物流收件中':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">{status}</span>;
      case '修復寄回中':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">{status}</span>;
      default:
        return null;
    }
  };

  const renderProgressBar = (progress: number) => {
    const steps = ['SUBMITTED', 'APPROVED', 'PICKUP', 'REPAIR', 'RETURN', 'DONE'];
    return (
      <div className="mt-6">
        <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${(progress / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <span 
              key={step} 
              className={`text-[10px] font-bold tracking-wider ${index <= progress ? 'text-slate-500' : 'text-slate-300'}`}
            >
              {step}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <Wrench className="w-6 h-6 mr-2 text-blue-600" />
            報修與維運管理 (Repair & Ops)
          </h2>
          <p className="text-sm text-slate-500 mt-1">追蹤設備維修進度、申請售後服務與查詢常見故障排除指南。</p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            <Phone className="w-4 h-4 mr-2" />
            聯繫廠商客服
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            新增報修單
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-slate-600">維修中案件</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <PenTool className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-black text-blue-600 mb-2">4</div>
          <p className="text-xs font-medium text-blue-600">2 件預計本週完成</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-slate-600">待物流收件</h3>
            <div className="p-2 bg-amber-50 rounded-lg">
              <Truck className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-500 mb-2">1</div>
          <p className="text-xs font-medium text-amber-600">已通知物流 (單號: T-9921)</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-slate-600">平均維修天數</h3>
            <div className="p-2 bg-slate-50 rounded-lg">
              <Clock className="w-5 h-5 text-slate-600" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1 mb-2">
            <span className="text-3xl font-black text-slate-800">5.2</span>
            <span className="text-sm font-bold text-slate-500">天</span>
          </div>
          <p className="text-xs font-medium text-emerald-600">優於合約標準 (7天)</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-slate-600">本學期維修率</h3>
            <div className="p-2 bg-slate-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-slate-600" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-800 mb-2">1.8%</div>
          <p className="text-xs font-medium text-slate-500">全校 450 台設備</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100/50 p-1 rounded-xl w-fit border border-slate-200">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex items-center px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'active'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
          }`}
        >
          <FileText className="w-4 h-4 mr-2" />
          進行中工單 (Active Tickets)
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
          }`}
        >
          <History className="w-4 h-4 mr-2" />
          維修歷史 (History)
        </button>
        <button
          onClick={() => setActiveTab('self-help')}
          className={`flex items-center px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'self-help'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
          }`}
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          故障排除 (Self-Help)
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <div className="flex-1">
          {activeTab === 'active' && (
            <div className="space-y-4">
              {mockTickets.map((ticket) => (
                <div key={ticket.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-bold text-slate-800">{ticket.serial}</h3>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs font-medium">{ticket.model}</span>
                    </div>
                    {getStatusBadge(ticket.status)}
                  </div>
                  
                  <div className="flex items-center text-red-600 font-bold mb-2">
                    <AlertCircle className="w-4 h-4 mr-1.5" />
                    故障原因：{ticket.issue}
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="text-sm text-slate-500">
                      報修人: {ticket.reporter} • 單號: {ticket.rmaNumber}
                    </div>
                    <div className="text-sm font-bold text-slate-600">
                      預計完成: {ticket.expectedDate}
                    </div>
                  </div>

                  {renderProgressBar(ticket.progress)}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <History className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">尚無歷史紀錄</h3>
              <p className="text-sm text-slate-500">過去 6 個月內沒有已結案的維修紀錄。</p>
            </div>
          )}

          {activeTab === 'self-help' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6">常見問題與故障排除</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-colors cursor-pointer group">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-600 mb-3">
                    Connectivity
                  </div>
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">iPad 無法連上學校 Wi-Fi 怎麼辦？</h4>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
                  </div>
                </div>
                
                <div className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-colors cursor-pointer group">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-600 mb-3">
                    Account
                  </div>
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">如何重置學生忘記的密碼？</h4>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-colors cursor-pointer group">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-600 mb-3">
                    Hardware
                  </div>
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">觸控筆沒反應的簡易排除步驟</h4>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-colors cursor-pointer group">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-600 mb-3">
                    Software
                  </div>
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">派送的 App 一直顯示「等待中...」</h4>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 flex items-center justify-between border border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">找不到解決方案？</h4>
                  <p className="text-sm text-slate-500">您可以下載完整的操作手冊或直接聯繫技術支援。</p>
                </div>
                <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
                  下載 PDF 手冊
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Vendor Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-4">維修廠商資訊</h3>
            
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                S
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">神腦國際 (Synnex)</h4>
                <p className="text-xs text-slate-500">南區授權維修中心</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">客服專線</span>
                <span className="text-sm font-bold text-blue-600">0800-000-123</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">服務時間</span>
                <span className="text-sm font-bold text-slate-800">週一至週五 09:00-18:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">合約狀態</span>
                <span className="inline-flex items-center text-sm font-bold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  有效期內
                </span>
              </div>
            </div>
          </div>

          {/* Download Links */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-4">常用文件下載</h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700">報修申請單 (RMA Form)</span>
                <FileText className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
              </button>
              <button className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700">設備賠償切結書</span>
                <FileText className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolRepairMaintenance;