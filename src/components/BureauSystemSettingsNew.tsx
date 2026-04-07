import React, { useState, useRef } from 'react';
import { 
  Settings, 
  Bell, 
  LayoutGrid, 
  Plus, 
  Trash2, 
  Save, 
  AlertCircle, 
  CheckCircle2,
  Calendar,
  Clock,
  Search,
  Filter,
  ChevronDown,
  Bold,
  Italic,
  Underline,
  Type,
  Smartphone,
  Info,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast, Toaster } from 'sonner';

type TabType = 'system' | 'announcement' | 'app-category';

interface Semester {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  publishDate: string;
  target: 'all' | 'specific';
  targetSchools?: string[];
  status: 'draft' | 'published';
}

interface AppInfo {
  id: string;
  name: string;
  bundleId: string;
  category: string;
}

const DEFAULT_CATEGORIES = ['學習類', '工具類', '創造力', '娛樂類', '其他'];

const BureauSystemSettingsNew: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('system');
  
  // Tab 1: System Settings State
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: '1', name: '112上學期', startDate: '2024-02-01', endDate: '2024-06-30' },
    { id: '2', name: '111下學期', startDate: '2023-08-30', endDate: '2024-01-20' }
  ]);
  const [newSemester, setNewSemester] = useState({ name: '', startDate: '', endDate: '' });
  const [unusedDays, setUnusedDays] = useState(30);

  // Tab 2: Announcement State
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: '1', title: '112學年度設備盤點通知', content: '請各校於本月底前完成設備盤點...', publishDate: '2024-03-20', target: 'all', status: 'published' },
    { id: '2', title: 'MDM 系統維護公告', content: '本週六凌晨 02:00 - 04:00 將進行系統維護...', publishDate: '2024-03-25', target: 'all', status: 'draft' }
  ]);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Tab 3: App Category State
  const [apps, setApps] = useState<AppInfo[]>([
    { id: '1', name: 'LoiLoNote', bundleId: 'jp.loilo.loilonote', category: '學習類' },
    { id: '2', name: 'Pagamo', bundleId: 'com.pagamo.app', category: '學習類' },
    { id: '3', name: 'YouTube Kids', bundleId: 'com.google.ios.youtubekids', category: '娛樂類' },
    { id: '4', name: 'Canva', bundleId: 'com.canva.Canva', category: '創造力' },
    { id: '5', name: 'Safari', bundleId: 'com.apple.mobilesafari', category: '工具類' }
  ]);
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newApp, setNewApp] = useState({ name: '', bundleId: '', category: '其他' });
  const [appSearch, setAppSearch] = useState('');

  // --- Tab 1 Handlers ---
  const handleAddSemester = () => {
    if (!newSemester.name || !newSemester.startDate || !newSemester.endDate) {
      toast.error('請填寫完整學期資訊');
      return;
    }

    const start = new Date(newSemester.startDate);
    const end = new Date(newSemester.endDate);

    if (start >= end) {
      toast.error('開始日期必須早於結束日期');
      return;
    }

    // Check for overlap
    const hasOverlap = semesters.some(s => {
      const sStart = new Date(s.startDate);
      const sEnd = new Date(s.endDate);
      return (start <= sEnd && end >= sStart);
    });

    if (hasOverlap) {
      toast.error('學期區間與現有學期重疊', {
        description: '請檢查日期設定，避免時間衝突。',
        icon: <AlertCircle className="w-5 h-5 text-rose-500" />
      });
      return;
    }

    setSemesters([{ id: Date.now().toString(), ...newSemester }, ...semesters]);
    setNewSemester({ name: '', startDate: '', endDate: '' });
    toast.success('學期設定已新增');
  };

  const handleSaveUnusedDays = () => {
    toast.success('未使用設備定義已更新', {
      description: `系統已同步更新報表，目前定義為：大於等於 ${unusedDays} 天未連線。`,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    });
  };

  // --- Tab 2 Handlers ---
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const handleSaveAnnouncement = () => {
    if (!editingAnnouncement?.title) {
      toast.error('請輸入公告名稱');
      return;
    }
    const content = editorRef.current?.innerHTML || '';
    const updatedAnnouncement = { ...editingAnnouncement, content };
    
    if (announcements.find(a => a.id === updatedAnnouncement.id)) {
      setAnnouncements(announcements.map(a => a.id === updatedAnnouncement.id ? updatedAnnouncement : a));
    } else {
      setAnnouncements([{ ...updatedAnnouncement, id: Date.now().toString() }, ...announcements]);
    }
    
    setEditingAnnouncement(null);
    toast.success('公告已儲存');
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
    toast.success('公告已刪除');
  };

  // --- Tab 3 Handlers ---
  const handleBatchCategorize = (category: string) => {
    setApps(apps.map(app => selectedAppIds.includes(app.id) ? { ...app, category } : app));
    setSelectedAppIds([]);
    toast.success(`已將 ${selectedAppIds.length} 個 App 設定為 ${category}`);
  };

  const handleAddApp = () => {
    if (!newApp.name || !newApp.bundleId) {
      toast.error('請填寫完整 App 資訊');
      return;
    }
    setApps([{ ...newApp, id: Date.now().toString() }, ...apps]);
    setNewApp({ name: '', bundleId: '', category: '其他' });
    setShowAddAppModal(false);
    toast.success('App 已新增');
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('請輸入分類名稱');
      return;
    }
    if (categories.includes(newCategoryName.trim())) {
      toast.error('分類已存在');
      return;
    }
    setCategories([...categories, newCategoryName.trim()]);
    setNewCategoryName('');
    setShowAddCategoryModal(false);
    toast.success(`已新增分類: ${newCategoryName.trim()}`);
  };

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(appSearch.toLowerCase()) || 
    app.bundleId.toLowerCase().includes(appSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-20">
      <Toaster position="top-center" expand={true} richColors />
      
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <Settings className="w-7 h-7 mr-3 text-blue-600" />
            系統設定
          </h2>
          <p className="text-slate-500 text-sm mt-1">管理全域系統參數、發布行政公告及定義 App 資源分類。</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-fit">
        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center px-8 py-3 text-sm font-bold rounded-xl transition-all ${
            activeTab === 'system'
              ? 'bg-white text-blue-600 shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4 mr-2" />
          系統設定
        </button>
        <button
          onClick={() => setActiveTab('announcement')}
          className={`flex items-center px-8 py-3 text-sm font-bold rounded-xl transition-all ${
            activeTab === 'announcement'
              ? 'bg-white text-blue-600 shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bell className="w-4 h-4 mr-2" />
          公告管理
        </button>
        <button
          onClick={() => setActiveTab('app-category')}
          className={`flex items-center px-8 py-3 text-sm font-bold rounded-xl transition-all ${
            activeTab === 'app-category'
              ? 'bg-white text-blue-600 shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LayoutGrid className="w-4 h-4 mr-2" />
          App 類別管理
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'system' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Semester Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                  學期區間設定
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">新增學期</p>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="學期名稱 (例如: 113上學期)" 
                      value={newSemester.name}
                      onChange={(e) => setNewSemester({ ...newSemester, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">開始日期</label>
                        <input 
                          type="date" 
                          value={newSemester.startDate}
                          onChange={(e) => setNewSemester({ ...newSemester, startDate: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">結束日期</label>
                        <input 
                          type="date" 
                          value={newSemester.endDate}
                          onChange={(e) => setNewSemester({ ...newSemester, endDate: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={handleAddSemester}
                      className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      新增學期區間
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">歷史學期紀錄</p>
                  <div className="space-y-2">
                    {semesters.map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-blue-200 transition-all">
                        <div>
                          <p className="font-bold text-slate-800">{s.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{s.startDate} ~ {s.endDate}</p>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Unused Device Definition */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-fit">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-amber-500" />
                  「未使用設備」定義
                </h3>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    設定設備被判定為「未使用」的門檻。此設定將即時影響所有報表中的統計數據。
                  </p>
                  <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-sm font-bold text-slate-700">大於等於</span>
                    <div className="relative w-32">
                      <input 
                        type="number" 
                        value={unusedDays}
                        onChange={(e) => setUnusedDays(parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-center font-black text-xl text-blue-600 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-700">天未連線</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    提示：預設值為 30 日。修改後系統會重新計算所有學校的未使用設備數，此操作可能需要幾秒鐘完成同步。
                  </p>
                </div>

                <button 
                  onClick={handleSaveUnusedDays}
                  className="w-full py-3 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition-all shadow-lg flex items-center justify-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  儲存並更新報表
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'announcement' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Announcement List */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-slate-800">公告列表</h3>
                <button 
                  onClick={() => setEditingAnnouncement({ id: '', title: '', content: '', publishDate: new Date().toISOString().split('T')[0], target: 'all', status: 'draft' })}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {announcements.map((a) => (
                  <div 
                    key={a.id} 
                    onClick={() => setEditingAnnouncement(a)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${editingAnnouncement?.id === a.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-200 hover:border-blue-100'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${a.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {a.status === 'published' ? '已發布' : '草稿'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">{a.publishDate}</span>
                    </div>
                    <h4 className="font-bold text-slate-800 line-clamp-1">{a.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2" dangerouslySetInnerHTML={{ __html: a.content.replace(/<[^>]*>/g, '') }}></p>
                  </div>
                ))}
              </div>
            </div>

            {/* Announcement Editor */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {editingAnnouncement ? (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[700px]"
                  >
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                      <h3 className="text-lg font-bold text-slate-800">編輯公告</h3>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleDeleteAnnouncement(editingAnnouncement.id)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setEditingAnnouncement(null)}
                          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-8 flex-1 overflow-y-auto space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">公告名稱</label>
                          <input 
                            type="text" 
                            value={editingAnnouncement.title}
                            onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">發布日期</label>
                          <input 
                            type="date" 
                            value={editingAnnouncement.publishDate}
                            onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, publishDate: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">指定對象</label>
                          <select 
                            value={editingAnnouncement.target}
                            onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, target: e.target.value as any })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="all">全體學校</option>
                            <option value="specific">指定學校</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">發布狀態</label>
                          <select 
                            value={editingAnnouncement.status}
                            onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, status: e.target.value as any })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="draft">草稿</option>
                            <option value="published">啟用</option>
                          </select>
                        </div>
                      </div>

                      {editingAnnouncement.target === 'specific' && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">選擇指定學校</label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
                            {['永康國小', '大橋國小', '復興國小', '勝利國小', '博愛國小', '進學國小'].map(school => (
                              <label key={school} className="flex items-center space-x-2 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors">
                                <input 
                                  type="checkbox" 
                                  checked={editingAnnouncement.targetSchools?.includes(school)}
                                  onChange={(e) => {
                                    const current = editingAnnouncement.targetSchools || [];
                                    const next = e.target.checked 
                                      ? [...current, school]
                                      : current.filter(s => s !== school);
                                    setEditingAnnouncement({ ...editingAnnouncement, targetSchools: next });
                                  }}
                                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-700">{school}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2 flex flex-col h-[350px]">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">公告內容</label>
                        <div className="flex-1 border border-slate-200 rounded-xl overflow-hidden flex flex-col">
                          {/* Toolbar */}
                          <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-200">
                            <button onClick={() => execCommand('bold')} className="p-1.5 hover:bg-white rounded transition-all text-slate-600"><Bold className="w-4 h-4" /></button>
                            <button onClick={() => execCommand('italic')} className="p-1.5 hover:bg-white rounded transition-all text-slate-600"><Italic className="w-4 h-4" /></button>
                            <button onClick={() => execCommand('underline')} className="p-1.5 hover:bg-white rounded transition-all text-slate-600"><Underline className="w-4 h-4" /></button>
                            <div className="w-px h-4 bg-slate-300 mx-1" />
                            <button onClick={() => execCommand('insertUnorderedList')} className="p-1.5 hover:bg-white rounded transition-all text-slate-600"><Type className="w-4 h-4" /></button>
                          </div>
                          {/* Editor Area */}
                          <div 
                            ref={editorRef}
                            contentEditable
                            dangerouslySetInnerHTML={{ __html: editingAnnouncement.content }}
                            className="flex-1 p-4 outline-none text-sm text-slate-700 prose prose-sm max-w-none overflow-y-auto bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex justify-end">
                      <button 
                        onClick={handleSaveAnnouncement}
                        className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        儲存公告
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-[700px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                    <Bell className="w-12 h-12 mb-4 opacity-20" />
                    <p className="font-bold">選擇公告進行編輯或點擊 "+" 新增</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {activeTab === 'app-category' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative w-full md:w-80">
                    <input 
                      type="text" 
                      placeholder="搜尋 App 名稱或 Bundle ID..." 
                      value={appSearch}
                      onChange={(e) => setAppSearch(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-2.5" />
                  </div>
                  
                  {selectedAppIds.length > 0 && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                        已選取 {selectedAppIds.length} 個
                      </span>
                      <div className="relative group">
                        <button className="flex items-center px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition-all">
                          批次分類 <ChevronDown className="w-4 h-4 ml-2" />
                        </button>
                        <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden hidden group-hover:block z-20">
                          {categories.map(cat => (
                            <button 
                              key={cat}
                              onClick={() => handleBatchCategorize(cat)}
                              className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setShowAddCategoryModal(true)}
                    className="flex items-center px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    新增分類
                  </button>
                  <button 
                    onClick={() => setShowAddAppModal(true)}
                    className="flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    新增 App
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <th className="px-8 py-5 w-12">
                        <input 
                          type="checkbox" 
                          checked={selectedAppIds.length === filteredApps.length && filteredApps.length > 0}
                          onChange={(e) => setSelectedAppIds(e.target.checked ? filteredApps.map(a => a.id) : [])}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-5">App 名稱</th>
                      <th className="px-6 py-5">Bundle ID</th>
                      <th className="px-6 py-5">目前分類</th>
                      <th className="px-8 py-5 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredApps.map((app) => (
                      <tr key={app.id} className={`hover:bg-slate-50/80 transition-colors group ${selectedAppIds.includes(app.id) ? 'bg-blue-50/30' : ''}`}>
                        <td className="px-8 py-5">
                          <input 
                            type="checkbox" 
                            checked={selectedAppIds.includes(app.id)}
                            onChange={() => setSelectedAppIds(prev => prev.includes(app.id) ? prev.filter(i => i !== app.id) : [...prev, app.id])}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mr-4 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                              <Smartphone className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-slate-800">{app.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <code className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">{app.bundleId}</code>
                        </td>
                        <td className="px-6 py-5">
                          <div className="relative group/select">
                            <button className="flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-blue-300 transition-all">
                              {app.category} <ChevronDown className="w-3 h-3 ml-2" />
                            </button>
                            <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden hidden group-hover/select:block z-20">
                              {categories.map(cat => (
                                <button 
                                  key={cat}
                                  onClick={() => setApps(apps.map(a => a.id === app.id ? { ...a, category: cat } : a))}
                                  className="w-full text-left px-4 py-2 text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
                                >
                                  {cat}
                                </button>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button 
                            onClick={() => setApps(apps.filter(a => a.id !== app.id))}
                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add App Modal */}
      <AnimatePresence>
        {showAddAppModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800">新增 App</h3>
                <button onClick={() => setShowAddAppModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">App 名稱</label>
                  <input 
                    type="text" 
                    placeholder="例如: LoiLoNote"
                    value={newApp.name}
                    onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bundle ID</label>
                  <input 
                    type="text" 
                    placeholder="例如: jp.loilo.loilonote"
                    value={newApp.bundleId}
                    onChange={(e) => setNewApp({ ...newApp, bundleId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">分類</label>
                  <select 
                    value={newApp.category}
                    onChange={(e) => setNewApp({ ...newApp, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={handleAddApp}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center"
                >
                  確認新增
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Category Modal */}
      <AnimatePresence>
        {showAddCategoryModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800">新增分類</h3>
                <button onClick={() => setShowAddCategoryModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">分類名稱</label>
                  <input 
                    type="text" 
                    placeholder="例如: 藝術類"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button 
                  onClick={handleAddCategory}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center"
                >
                  確認新增
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BureauSystemSettingsNew;
