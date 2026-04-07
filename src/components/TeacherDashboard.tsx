import React, { useState } from 'react';
import { 
  LayoutGrid, 
  BookOpen, 
  Languages, 
  FileSignature, 
  MonitorPlay, 
  Send, 
  Lock, 
  Battery, 
  BatteryMedium, 
  BatteryFull, 
  Monitor, 
  CheckCircle2, 
  XCircle, 
  BarChart2
} from 'lucide-react';

type ModeType = 'general' | 'math' | 'english' | 'test';

interface StudentDevice {
  id: string;
  seatNumber: string;
  appName: string;
  battery: number;
  status: 'ONLINE' | 'OFFLINE' | 'ANOMALY';
  imageUrl: string;
}

// We will generate the devices dynamically based on the mode
const generateDevicesForMode = (mode: ModeType): StudentDevice[] => {
  return Array.from({ length: 30 }, (_, i) => {
    const seatNumber = `T-${String(i + 1).padStart(2, '0')}`;
    let appName = 'Chrome';
    let status: 'ONLINE' | 'OFFLINE' | 'ANOMALY' = 'ONLINE';
    
    // Default general mode
    if (mode === 'general') {
      if (i === 6 || i === 11 || i === 17) {
        appName = 'Genshin Im...';
        status = 'ANOMALY';
      }
    } 
    // Math mode
    else if (mode === 'math') {
      appName = 'GeoGebra';
      if (i === 3) {
        appName = 'YouTube';
        status = 'ANOMALY';
      } else if (i === 14) {
        appName = 'Calculator'; // Maybe allowed, but let's say they should be on GeoGebra
        status = 'ANOMALY';
      } else if (i === 22) {
        appName = 'Chrome'; // Browsing instead of math
        status = 'ANOMALY';
      }
    }
    // English mode
    else if (mode === 'english') {
      appName = 'Duolingo';
      if (i === 8) {
        appName = 'Netflix';
        status = 'ANOMALY';
      } else if (i === 19) {
        appName = 'Spotify';
        status = 'ANOMALY';
      }
    }
    // Test mode
    else if (mode === 'test') {
      appName = 'Exam Browser';
      if (i === 5) {
        appName = 'Chrome'; // Trying to search answers
        status = 'ANOMALY';
      } else if (i === 27) {
        appName = 'Discord'; // Chatting during test
        status = 'ANOMALY';
      }
    }
    
    return {
      id: `student-${i}`,
      seatNumber,
      appName,
      battery: Math.floor(Math.random() * 40) + 60, // 60-99%
      status,
      imageUrl: `https://picsum.photos/seed/student${i + 1}/400/300`
    };
  });
};

const TeacherDashboard: React.FC = () => {
  const [activeMode, setActiveMode] = useState<ModeType>('general');
  const currentDevices = generateDevicesForMode(activeMode);
  const anomalyCount = currentDevices.filter(d => d.status === 'ANOMALY').length;
  const onlineCount = currentDevices.length - anomalyCount; // Simplified for this mock

  const getBatteryIcon = (level: number) => {
    if (level > 80) return <BatteryFull className="w-3 h-3 text-slate-400 mr-1" />;
    if (level > 30) return <BatteryMedium className="w-3 h-3 text-slate-400 mr-1" />;
    return <Battery className="w-3 h-3 text-red-400 mr-1" />;
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4">
      {/* Top Control Bar */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center shrink-0">
        <div className="flex space-x-1 bg-slate-100/50 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveMode('general')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeMode === 'general'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            一般模式
          </button>
          <button
            onClick={() => setActiveMode('math')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeMode === 'math'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            數學課
          </button>
          <button
            onClick={() => setActiveMode('english')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeMode === 'english'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            <Languages className="w-4 h-4 mr-2" />
            英文課
          </button>
          <button
            onClick={() => setActiveMode('test')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeMode === 'test'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            <FileSignature className="w-4 h-4 mr-2" />
            測驗模式
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <MonitorPlay className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Send className="w-5 h-5" />
          </button>
          <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-colors shadow-sm">
            <Lock className="w-4 h-4 mr-2" />
            全班黑屏鎖定
          </button>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Main Grid Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center shrink-0">
            <div className="flex items-center space-x-3">
              <LayoutGrid className="w-5 h-5 text-slate-500" />
              <h2 className="text-lg font-bold text-slate-800">班級設備監控 (Classroom View)</h2>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md">
                {activeMode === 'general' && '一般模式'}
                {activeMode === 'math' && '數學課'}
                {activeMode === 'english' && '英文課'}
                {activeMode === 'test' && '測驗模式'}
              </span>
            </div>
            <div className="text-sm font-medium text-slate-500">
              Online: 29 / 30
            </div>
          </div>

          <div className="p-4 overflow-y-auto flex-1 bg-slate-50/50">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {currentDevices.map((device) => (
                <div 
                  key={device.id} 
                  className={`bg-white rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group ${
                    device.status === 'ANOMALY' ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200'
                  }`}
                >
                  <div className="relative aspect-[4/3] bg-slate-100">
                    <img 
                      src={device.imageUrl} 
                      alt={`Student ${device.seatNumber} screen`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6">
                      <span className="text-white text-xs font-bold">{device.seatNumber}</span>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-slate-800 truncate pr-2">{device.appName}</span>
                      <div className="flex items-center shrink-0">
                        {getBatteryIcon(device.battery)}
                        <span className="text-[10px] font-medium text-slate-500">{device.battery}%</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        device.status === 'ONLINE' ? 'bg-emerald-500' : 
                        device.status === 'ANOMALY' ? 'bg-red-500' : 'bg-slate-300'
                      }`}></div>
                      <span className={`text-[10px] font-bold tracking-wider ${
                        device.status === 'ANOMALY' ? 'text-red-500' : 'text-slate-400'
                      }`}>
                        {device.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-72 flex flex-col space-y-4 shrink-0 overflow-y-auto">
          {/* Connection Status */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 flex items-center mb-4">
              <BarChart2 className="w-4 h-4 mr-2 text-blue-600" />
              班級連線狀態
            </h3>
            
            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold text-slate-500 mb-1">應到設備</div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-black text-slate-800">30</span>
                    <span className="text-xs font-bold text-slate-500">台</span>
                  </div>
                </div>
                <Monitor className="w-8 h-8 text-slate-200" />
              </div>

              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold text-emerald-600 mb-1">連線正常</div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-black text-emerald-600">{onlineCount}</span>
                    <span className="text-xs font-bold text-emerald-600">台</span>
                  </div>
                </div>
                <CheckCircle2 className="w-8 h-8 text-emerald-200" />
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold text-red-600 mb-1">違規/異常</div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-black text-red-600">{anomalyCount}</span>
                    <span className="text-xs font-bold text-red-600">台</span>
                  </div>
                </div>
                <XCircle className="w-8 h-8 text-red-200" />
              </div>
            </div>
          </div>

          {/* AI Anomaly Detection */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col">
            <h3 className="text-sm font-bold text-slate-800 mb-4">AI 異常偵測</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {anomalyCount === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <span className="text-sm font-medium text-slate-400">目前無異常設備</span>
                </div>
              ) : (
                currentDevices.filter(d => d.status === 'ANOMALY').map(device => (
                  <div key={`anomaly-${device.id}`} className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start space-x-3">
                    <div className="w-8 h-8 rounded bg-white border border-red-200 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-red-600">{device.seatNumber.replace('T-', '')}</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 mb-0.5">未授權應用程式</h4>
                      <p className="text-[10px] text-slate-500">偵測到執行 <span className="font-bold text-red-600">{device.appName}</span></p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;