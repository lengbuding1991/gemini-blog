
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Lock, Zap, Sparkles, Code, FileJson, Calculator, X, CheckCircle2, Crown, Check, Globe, Database, Layers, Wrench, ExternalLink 
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { UserProfile } from '../types';

interface ToolsGridProps {
  user: UserProfile | null;
  onUpdatePremium: () => Promise<void>;
}

const ToolsGrid: React.FC<ToolsGridProps> = ({ user, onUpdatePremium }) => {
  const navigate = useNavigate();
  const [showPayModal, setShowPayModal] = useState(false);
  const [paymentState, setPaymentState] = useState<'idle' | 'paying' | 'success'>('idle');
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const iconMap: Record<string, React.ReactNode> = {
    'Code': <Code />,
    'FileJson': <FileJson />,
    'Sparkles': <Sparkles />,
    'Calculator': <Calculator />,
    'Zap': <Zap />,
    'Globe': <Globe />,
    'Database': <Database />,
    'Layers': <Layers />,
    'Wrench': <Wrench />
  };

  const fetchTools = async () => {
    const { data } = await supabase.from('tools').select('*').order('created_at', { ascending: true });
    if (data && data.length > 0) {
      setTools(data);
    } else {
      setTools([
        { id: 'markdown', name: 'Markdown 编辑器', description: '实时的 Markdown 转换与预览工具。', icon_name: 'Code', is_premium: false, category: '开发' },
        { id: 'json-format', name: 'JSON 格式化', description: '让杂乱的 JSON 字符串变得清晰易读。', icon_name: 'FileJson', is_premium: false, category: '数据' },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleStartPay = async () => {
    if (!user) return;
    setPaymentState('paying');
    // 模拟支付网络延迟
    await new Promise(r => setTimeout(r, 1500));
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'vip' })
        .eq('id', user.id);

      if (error) throw error;
      
      // 关键修复：等待父组件的 state 更新完毕
      await onUpdatePremium();
      setPaymentState('success');

    } catch (error: any) {
      if (error.message && error.message.includes('security policy')) {
         alert(`权限更新失败：数据库拒绝了本次操作。\n\n这通常是由于 'profiles' 表的行级安全策略 (RLS) 未正确配置。请检查 README.md 文件中的 '4. 行级安全策略 (RLS) 配置' 章节，并确保已为 profiles 表添加了允许用户更新自己信息的策略。`);
      } else {
        alert('权限更新失败: ' + error.message);
      }
      setPaymentState('idle'); // 失败时重置状态
    }
  };
  
  const handleCloseModal = () => {
    setShowPayModal(false);
    // 动画结束后重置支付状态
    setTimeout(() => {
      setPaymentState('idle');
    }, 300);
  }

  const handleLaunch = (tool: any) => {
    if (!user) return navigate('/auth');
    
    const hasAccess = user.role === 'admin' || user.role === 'vip' || !tool.is_premium;
    if (!hasAccess) {
      setShowPayModal(true);
      return;
    }

    if (tool.external_url) {
      window.open(tool.external_url, '_blank');
    } else {
      navigate(`/tools/${tool.id}`);
    }
  };

  if (loading) return <div className="container py-5 text-center fw-black opacity-50">扫描实验室设备中...</div>;

  return (
    <div className="container py-5">
      <header className="text-center mb-5 py-5 animate-fade-in">
        <h1 className="display-3 fw-black tracking-tighter mb-3 text-slate-900">个人实验室<span className="text-blue-600">.</span></h1>
        <p className="text-muted fw-bold text-uppercase tracking-widest small">COLD PUDDING'S LAB / 效率工具集</p>
      </header>

      <div className="row g-4">
        {tools.map(tool => {
          const isNotLoggedIn = !user;
          const hasAccess = user?.role === 'admin' || user?.role === 'vip' || !tool.is_premium;
          const isPremiumLocked = tool.is_premium && !hasAccess;

          return (
            <div key={tool.id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 p-4 shadow-sm position-relative transition-all hover-shadow bg-white rounded-5">
                <div className="position-absolute top-0 end-0 p-4 d-flex gap-2">
                  {tool.is_premium && (
                    <span className={`badge ${hasAccess ? 'bg-success' : 'bg-warning'} text-dark rounded-pill py-2 px-3 fw-black small text-uppercase tracking-tighter shadow-sm d-flex align-items-center gap-1`}>
                      {hasAccess ? <Check size={12}/> : <Crown size={12} />} {hasAccess ? '已解锁' : 'PRO'}
                    </span>
                  )}
                  {isNotLoggedIn && <span className="badge bg-dark rounded-pill py-2 px-3 fw-black small text-uppercase tracking-tighter"><Lock size={12} className="me-1" /> LOCK</span>}
                </div>

                <div className="bg-light rounded-4 d-flex align-items-center justify-content-center mb-4 shadow-inner" style={{width: '80px', height: '80px'}}>
                  {React.cloneElement((iconMap[tool.icon_name] || <Zap />) as React.ReactElement<any>, { size: 36, className: 'text-dark' })}
                </div>

                <div className="card-body p-0">
                  <h3 className="h4 fw-black mb-2 text-slate-900 d-flex align-items-center gap-2">
                    {tool.name}
                    {tool.external_url && <ExternalLink size={14} className="text-muted opacity-50" />}
                  </h3>
                  <p className="text-muted fw-medium mb-5 small" style={{minHeight: '40px'}}>{tool.description}</p>
                </div>

                <div className="mt-auto">
                  <button 
                    onClick={() => handleLaunch(tool)}
                    className={`btn ${isPremiumLocked ? 'btn-warning' : (tool.is_premium ? 'btn-blue' : 'btn-dark')} w-100 py-3 rounded-4 fw-black text-uppercase tracking-widest small shadow-sm d-flex align-items-center justify-content-center gap-2`}
                  >
                    {isNotLoggedIn ? (
                      <><Lock size={16} /> 请先登录</>
                    ) : isPremiumLocked ? (
                      <><Crown size={16} /> 解锁 VIP 功能</>
                    ) : (
                      <><Zap size={16} /> {tool.external_url ? '访问外部链接' : '立即启动'}</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showPayModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3" style={{backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)'}}>
          <div className="bg-white rounded-5 shadow-2xl p-4 p-lg-5 animate-fade-in" style={{maxWidth: '450px', width: '90%'}}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-black tracking-tight mb-0 text-slate-900">开通 VIP 权限</h3>
              <button onClick={handleCloseModal} className="btn btn-light rounded-circle p-2"><X size={20}/></button>
            </div>
            
            {paymentState === 'success' ? (
              <div className="text-center py-4">
                <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex p-3 mb-3 animate-fade-in"><Check size={40} /></div>
                <h4 className="fw-black text-success">权限已成功解锁！</h4>
                <p className="text-muted small fw-bold mb-4">所有 VIP 工具现在都可供您使用。</p>
                <button onClick={handleCloseModal} className="btn btn-dark w-100 py-3 rounded-4 fw-black text-uppercase tracking-widest small">太棒了！</button>
              </div>
            ) : (
              <>
                <div className="bg-slate-900 rounded-5 p-4 text-white mb-4 position-relative overflow-hidden">
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="bg-warning text-dark p-2 rounded-3 shadow"><Crown size={24} /></div>
                    <div>
                      <div className="fw-black text-warning text-uppercase small tracking-widest" style={{fontSize: '9px'}}>Lifetime Access / 终身会员</div>
                      <div className="h4 fw-black mb-0">¥ 19.9 <span className="small opacity-50 fw-medium">/ 永久</span></div>
                    </div>
                  </div>
                  <ul className="list-unstyled mb-0 small fw-bold text-slate-400">
                    <li className="mb-2 d-flex align-items-center gap-2"><CheckCircle2 className="text-blue-400" size={16} /> 解锁 AI 实验室所有智能工具</li>
                    <li className="mb-2 d-flex align-items-center gap-2"><CheckCircle2 className="text-blue-400" size={16} /> 优先体验管理端发布的最新工具</li>
                    <li className="d-flex align-items-center gap-2"><CheckCircle2 className="text-blue-400" size={16} /> 个人资料页尊贵 VIP 专属勋章</li>
                  </ul>
                </div>
                <button onClick={handleStartPay} className="btn btn-blue w-100 py-4 rounded-4 fs-5 fw-black shadow-lg" disabled={paymentState === 'paying'}>
                  {paymentState === 'paying' ? <span className="spinner-border spinner-border-sm me-2"></span> : '立即模拟支付'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolsGrid;
