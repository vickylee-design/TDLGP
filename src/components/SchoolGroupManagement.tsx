import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Tablet, 
  TrendingUp, 
  Clock, 
  X, 
  ChevronRight,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Info,
  User,
  Pencil,
  FileText,
  Trash2,
  Monitor,
  Battery,
  Smartphone,
  Layout,
  ShieldCheck
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { toast } from 'sonner';

// --- Types ---
interface Group {
  id: string;
  name: string;
  description: string;
  owner: string;
  deviceCount: number;
  usageRate: number;
  usageDuration: number; // in minutes
  categoryId: string | null;
}

interface Category {
  id: string;
  name: string;
}

interface GroupDevice {
  serial: string;
  model: string;
  os: string;
  battery: string;
  lastSeen: string;
}

// --- Mock Data ---
export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat1', name: '1年級' },
  { id: 'cat2', name: '2年級' },
  { id: 'cat3', name: '專科教室' },
];

export const INITIAL_GROUPS: Group[] = [
  { id: 'g1', name: '三年二班', description: '普通教室設備', owner: '王小明老師', deviceCount: 32, usageRate: 85, usageDuration: 12450, categoryId: 'cat1' },
  { id: 'g2', name: '三年五班', description: '普通教室設備', owner: '李小華老師', deviceCount: 30, usageRate: 78, usageDuration: 10200, categoryId: 'cat1' },
  { id: 'g3', name: '四年一班', description: '普通教室設備', owner: '張大同老師', deviceCount: 35, usageRate: 92, usageDuration: 15600, categoryId: 'cat2' },
  { id: 'g4', name: '電腦教室(一)', description: '專科教室固定設備', owner: '資訊組長', deviceCount: 40, usageRate: 65, usageDuration: 8900, categoryId: 'cat3' },
  { id: 'g5', name: '電腦教室(二)', description: '專科教室固定設備', owner: '資訊組長', deviceCount: 40, usageRate: 70, usageDuration: 9500, categoryId: 'cat3' },
  { id: 'g6', name: '圖書館', description: '公用查詢設備', owner: '圖書管理員', deviceCount: 15, usageRate: 45, usageDuration: 3200, categoryId: null },
  { id: 'g7', name: '教師辦公室', description: '行政與教學準備用', owner: '教務主任', deviceCount: 25, usageRate: 55, usageDuration: 6800, categoryId: null },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const SchoolGroupManagement: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [activeCategoryId, setActiveCategoryId] = useState<string | 'all' | 'none'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<'report' | 'devices'>('report');
  
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  
  // Group Form State
  const [groupForm, setGroupForm] = useState({ name: '', description: '', owner: '', categoryId: null as string | null });
  const [categoryForm, setCategoryForm] = useState({ name: '' });

  // Detail Filters
  const [startMonth, setStartMonth] = useState('2024-03');
  const [endMonth, setEndMonth] = useState('2024-03');

  const filteredGroups = useMemo(() => {
    return groups.filter(g => {
      const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategoryId === 'all' || 
                             (activeCategoryId === 'none' && !g.categoryId) || 
                             g.categoryId === activeCategoryId;
      return matchesSearch && matchesCategory;
    });
  }, [groups, searchQuery, activeCategoryId]);

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupForm.name || !groupForm.owner) {
      toast.error('請填寫必填欄位');
      return;
    }
    const group: Group = {
      id: `g-${Date.now()}`,
      ...groupForm,
      deviceCount: Math.floor(Math.random() * 50) + 10,
      usageRate: Math.floor(Math.random() * 40) + 60,
      usageDuration: Math.floor(Math.random() * 10000) + 5000
    };
    setGroups([group, ...groups]);
    setIsAddModalOpen(false);
    setGroupForm({ name: '', description: '', owner: '', categoryId: null });
    toast.success('群組已新增');
  };

  const handleEditGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGroup || !groupForm.name || !groupForm.owner) return;
    
    setGroups(groups.map(g => g.id === editingGroup.id ? { ...g, ...groupForm } : g));
    setIsEditModalOpen(false);
    setEditingGroup(null);
    setGroupForm({ name: '', description: '', owner: '', categoryId: null });
    toast.success('群組已更新');
  };

  const confirmDeleteGroup = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setGroupToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteGroup = () => {
    if (groupToDelete) {
      setGroups(groups.filter(g => g.id !== groupToDelete));
      setIsDeleteConfirmOpen(false);
      setGroupToDelete(null);
      toast.success('群組已刪除，設備已歸類至未指派');
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) return;
    
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, name: categoryForm.name } : c));
      toast.success('分類已更新');
    } else {
      const newCat: Category = { id: `cat-${Date.now()}`, name: categoryForm.name };
      setCategories([...categories, newCat]);
      toast.success('分類已新增');
    }
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    setCategoryForm({ name: '' });
  };

  const handleDeleteCategory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('確定要刪除此分類嗎？該分類下的群組將歸類至未分類。')) {
      setCategories(categories.filter(c => c.id !== id));
      setGroups(groups.map(g => g.categoryId === id ? { ...g, categoryId: null } : g));
      if (activeCategoryId === id) setActiveCategoryId('all');
      toast.success('分類已刪除');
    }
  };

  const handleBulkAssign = (categoryId: string | null) => {
    setGroups(groups.map(g => selectedGroupIds.includes(g.id) ? { ...g, categoryId } : g));
    setSelectedGroupIds([]);
    toast.success('群組分類已更新');
  };

  const openEditModal = (group: Group, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingGroup(group);
    setGroupForm({ name: group.name, description: group.description, owner: group.owner, categoryId: group.categoryId });
    setIsEditModalOpen(true);
  };

  // Dynamic Report Data based on month selection
  const reportData = useMemo(() => {
    // In a real app, this would fetch data based on startMonth/endMonth
    // For mock, we'll just vary the numbers slightly based on the month strings
    const seed = (startMonth + endMonth).length;
    return {
      deviceCount: selectedGroup?.deviceCount || 0,
      usedDeviceCount: Math.round((selectedGroup?.deviceCount || 0) * (0.7 + (seed % 20) / 100)),
      usageRate: Math.round((selectedGroup?.usageRate || 0) * (0.9 + (seed % 10) / 100)),
      usageDuration: Math.round((selectedGroup?.usageDuration || 0) * (0.8 + (seed % 30) / 100)),
      usageCurve: Array.from({ length: 7 }, (_, i) => ({
        time: `03-0${i + 1}`,
        usage: Math.floor(Math.random() * 500) + 200 + (seed * 2)
      })),
      modelDistribution: [
        { name: 'iPad Air (5th Gen)', value: 15 + (seed % 5), color: '#3b82f6' },
        { name: 'iPad (9th Gen)', value: 20 - (seed % 3), color: '#10b981' },
        { name: 'iPad Pro 11"', value: 5 + (seed % 2), color: '#f59e0b' }
      ],
      mdmDistribution: [
        { name: 'Jamf Pro', value: 25 + (seed % 4), color: '#8b5cf6' },
        { name: 'Intune', value: 15 - (seed % 2), color: '#3b82f6' }
      ]
    };
  }, [selectedGroup, startMonth, endMonth]);

  const groupDevices: GroupDevice[] = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => ({
      serial: `DAAN${3000 + i}XYZ`,
      model: i % 2 === 0 ? 'iPad Air (5th Gen)' : 'iPad (9th Gen)',
      os: 'iPadOS 17.2',
      battery: `${Math.floor(Math.random() * 40) + 60}%`,
      lastSeen: '2024-03-20 14:30'
    }));
  }, [selectedGroup]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <Users className="w-7 h-7 mr-3 text-blue-600" />
            群組管理
          </h2>
          <p className="text-slate-500 text-sm mt-1">管理校內設備群組、負責人及使用狀況分析。</p>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
        >
          <Plus className="w-4 h-4 mr-2" />
          新增群組
        </button>
      </div>

      {/* Search & Stats Summary */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="搜尋群組名稱..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
          />
        </div>
        <div className="flex-1"></div>
        <div className="text-sm text-slate-500 font-medium">
          共 <span className="text-blue-600 font-bold">{filteredGroups.length}</span> 個群組
        </div>
      </div>

      {/* Categories Tabs */}
      <Reorder.Group 
        axis="x" 
        values={categories} 
        onReorder={setCategories}
        className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-1"
      >
        <button 
          onClick={() => setActiveCategoryId('all')}
          className={`px-3 py-2 text-sm font-bold transition-all border-b-2 ${activeCategoryId === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          全部
        </button>
        {categories.map(cat => (
          <Reorder.Item 
            key={cat.id} 
            value={cat}
            className="group relative flex items-center cursor-grab active:cursor-grabbing"
          >
            <button 
              onClick={() => setActiveCategoryId(cat.id)}
              className={`px-3 py-2 text-sm font-bold transition-all border-b-2 ${activeCategoryId === cat.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              {cat.name}
            </button>
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex opacity-0 group-hover:opacity-100 transition-all group-hover:-top-11 bg-white backdrop-blur-sm rounded-full shadow-lg border border-slate-200 p-1 z-10">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingCategory(cat);
                  setCategoryForm({ name: cat.name });
                  setIsCategoryModalOpen(true);
                }}
                className="p-1.5 hover:bg-blue-50 rounded-full text-slate-500 hover:text-blue-600 transition-colors"
                title="編輯"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-slate-200 self-center mx-0.5" />
              <button 
                onClick={(e) => handleDeleteCategory(cat.id, e)}
                className="p-1.5 hover:bg-rose-50 rounded-full text-slate-500 hover:text-rose-600 transition-colors"
                title="刪除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              {/* Tooltip Arrow */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-slate-200 rotate-45" />
            </div>
          </Reorder.Item>
        ))}
        <button 
          onClick={() => setActiveCategoryId('none')}
          className={`px-3 py-2 text-sm font-bold transition-all border-b-2 ${activeCategoryId === 'none' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          未分類
        </button>
        <button 
          onClick={() => {
            setEditingCategory(null);
            setCategoryForm({ name: '' });
            setIsCategoryModalOpen(true);
          }}
          className="ml-2 p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all"
          title="新增分類"
        >
          <Plus className="w-4 h-4" />
        </button>
      </Reorder.Group>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedGroupIds.length > 0 && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-6 border border-slate-700/50 backdrop-blur-xl"
          >
            <div className="flex items-center space-x-3 border-r border-slate-700 pr-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
                {selectedGroupIds.length}
              </div>
              <span className="text-sm font-bold text-slate-300">個群組已選取</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">歸類至：</span>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => handleBulkAssign(cat.id)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-blue-600 rounded-lg text-xs font-bold transition-all border border-slate-700"
                  >
                    {cat.name}
                  </button>
                ))}
                <button 
                  onClick={() => handleBulkAssign(null)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-all border border-slate-700"
                >
                  未分類
                </button>
              </div>
            </div>

            <button 
              onClick={() => setSelectedGroupIds([])}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Group Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGroups.map((group) => (
          <motion.div 
            key={group.id}
            layoutId={group.id}
            className={`bg-white p-6 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${selectedGroupIds.includes(group.id) ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200'}`}
            onClick={() => {
              if (selectedGroupIds.length > 0) {
                setSelectedGroupIds(prev => prev.includes(group.id) ? prev.filter(id => id !== group.id) : [...prev, group.id]);
              } else {
                setSelectedGroup(group);
              }
            }}
          >
            {/* Selection Overlay */}
            <div 
              className="absolute top-4 left-4 z-10"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedGroupIds(prev => prev.includes(group.id) ? prev.filter(id => id !== group.id) : [...prev, group.id]);
              }}
            >
              <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${selectedGroupIds.includes(group.id) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 opacity-0 group-hover:opacity-100'}`}>
                {selectedGroupIds.includes(group.id) && <Plus className="w-3 h-3 rotate-45" />}
              </div>
            </div>

            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users className="w-16 h-16" />
            </div>
            
            <div className="space-y-4 relative h-full flex flex-col">
              <div className="flex flex-col space-y-2">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">{group.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.categoryId && (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md">
                      {categories.find(c => c.id === group.categoryId)?.name}
                    </span>
                  )}
                  <p className="text-xs text-slate-400 flex items-center">
                    <User className="w-3.5 h-3.5 mr-1" />
                    負責人：{group.owner}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">設備數量</p>
                  <div className="flex items-center text-slate-700 font-bold">
                    <Tablet className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                    {group.deviceCount}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">使用率</p>
                  <div className="flex items-center text-slate-700 font-bold">
                    <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                    {group.usageRate}%
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">使用時長</p>
                <div className="flex items-center text-slate-700 font-bold">
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                  {Math.floor(group.usageDuration / 60)} 小時 {group.usageDuration % 60} 分
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="flex space-x-2">
                  <button 
                    onClick={(e) => openEditModal(group, e)}
                    className="flex items-center px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-lg transition-all text-xs font-bold border border-slate-100"
                    title="編輯"
                  >
                    <Pencil className="w-3.5 h-3.5 mr-1.5" />
                    編輯
                  </button>
                  <button 
                    onClick={(e) => confirmDeleteGroup(group.id, e)}
                    className="flex items-center px-3 py-1.5 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition-all text-xs font-bold border border-slate-100"
                    title="刪除"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    刪除
                  </button>
                </div>
                <span className="text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">查看詳情</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Group Modal */}
      <AnimatePresence>
        {(isAddModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
                setEditingGroup(null);
                setGroupForm({ name: '', description: '', owner: '', categoryId: null });
              }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">{isEditModalOpen ? '編輯群組' : '新增群組'}</h3>
                <button 
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                    setEditingGroup(null);
                    setGroupForm({ name: '', description: '', owner: '', categoryId: null });
                  }} 
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <form onSubmit={isEditModalOpen ? handleEditGroup : handleAddGroup} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">群組名稱 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    value={groupForm.name}
                    onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                    placeholder="例如：三年二班"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">負責人 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    value={groupForm.owner}
                    onChange={(e) => setGroupForm({ ...groupForm, owner: e.target.value })}
                    placeholder="例如：王小明老師"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">所屬分類</label>
                  <select 
                    value={groupForm.categoryId || ''}
                    onChange={(e) => setGroupForm({ ...groupForm, categoryId: e.target.value || null })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="">未分類</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">群組簡要說明</label>
                  <textarea 
                    value={groupForm.description}
                    onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                    placeholder="請輸入群組用途說明..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  />
                </div>
                <div className="pt-4 flex space-x-3">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setIsEditModalOpen(false);
                      setEditingGroup(null);
                      setGroupForm({ name: '', description: '', owner: '', categoryId: null });
                    }}
                    className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                  >
                    取消
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                  >
                    {isEditModalOpen ? '儲存變更' : '確認新增'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Category Management Modal */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">{editingCategory ? '編輯分類' : '新增分類'}</h3>
                <button onClick={() => setIsCategoryModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleAddCategory} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">分類名稱</label>
                  <input 
                    type="text" 
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ name: e.target.value })}
                    placeholder="例如：1年級"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="pt-4 flex space-x-3">
                  <button 
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                  >
                    取消
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                  >
                    確認
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Group Confirmation Modal */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden p-8 text-center"
            >
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">確定要刪除此群組嗎？</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                若刪除群組，群組內的所有設備會歸類到<span className="text-rose-600 font-bold">未指派</span>。
              </p>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={handleDeleteGroup}
                  className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-100"
                >
                  確定刪除
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedGroup && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGroup(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-3xl bg-white shadow-2xl h-full flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mr-4 shadow-lg shadow-blue-100">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">{selectedGroup.name}</h3>
                    <p className="text-sm text-slate-400 flex items-center">
                      <User className="w-3.5 h-3.5 mr-1" />
                      負責人：{selectedGroup.owner}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedGroup(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-100 px-6 bg-white sticky top-0 z-10">
                <button 
                  onClick={() => setDetailTab('report')}
                  className={`px-8 py-4 text-sm font-bold transition-all border-b-2 ${detailTab === 'report' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  詳情報表
                </button>
                <button 
                  onClick={() => setDetailTab('devices')}
                  className={`px-8 py-4 text-sm font-bold transition-all border-b-2 ${detailTab === 'devices' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  設備清單
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {detailTab === 'report' ? (
                  <div className="space-y-8">
                    {/* Month Filter */}
                    <div className="flex flex-col space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <div className="flex items-center text-sm font-bold text-slate-700">
                        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                        篩選月份區間
                      </div>
                      <div className="flex items-center space-x-3">
                        <input 
                          type="month" 
                          value={startMonth}
                          onChange={(e) => setStartMonth(e.target.value)}
                          className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        />
                        <span className="text-slate-400 font-bold">至</span>
                        <input 
                          type="month" 
                          value={endMonth}
                          onChange={(e) => setEndMonth(e.target.value)}
                          className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        />
                      </div>
                    </div>

                    {/* KPIs */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                        <div className="flex items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                          <Tablet className="w-4 h-4 mr-2" /> 設備總數
                        </div>
                        <div className="text-2xl font-black text-slate-800">{reportData.deviceCount.toLocaleString()} <span className="text-sm font-normal text-slate-400">台</span></div>
                      </div>
                      <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                        <div className="flex items-center text-blue-600 text-xs font-bold uppercase tracking-wider mb-2 leading-tight">
                          <Tablet className="w-4 h-4 mr-2" /> 使用設備數
                        </div>
                        <div className="text-2xl font-black text-blue-700">{reportData.usedDeviceCount.toLocaleString()} <span className="text-sm font-normal text-blue-400">台</span></div>
                      </div>
                      <div className="bg-rose-50 p-5 rounded-xl border border-rose-100">
                        <div className="text-rose-600 text-xs font-bold uppercase tracking-wider mb-2 leading-tight">
                          未使用設備數
                        </div>
                        <div className="text-2xl font-black text-rose-700">{(reportData.deviceCount - reportData.usedDeviceCount).toLocaleString()} <span className="text-sm font-normal text-rose-400">台</span></div>
                      </div>
                      <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                        <div className="flex items-center text-blue-600 text-xs font-bold uppercase tracking-wider mb-2 leading-tight">
                          <TrendingUp className="w-4 h-4 mr-2" /> 使用率
                        </div>
                        <div className="text-2xl font-black text-blue-700">{reportData.usageRate}%</div>
                      </div>
                      <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 col-span-2">
                        <div className="flex items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2 leading-tight">
                          <Clock className="w-4 h-4 mr-2" /> 使用時長
                        </div>
                        <div className="text-2xl font-black text-slate-800">
                          {reportData.usageDuration.toLocaleString()} <span className="text-sm font-normal text-slate-400">分鐘</span>
                        </div>
                      </div>
                    </div>

                    {/* Usage Curve */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-bold text-slate-800 flex items-center">
                          <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                          使用曲線圖
                        </h4>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <div className="w-3 h-0.5 bg-blue-500 mr-2"></div> 平均使用分鐘數
                          </div>
                        </div>
                      </div>
                      <div className="h-72 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={reportData.usageCurve}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} label={{ value: '平均使用分鐘數', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Line type="monotone" dataKey="usage" name="平均使用分鐘數" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Distributions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Model Pie Chart */}
                      <div>
                        <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                          <FileText className="w-5 h-5 mr-2 text-blue-500" />
                          設備型號分布
                        </h4>
                        <div className="h-48 relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={reportData.modelDistribution}
                                innerRadius={50}
                                outerRadius={70}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {reportData.modelDistribution.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-xl font-bold text-slate-800">{reportData.deviceCount}</span>
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Total</span>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          {reportData.modelDistribution.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                                <span className="text-slate-600">{item.name}</span>
                              </div>
                              <span className="font-bold text-slate-800">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* MDM Pie Chart */}
                      <div>
                        <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                          <ShieldCheck className="w-5 h-5 mr-2 text-purple-500" />
                          MDM 分布
                        </h4>
                        <div className="h-48 relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={reportData.mdmDistribution}
                                innerRadius={50}
                                outerRadius={70}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {reportData.mdmDistribution.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-xl font-bold text-slate-800">{reportData.deviceCount}</span>
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Total</span>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          {reportData.mdmDistribution.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                                <span className="text-slate-600">{item.name}</span>
                              </div>
                              <span className="font-bold text-slate-800">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-bold text-slate-800">設備清單</h4>
                      <span className="text-sm text-slate-500 font-medium">共 {groupDevices.length} 台設備</span>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <th className="px-6 py-4">設備序號</th>
                            <th className="px-6 py-4">設備型號</th>
                            <th className="px-6 py-4">電量</th>
                            <th className="px-6 py-4">最後連線時間</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {groupDevices.map((device) => (
                            <tr key={device.serial} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4">
                                <code className="text-xs bg-slate-100 px-2.5 py-1 rounded-lg text-slate-600 font-mono font-bold">
                                  {device.serial}
                                </code>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm font-bold text-slate-800">{device.model}</div>
                                <div className="text-[10px] text-slate-400 font-medium">{device.os}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center text-sm font-bold text-slate-700">
                                  <Battery className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                                  {device.battery}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                {device.lastSeen}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setSelectedGroup(null)}
                  className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all shadow-sm"
                >
                  關閉
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SchoolGroupManagement;
