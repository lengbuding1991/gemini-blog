
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';

interface AuthPageProps {
  setUser: (user: any) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    let userObj = null;
    if (email === 'admin@geek.com' && password === 'admin') {
      userObj = { email, role: 'admin', is_premium_user: true, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' };
    } else if (email && password) {
      userObj = { email, role: 'user', is_premium_user: false, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden' };
    }

    if (userObj) {
      setUser(userObj);
      localStorage.setItem('site_user', JSON.stringify(userObj));
      navigate(userObj.role === 'admin' ? '/admin' : '/');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light position-relative overflow-hidden">
      <div className="container position-relative z-1">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="text-center mb-5 animate-fade-in">
              <div className="bg-dark d-inline-flex p-4 rounded-5 text-white mb-4 shadow-xl">
                <ShieldCheck size={48} className="text-primary" />
              </div>
              <h1 className="fw-black tracking-tighter display-4 mb-2">{isLogin ? '欢迎归来' : '加入空间'}</h1>
              <p className="text-muted fw-black text-uppercase tracking-widest small opacity-75">COLD PUDDING'S PERSONAL SPACE</p>
            </div>

            <div className="card border-0 shadow-2xl rounded-5 p-4 p-lg-5 bg-white">
              <form onSubmit={handleAuth} className="d-flex flex-column gap-4">
                <div>
                  <div className="form-label-custom">
                    <span className="label-zh">电子邮箱</span>
                    <span className="label-en">Email Address</span>
                  </div>
                  <div className="input-group input-group-refined overflow-hidden">
                    <span className="input-group-text bg-transparent border-0 ps-4">
                      <Mail size={20} className="text-muted" />
                    </span>
                    <input 
                      type="email" 
                      className="form-control border-0 py-3 rounded-end-4 fw-bold" 
                      placeholder="your@email.com" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                
                <div>
                  <div className="form-label-custom">
                    <span className="label-zh">安全密码</span>
                    <span className="label-en">Password</span>
                  </div>
                  <div className="input-group input-group-refined overflow-hidden">
                    <span className="input-group-text bg-transparent border-0 ps-4">
                      <Lock size={20} className="text-muted" />
                    </span>
                    <input 
                      type="password" 
                      className="form-control border-0 py-3 rounded-end-4 fw-bold" 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-blue py-3 fs-5 d-flex align-items-center justify-content-center gap-3 mt-2 shadow-lg">
                  <span className="fw-black">{isLogin ? '立即登录系统' : '创建极客账号'}</span> <ArrowRight size={22} />
                </button>
              </form>

              <div className="text-center mt-5 pt-4 border-top border-light">
                <p className="text-muted small fw-bold mb-0">
                  {isLogin ? '还没有账号？' : '已经有账号？'}
                  <button onClick={() => setIsLogin(!isLogin)} className="btn btn-link text-blue-600 fw-black text-decoration-none p-0 ms-2 text-uppercase tracking-widest" style={{fontSize: '11px'}}>立即注册 / REGISTER</button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
