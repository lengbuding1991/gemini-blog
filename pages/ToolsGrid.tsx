
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Zap, Sparkles, Code, FileJson, Calculator, X, CheckCircle2, Crown, Check, Globe, Database, Layers, ShieldCheck } from 'lucide-react';

interface ToolsGridProps {
  user: { email: string; role: string; is_premium_user?: boolean } | null;
  onUpdatePremium: (status: boolean) => void;
}

const ToolsGrid: React.FC<ToolsGridProps> = ({ user, onUpdatePremium }) => {
  const [showPayModal, setShowPayModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [tools, setTools] = useState<any[]>([]);

  const iconMap: Record<string, React.ReactNode> = {
    'Code': <Code />,
    'FileJson': <FileJson />,
    'Sparkles': <Sparkles />,
    'Calculator': <Calculator />,
    'Zap': <Zap />,
    'Globe': <Globe />,
    'Database': <Database />,
    'Layers': <Layers />
  };

  useEffect(() => {
    const savedTools = localStorage.getItem('site_tools');
    if (savedTools) {
      setTools(JSON.parse(savedTools));
    } else {
      const defaults = [
        { id: 'markdown', name: 'Markdown 编辑器', description: '实时的 Markdown 转换与预览工具，支持代码高亮。', iconName: 'Code', is_premium: false, category: '开发' },
        { id: 'json-format', name: 'JSON 格式化', description: '让杂乱的 JSON 字符串变得清晰易读。', iconName: 'FileJson', is_premium: false, category: '数据' },
        { id: 'gemini-ai', name: 'AI 文案生成', description: '基于 Gemini API 的智能文案助手，解锁 PRO 后可用。', iconName: 'Sparkles', is_premium: true, category: '智能' }
      ];
      setTools(defaults);
      localStorage.setItem('site_tools', JSON.stringify(defaults));
    }
  }, []);

  const handleStartPay = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaySuccess(true);
      onUpdatePremium(true);
      setTimeout(() => {
        setShowPayModal(false);
        setPaySuccess(false);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="container py-5">
      <header className="text-center mb-5 py-5 animate-fade-in">
        <h1 className="display-3 fw-black tracking-tighter mb-3 text-slate-900">个人实验室<span className="text-blue-600">.</span></h1>
        <p className="text-muted fw-bold text-uppercase tracking-widest small">COLD PUDDING'S LAB / 效率工具集</p>
      </header>

      <div className="row g-4">
        {tools.map(tool => {
          const isNotLoggedIn = !user;
          // 核心权限判断：管理员或VIP自动解锁
          const hasAccess = user?.role === 'admin' || user?.is_premium_user || !tool.is_premium;
          const isPremiumLocked = tool.is_premium && !hasAccess;

          return (
            <div key={tool.id} className="col-md-6 col-lg-4">
              <div className={`card h-100 card-custom border-0 p-4 shadow-sm position-relative transition-all ${isNotLoggedIn ? 'opacity-75' : ''}`}>
                <div className="position-absolute top-0 end-0 p-4 d-flex gap-2">
                  {tool.is_premium && (
                    <span className={`badge ${hasAccess ? 'bg-success' : 'bg-warning'} text-dark rounded-pill py-2 px-3 fw-black small text-uppercase tracking-tighter shadow-sm d-flex align-items-center gap-1`}>
                      {hasAccess ? <Check size={12}/> : <Crown size={12} />} {hasAccess ? '已解锁' : 'PRO'}
                    </span>
                  )}
                  {isNotLoggedIn && <span className="badge bg-dark rounded-pill py-2 px-3 fw-black small text-uppercase tracking-tighter"><Lock size={12} className="me-1" /> LOCK</span>}
                </div>

                <div className="bg-light rounded-4 d-flex align-items-center justify-content-center mb-4 shadow-inner" style={{width: '80px', height: '80px'}}>
                  {React.cloneElement((iconMap[tool.iconName] || <Zap />) as React.ReactElement<any>, { size: 36, className: 'text-dark' })}
                </div>

                <div className="card-body p-0">
                  <h3 className="h4 fw-black mb-2 text-slate-900">{tool.name}</h3>
                  <p className="text-muted fw-medium mb-5 small" style={{minHeight: '40px'}}>{tool.description}</p>
                </div>

                <div className="mt-auto">
                  {isNotLoggedIn ? (
                    <Link to="/auth" className="btn btn-light w-100 py-3 rounded-4 fw-black text-uppercase tracking-widest small shadow-sm">请先登录</Link>
                  ) : isPremiumLocked ? (
                    <button onClick={() => setShowPayModal(true)} className="btn btn-warning w-100 py-3 rounded-4 fw-black text-uppercase tracking-widest small shadow-sm d-flex align-items-center justify-content-center gap-2">
                      <Crown size={18} /> 解锁 VIP 功能
                    </button>
                  ) : (
                    <Link to={`/tools/${tool.id}`} className={`btn ${tool.is_premium ? 'btn-blue' : 'btn-dark'} w-100 py-3 rounded-4 fw-black text-uppercase tracking-widest small d-flex align-items-center justify-content-center gap-2 shadow`}>
                      <Zap size={18} /> {tool.is_premium ? 'VIP 专享：立即启动' : '立即启动'}
                    </Link>
                  )}
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
              <button onClick={() => setShowPayModal(false)} className="btn btn-light rounded-circle p-2"><X size={20}/></button>
            </div>

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

            {paySuccess ? (
              <div className="text-center py-4">
                <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex p-3 mb-3 animate-fade-in"><Check size={40} /></div>
                <h4 className="fw-black text-success">权限已解锁！</h4>
                <p className="text-muted small fw-bold">系统正在为您同步 VIP 身份...</p>
              </div>
            ) : (
              <button onClick={handleStartPay} className="btn btn-blue w-100 py-4 rounded-4 fs-5 fw-black shadow-lg" disabled={isPaying}>
                {isPaying ? <span className="spinner-border spinner-border-sm me-2"></span> : '立即模拟支付'}
              </button>
            )}
            <div className="mt-3 text-center">
              <p className="text-muted" style={{fontSize: '10px'}}>支付成功后将自动刷新权限，无需重复购买。</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolsGrid;
