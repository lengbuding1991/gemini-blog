import React, { useState, useEffect, useRef } from 'react';
import { Navigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, BarChart3, FileText, Wrench, ChevronLeft, Zap, Crown, 
  Image as ImageIcon, Tag, Hash, DollarSign, Upload, Link as LinkIcon, Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface AdminDashboardProps {
  user: { id: string; email: string; role: string } | null;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const location = useLocation();
  if (!user || user.role !== 'admin') return <Navigate to="/" />;
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="container py-5 animate-fade-in">
      <div className="row g-4">
        <div className="col-lg-3">
          <div className="sticky-lg-top" style={{top: '120px'}}>
            <div className="d-flex flex-row flex-lg-column gap-2 mb-4">
              <Link to="/admin" className={`btn w-100 text-start py-3 px-4 rounded-4 fw-black transition-all ${isActive('/admin') ? 'btn-dark shadow' : 'btn-white bg-white shadow-sm'}`}><BarChart3 size={18} className="me-2"/> 概览</Link>
              <Link to="/admin/articles" className={`btn w-100 text-start py-3 px-4 rounded-4 fw-black transition-all ${isActive('/admin/articles') ? 'btn-dark shadow' : 'btn-white bg-white shadow-sm'}`}><FileText size={18} className="me-2"/> 文章管理</Link>
              <Link to="/admin/tools" className={`btn w-100 text-start py-3 px-4 rounded-4 fw-black transition-all ${isActive('/admin/tools') ? 'btn-dark shadow' : 'btn-white bg-white shadow-sm'}`}><Wrench size={18} className="me-2"/> 工具配置</Link>
            </div>
          </div>
        </div>
        <div className="col-lg-9">
          <div className="bg-white rounded-5 p-4 p-md-5 shadow-sm min-vh-50 border">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/articles" element={<ManageArticles authorId={user.id} />} />
              <Route path="/tools" element={<ManageTools />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardHome = () => {
  const [stats, setStats] = useState({ articles: 0, tools: 0 });
  useEffect(() => {
    const fetchStats = async () => {
      const { count: artCount } = await supabase.from('articles').select('*', { count: 'exact', head: true });
      const { count: toolCount } = await supabase.from('tools').select('*', { count: 'exact', head: true });
      setStats({ articles: artCount || 0, tools: toolCount || 0 });
    };
    fetchStats();
  }, []);
  return (
    <div>
      <h2 className="fw-black display-6 mb-5 tracking-tighter text-slate-900">控制台概览</h2>
      <div className="row g-4">
        <div className="col-sm-6">
          <div className="bg-slate-900 rounded-5 p-5 text-white shadow-lg">
            <div className="small fw-black text-uppercase opacity-50 mb-2 tracking-widest">Total Articles</div>
            <div className="display-3 fw-black">{stats.articles}</div>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="bg-blue-600 rounded-5 p-5 text-white shadow-lg">
            <div className="small fw-black text-uppercase opacity-50 mb-2 tracking-widest">Active Tools</div>
            <div className="display-3 fw-black">{stats.tools}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ManageArticles = ({ authorId }: { authorId: string }) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editArt, setEditArt] = useState({ 
    title: '', 
    excerpt: '', 
    content: '', 
    cover_image: '', 
    category: '技术架构' 
  });

  const fetchArticles = async () => {
    const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    setArticles(data || []);
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `article_covers/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('covers')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('covers')
        .getPublicUrl(filePath);

      setEditArt({ ...editArt, cover_image: publicUrl });
      alert('封面图上传成功！');
    } catch (error: any) {
      if (error.message && error.message.includes('Bucket not found')) {
        alert("上传失败：未找到名为 'covers' 的存储桶。\n\n请前往 Supabase 控制台 > Storage 页面，确认已创建一个名为 'covers' 的公开（Public）存储桶。");
      } else if (error.message && error.message.includes('security policy')) {
        alert("上传失败：权限不足。\n\n这通常是由于 Supabase 的存储策略 (Storage RLS) 未正确配置。请检查 README.md 文件中的 '2.2 配置存储桶访问策略' 章节，并确保已执行相关的 SQL 脚本。");
      } else {
        alert('上传失败: ' + error.message);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!editArt.title || !editArt.content) return alert('请填入标题和正文');
    const articleData = { ...editArt, author_id: authorId };
    
    let error;
    if (editingId) {
      const { error: err } = await supabase.from('articles').update(articleData).eq('id', editingId);
      error = err;
    } else {
      const { error: err } = await supabase.from('articles').insert([articleData]);
      error = err;
    }

    if (error) {
        alert('保存失败: ' + error.message + '\n\n提示：这通常是由于数据库的 Row Level Security (RLS) 策略没有正确配置。请检查 README.md 中的 RLS 配置指南。');
    } else {
      setShowEditor(false);
      fetchArticles();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这篇文章吗？操作不可撤销。')) {
      await supabase.from('articles').delete().eq('id', id);
      fetchArticles();
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-black h3 mb-0 tracking-tighter">内容管理</h2>
        {!showEditor && (
          <button onClick={() => { 
            setEditArt({ title: '', excerpt: '', content: '', cover_image: '', category: '技术架构' }); 
            setEditingId(null); 
            setShowEditor(true); 
          }} className="btn btn-blue rounded-pill px-4 fw-black">
            <Plus size={18} className="me-1"/> 发布新文章
          </button>
        )}
      </div>

      {showEditor ? (
        <div className="animate-fade-in">
          <button onClick={() => setShowEditor(false)} className="btn btn-link text-muted mb-4 p-0 fw-bold text-decoration-none">
            <ChevronLeft size={16}/> 取消返回
          </button>
          
          <div className="row g-4">
            <div className="col-12">
               <label className="fw-black small text-uppercase mb-2 text-muted tracking-widest">文章标题</label>
               <input className="form-control py-3 rounded-4 px-4 shadow-sm border-light fw-bold" placeholder="输入引人入胜的标题" value={editArt.title} onChange={e => setEditArt({...editArt, title: e.target.value})} />
            </div>
            <div className="col-md-6">
               <label className="fw-black small text-uppercase mb-2 text-muted tracking-widest">分类</label>
               <select className="form-select py-3 rounded-4 px-4 shadow-sm border-light fw-bold" value={editArt.category} onChange={e => setEditArt({...editArt, category: e.target.value})}>
                 <option>技术架构</option>
                 <option>前端开发</option>
                 <option>人工智能</option>
                 <option>生活随想</option>
                 <option>作品展示</option>
               </select>
            </div>
            <div className="col-md-6"></div> {/* Placeholder to keep layout */}
            
            {/* --- NEW: Image Preview & Upload Section --- */}
            <div className="col-12">
              <div className="row g-3 align-items-end">
                <div className="col-md-3 col-sm-4">
                  <label className="fw-black small text-uppercase mb-2 text-muted tracking-widest">封面预览</label>
                  <div className="aspect-ratio aspect-ratio-1x1 bg-light rounded-4 d-flex align-items-center justify-content-center overflow-hidden border shadow-inner">
                    {editArt.cover_image ? (
                      <img src={editArt.cover_image} className="w-100 h-100 object-fit-cover" alt="封面预览"/>
                    ) : (
                      <ImageIcon size={32} className="text-muted opacity-50" />
                    )}
                  </div>
                </div>
                <div className="col-md-9 col-sm-8">
                  <label className="fw-black small text-uppercase mb-2 text-muted tracking-widest d-flex justify-content-between">
                    <span>封面图 URL / 上传</span>
                    {uploading && <span className="text-blue-600"><Loader2 size={12} className="animate-spin" /> 上传中...</span>}
                  </label>
                  <div className="input-group">
                      <input className="form-control py-3 rounded-start-4 px-4 shadow-sm border-light fw-bold" placeholder="输入 URL 或点击右侧上传" value={editArt.cover_image} onChange={e => setEditArt({...editArt, cover_image: e.target.value})} />
                      <button className="btn btn-light border-light border-start-0 rounded-end-4 px-3 d-flex align-items-center" type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                        <Upload size={18} />
                      </button>
                  </div>
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileUpload} />
                </div>
              </div>
            </div>

            <div className="col-12">
               <label className="fw-black small text-uppercase mb-2 text-muted tracking-widest">内容摘要</label>
               <textarea className="form-control py-3 rounded-4 px-4 shadow-sm border-light fw-medium" rows={2} placeholder="简短的描述，将显示在列表页" value={editArt.excerpt} onChange={e => setEditArt({...editArt, excerpt: e.target.value})} />
            </div>
            <div className="col-12">
               <label className="fw-black small text-uppercase mb-2 text-muted tracking-widest">正文内容 (Markdown)</label>
               <textarea className="form-control font-monospace py-4 rounded-4 px-4 shadow-sm border-light" rows={12} placeholder="支持 Markdown 语法..." value={editArt.content} onChange={e => setEditArt({...editArt, content: e.target.value})} />
            </div>
          </div>
          <button onClick={handleSave} className="btn btn-blue w-100 py-3 rounded-4 fw-black shadow-lg mt-5">确认并发布</button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {articles.length > 0 ? articles.map(art => (
            <div key={art.id} className="bg-light rounded-5 p-3 d-flex align-items-center justify-content-between border border-white transition-all hover-bg-white hover-shadow-sm">
              <div className="d-flex align-items-center gap-4">
                <div className="rounded-4 overflow-hidden shadow-sm border" style={{width:'60px', height:'60px'}}>
                  <img src={art.cover_image || 'https://picsum.photos/100'} className="w-100 h-100 object-fit-cover" alt="" />
                </div>
                <div>
                  <div className="fw-black h6 mb-1 text-slate-900">{art.title}</div>
                  <div className="d-flex gap-2 align-items-center">
                    <span className="badge bg-white text-primary rounded-pill fw-black border small" style={{fontSize:'9px'}}>{art.category}</span>
                    <span className="small text-muted fw-bold" style={{fontSize:'10px'}}>{new Date(art.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2 pe-2">
                <button onClick={() => { setEditArt(art); setEditingId(art.id); setShowEditor(true); }} className="btn btn-white shadow-sm rounded-circle p-2 text-dark"><Edit size={16}/></button>
                <button onClick={() => handleDelete(art.id)} className="btn btn-white shadow-sm rounded-circle p-2 text-danger"><Trash2 size={16}/></button>
              </div>
            </div>
          )) : (
            <div className="text-center py-5 opacity-50 fw-black text-muted text-uppercase tracking-widest">暂无发布的文章内容</div>
          )}
        </div>
      )}
    </div>
  );
};

const ManageTools = () => {
  const [tools, setTools] = useState<any[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTool, setEditTool] = useState({ 
    id: '', 
    name: '', 
    description: '', 
    icon_name: 'Zap', 
    category: '开发辅助', 
    is_premium: false, 
    price: 0,
    external_url: '' // 新增字段
  });

  const fetchTools = async () => {
    const { data } = await supabase.from('tools').select('*').order('created_at', { ascending: false });
    setTools(data || []);
  };

  useEffect(() => { fetchTools(); }, []);

  const handleSave = async () => {
    if (!editTool.id || !editTool.name) return alert('请填入工具ID和名称');
    
    let error;
    if (editingId) {
      const { error: err } = await supabase.from('tools').update(editTool).eq('id', editingId);
      error = err;
    } else {
      const { error: err } = await supabase.from('tools').insert([editTool]);
      error = err;
    }

    if (error) alert('保存失败 (可能是ID重复): ' + error.message);
    else {
      setShowEditor(false);
      fetchTools();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('确定要移除这个工具配置吗？')) {
      await supabase.from('tools').delete().eq('id', id);
      fetchTools();
    }
  };

  return (
    <div>
       <div className="d-flex justify-content-between align-items-center mb-5">
         <h2 className="fw-black h3 mb-0 tracking-tighter">工具配置</h2>
         {!showEditor && (
           <button onClick={() => { 
             setEditTool({ id: '', name: '', description: '', icon_name: 'Zap', category: '开发辅助', is_premium: false, price: 0, external_url: '' }); 
             setEditingId(null); 
             setShowEditor(true); 
           }} className="btn btn-blue rounded-pill px-4 fw-black">
             <Plus size={18} className="me-1"/> 新增工具
           </button>
         )}
       </div>

       {showEditor ? (
         <div className="animate-fade-in">
           <button onClick={() => setShowEditor(false)} className="btn btn-link text-muted mb-4 p-0 fw-bold text-decoration-none">
             <ChevronLeft size={16}/> 取消返回
           </button>
           
           <div className="row g-4">
             <div className="col-md-6">
                <label className="fw-black small text-uppercase mb-2 text-muted tracking-widest"><Hash size={12} className="me-1"/> 工具唯一 ID (内部路由)</label>
                <input className="form-control py-3 rounded-4 px-4 shadow-sm border-light fw-bold" placeholder="例如: markdown" disabled={!!editingId} value={editTool.id} onChange={e => setEditTool({...editTool, id: e.target.value})} />
             </div>
             <div className="col-md-6">
                <label className="fw-black small text-uppercase mb-2 text-muted tracking-widest">工具显示名称</label>
                <input className="form-control py-3 rounded-4 px-4 shadow-sm border-light fw-bold" placeholder="例如: Markdown 编辑器" value={editTool.name} onChange={e => setEditTool({...editTool, name: e.target.value})} />
             </div>
             <div className="col-12">
                <label className="fw-black small text-uppercase mb-2 text-muted tracking-widest"><LinkIcon size={12} className="me-1"/> 外部工具链接 (可选)</label>
                <input className="form-control py-3 rounded-4 px-4 shadow-sm border-light fw-bold" placeholder="如果填写，将直接跳转到该 URL，忽略内部 ID" value={editTool.external_url} onChange={e => setEditTool({...editTool, external_url: e.target.value})} />
             </div>
             <div className="col-md-6">
                <label className="fw-black small text-uppercase mb-2 text-muted tracking-widest">分类</label>
                <input className="form-control py-3 rounded-4 px-4 shadow-sm border-light fw-bold" placeholder="开发 / 数据 / AI" value={editTool.category} onChange={e => setEditTool({...editTool, category: e.target.value})} />
             </div>
             <div className="col-md-6">
                <label className="fw-black small text-uppercase mb-2 text-muted tracking-widest">图标名 (Lucide)</label>
                <select className="form-select py-3 rounded-4 px-4 shadow-sm border-light fw-bold" value={editTool.icon_name} onChange={e => setEditTool({...editTool, icon_name: e.target.value})}>
                  <option>Zap</option>
                  <option>Code</option>
                  <option>FileJson</option>
                  <option>Sparkles</option>
                  <option>Calculator</option>
                  <option>Globe</option>
                  <option>Database</option>
                  <option>Layers</option>
                  <option>Wrench</option>
                </select>
             </div>
             <div className="col-12">
                <label className="fw-black small text-uppercase mb-2 text-muted tracking-widest">工具功能描述</label>
                <textarea className="form-control py-3 rounded-4 px-4 shadow-sm border-light fw-medium" rows={2} placeholder="简单介绍一下这个工具的用途" value={editTool.description} onChange={e => setEditTool({...editTool, description: e.target.value})} />
             </div>
             <div className="col-md-6 d-flex align-items-center">
                <div className="form-check form-switch bg-light p-3 rounded-4 w-100 border border-white shadow-sm">
                  <input className="form-check-input ms-0 me-3" type="checkbox" role="switch" checked={editTool.is_premium} onChange={e => setEditTool({...editTool, is_premium: e.target.checked})} />
                  <label className="form-check-label fw-black text-uppercase small tracking-widest d-flex align-items-center gap-2">
                    <Crown size={14} className="text-warning" /> VIP 专属工具
                  </label>
                </div>
             </div>
             <div className="col-md-6">
                <label className="fw-black small text-uppercase mb-2 text-muted tracking-widest"><DollarSign size={12} className="me-1"/> 模拟定价 (¥)</label>
                <input type="number" className="form-control py-3 rounded-4 px-4 shadow-sm border-light fw-bold" value={editTool.price} onChange={e => setEditTool({...editTool, price: Number(e.target.value)})} />
             </div>
           </div>
           <button onClick={handleSave} className="btn btn-blue w-100 py-3 rounded-4 fw-black shadow-lg mt-5">保存工具配置</button>
         </div>
       ) : (
         <div className="row g-3">
           {tools.length > 0 ? tools.map(tool => (
             <div key={tool.id} className="col-12">
               <div className="bg-light p-4 rounded-5 border border-white d-flex justify-content-between align-items-center transition-all hover-bg-white hover-shadow-sm">
                  <div className="d-flex align-items-center gap-4">
                    <div className="bg-white rounded-4 p-3 shadow-sm text-blue-600 d-flex align-items-center justify-content-center" style={{width:'56px', height:'56px'}}>
                      <Wrench size={24} />
                    </div>
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <h5 className="fw-black mb-0 text-slate-900">{tool.name}</h5>
                        {tool.is_premium && <Crown size={14} className="text-warning" />}
                        {tool.external_url && <span title="外部链接"><LinkIcon size={12} className="text-muted" /></span>}
                      </div>
                      <div className="text-muted small fw-bold text-uppercase tracking-widest mt-1" style={{fontSize: '9px'}}>ID: {tool.id} · {tool.category}</div>
                    </div>
                  </div>
                  <div className="d-flex gap-2 pe-1">
                    <button onClick={() => { setEditTool(tool); setEditingId(tool.id); setShowEditor(true); }} className="btn btn-white shadow-sm rounded-circle p-2"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(tool.id)} className="btn btn-white shadow-sm rounded-circle p-2 text-danger"><Trash2 size={16}/></button>
                  </div>
               </div>
             </div>
           )) : (
             <div className="col-12 text-center py-5 opacity-50 fw-black text-muted text-uppercase tracking-widest">暂无配置工具数据</div>
           )}
         </div>
       )}
    </div>
  );
};

export default AdminDashboard;