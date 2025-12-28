
import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { User, Crown, Mail, CheckCircle2, Cpu, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

interface ProfilePageProps {
  user: { email: string; role: string; is_premium_user?: boolean; displayName?: string; avatarUrl?: string } | null;
  onUpdateProfile: (data: any) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  if (!user) return <Navigate to="/auth" />;

  const isAdmin = user.role === 'admin';
  const isVIP = user.is_premium_user && !isAdmin;
  const hasPremiumAccess = isAdmin || isVIP;

  return (
    <div className="container py-5 animate-fade-in">
      <div className="row g-5">
        <div className="col-lg-4">
          <div className="card border-0 shadow-lg rounded-5 overflow-hidden">
            {/* 卡片顶部背景根据角色变化 */}
            <div className={`${isAdmin ? 'bg-slate-900' : isVIP ? 'bg-warning' : 'bg-blue-600'} py-5 text-center position-relative shadow-inner`}>
              {isAdmin && (
                <span className="position-absolute top-0 end-0 m-4 badge bg-white text-slate-900 rounded-pill py-2 px-3 fw-black small text-uppercase tracking-widest shadow">
                  <ShieldCheck size={14} className="me-1" /> SYSTEM ROOT
                </span>
              )}
              {isVIP && (
                <span className="position-absolute top-0 end-0 m-4 badge bg-slate-900 text-warning rounded-pill py-2 px-3 fw-black small text-uppercase tracking-widest shadow">
                  <Crown size={14} className="me-1" /> LIFETIME VIP
                </span>
              )}
              <div className="bg-white rounded-5 d-inline-flex p-2 shadow-2xl mt-4 border border-white border-opacity-25" style={{width: '160px', height: '160px'}}>
                <img src={user.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden'} className="w-100 h-100 rounded-5 object-fit-cover" alt="avatar" />
              </div>
            </div>
            
            <div className="card-body p-4 p-lg-5 text-center">
              <h2 className="fw-black display-6 tracking-tighter mb-2 text-slate-900">{user.displayName || user.email.split('@')[0]}</h2>
              <p className="text-muted fw-bold d-flex align-items-center justify-content-center gap-2 mb-4">
                <Mail size={16} /> {user.email}
              </p>
              <div className="d-flex justify-content-center gap-3 border-top border-light pt-4">
                <span className={`badge rounded-pill px-4 py-2 fw-black text-uppercase tracking-widest shadow-sm ${isAdmin ? 'bg-dark' : 'bg-light text-muted'}`}>
                  {isAdmin ? '管理员' : '正式用户'}
                </span>
                {hasPremiumAccess && <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill px-4 py-2 fw-black text-uppercase tracking-widest border border-warning border-opacity-25">PREMIUM</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="d-flex flex-column gap-4">
            <div className={`card border-0 shadow-sm rounded-5 p-4 p-lg-5 ${isAdmin ? 'bg-slate-900' : isVIP ? 'bg-warning bg-opacity-10 border-warning border-opacity-25' : 'bg-dark'} text-white position-relative overflow-hidden`}>
              <div className="position-relative z-1">
                <h3 className={`fw-black display-6 tracking-tighter mb-4 ${isVIP ? 'text-dark' : 'text-white'}`}>
                  {isAdmin ? '管理员全权接入' : isVIP ? '尊贵的 VIP 会员' : '解锁极客空间 VIP 特权'}
                </h3>
                <p className={`fw-medium mb-5 ${isVIP ? 'text-muted' : 'text-secondary'}`}>
                  {isAdmin 
                    ? '您目前拥有系统的最高权限。您可以管理所有文章内容、配置实验室工具并查看系统统计数据。所有高级工具已为您自动开启。'
                    : isVIP 
                      ? '感谢您对冷丶布丁个人实验室的支持。您已解锁全部高级 AI 工具。您的探索之旅已不再受限。'
                      : '解锁由冷丶布丁开发的全部高级工具，包括最新的 AI 智能引擎。一次开通，终身享用。'}
                </p>
                {hasPremiumAccess ? (
                  <div className="d-flex flex-wrap gap-3">
                    <div className={`d-flex align-items-center gap-2 fw-black h5 mb-0 ${isVIP ? 'text-dark' : 'text-info'}`}>
                      <CheckCircle2 /> 权限：实验室全功能解锁
                    </div>
                    <Link to="/tools" className={`btn ${isVIP ? 'btn-dark' : 'btn-blue'} rounded-pill px-4 fw-black small text-uppercase tracking-widest d-flex align-items-center gap-2`}>
                      前往实验室 <Zap size={16}/>
                    </Link>
                  </div>
                ) : (
                  <Link to="/tools" className="btn btn-blue btn-lg px-5 py-3 rounded-pill shadow-lg fw-black d-inline-flex align-items-center gap-2">
                    立即开通 VIP ¥19.9 <ArrowRight size={20} />
                  </Link>
                )}
              </div>
              {isAdmin ? (
                <ShieldCheck size={120} className="position-absolute end-0 bottom-0 opacity-10 m-n4" />
              ) : (
                <Crown size={120} className={`position-absolute end-0 bottom-0 opacity-10 m-n4 ${isVIP ? 'text-warning' : 'text-white'}`} />
              )}
            </div>

            <div className="row g-4 text-center">
              <div className="col-md-4">
                <div className="card border-0 bg-white shadow-sm rounded-5 p-5 border-light border-2">
                  <div className="text-muted fw-black text-uppercase tracking-widest small mb-2">读过文章</div>
                  <div className="display-4 fw-black tracking-tighter text-slate-900">12</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 bg-white shadow-sm rounded-5 p-5 border-blue-600 border-2 border-opacity-10">
                  <div className="text-blue-600 fw-black text-uppercase tracking-widest small mb-2">发表评论</div>
                  <div className="display-4 fw-black tracking-tighter text-slate-900">05</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 bg-white shadow-sm rounded-5 p-5 border-light border-2">
                  <div className="text-muted fw-black text-uppercase tracking-widest small mb-2">收藏工具</div>
                  <div className="display-4 fw-black tracking-tighter text-slate-900">08</div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-5 p-4 p-lg-5 bg-white border">
              <h4 className="fw-black mb-5 tracking-tight d-flex align-items-center gap-2 text-slate-900">
                <Cpu size={24} className="text-blue-600" /> 我的足迹 / Trace
              </h4>
              <div className="d-flex flex-column gap-4">
                <div className="d-flex align-items-center gap-4 bg-light p-4 rounded-4 transition-all hover-bg-white border-2 border-transparent hover-border-blue-600 shadow-hover cursor-pointer">
                   <div className="bg-white rounded-3 p-3 fw-black shadow-sm text-blue-600">冷</div>
                   <div>
                     <p className="fw-bold mb-1 text-slate-900">你在文章 <span className="text-blue-600">《现代前端架构》</span> 下发表了评论。</p>
                     <span className="small text-muted fw-black text-uppercase tracking-widest" style={{fontSize: '9px'}}>2 HOURS AGO</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
