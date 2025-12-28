
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { 
  User, 
  LogOut, 
  Menu, 
  ShieldCheck,
  ChevronDown
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

  return (
    <HashRouter>
      <div className="d-flex flex-column min-vh-100">
        <header className="fixed-top w-100">
          <nav className="navbar navbar-expand-lg navbar-refined mx-auto">
            <div className="container-fluid px-0">
              <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
                <span className="fw-black fs-4 tracking-tighter text-slate-900">
                  冷丶布丁<span className="logo-dot ms-1"></span>
                </span>
              </Link>
              
              <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
                <Menu size={24} />
              </button>

              <div className="collapse navbar-collapse" id="mainNavbar">
                <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
                  <li className="nav-item">
                    <Link to="/" className="nav-link nav-link-refined">首页</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/articles" className="nav-link nav-link-refined">深度思考</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/tools" className="nav-link nav-link-refined">实验室</Link>
                  </li>
                </ul>

                <div className="d-flex align-items-center gap-2">
                  {user ? (
                    <div className="dropdown">
                      <div className="d-flex align-items-center gap-2 cursor-pointer ps-2 py-1 pe-3 bg-light rounded-pill border" data-bs-toggle="dropdown">
                        <div className="rounded-circle overflow-hidden border border-white" style={{width: '32px', height: '32px'}}>
                          <img src={user.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden'} alt="avatar" className="w-100 h-100 object-fit-cover" />
                        </div>
                        <span className="small fw-bold text-dark d-none d-sm-inline">{user.displayName || user.email.split('@')[0]}</span>
                        <ChevronDown size={14} className="text-muted" />
                      </div>
                      <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg p-2 rounded-4 mt-3">
                        <li className="px-3 py-2 border-bottom mb-2">
                           <div className="small fw-black text-muted text-uppercase tracking-widest" style={{fontSize: '9px'}}>权限身份</div>
                           <div className="fw-bold text-blue-600">{user.role === 'admin' ? '系统管理员' : '认证用户'}</div>
                        </li>
                        {user.role === 'admin' && (
                          <li><Link to="/admin" className="dropdown-item fw-bold rounded-3">管理中心</Link></li>
                        )}
                        <li><Link to="/profile" className="dropdown-item fw-bold rounded-3">个人足迹</Link></li>
                        <li><hr className="dropdown-divider opacity-50" /></li>
                        <li><button onClick={handleLogout} className="dropdown-item fw-bold text-danger rounded-3 d-flex align-items-center gap-2"><LogOut size={16} /> 登出账号</button></li>
                      </ul>
                    </div>
                  ) : (
                    <Link to="/auth" className="btn btn-blue py-2 px-4">
                      开始探索
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </nav>
        </header>

        {/* 顶部留白，适配悬浮导航 */}
        <div style={{ height: '100px' }}></div>

        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
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
                <div className="d-inline-flex align-items-center gap-2">
                  <span className="fw-black h5 mb-0">冷丶布丁<span className="logo-dot ms-1" style={{width: '6px', height: '6px'}}></span></span>
                </div>
              </div>
              <div className="col-md-4 text-center">
                <p className="text-muted mb-0 small fw-medium">© 2026 冷丶布丁的个人空间. Built with Passion.</p>
              </div>
              <div className="col-md-4 text-center text-md-end">
                <div className="d-flex justify-content-center justify-content-md-end gap-4">
                  <a href="#" className="text-muted text-decoration-none small fw-bold hover-blue">Github</a>
                  <a href="#" className="text-muted text-decoration-none small fw-bold hover-blue">Twitter</a>
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
