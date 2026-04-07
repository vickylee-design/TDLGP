import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Search, 
  MoreVertical, 
  Mail, 
  Building2, 
  Clock, 
  CheckCircle2, 
  Send, 
  AlertCircle, 
  Trash2, 
  Edit2, 
  X,
  Plus,
  ChevronDown,
  Lock,
  Eye,
  Settings,
  Download,
  Trash,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast, Toaster } from 'sonner';

type TabType = 'accounts' | 'roles';
type AccountStatus = 'active' | 'invited' | 'expired';
type PermissionType = 'view' | 'edit' | 'delete' | 'download';

interface Role {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  permissions: {
    page: string;
    actions: PermissionType[];
  }[];
}

interface Account {
  id: string;
  name: string;
  email: string;
  unit: string;
  roleId: string;
  lastLogin: string;
  status: AccountStatus;
}

const INITIAL_ROLES: Role[] = [
  { 
    id: 'role-1', 
    name: '系統管理員', 
    description: '具備所有頁面的完整管理權限', 
    status: 'active', 
    createdAt: '2024-01-01',
    permissions: [
      { page: 'Dashboard', actions: ['view', 'edit', 'delete', 'download'] },
      { page: '學校管理', actions: ['view', 'edit', 'delete', 'download'] },
      { page: '設備管理', actions: ['view', 'edit', 'delete', 'download'] }
    ]
  },
  { 
    id: 'role-2', 
    name: '教育局專員', 
    description: '可查看報表與管理學校基本資訊', 
    status: 'active', 
    createdAt: '2024-02-15',
    permissions: [
      { page: 'Dashboard', actions: ['view', 'download'] },
      { page: '學校管理', actions: ['view', 'edit'] },
      { page: '報表中心', actions: ['view', 'download'] }
    ]
  },
  { 
    id: 'role-3', 
    name: '學校管理者', 
    description: '負責校內設備與帳號之日常維護管理', 
    status: 'active', 
    createdAt: '2024-03-01',
    permissions: [
      { page: 'Dashboard', actions: ['view'] },
      { page: '設備管理', actions: ['view', 'edit'] },
      { page: '報表中心', actions: ['view', 'download'] }
    ]
  }
];

const INITIAL_ACCOUNTS: Account[] = [
  { id: 'acc-1', name: '王大同', email: 'datong.wang@tn.edu.tw', unit: '教育局', roleId: 'role-1', lastLogin: '2024-03-24 10:30', status: 'active' },
  { id: 'acc-2', name: '李小美', email: 'xiaomei.li@tn.edu.tw', unit: '永康國小', roleId: 'role-2', lastLogin: '2024-03-23 15:45', status: 'active' },
  { id: 'acc-3', name: '張主任', email: 'director.chang@tn.edu.tw', unit: '復興國小', roleId: 'role-2', lastLogin: '-', status: 'invited' },
  { id: 'acc-4', name: '陳老師', email: 'teacher.chen@tn.edu.tw', unit: '大橋國小', roleId: 'role-2', lastLogin: '-', status: 'expired' },
];

const PAGES = ['Dashboard', '學校管理', '設備管理', '全域政策管理', '不當網站管理', '報表中心', '系統設定'];

const BureauAccountPermissions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('accounts');
  const [accountSearch, setAccountSearch] = useState('');
  const [roleSearch, setRoleSearch] = useState('');
  
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Form States
  const [accountForm, setAccountForm] = useState({ name: '', email: '', unit: '教育局', roleId: '' });
  const [roleForm, setRoleForm] = useState<Partial<Role>>({ name: '', description: '', permissions: [] });

  // --- Accounts Logic ---
  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => 
      acc.name.toLowerCase().includes(accountSearch.toLowerCase()) || 
      acc.email.toLowerCase().includes(accountSearch.toLowerCase())
    );
  }, [accounts, accountSearch]);

  const handleInviteAccount = () => {
    if (!accountForm.name || !accountForm.email || !accountForm.roleId) {
      toast.error('請填寫完整資訊');
      return;
    }
    const newAcc: Account = {
      id: `acc-${Date.now()}`,
      ...accountForm,
      lastLogin: '-',
      status: 'invited'
    };
    setAccounts([newAcc, ...accounts]);
    setShowInviteModal(false);
    setAccountForm({ name: '', email: '', unit: '教育局', roleId: '' });
    toast.success('邀請已送出');
  };

  const handleUpdateAccount = () => {
    if (!editingAccount) return;
    setAccounts(accounts.map(acc => acc.id === editingAccount.id ? editingAccount : acc));
    setEditingAccount(null);
    toast.success('帳號資訊已更新');
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter(acc => acc.id !== id));
    toast.success('帳號已刪除');
  };

  const handleResendInvite = (id: string) => {
    setAccounts(accounts.map(acc => acc.id === id ? { ...acc, status: 'invited' } : acc));
    toast.success('邀請已重新發送');
  };

  // --- Roles Logic ---
  const filteredRoles = useMemo(() => {
    return roles.filter(role => 
      role.name.toLowerCase().includes(roleSearch.toLowerCase())
    );
  }, [roles, roleSearch]);

  const handleSaveRole = () => {
    if (!roleForm.name) {
      toast.error('請輸入角色名稱');
      return;
    }
    
    if (editingRole) {
      setRoles(roles.map(r => r.id === editingRole.id ? { ...editingRole, ...roleForm } as Role : r));
      setEditingRole(null);
      toast.success('角色已更新');
    } else {
      const newRole: Role = {
        id: `role-${Date.now()}`,
        name: roleForm.name || '',
        description: roleForm.description || '',
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        permissions: roleForm.permissions || []
      };
      setRoles([...roles, newRole]);
      toast.success('角色已創建');
    }
    setShowRoleModal(false);
    setRoleForm({ name: '', description: '', permissions: [] });
  };

  const handleDeleteRole = (id: string) => {
    if (accounts.some(acc => acc.roleId === id)) {
      toast.error('無法刪除此角色', { description: '尚有帳號使用此角色，請先更改帳號角色。' });
      return;
    }
    setRoles(roles.filter(r => r.id !== id));
    toast.success('角色已刪除');
  };

  const togglePermission = (page: string, action: PermissionType) => {
    const currentPermissions = roleForm.permissions || [];
    const pagePerm = currentPermissions.find(p => p.page === page);
    
    let nextPermissions;
    if (pagePerm) {
      const nextActions = pagePerm.actions.includes(action)
        ? pagePerm.actions.filter(a => a !== action)
        : [...pagePerm.actions, action];
      
      if (nextActions.length === 0) {
        nextPermissions = currentPermissions.filter(p => p.page !== page);
      } else {
        nextPermissions = currentPermissions.map(p => p.page === page ? { ...p, actions: nextActions } : p);
      }
    } else {
      nextPermissions = [...currentPermissions, { page, actions: [action] }];
    }
    setRoleForm({ ...roleForm, permissions: nextPermissions });
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-20">
      <Toaster position="top-center" richColors />
      
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <Shield className="w-7 h-7 mr-3 text-blue-600" />
            帳號權限管理
          </h2>
          <p className="text-slate-500 text-sm mt-1">管理系統存取帳號並定義細粒度的角色權限控管 (RBAC)。</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-fit">
        <button
          onClick={() => setActiveTab('accounts')}
          className={`flex items-center px-8 py-3 text-sm font-bold rounded-xl transition-all ${
            activeTab === 'accounts'
              ? 'bg-white text-blue-600 shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 mr-2" />
          帳號
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center px-8 py-3 text-sm font-bold rounded-xl transition-all ${
            activeTab === 'roles'
              ? 'bg-white text-blue-600 shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Lock className="w-4 h-4 mr-2" />
          角色
        </button>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {activeTab === 'accounts' ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative w-full md:w-80">
                <input 
                  type="text" 
                  placeholder="搜尋帳號、使用者姓名..." 
                  value={accountSearch}
                  onChange={(e) => setAccountSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-2.5" />
              </div>
              <button 
                onClick={() => setShowInviteModal(true)}
                className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                邀請帳號
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">使用者</th>
                    <th className="px-6 py-4">單位</th>
                    <th className="px-6 py-4">角色</th>
                    <th className="px-6 py-4">最後登入</th>
                    <th className="px-6 py-4">狀態</th>
                    <th className="px-6 py-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAccounts.map((acc) => (
                    <tr key={acc.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-slate-800">{acc.name}</p>
                          <p className="text-xs text-slate-400">{acc.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-slate-600">
                          <Building2 className="w-4 h-4 mr-2 text-slate-400" />
                          {acc.unit}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                          {roles.find(r => r.id === acc.roleId)?.name || '未知角色'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-xs text-slate-400">
                          <Clock className="w-3.5 h-3.5 mr-1.5" />
                          {acc.lastLogin}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {acc.status === 'active' && (
                          <span className="inline-flex items-center text-emerald-600 text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> 啟用
                          </span>
                        )}
                        {acc.status === 'invited' && (
                          <span className="inline-flex items-center text-blue-500 text-xs font-bold">
                            <Send className="w-3.5 h-3.5 mr-1.5" /> 邀請已送出
                          </span>
                        )}
                        {acc.status === 'expired' && (
                          <span className="inline-flex items-center text-rose-500 text-xs font-bold">
                            <AlertCircle className="w-3.5 h-3.5 mr-1.5" /> 邀請已過期
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {acc.status === 'active' ? (
                            <>
                              <button 
                                onClick={() => setEditingAccount(acc)}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteAccount(acc.id)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleResendInvite(acc.id)}
                                className="px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              >
                                重新發送邀請
                              </button>
                              <button 
                                onClick={() => handleDeleteAccount(acc.id)}
                                className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                              >
                                取消邀請
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative w-full md:w-80">
                <input 
                  type="text" 
                  placeholder="搜尋角色名稱..." 
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-2.5" />
              </div>
              <button 
                onClick={() => {
                  setEditingRole(null);
                  setRoleForm({ name: '', description: '', permissions: [] });
                  setShowRoleModal(true);
                }}
                className="flex items-center px-6 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition-all shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                創建角色
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">角色名稱</th>
                    <th className="px-6 py-4">描述</th>
                    <th className="px-6 py-4">狀態</th>
                    <th className="px-6 py-4">創建時間</th>
                    <th className="px-6 py-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRoles.map((role) => (
                    <tr key={role.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center font-bold text-slate-800">
                          <Lock className="w-4 h-4 mr-2 text-blue-500" />
                          {role.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-500 max-w-xs truncate">{role.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                          使用中
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {role.createdAt}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => {
                              setEditingRole(role);
                              setRoleForm(role);
                              setShowRoleModal(true);
                            }}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteRole(role.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      {/* Invite/Edit Account Modal */}
      <AnimatePresence>
        {(showInviteModal || editingAccount) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800">{editingAccount ? '編輯帳號' : '邀請帳號'}</h3>
                <button 
                  onClick={() => {
                    setShowInviteModal(false);
                    setEditingAccount(null);
                  }} 
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">使用者姓名</label>
                  <input 
                    type="text" 
                    value={editingAccount ? editingAccount.name : accountForm.name}
                    onChange={(e) => editingAccount ? setEditingAccount({...editingAccount, name: e.target.value}) : setAccountForm({...accountForm, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">電子信箱</label>
                  <input 
                    type="email" 
                    value={editingAccount ? editingAccount.email : accountForm.email}
                    onChange={(e) => editingAccount ? setEditingAccount({...editingAccount, email: e.target.value}) : setAccountForm({...accountForm, email: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">所屬單位</label>
                  <select 
                    value={editingAccount ? editingAccount.unit : accountForm.unit}
                    onChange={(e) => editingAccount ? setEditingAccount({...editingAccount, unit: e.target.value}) : setAccountForm({...accountForm, unit: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="教育局">教育局</option>
                    <option value="永康國小">永康國小</option>
                    <option value="復興國小">復興國小</option>
                    <option value="大橋國小">大橋國小</option>
                    <option value="勝利國小">勝利國小</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">指派角色</label>
                  <select 
                    value={editingAccount ? editingAccount.roleId : accountForm.roleId}
                    onChange={(e) => editingAccount ? setEditingAccount({...editingAccount, roleId: e.target.value}) : setAccountForm({...accountForm, roleId: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">請選擇角色</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={editingAccount ? handleUpdateAccount : handleInviteAccount}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center"
                >
                  {editingAccount ? '儲存變更' : '送出邀請'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create/Edit Role Modal */}
      <AnimatePresence>
        {showRoleModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800">{editingRole ? '編輯角色' : '創建角色'}</h3>
                <button onClick={() => setShowRoleModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 flex-1 overflow-y-auto space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">角色名稱</label>
                    <input 
                      type="text" 
                      placeholder="例如: 報表查閱員"
                      value={roleForm.name}
                      onChange={(e) => setRoleForm({...roleForm, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">角色描述</label>
                    <input 
                      type="text" 
                      placeholder="簡短說明此角色的用途..."
                      value={roleForm.description}
                      onChange={(e) => setRoleForm({...roleForm, description: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">頁面權限設定</label>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase">
                      <span className="w-12 text-center">觀看</span>
                      <span className="w-12 text-center">編輯</span>
                      <span className="w-12 text-center">刪除</span>
                      <span className="w-12 text-center">下載</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {PAGES.map(page => {
                      const pagePerm = roleForm.permissions?.find(p => p.page === page);
                      return (
                        <div key={page} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-sm font-bold text-slate-700">{page}</span>
                          <div className="flex items-center gap-4">
                            {(['view', 'edit', 'delete', 'download'] as PermissionType[]).map(action => (
                              <button
                                key={action}
                                onClick={() => togglePermission(page, action)}
                                className={`w-12 h-8 rounded-lg flex items-center justify-center transition-all ${
                                  pagePerm?.actions.includes(action)
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                                    : 'bg-white text-slate-300 border border-slate-200 hover:border-blue-200 hover:text-blue-400'
                                }`}
                              >
                                {action === 'view' && <Eye className="w-4 h-4" />}
                                {action === 'edit' && <Edit2 className="w-4 h-4" />}
                                {action === 'delete' && <Trash className="w-4 h-4" />}
                                {action === 'download' && <Download className="w-4 h-4" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex justify-end">
                <button 
                  onClick={handleSaveRole}
                  className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  儲存角色
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BureauAccountPermissions;
