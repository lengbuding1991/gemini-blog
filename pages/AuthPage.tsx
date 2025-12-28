
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, Crown } from 'lucide-react';

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

    // 模拟登录逻辑：预设三种身份
    if (email === 'admin@geek.com' && password === 'admin') {
      // 1. 管理员：拥有最高权限
      userObj = { 
        email, 
        role: 'admin', 
        is_premium_user: true, 
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        displayName: '冷丶布丁'
      };
    } else if (email === 'vip@geek.com' && password === 'vip') {
      // 2. 预设 VIP 账号：已购买过 PRO 的用户
      userObj = { 
        email, 
        role: 'user', 
        is_premium_user: true, 
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
        displayName: '尊贵会员'
      };
    } else if (email && password) {
      // 3. 普通用户：未购买 PRO
      userObj = { 
        email, 
        role: 'user', 
        is_premium_user: false, 
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden' 
      };
    }

    if (userObj) {
      setUser(userObj);
      localStorage.setItem('site_user', JSON.stringify(userObj));
      navigate(userObj.role === 'admin' ? '/admin' : '/');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            <div className="text-center mb-5 animate-fade-in">
              <div className="bg-slate-900 d-inline-flex p-4 rounded-5 text-white mb-4 shadow-lg border border-white border-opacity-10">
                <ShieldCheck size={40} className="text-blue-400" />
              </div>
              <h1 className="fw-black tracking-tighter h2 mb-2 text-slate-900">{isLogin ? '欢迎归来' : '加入空间'}</h1>
              <p className="text-slate-400 fw-black text-uppercase tracking-widest" style={{fontSize: '10px'}}>COLD PUDDING'S PERSONAL SPACE</p>
            </div>

            <div className="bg-white border rounded-5 p-4 p-lg-5 shadow-sm">
              <form onSubmit={handleAuth} className="d-flex flex-column gap-4">
                <div>
                  <div className="form-label-custom">
                    <span className="label-zh">电子邮箱</span>
                    <span className="label-en">Email Address</span>
                  </div>
                  <div className="input-group input-group-refined shadow-sm">
                    <span className="input-group-text">
                      <Mail size={18} />
                    </span>
                    <input 
                      type="email" 
                      className="form-control" 
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
                  <div className="input-group input-group-refined shadow-sm">
                    <span className="input-group-text">
                      <Lock size={18} />
                    </span>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-blue py-3 w-100 d-flex align-items-center justify-content-center gap-2 mt-2 shadow">
                  <span className="fw-black text-uppercase tracking-widest small">{isLogin ? '立即登录' : '注册账号'}</span> <ArrowRight size={18} />
                </button>
              </form>

              {isLogin && (
                <div className="mt-4 p-3 bg-light rounded-4 border border-dashed text-center">
                   <div className="small fw-black text-muted text-uppercase tracking-widest mb-2" style={{fontSize: '9px'}}>测试账号提示</div>
                   <div className="d-flex flex-column gap-1">
                     <code className="small text-blue-600 fw-bold">admin@geek.com / admin (管理员)</code>
                     <code className="small text-warning fw-bold">vip@geek.com / vip (已购VIP)</code>
                   </div>
                </div>
              )}

              <div className="text-center mt-5 pt-4 border-top">
                <p className="text-muted small fw-bold mb-0">
                  {isLogin ? '还没有账号？' : '已经有账号？'}
                  <button onClick={() => setIsLogin(!isLogin)} className="btn btn-link text-blue-600 fw-black text-decoration-none p-0 ms-1 text-uppercase tracking-widest" style={{fontSize: '11px'}}>立即切换</button>
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
