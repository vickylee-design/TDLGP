import React from 'react';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  BarChart3, 
  Settings, 
  School, 
  Users, 
  Wrench,
  LogOut,
  MonitorPlay,
  Tablet,
  Box,
  History
} from 'lucide-react';

interface SidebarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentRole, onRoleChange, currentView, onViewChange }) => {
  
  const getMenuItems = () => {
    switch (currentRole) {
      case UserRole.BUREAU:
        return [
          { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { id: 'schools', icon: School, label: '學校管理' },
          { id: 'devices', icon: Tablet, label: '設備管理' },
          { id: 'reports-new', icon: BarChart3, label: '報表' },
          { id: 'account-permissions', icon: Users, label: '帳號權限' },
          { id: 'operation-logs', icon: History, label: '操作記錄' },
          { id: 'settings-new', icon: Settings, label: '系統設定' },
        ];
      case UserRole.SCHOOL:
        return [
          { id: 'school-dashboard', icon: School, label: 'Dashboard' },
          { id: 'school-devices', icon: Tablet, label: '設備管理' },
          { id: 'school-groups', icon: Users, label: '群組管理' },
          { id: 'school-reports', icon: BarChart3, label: '報表' },
        ];
      default:
        return [];
    }
  };

  const handleMenuClick = (id: string) => {
    onViewChange(id);
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    onRoleChange(newRole);
    // Set default view for new role
    if (newRole === UserRole.BUREAU) onViewChange('dashboard');
    if (newRole === UserRole.SCHOOL) onViewChange('school-dashboard');
  };

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 z-20 shadow-xl">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold tracking-wider text-blue-400">TDLGP</h1>
        <p className="text-xs text-slate-400 mt-1">臺南市教學平板治理平台</p>
      </div>

      {/* Role Switcher */}
      <div className="p-4 border-b border-slate-700 bg-slate-800/50">
        <p className="text-xs text-slate-400 uppercase font-bold mb-2 px-2">管理層級切換</p>
        <div className="space-y-1">
          <button 
            onClick={() => handleRoleSwitch(UserRole.BUREAU)}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded transition-colors ${currentRole === UserRole.BUREAU ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
          >
            教育局端 (Bureau)
          </button>
          <button 
             onClick={() => handleRoleSwitch(UserRole.SCHOOL)}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded transition-colors ${currentRole === UserRole.SCHOOL ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
          >
            學校端 (School)
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className="text-xs text-slate-500 uppercase font-bold mb-3 px-2">功能選單</p>
        {getMenuItems().map((item) => (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.id)}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              currentView === item.id
                ? 'bg-slate-700 text-white border-l-4 border-blue-500' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* User Actions */}
      <div className="p-4 border-t border-slate-700 bg-slate-900">
        <div className="flex items-center px-3 text-slate-400 hover:text-white cursor-pointer transition-colors">
          <LogOut className="w-5 h-5 mr-3" />
          <span className="text-sm font-medium">登出系統</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;