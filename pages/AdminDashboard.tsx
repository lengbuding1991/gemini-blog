import React, { useState, useEffect, useRef } from 'react';
import { Navigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  BarChart3, 
  FileText,
  Wrench,
  ChevronLeft,
  Check,
  Zap,
  Crown,
  MessageSquare,
  Tag,
  Upload,
  Image as ImageIcon,
  Layout,
  X,
  Link as LinkIcon
} from 'lucide-react';

interface AdminDashboardProps {
  user: { email: string; role: string } | null;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const location = useLocation();
  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="container py-5 animate-fade-in">
      <div className="row g-4">
        {/* 左侧导航 */}
        <div className="col-lg-3">
          <div className="sticky-lg-top" style={{top: '120px'}}>
            <div className="d-flex flex-row flex-lg-column gap-2 overflow-auto pb-3 pb-lg-0">
              <Link to="/admin" className={`btn w-100 text-start py-3 px-4 rounded-4 fw-black text-uppercase tracking-widest small shadow-sm d-flex align-items-center gap-3 transition-all ${isActive('/admin') ? 'btn-dark' : 'btn-white bg-white'}`}>
                <BarChart3 size={18} /> 概览
              </Link>
              <Link to="/admin/articles" className={`btn w-100 text-start py-3 px-4 rounded-4 fw-black text-uppercase tracking-widest small shadow-sm d-flex align-items-center gap-3 transition-all ${isActive('/admin/articles') ? 'btn-dark' : 'btn-white bg-white'}`}>
                <FileText size={18} /> 文章管理
              </Link>
              <Link to="/admin/tools" className={`btn w-100 text-start py-3 px-4 rounded-4 fw-black text-uppercase tracking-widest small shadow-sm d-flex align-items-center gap-3 transition-all ${isActive('/admin/tools') ? 'btn-dark' : 'btn-white bg-white'}`}>
                <Wrench size={18} /> 工具配置
              </Link>
            </div>
          </div>
        </div>

        {/* 右侧主内容区 */}
        <div className="col-lg-9">
          <div className="bg-white rounded-5 p-4 p-md-5 shadow-sm min-vh-50 border border-light">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/articles" element={<ManageArticles />} />
              <Route path="/tools" element={<ManageTools />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 子组件：管理首页 ---
const DashboardHome = () => {
  const [stats, setStats] = useState({ articles: 0, tools: 0 });

  useEffect(() => {
    const articles = JSON.parse(localStorage.getItem('site_articles') || '[]');
    const tools = JSON.parse(localStorage.getItem('site_tools') || '[]');
    setStats({ articles: articles.length, tools: tools.length });
  }, []);

  return (
    <div>
      <h2 className="fw-black display-6 tracking-tighter mb-5 text-slate-900">管理概览</h2>
      <div className="row g-4 mb-5">
        <div className="col-sm-6">
          <div className="bg-slate-900 rounded-5 p-5 shadow-lg position-relative overflow-hidden">
            <div className="position-relative z-1 text-white">
              <div className="text-white-50 small fw-black text-uppercase tracking-widest mb-2" style={{opacity: 0.8}}>Total Articles</div>
              <div className="display-3 fw-black tracking-tighter mb-0 text-white">{stats.articles}</div>
              <p className="small text-blue-400 fw-bold mt-2 mb-0">内容存储状态：良好</p>
            </div>
            <FileText size={120} className="position-absolute end-0 bottom-0 opacity-10 m-n3 text-white" />
          </div>
        </div>
        <div className="col-sm-6">
          <div className="bg-blue-600 rounded-5 p-5 shadow-lg position-relative overflow-hidden">
            <div className="position-relative z-1 text-white">
              {/* 关键修复：确保文字在蓝色背景下始终为白色且可见 */}
              <div className="text-white small fw-black text-uppercase tracking-widest mb-2" style={{opacity: 0.85}}>Active Tools</div>
              <div className="display-3 fw-black tracking-tighter mb-0 text-white">{stats.tools}</div>
              <p className="small text-white fw-bold mt-2 mb-0" style={{opacity: 0.9}}>工具引擎：在线</p>
            </div>
            <Zap size={120} className="position-absolute end-0 bottom-0 opacity-10 m-n3 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 子组件：文章管理 (保持不变) ---
const ManageArticles = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editArt, setEditArt] = useState({ 
    title: '', 
    excerpt: '', 
    content: '', 
    cover_image: '', 
    category: '技术架构' 
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('site_articles');
    if (saved && JSON.parse(saved).length > 0) {
      setArticles(JSON.parse(saved));
    } else {
      const defaults = [
        { id: '1', title: '现代前端架构演进之路', excerpt: '探讨前端架构在过去十年的变化与未来趋势。', content: '## 架构的演进\n\n从最初的 jQuery 时代到现在的 React/Vue 大行其道...', category: '技术架构', date: '2024-03-20', cover_image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800' },
        { id: '2', title: '深度学习在生产环境的落地挑战', excerpt: '分享部署 AI 模型时遇到的性能瓶颈。', content: '## AI 的挑战\n\n将模型部署到生产环境不仅仅是模型训练的问题...', category: '人工智能', date: '2024-03-18', cover_image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800' }
      ];
      setArticles(defaults);
      localStorage.setItem('site_articles', JSON.stringify(defaults));
    }
  }, []);

  const handleSave = () => {
    if (!editArt.title || !editArt.content) return alert('请填写标题和内容');
    let newList;
    const now = new Date().toISOString().split('T')[0];
    if (editingId) {
      newList = articles.map(art => art.id === editingId ? { ...art, ...editArt, date: now } : art);
    } else {
      newList = [{ ...editArt, id: Date.now().toString(), date: now }, ...articles];
    }
    setArticles(newList);
    localStorage.setItem('site_articles', JSON.stringify(newList));
    setShowEditor(false);
    setEditingId(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditArt({ ...editArt, cover_image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const categories = ['技术架构', '前端开发', '人工智能', '实战教程', '生活随笔'];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-black h3 mb-0 text-slate-900">文章管理</h2>
        {!showEditor && (
          <button onClick={() => { setEditArt({ title: '', excerpt: '', content: '', cover_image: '', category: '技术架构' }); setEditingId(null); setShowEditor(true); }} className="btn btn-dark rounded-pill px-4 py-2 fw-black small text-uppercase tracking-widest d-flex align-items-center gap-2 shadow">
            <Plus size={18} /> 新建文章
          </button>
        )}
      </div>

      {showEditor ? (
        <div className="animate-fade-in">
          <button onClick={() => setShowEditor(false)} className="btn btn-link text-muted text-decoration-none fw-black small text-uppercase tracking-widest p-0 mb-4 d-flex align-items-center gap-2">
            <ChevronLeft size={16} /> 取消并返回
          </button>
          
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="mb-4">
                <div className="form-label-custom">
                  <span className="label-zh">文章标题</span>
                  <span className="label-en">Title</span>
                </div>
                <input className="form-control input-group-refined border-2 py-3 px-4 fw-black" placeholder="输入文章标题..." value={editArt.title} onChange={e => setEditArt({...editArt, title: e.target.value})} />
              </div>
              
              <div className="mb-4">
                <div className="form-label-custom">
                  <span className="label-zh">摘要描述</span>
                  <span className="label-en">Excerpt</span>
                </div>
                <textarea className="form-control input-group-refined border-2 py-3 px-4 fw-bold" rows={2} placeholder="简单描述文章内容..." value={editArt.excerpt} onChange={e => setEditArt({...editArt, excerpt: e.target.value})} />
              </div>

              <div className="mb-4">
                <div className="form-label-custom">
                  <span className="label-zh">Markdown 正文</span>
                  <span className="label-en">Content (Markdown)</span>
                </div>
                <textarea 
                  className="form-control markdown-editor-refined" 
                  rows={14} 
                  placeholder="使用 Markdown 语法书写，此处已同步全局 Inter 字体..." 
                  value={editArt.content} 
                  onChange={e => setEditArt({...editArt, content: e.target.value})} 
                />
              </div>
            </div>

            <div className="col-lg-4">
              <div className="bg-light rounded-5 p-4 border border-2 border-dashed">
                <div className="mb-4">
                  <div className="form-label-custom">
                    <span className="label-zh">所属分类</span>
                    <span className="label-en">Category</span>
                  </div>
                  <select className="form-select input-group-refined border-2 py-3 px-3 fw-black" value={editArt.category} onChange={e => setEditArt({...editArt, category: e.target.value})}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="mb-4">
                  <div className="form-label-custom">
                    <span className="label-zh">封面图片配置</span>
                    <span className="label-en">Cover Image</span>
                  </div>
                  
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white border-2 border-dashed rounded-4 p-4 text-center cursor-pointer mb-3 transition-all hover-border-blue-600 hover-bg-light"
                  >
                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileUpload} />
                    <Upload size={24} className="text-muted mb-2" />
                    <div className="small fw-black text-slate-900">点击上传本地图片</div>
                    <div className="text-muted fw-bold mt-1" style={{fontSize: '9px'}}>支持 JPG, PNG, WEBP</div>
                  </div>

                  <div className="text-center text-muted fw-black small mb-3 text-uppercase tracking-widest" style={{fontSize: '9px'}}>或者</div>

                  <input className="form-control input-group-refined border-2 py-3 px-3 fw-bold small mb-3" placeholder="输入网络图片 URL..." value={editArt.cover_image} onChange={e => setEditArt({...editArt, cover_image: e.target.value})} />
                  
                  {editArt.cover_image && (
                    <div className="position-relative">
                      <img src={editArt.cover_image} className="w-100 rounded-4 shadow-sm object-fit-cover" style={{height: '140px'}} alt="Preview" />
                      <button 
                        onClick={() => setEditArt({...editArt, cover_image: ''})}
                        className="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 m-2 shadow"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <button onClick={handleSave} className="btn btn-blue w-100 py-3 rounded-4 shadow-lg d-flex align-items-center justify-content-center gap-2">
                  <Check size={20} /> 保存并发布
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {articles.map(art => (
            <div key={art.id} className="bg-white border rounded-4 p-3 d-flex align-items-center justify-content-between transition-all hover-shadow-sm">
              <div className="d-flex align-items-center gap-3">
                <img src={art.cover_image} className="rounded-3 object-fit-cover d-none d-md-block" style={{width: '60px', height: '40px'}} alt="" />
                <div>
                  <h6 className="fw-black mb-1 text-slate-900">{art.title}</h6>
                  <span className="badge bg-light text-primary rounded-pill px-2 py-1 fw-black small" style={{fontSize: '9px'}}>{art.category}</span>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button onClick={() => { setEditArt({...art}); setEditingId(art.id); setShowEditor(true); }} className="btn btn-light rounded-circle p-2 text-muted"><Edit size={16}/></button>
                <button onClick={() => { if(confirm('删除文章?')) { const n = articles.filter(a => a.id !== art.id); setArticles(n); localStorage.setItem('site_articles', JSON.stringify(n)); } }} className="btn btn-light rounded-circle p-2 text-danger"><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- 子组件：工具配置 (保持不变) ---
const ManageTools = () => {
  const [tools, setTools] = useState<any[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTool, setEditTool] = useState({ 
    name: '', 
    description: '', 
    route: '',
    iconName: 'Zap', 
    is_premium: false, 
    category: '开发' 
  });

  useEffect(() => {
    const saved = localStorage.getItem('site_tools');
    if (saved && JSON.parse(saved).length > 0) {
      setTools(JSON.parse(saved));
    } else {
      const defaults = [
        { id: 'markdown', name: 'Markdown 编辑器', description: '实时的 Markdown 转换与预览工具。', route: 'markdown', iconName: 'Code', is_premium: false, category: '开发' },
        { id: 'json-format', name: 'JSON 格式化', description: '让杂乱的 JSON 字符串变得清晰易读。', route: 'json-format', iconName: 'FileJson', is_premium: false, category: '数据' },
        { id: 'gemini-ai', name: 'AI 文案生成', description: '基于 Gemini API 的智能文案助手。', route: 'gemini-ai', iconName: 'Sparkles', is_premium: true, category: '智能' }
      ];
      setTools(defaults);
      localStorage.setItem('site_tools', JSON.stringify(defaults));
    }
  }, []);

  const handleSave = () => {
    if (!editTool.name) return alert('请填写名称');
    let newList;
    const toolId = editTool.route || editTool.name.toLowerCase().replace(/\s/g, '-');
    
    const toolData = { ...editTool, id: toolId };

    if (editingId) {
      newList = tools.map(t => t.id === editingId ? toolData : t);
    } else {
      newList = [toolData, ...tools];
    }
    setTools(newList);
    localStorage.setItem('site_tools', JSON.stringify(newList));
    setShowEditor(false);
    setEditingId(null);
  };

  const icons = ['Code', 'FileJson', 'Sparkles', 'Calculator', 'Zap', 'Globe', 'Database', 'Layers'];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-black h3 mb-0 text-slate-900">工具配置</h2>
        {!showEditor && (
          <button onClick={() => { setEditTool({ name: '', description: '', route: '', iconName: 'Zap', is_premium: false, category: '开发' }); setEditingId(null); setShowEditor(true); }} className="btn btn-dark rounded-pill px-4 py-2 fw-black small text-uppercase tracking-widest d-flex align-items-center gap-2 shadow">
            <Plus size={18} /> 新增工具
          </button>
        )}
      </div>

      {showEditor ? (
        <div className="animate-fade-in">
          <button onClick={() => setShowEditor(false)} className="btn btn-link text-muted text-decoration-none fw-black small text-uppercase tracking-widest p-0 mb-4 d-flex align-items-center gap-2">
            <ChevronLeft size={16} /> 返回列表
          </button>

          <div className="row g-4">
            <div className="col-lg-7">
              <div className="mb-4">
                <div className="form-label-custom">
                  <span className="label-zh">工具名称</span>
                  <span className="label-en">Tool Name</span>
                </div>
                <input className="form-control input-group-refined border-2 py-3 px-4 fw-black" placeholder="输入工具名称..." value={editTool.name} onChange={e => setEditTool({...editTool, name: e.target.value})} />
              </div>
              <div className="mb-4">
                <div className="form-label-custom">
                  <span className="label-zh">工具路径/链接</span>
                  <span className="label-en">Tool Route/ID</span>
                </div>
                <div className="input-group input-group-refined border-2 shadow-sm overflow-hidden">
                  <span className="input-group-text bg-transparent border-0 ps-3 pe-2 text-muted">
                    <LinkIcon size={16} />
                  </span>
                  <input className="form-control border-0 py-3 px-3 fw-bold small" placeholder="例如: markdown (空则按名称生成)" value={editTool.route} onChange={e => setEditTool({...editTool, route: e.target.value})} />
                </div>
                <div className="text-muted small fw-bold mt-2 ps-1" style={{fontSize: '10px'}}>此 ID 决定了工具在详情页的渲染逻辑。</div>
              </div>
              <div className="mb-4">
                <div className="form-label-custom">
                  <span className="label-zh">核心描述</span>
                  <span className="label-en">Description</span>
                </div>
                <textarea className="form-control input-group-refined border-2 py-3 px-4 fw-bold" rows={3} placeholder="工具功能简述..." value={editTool.description} onChange={e => setEditTool({...editTool, description: e.target.value})} />
              </div>
            </div>

            <div className="col-lg-5">
              <div className="bg-light rounded-5 p-4 border border-2 border-dashed">
                <div className="mb-4">
                  <div className="form-label-custom">
                    <span className="label-zh">图标类型</span>
                    <span className="label-en">Icon Set</span>
                  </div>
                  <select className="form-select input-group-refined border-2 py-3 px-3 fw-black" value={editTool.iconName} onChange={e => setEditTool({...editTool, iconName: e.target.value})}>
                    {icons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                  </select>
                </div>
                
                <div className="mb-5">
                  <div className="form-label-custom">
                    <span className="label-zh">付费控制</span>
                    <span className="label-en">Premium Status</span>
                  </div>
                  <div className="d-flex align-items-center gap-3 bg-white p-3 rounded-4 border shadow-sm">
                    <div className={`p-2 rounded-3 ${editTool.is_premium ? 'bg-warning text-dark' : 'bg-light text-muted'}`}>
                      <Crown size={18} />
                    </div>
                    <div className="flex-grow-1 fw-black small">需 VIP 解锁</div>
                    <div className="form-check form-switch m-0">
                      <input className="form-check-input" type="checkbox" checked={editTool.is_premium} onChange={e => setEditTool({...editTool, is_premium: e.target.checked})} />
                    </div>
                  </div>
                </div>

                <button onClick={handleSave} className="btn btn-blue w-100 py-3 rounded-4 shadow-lg d-flex align-items-center justify-content-center gap-2">
                  <Check size={20} /> {editingId ? '保存更改' : '立即发布工具'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {tools.map(tool => (
            <div key={tool.id} className="col-md-6">
              <div className="bg-white border rounded-5 p-4 d-flex align-items-start justify-content-between h-100 transition-all hover-shadow-sm">
                <div className="d-flex gap-3">
                  <div className="bg-light rounded-4 p-3 d-flex align-items-center justify-content-center" style={{width: '56px', height: '56px'}}>
                    <Wrench size={24} className="text-slate-900" />
                  </div>
                  <div>
                    <h6 className="fw-black mb-1 d-flex align-items-center gap-2">
                      {tool.name}
                      {tool.is_premium && <Crown size={12} className="text-warning" />}
                    </h6>
                    <p className="small text-muted mb-1 fw-bold line-clamp-2" style={{lineHeight: '1.4'}}>{tool.description}</p>
                    <div className="d-flex align-items-center gap-1 text-blue-600 small fw-black text-uppercase" style={{fontSize: '9px'}}>
                      <LinkIcon size={10} /> /{tool.id}
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-1">
                  <button onClick={() => { setEditTool({...tool, route: tool.id}); setEditingId(tool.id); setShowEditor(true); }} className="btn btn-light rounded-circle p-2 text-muted"><Edit size={14}/></button>
                  <button onClick={() => { if(confirm('删除工具?')) { const n = tools.filter(t => t.id !== tool.id); setTools(n); localStorage.setItem('site_tools', JSON.stringify(n)); } }} className="btn btn-light rounded-circle p-2 text-danger"><Trash2 size={14}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;