import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import BureauDashboard from './components/BureauDashboard';
import BureauDeviceManagement from './components/BureauDeviceManagement';
import BureauDeviceManagementNew from './components/BureauDeviceManagementNew';
import BureauReports from './components/BureauReports';
import BureauNewReports from './components/BureauNewReports';
import BureauAccountPermissions from './components/BureauAccountPermissions';
import BureauOperationLogs from './components/BureauOperationLogs';
import BureauSystemSettings from './components/BureauSystemSettings';
import BureauSystemSettingsNew from './components/BureauSystemSettingsNew';
import SchoolDashboard from './components/SchoolDashboard';
import SchoolClassManagement from './components/SchoolClassManagement';
import SchoolReports from './components/SchoolReports';
import SchoolDeviceManagement from './components/SchoolDeviceManagement';
import SchoolGroupManagement from './components/SchoolGroupManagement';
import { UserRole } from './types';
import { Bell, Search, User, CheckCircle2, AlertCircle, Info, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';

interface Notification {
  id: string;
  title: string;
  content: string;
  time: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning';
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: '1', title: '系統維護通知', content: '系統將於 2026-04-10 00:00 進行例行維護，預計耗時 2 小時。', time: '2026-04-05 08:30', isRead: false, type: 'info' },
  { id: '2', title: '設備異常警報', content: '永康國小有 5 台設備超過 30 天未連線，請確認設備狀態。', time: '2026-04-05 07:15', isRead: false, type: 'warning' },
  { id: '3', title: '報表匯出完成', content: '您申請的「3月份設備使用率報表」已匯出完成，可至下載中心查看。', time: '2026-04-04 16:45', isRead: true, type: 'success' },
  { id: '4', title: '新帳號申請', content: '有一筆新的學校管理者帳號申請待審核。', time: '2026-04-04 10:20', isRead: true, type: 'info' },
];

const AppContent: React.FC = () => {
  // State to manage current role (simulating login context)
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.BUREAU);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // State to manage current active view within the role
  const currentView = location.pathname.replace('/', '') || 'dashboard';

  React.useEffect(() => {
    if (currentView.startsWith('school-')) {
      if (currentRole !== UserRole.SCHOOL) setCurrentRole(UserRole.SCHOOL);
    } else {
      if (currentRole !== UserRole.BUREAU) setCurrentRole(UserRole.BUREAU);
    }
  }, [currentView, currentRole]);

  const handleViewChange = (view: string) => {
    navigate(`/${view}`);
  };

  const renderDashboard = () => {
    switch (currentRole) {
      case UserRole.BUREAU:
        if (currentView === 'devices-new') return <BureauDeviceManagementNew />;
        if (currentView === 'devices' || currentView === 'device-management') return <BureauDeviceManagement />;
        if (currentView === 'reports') return <BureauReports />;
        if (currentView === 'reports-new') return <BureauNewReports />;
        if (currentView === 'account-permissions') return <BureauAccountPermissions />;
        if (currentView === 'operation-logs') return <BureauOperationLogs />;
        if (currentView === 'settings-new') return <BureauSystemSettingsNew />;
        if (currentView === 'settings') return <BureauSystemSettings />;
        // Default to dashboard for other views for now (can expand later)
        return <BureauDashboard />;
        
      case UserRole.SCHOOL:
        if (currentView === 'school-devices') return <SchoolDeviceManagement />;
        if (currentView === 'school-groups') return <SchoolGroupManagement />;
        if (currentView === 'school-classes') return <SchoolClassManagement />;
        if (currentView === 'school-reports') return <SchoolReports />;
        return <SchoolDashboard />;
        
      default:
        return <BureauDashboard />;
    }
  };

  const getRoleTitle = () => {
    switch (currentRole) {
      case UserRole.BUREAU: return '教育局端 (Education Bureau)';
      case UserRole.SCHOOL: return '學校端 (School Admin)';
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentRole={currentRole} 
        onRoleChange={setCurrentRole}
        currentView={currentView}
        onViewChange={handleViewChange}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 ml-64 flex flex-col">
        
        {/* Top Header */}
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          {/* Breadcrumb / Title */}
          <div>
            <h2 className="text-lg font-bold text-slate-800">{getRoleTitle()}</h2>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
              >
                <Bell className="w-5 h-5" />
                {notifications.some(n => !n.isRead) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div 
                      className="fixed inset-0 z-20" 
                      onClick={() => setShowNotifications(false)}
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-30 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-bold text-slate-800">通知中心</h3>
                        <button 
                          onClick={() => setNotifications(notifications.map(n => ({ ...n, isRead: true })))}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          全部標記為已讀
                        </button>
                      </div>
                      <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length > 0 ? (
                          <div className="divide-y divide-slate-50">
                            {notifications.map((n) => (
                              <div 
                                key={n.id} 
                                onClick={() => {
                                  setNotifications(notifications.map(notif => notif.id === n.id ? { ...notif, isRead: true } : notif));
                                }}
                                className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                              >
                                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!n.isRead ? 'bg-red-500' : 'bg-transparent'}`} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    {n.type === 'info' && <Info className="w-3.5 h-3.5 text-blue-500" />}
                                    {n.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                                    {n.type === 'warning' && <AlertCircle className="w-3.5 h-3.5 text-amber-500" />}
                                    <h4 className={`text-sm truncate ${!n.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>
                                      {n.title}
                                    </h4>
                                  </div>
                                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                    {n.content}
                                  </p>
                                  <p className="text-[10px] text-slate-400 mt-2 flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {n.time}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-8 text-center text-slate-400">
                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">目前沒有新通知</p>
                          </div>
                        )}
                      </div>
                      <div className="p-3 border-t border-slate-100 text-center bg-slate-50/30">
                        <button className="text-xs text-slate-500 hover:text-slate-700 font-medium">查看所有通知</button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex items-center space-x-3 pl-6 border-l border-slate-200">
               <div className="text-right hidden md:block">
                 <div className="text-sm font-bold text-slate-700">Admin User</div>
                 <div className="text-xs text-slate-400">System Administrator</div>
               </div>
               <div className="h-9 w-9 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 border-2 border-white shadow-sm">
                 <User className="w-5 h-5" />
               </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8">
           <Routes>
             <Route path="*" element={renderDashboard()} />
           </Routes>
        </main>

      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
      <Toaster position="top-right" expand={true} richColors />
    </HashRouter>
  );
};

export default App;