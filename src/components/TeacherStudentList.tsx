import React, { useState } from 'react';
import { 
  Box, 
  Battery, 
  BatteryCharging, 
  BatteryFull, 
  BatteryWarning, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  List, 
  Grid,
  Search,
  AlertCircle,
  X
} from 'lucide-react';

type ViewMode = 'cart' | 'list';

interface TabletData {
  id: string;
  slotNumber: number;
  seatNumber: string;
  studentName: string;
  serialNumber: string;
  batteryLevel: number;
  isPluggedIn: boolean;
  status: 'NORMAL' | 'NEEDS_REPAIR' | 'MISSING';
  issueDescription?: string;
}

// Generate mock data for 30 slots
const generateMockTablets = (): TabletData[] => {
  const firstNames = ['小明', '小華', '大文', '志豪', '雅婷', '家豪', '淑芬', '建國', '俊傑', '怡君'];
  const lastNames = ['陳', '林', '黃', '張', '李', '王', '吳', '劉', '蔡', '楊'];
  
  return Array.from({ length: 30 }, (_, i) => {
    const slotNumber = i + 1;
    const seatNumber = `T-${String(slotNumber).padStart(2, '0')}`;
    const studentName = `${lastNames[i % 10]}${firstNames[(i * 3) % 10]}`;
    const serialNumber = `SN-2023-${String(1000 + i).padStart(4, '0')}`;
    
    let status: 'NORMAL' | 'NEEDS_REPAIR' | 'MISSING' = 'NORMAL';
    let isPluggedIn = true;
    let batteryLevel = Math.floor(Math.random() * 60) + 40; // 40-99%
    let issueDescription = undefined;

    // Create some anomalies
    if (i === 4) {
      status = 'NEEDS_REPAIR';
      issueDescription = '螢幕破裂，無法觸控';
      batteryLevel = 15;
    } else if (i === 12) {
      status = 'MISSING';
      isPluggedIn = false;
      batteryLevel = 0;
    } else if (i === 18) {
      status = 'NEEDS_REPAIR';
      issueDescription = '充電孔接觸不良';
      isPluggedIn = false;
      batteryLevel = 5;
    } else if (i === 27) {
      isPluggedIn = false; // Forgot to plug in
      batteryLevel = 22;
    }

    if (status === 'NORMAL' && isPluggedIn && Math.random() > 0.5) {
      batteryLevel = 100; // Some are fully charged
    }

    return {
      id: `tab-${i}`,
      slotNumber,
      seatNumber,
      studentName,
      serialNumber,
      batteryLevel,
      isPluggedIn,
      status,
      issueDescription
    };
  });
};

const mockTablets = generateMockTablets();

const TeacherStudentList: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('cart');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTablet, setSelectedTablet] = useState<TabletData | null>(null);
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);

  const filteredTablets = mockTablets.filter(t => 
    t.studentName.includes(searchQuery) || 
    t.seatNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: mockTablets.length,
    missing: mockTablets.filter(t => t.status === 'MISSING').length,
    needsRepair: mockTablets.filter(t => t.status === 'NEEDS_REPAIR').length,
    fullyCharged: mockTablets.filter(t => t.batteryLevel === 100 && t.status === 'NORMAL').length,
    charging: mockTablets.filter(t => t.isPluggedIn && t.batteryLevel < 100 && t.status === 'NORMAL').length,
    unplugged: mockTablets.filter(t => !t.isPluggedIn && t.status === 'NORMAL').length,
  };

  const getBatteryIcon = (level: number, isPluggedIn: boolean) => {
    if (isPluggedIn && level < 100) return <BatteryCharging className="w-5 h-5 text-amber-500" />;
    if (level === 100) return <BatteryFull className="w-5 h-5 text-emerald-500" />;
    if (level <= 20) return <BatteryWarning className="w-5 h-5 text-red-500" />;
    return <Battery className="w-5 h-5 text-slate-500" />;
  };

  const handleReportRepair = (tablet: TabletData) => {
    setSelectedTablet(tablet);
    setIsRepairModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
              <Box className="w-6 h-6 mr-2 text-blue-600" />
              班級平板庫 (Tablet Library)
            </h2>
            <p className="text-sm text-slate-500 mt-1">管理班級充電車、監控平板電量與狀態，並進行快速報修。</p>
          </div>
          
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('cart')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-bold transition-all ${
                viewMode === 'cart' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Grid className="w-4 h-4 mr-2" />
              充電車視圖
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-bold transition-all ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <List className="w-4 h-4 mr-2" />
              列表視圖
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="text-xs font-bold text-slate-500 mb-1">總設備數</div>
            <div className="text-2xl font-black text-slate-800">{stats.total}</div>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
            <div className="text-xs font-bold text-emerald-600 mb-1">已充飽</div>
            <div className="text-2xl font-black text-emerald-600">{stats.fullyCharged}</div>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
            <div className="text-xs font-bold text-amber-600 mb-1">充電中</div>
            <div className="text-2xl font-black text-amber-600">{stats.charging}</div>
          </div>
          <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
            <div className="text-xs font-bold text-slate-600 mb-1">未插電</div>
            <div className="text-2xl font-black text-slate-600">{stats.unplugged}</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <div className="text-xs font-bold text-red-600 mb-1">待維修</div>
            <div className="text-2xl font-black text-red-600">{stats.needsRepair}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="text-xs font-bold text-purple-600 mb-1">未歸還/遺失</div>
            <div className="text-2xl font-black text-purple-600">{stats.missing}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {viewMode === 'cart' ? (
          <div className="p-6 bg-slate-50">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="font-bold text-slate-700 flex items-center">
                <BatteryCharging className="w-5 h-5 mr-2 text-slate-500" />
                智慧充電車狀態監控
              </h3>
              <div className="flex items-center space-x-4 text-xs font-medium text-slate-500">
                <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-emerald-500 mr-1.5"></div>充飽</span>
                <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-amber-500 mr-1.5"></div>充電中</span>
                <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-slate-300 mr-1.5"></div>未插電</span>
                <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-1.5"></div>異常</span>
              </div>
            </div>
            
            {/* Cart Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 p-6 bg-slate-800 rounded-xl border-8 border-slate-700 shadow-inner">
              {mockTablets.map((tablet) => (
                <div 
                  key={tablet.id} 
                  className={`relative flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                    tablet.status === 'MISSING' ? 'bg-slate-800/50 border-slate-700 border-dashed' :
                    tablet.status === 'NEEDS_REPAIR' ? 'bg-red-900/20 border-red-500/50' :
                    'bg-slate-900 border-slate-600 hover:border-slate-400'
                  }`}
                >
                  {/* Slot Number */}
                  <div className="absolute top-2 left-2 text-[10px] font-mono font-bold text-slate-500">
                    {String(tablet.slotNumber).padStart(2, '0')}
                  </div>

                  {tablet.status === 'MISSING' ? (
                    <div className="flex flex-col items-center justify-center h-24 text-slate-600">
                      <AlertTriangle className="w-6 h-6 mb-1 opacity-50" />
                      <span className="text-xs font-bold">空槽位</span>
                    </div>
                  ) : (
                    <>
                      {/* Tablet Representation */}
                      <div className="w-16 h-20 border-4 border-slate-700 rounded-md bg-slate-800 mt-4 mb-2 relative flex flex-col items-center justify-center">
                        {tablet.status === 'NEEDS_REPAIR' ? (
                          <Wrench className="w-6 h-6 text-red-400" />
                        ) : (
                          <div className="flex flex-col items-center">
                            {getBatteryIcon(tablet.batteryLevel, tablet.isPluggedIn)}
                            <span className={`text-[10px] font-bold mt-1 ${
                              tablet.batteryLevel <= 20 ? 'text-red-400' : 
                              tablet.batteryLevel === 100 ? 'text-emerald-400' : 'text-slate-300'
                            }`}>
                              {tablet.batteryLevel}%
                            </span>
                          </div>
                        )}
                        
                        {/* Charging Indicator Light */}
                        <div className={`absolute -bottom-1.5 w-2 h-2 rounded-full ${
                          tablet.status === 'NEEDS_REPAIR' ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]' :
                          tablet.isPluggedIn && tablet.batteryLevel < 100 ? 'bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.8)] animate-pulse' :
                          tablet.isPluggedIn && tablet.batteryLevel === 100 ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]' :
                          'bg-slate-600'
                        }`}></div>
                      </div>

                      {/* Student Info */}
                      <div className="text-center w-full">
                        <div className="text-xs font-bold text-slate-300 truncate">{tablet.seatNumber} {tablet.studentName}</div>
                      </div>

                      {/* Action Button */}
                      {tablet.status === 'NORMAL' && (
                        <button 
                          onClick={() => handleReportRepair(tablet)}
                          className="absolute top-2 right-2 p-1 text-slate-500 hover:text-red-400 transition-colors rounded"
                          title="報修"
                        >
                          <Wrench className="w-3 h-3" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜尋座號、姓名或序號..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-bold">槽位 / 座號</th>
                    <th className="p-4 font-bold">學生姓名</th>
                    <th className="p-4 font-bold">設備序號</th>
                    <th className="p-4 font-bold">電量狀態</th>
                    <th className="p-4 font-bold">設備狀態</th>
                    <th className="p-4 font-bold text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTablets.map((tablet) => (
                    <tr key={tablet.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-slate-100 text-slate-600 text-xs font-mono font-bold">
                            {String(tablet.slotNumber).padStart(2, '0')}
                          </span>
                          <span className="font-bold text-slate-800">{tablet.seatNumber}</span>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-slate-700">{tablet.studentName}</td>
                      <td className="p-4 text-sm text-slate-500 font-mono">{tablet.serialNumber}</td>
                      <td className="p-4">
                        {tablet.status === 'MISSING' ? (
                          <span className="text-slate-400 text-sm">-</span>
                        ) : (
                          <div className="flex items-center space-x-2">
                            {getBatteryIcon(tablet.batteryLevel, tablet.isPluggedIn)}
                            <span className="text-sm font-bold text-slate-700">{tablet.batteryLevel}%</span>
                            {!tablet.isPluggedIn && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">未插電</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        {tablet.status === 'NORMAL' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> 正常
                          </span>
                        )}
                        {tablet.status === 'NEEDS_REPAIR' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                            <Wrench className="w-3 h-3 mr-1" /> 待維修
                          </span>
                        )}
                        {tablet.status === 'MISSING' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                            <AlertTriangle className="w-3 h-3 mr-1" /> 未歸還
                          </span>
                        )}
                        {tablet.issueDescription && (
                          <div className="text-xs text-red-500 mt-1">{tablet.issueDescription}</div>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {tablet.status === 'NORMAL' && (
                          <button 
                            onClick={() => handleReportRepair(tablet)}
                            className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm"
                          >
                            <Wrench className="w-3 h-3 mr-1.5" />
                            報修
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredTablets.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        找不到符合條件的設備
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Repair Modal */}
      {isRepairModalOpen && selectedTablet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <Wrench className="w-5 h-5 mr-2 text-red-500" />
                設備報修申請
              </h3>
              <button 
                onClick={() => setIsRepairModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">座號 / 學生</span>
                  <span className="text-sm font-bold text-slate-800">{selectedTablet.seatNumber} {selectedTablet.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">設備序號</span>
                  <span className="text-sm font-mono font-bold text-slate-800">{selectedTablet.serialNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">充電車槽位</span>
                  <span className="text-sm font-bold text-slate-800">第 {selectedTablet.slotNumber} 槽</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">故障類別</label>
                <select className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                  <option>螢幕破裂/顯示異常</option>
                  <option>無法開機/無法充電</option>
                  <option>外觀損壞/按鍵失靈</option>
                  <option>系統異常/無法連線</option>
                  <option>其他硬體問題</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">詳細狀況說明</label>
                <textarea 
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[100px]"
                  placeholder="請簡述設備故障的具體情況..."
                ></textarea>
              </div>

              <div className="flex items-start p-3 bg-blue-50 text-blue-700 rounded-lg text-xs">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                <p>提交報修後，系統將自動通知學校資訊組，並將此設備狀態標記為「待維修」。請將設備留在充電車內等待處理。</p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end space-x-3 bg-slate-50">
              <button 
                onClick={() => setIsRepairModalOpen(false)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  // In a real app, we would update the state/backend here
                  alert('報修申請已送出！');
                  setIsRepairModalOpen(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors shadow-sm"
              >
                確認送出報修
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherStudentList;