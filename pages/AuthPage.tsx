
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, Info } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage({ type: 'error', text: '登录失败: ' + error.message });
      else navigate('/');
    } else {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          // 这里的 data 会进入 auth.users 表
          data: {
            display_name: email.split('@')[0]
          }
        }
      });
      
      if (error) {
        setMessage({ type: 'error', text: '注册失败: ' + error.message });
      } else {
        if (data.session) {
          // 如果 Supabase 设置了自动登录（关闭了邮件验证）
          setMessage({ type: 'success', text: '注册成功！正在进入空间...' });
          setTimeout(() => navigate('/'), 1500);
        } else {
          // 如果开启了邮件验证
          setMessage({ type: 'success', text: '注册成功！请前往邮箱查收确认邮件以激活账号。激活后，你的信息才会出现在数据库中。' });
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card border-0 shadow-lg rounded-5 p-4 p-md-5" style={{ maxWidth: '450px', width: '90%' }}>
        <div className="text-center mb-5">
           <div className="bg-slate-900 d-inline-flex p-3 rounded-4 text-white mb-3 shadow-sm">
             <ShieldCheck size={32} className="text-blue-400" />
           </div>
           <h2 className="fw-black">{isLogin ? '欢迎归来' : '加入极客空间'}</h2>
           <p className="text-muted small fw-bold text-uppercase tracking-widest mt-2">Identity & Access Management</p>
        </div>

        {message && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} border-0 rounded-4 mb-4 small fw-bold d-flex align-items-start gap-2 shadow-sm`}>
            <Info size={18} className="flex-shrink-0" />
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="d-flex flex-column gap-3">
          <div className="form-group">
            <label className="label-en mb-2 d-block">Email Address</label>
            <input className="form-control py-3 rounded-4 px-4 fw-bold shadow-sm" type="email" placeholder="输入邮箱" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="label-en mb-2 d-block">Secure Password</label>
            <input className="form-control py-3 rounded-4 px-4 fw-bold shadow-sm" type="password" placeholder="输入密码" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          
          <button type="submit" className="btn btn-blue py-3 rounded-4 fw-black shadow mt-3 w-100" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
            {isLogin ? '立即登录' : '注册新账号'}
          </button>
        </form>

        <div className="text-center mt-4">
          <button onClick={() => { setIsLogin(!isLogin); setMessage(null); }} className="btn btn-link text-decoration-none text-muted small fw-bold">
            {isLogin ? '没有账号？开启你的实验室之旅' : '已有账号？立即返回空间'}
          </button>
        </div>

        {!isLogin && (
          <div className="mt-5 p-3 bg-light rounded-4 border">
             <div className="d-flex align-items-center gap-2 mb-2">
               <Info size={14} className="text-blue-600" />
               <span className="fw-black small text-uppercase tracking-tighter" style={{fontSize: '10px'}}>温馨提示</span>
             </div>
             <p className="mb-0 text-muted" style={{fontSize: '11px', lineHeight: '1.5'}}>
               注册后请检查邮箱。完成验证前，您的信息暂时存储在系统加密区，验证通过后将自动同步至个人 Profile 表。
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
