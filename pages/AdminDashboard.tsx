
import React, { useState, useEffect } from 'react';
import { Navigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  BarChart3, 
  FileText,
  Wrench,
  ChevronLeft
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
      <div className="row g-5">
        <div className="col-lg-3">
          <div className="d-flex flex-row flex-lg-column gap-3 overflow-auto pb-3 pb-lg-0 scrollbar-hide sticky-lg-top" style={{top: '120px'}}>
            <Link to="/admin" className={`btn w-100 text-start py-3 px-4 rounded-4 fw-black text-uppercase tracking-widest small shadow-sm d-flex align-items-center gap-3 ${isActive('/admin') ? 'btn-dark' : 'btn-white bg-white'}`}>
              <BarChart3 size={18} /> 概览
            </Link>
            <Link to="/admin/articles" className={`btn w-100 text-start py-3 px-4 rounded-4 fw-black text-uppercase tracking-widest small shadow-sm d-flex align-items-center gap-3 ${isActive('/admin/articles') ? 'btn-dark' : 'btn-white bg-white'}`}>
              <FileText size={18} /> 文章
            </Link>
            <Link to="/admin/tools" className={`btn w-100 text-start py-3 px-4 rounded-4 fw-black text-uppercase tracking-widest small shadow-sm d-flex align-items-center gap-3 ${isActive('/admin/tools') ? 'btn-dark' : 'btn-white bg-white'}`}>
              <Wrench size={18} /> 工具
            </Link>
          </div>
        </div>

        <div className="col-lg-9">
          <div className="bg-white rounded-5 p-4 p-lg-5 shadow-sm min-vh-50 border">
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

const DashboardHome = () => (
  <div>
    <h2 className="fw-black display-6 tracking-tighter mb-5">管理概览</h2>
    <div className="row g-4">
      <div className="col-sm-6">
        <div className="bg-dark rounded-5 p-5 text-white shadow-lg position-relative overflow-hidden">
          <div className="position-relative z-1">
            <div className="text-secondary small fw-black text-uppercase tracking-widest mb-2">文章总数</div>
            <div className="display-3 fw-black tracking-tighter">42</div>
          </div>
          <FileText size={120} className="position-absolute end-0 bottom-0 opacity-10 m-n3" />
        </div>
      </div>
      <div className="col-sm-6">
        <div className="bg-blue-600 rounded-5 p-5 text-white shadow-lg position-relative overflow-hidden">
          <div className="position-relative z-1">
            <div className="text-white text-opacity-50 small fw-black text-uppercase tracking-widest mb-2">上架工具</div>
            <div className="display-3 fw-black tracking-tighter">12</div>
          </div>
          <Wrench size={120} className="position-absolute end-0 bottom-0 opacity-10 m-n3" />
        </div>
      </div>
    </div>
  </div>
);

const ManageArticles = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editArt, setEditArt] = useState({ title: '', content: '', cover_image: '', category: '技术架构' });

  useEffect(() => {
    const saved = localStorage.getItem('site_articles');
    if (saved) setArticles(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    const newList = [{ ...editArt, id: Date.now().toString(), date: new Date().toISOString().split('T')[0] }, ...articles];
    setArticles(newList);
    localStorage.setItem('site_articles', JSON.stringify(newList));
    setShowEditor(false);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-5 gap-3">
        <h2 className="fw-black display-6 tracking-tighter mb-0">文章管理</h2>
        {!showEditor && (
          <button onClick={() => { setEditArt({ title: '', content: '', cover_image: '', category: '技术架构' }); setShowEditor(true); }} className="btn btn-dark rounded-pill px-4 py-3 fw-black small text-uppercase d-flex align-items-center gap-2 tracking-widest"><Plus size={18}/> 新建</button>
        )}
      </div>

      {showEditor ? (
        <div className="d-flex flex-column gap-4 animate-fade-in">
          <button onClick={() => setShowEditor(false)} className="btn btn-link text-muted text-decoration-none fw-black small text-uppercase tracking-widest d-flex align-items-center gap-2"><ChevronLeft size={16}/> 返回</button>
          <input className="form-control form-control-lg bg-light border-0 rounded-4 fw-black py-4 px-4" placeholder="文章标题..." value={editArt.title} onChange={e => setEditArt({...editArt, title: e.target.value})} />
          <input className="form-control bg-light border-0 rounded-4 fw-bold py-3 px-4" placeholder="封面图片 URL..." value={editArt.cover_image} onChange={e => setEditArt({...editArt, cover_image: e.target.value})} />
          <textarea className="form-control bg-light border-0 rounded-4 fw-medium py-4 px-4 font-monospace" rows={12} placeholder="内容 (Markdown)..." value={editArt.content} onChange={e => setEditArt({...editArt, content: e.target.value})} />
          <div className="d-flex gap-3">
            <button onClick={handleSave} className="btn btn-blue px-5 py-3 rounded-4 flex-grow-1">立即发布</button>
            <button onClick={() => setShowEditor(false)} className="btn btn-light px-5 py-3 rounded-4 fw-black text-muted">取消</button>
          </div>
        </div>
      ) : (
        <div className="list-group list-group-flush">
          {articles.map(art => (
            <div key={art.id} className="list-group-item bg-transparent border-light py-4 px-0 d-flex justify-content-between align-items-center group">
              <div className="d-flex align-items-center gap-4">
                <div className="rounded-4 bg-light overflow-hidden" style={{width: '80px', height: '56px'}}>
                  {art.cover_image && <img src={art.cover_image} className="w-100 h-100 object-fit-cover" alt="thumb" />}
                </div>
                <div>
                  <h6 className="fw-black mb-1 h5 tracking-tight">{art.title}</h6>
                  <span className="small text-muted fw-bold text-uppercase tracking-widest">{art.date}</span>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-light rounded-circle p-2 text-muted hover-blue shadow-sm"><Edit size={16}/></button>
                <button className="btn btn-light rounded-circle p-2 text-muted hover-danger shadow-sm"><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ManageTools = () => (
  <div className="text-center py-5">
    <Wrench size={48} className="text-muted opacity-25 mb-4" />
    <h4 className="fw-black text-muted text-uppercase tracking-widest small">工具管理开发中...</h4>
  </div>
);

export default AdminDashboard;
