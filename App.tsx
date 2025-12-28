
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { 
  User, 
  LogOut, 
  Menu, 
  ShieldCheck,
  ChevronDown,
  Settings,
  Crown,
  LayoutDashboard,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { supabase } from './lib/supabaseClient';

// Pages
import HomePage from './pages/HomePage';
import ArticleList from './pages/ArticleList';
import ArticleDetail from './pages/ArticleDetail';
import ToolsGrid from './pages/ToolsGrid';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import ToolDetail from './pages/ToolDetail';
import ProfilePage from './pages/ProfilePage';
import ContactPage from './pages/ContactPage';

const App: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // 监听滚动
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);

    // 1. 初始化检查当前 Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) fetchProfile(session.user.id, session.user.email);
      else setLoading(false);
    });

    // 2. 监听 Auth 状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) fetchProfile(session.user.id, session.user.email);
      else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string, email: string | undefined) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setUser({ ...data, email });
    } else {
      // 如果没有 Profile，可能是刚注册，创建一个默认的
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert([{ id: userId, email, role: 'user' }])
        .select()
        .single();
      setUser({ ...newProfile, email });
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.hash = '#/';
  };

  const renderBadge = () => {
    if (!user) return null;
    if (user.role === 'admin') return <span className="badge bg-slate-900 text-white rounded-pill px-2 py-1 ms-1 fw-black shadow-sm" style={{fontSize: '9px'}}><ShieldCheck size={10} className="me-1" /> STAFF</span>;
    if (user.role === 'vip') return <span className="badge bg-warning text-dark rounded-pill px-2 py-1 ms-1 fw-black shadow-sm" style={{fontSize: '9px'}}><Crown size={10} className="me-1" /> VIP PRO</span>;
    return <span className="badge bg-light text-muted rounded-pill px-2 py-1 ms-1 fw-black border" style={{fontSize: '9px'}}>MEMBER</span>;
  };

  if (loading) return <div className="min-vh-100 d-flex align-items-center justify-content-center fw-black text-muted text-uppercase tracking-widest">初始化极客空间...</div>;

  return (
    <HashRouter>
      <div className="d-flex flex-column min-vh-100">
        <header className="fixed-top w-100">
          <nav className={`navbar navbar-expand-lg navbar-refined mx-auto ${scrolled ? 'scrolled' : ''}`}>
            <div className="container-fluid px-0">
              <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
                <span className="fw-black fs-4 tracking-tighter text-slate-900 transition-all">
                  冷丶布丁<span className="logo-dot"></span>
                </span>
              </Link>
              <div className="collapse navbar-collapse" id="mainNavbar">
                <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
                  <li className="nav-item"><Link to="/" className="nav-link nav-link-refined">首页</Link></li>
                  <li className="nav-item"><Link to="/articles" className="nav-link nav-link-refined">深度思考</Link></li>
                  <li className="nav-item"><Link to="/tools" className="nav-link nav-link-refined">实验室</Link></li>
                  <li className="nav-item"><Link to="/contact" className="nav-link nav-link-refined">与我联系</Link></li>
                </ul>
                <div className="d-flex align-items-center gap-3">
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="btn btn-dark rounded-pill px-3 py-2 d-none d-lg-flex align-items-center gap-2 shadow-sm border-0 transition-all hover-blue">
                      <LayoutDashboard size={16} />
                      <span className="fw-black small text-uppercase tracking-widest" style={{fontSize: '11px'}}>进入后台</span>
                    </Link>
                  )}
                  {user ? (
                    <div className="dropdown">
                      <div className="d-flex align-items-center gap-2 cursor-pointer ps-2 py-1 pe-3 bg-white rounded-pill border shadow-sm transition-all" data-bs-toggle="dropdown">
                        <div className="rounded-circle overflow-hidden border border-light" style={{width: '32px', height: '32px'}}>
                          {user.avatar_url ? (
                             <img src={user.avatar_url} alt="avatar" className="w-100 h-100 object-fit-cover" />
                          ) : (
                             <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-secondary text-white fw-bold small">
                               {(user.display_name?.charAt(0) || user.email.charAt(0)).toUpperCase()}
                             </div>
                          )}
                        </div>
                        <div className="d-flex flex-column">
                          <span className="small fw-black text-dark lh-1">{user.display_name || user.email.split('@')[0]}</span>
                          {renderBadge()}
                        </div>
                        <ChevronDown size={14} className="text-muted ms-1" />
                      </div>
                      <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg p-2 rounded-4 mt-3 animate-fade-in">
                        <li><h6 className="dropdown-header small text-uppercase fw-black text-muted">个人中心</h6></li>
                        <li><Link to="/profile" className="dropdown-item rounded-3">个人资料</Link></li>
                        {user.role === 'admin' && <li><Link to="/admin" className="dropdown-item rounded-3">管理中心</Link></li>}
                        <li><hr className="dropdown-divider my-2" /></li>
                        <li><button onClick={handleLogout} className="dropdown-item text-danger d-flex align-items-center gap-2 rounded-3"><LogOut size={16} /> 登出账号</button></li>
                      </ul>
                    </div>
                  ) : (
                    <Link to="/auth" className="btn btn-blue py-2 px-4 shadow">开始探索</Link>
                  )}
                </div>
              </div>
            </div>
          </nav>
        </header>
        <div style={{ height: '100px' }}></div>
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route path="/articles" element={<ArticleList />} />
            <Route path="/articles/:id" element={<ArticleDetail user={user} />} />
            <Route path="/tools" element={<ToolsGrid user={user} onUpdatePremium={async () => user && await fetchProfile(user.id, user.email)} />} />
            <Route path="/tools/:id" element={<ToolDetail user={user} />} />
            <Route path="/admin/*" element={<AdminDashboard user={user} />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage user={user} onUpdateProfile={async () => user && await fetchProfile(user.id, user.email)} />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <footer className="bg-white border-top py-5 mt-5">
           <div className="container text-center text-muted small fw-medium">© 2026 冷丶布丁的个人空间. Built with Passion and Supabase.</div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;