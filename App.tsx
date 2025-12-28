
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

// Pages
import HomePage from './pages/HomePage';
import ArticleList from './pages/ArticleList';
import ArticleDetail from './pages/ArticleDetail';
import ToolsGrid from './pages/ToolsGrid';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import ToolDetail from './pages/ToolDetail';
import ProfilePage from './pages/ProfilePage';

const App: React.FC = () => {
  const [user, setUser] = useState<{ 
    email: string; 
    role: 'admin' | 'user'; 
    is_premium_user?: boolean;
    displayName?: string;
    avatarUrl?: string;
  } | null>(null);

  const [scrolled, setScrolled] = useState(false);
  const [menuExpanded, setMenuExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('site_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('site_user');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('site_user');
    setUser(null);
    window.location.hash = '#/';
  };

  const updateUserInfo = (newData: any) => {
    if (user) {
      const updatedUser = { ...user, ...newData };
      setUser(updatedUser);
      localStorage.setItem('site_user', JSON.stringify(updatedUser));
    }
  };

  const renderBadge = () => {
    if (!user) return null;
    if (user.role === 'admin') return <span className="badge bg-slate-900 text-white rounded-pill px-2 py-1 ms-1 fw-black shadow-sm" style={{fontSize: '9px'}}><ShieldCheck size={10} className="me-1" /> STAFF</span>;
    if (user.is_premium_user) return <span className="badge bg-warning text-dark rounded-pill px-2 py-1 ms-1 fw-black shadow-sm" style={{fontSize: '9px'}}><Crown size={10} className="me-1" /> VIP PRO</span>;
    return <span className="badge bg-light text-muted rounded-pill px-2 py-1 ms-1 fw-black border" style={{fontSize: '9px'}}>MEMBER</span>;
  };

  return (
    <HashRouter>
      <div className="d-flex flex-column min-vh-100">
        <header className="fixed-top w-100">
          <nav className={`navbar navbar-expand-lg navbar-refined mx-auto ${scrolled ? 'scrolled' : ''} ${menuExpanded ? 'expanded' : ''}`}>
            <div className="container-fluid px-0">
              <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
                <span className="fw-black fs-4 tracking-tighter text-slate-900 transition-all">
                  冷丶布丁<span className="logo-dot"></span>
                </span>
              </Link>
              
              <button 
                className="navbar-toggler border-0 shadow-none" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#mainNavbar"
                onClick={() => setMenuExpanded(!menuExpanded)}
              >
                <Menu size={24} />
              </button>

              <div className="collapse navbar-collapse" id="mainNavbar">
                <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
                  <li className="nav-item"><Link to="/" className="nav-link nav-link-refined">首页</Link></li>
                  <li className="nav-item"><Link to="/articles" className="nav-link nav-link-refined">深度思考</Link></li>
                  <li className="nav-item"><Link to="/tools" className="nav-link nav-link-refined">实验室</Link></li>
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
                      <div className="d-flex align-items-center gap-2 cursor-pointer ps-2 py-1 pe-3 bg-white rounded-pill border shadow-sm transition-all" data-bs-toggle="dropdown" aria-expanded="false">
                        <div className="rounded-circle overflow-hidden border border-light" style={{width: '32px', height: '32px'}}>
                          <img src={user.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden'} alt="avatar" className="w-100 h-100 object-fit-cover" />
                        </div>
                        <div className="d-flex flex-column">
                          <span className="small fw-black text-dark d-none d-sm-inline lh-1">{user.displayName || user.email.split('@')[0]}</span>
                          {renderBadge()}
                        </div>
                        <ChevronDown size={14} className="text-muted ms-1" />
                      </div>
                      <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg p-2 rounded-4 mt-3 animate-fade-in" style={{minWidth: '220px'}}>
                        <li className="px-3 py-3 border-bottom mb-2 bg-light rounded-top-4">
                           <div className="small fw-black text-muted text-uppercase tracking-widest mb-1" style={{fontSize: '9px'}}>当前身份 / Status</div>
                           <div className={`fw-black fs-6 ${user.role === 'admin' ? 'text-slate-900' : user.is_premium_user ? 'text-warning' : 'text-blue-600'}`}>
                             {user.role === 'admin' ? '总监 / 系统管理员' : user.is_premium_user ? '尊贵会员 / VIP PRO' : '普通会员 / MEMBER'}
                           </div>
                        </li>
                        {user.role === 'admin' && (
                          <li>
                            <Link to="/admin" className="dropdown-item d-flex align-items-center gap-2 text-primary">
                              <ShieldCheck size={16} /> 管理中心 (Dashboard)
                            </Link>
                          </li>
                        )}
                        <li><Link to="/profile" className="dropdown-item">个人足迹</Link></li>
                        
                        {!user.is_premium_user && user.role !== 'admin' ? (
                          <li><Link to="/tools" className="dropdown-item text-warning d-flex align-items-center gap-2"><Crown size={16}/> 升级 PRO</Link></li>
                        ) : (
                          <li className="px-3 py-2 text-success small fw-black d-flex align-items-center gap-2">
                             <CheckCircle2 size={14} /> 已解锁所有 PRO 工具
                          </li>
                        )}
                        
                        <li><hr className="dropdown-divider opacity-50" /></li>
                        <li><button onClick={handleLogout} className="dropdown-item text-danger d-flex align-items-center gap-2"><LogOut size={16} /> 登出账号</button></li>
                      </ul>
                    </div>
                  ) : (
                    <Link to="/auth" className="btn btn-blue py-2 px-4 shadow">
                      开始探索
                    </Link>
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
            <Route path="/tools" element={<ToolsGrid user={user} onUpdatePremium={(s) => updateUserInfo({is_premium_user: s})} />} />
            <Route path="/tools/:id" element={<ToolDetail user={user} />} />
            <Route path="/admin/*" element={<AdminDashboard user={user} />} />
            <Route path="/auth" element={<AuthPage setUser={setUser} />} />
            <Route path="/profile" element={<ProfilePage user={user} onUpdateProfile={updateUserInfo} />} />
          </Routes>
        </main>

        <footer className="bg-white border-top py-5 mt-5">
          <div className="container">
            <div className="row align-items-center gy-4">
              <div className="col-md-4 text-center text-md-start">
                <span className="fw-black h5 mb-0 text-slate-900">冷丶布丁<span className="logo-dot"></span></span>
              </div>
              <div className="col-md-4 text-center">
                <p className="text-muted mb-0 small fw-medium">© 2026 冷丶布丁的个人空间. Built with Passion.</p>
              </div>
              <div className="col-md-4 text-center text-md-end">
                <div className="d-flex justify-content-center justify-content-md-end gap-4">
                  <a href="#" className="text-muted text-decoration-none small fw-black text-uppercase tracking-widest hover-blue">Github</a>
                  <a href="#" className="text-muted text-decoration-none small fw-black text-uppercase tracking-widest hover-blue">Twitter</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
