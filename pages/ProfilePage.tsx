
import React from 'react';
import { Navigate } from 'react-router-dom';
import { User, Crown, Mail, CheckCircle2, Cpu } from 'lucide-react';

interface ProfilePageProps {
  user: { email: string; role: string; is_premium_user?: boolean; displayName?: string; avatarUrl?: string } | null;
  onUpdateProfile: (data: any) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  if (!user) return <Navigate to="/auth" />;

  return (
    <div className="container py-5 animate-fade-in">
      <div className="row g-5">
        <div className="col-lg-4">
          <div className="card border-0 shadow-lg rounded-5 overflow-hidden">
            <div className="bg-dark py-5 text-center position-relative">
              {user.is_premium_user && (
                <span className="position-absolute top-0 end-0 m-4 badge bg-warning text-dark rounded-pill py-2 px-3 fw-black small text-uppercase tracking-widest shadow">
                  <Crown size={14} className="me-1" /> VIP MEMBER
                </span>
              )}
              <div className="bg-white rounded-5 d-inline-flex p-2 shadow-2xl mt-4 border border-light" style={{width: '160px', height: '160px'}}>
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} className="w-100 h-100 rounded-5 object-fit-cover" alt="avatar" />
                ) : (
                  <div className="w-100 h-100 bg-light rounded-5 d-flex align-items-center justify-content-center"><User size={64} className="text-muted" /></div>
                )}
              </div>
            </div>
            <div className="card-body p-4 p-lg-5 text-center">
              <h2 className="fw-black display-6 tracking-tighter mb-2">{user.displayName || user.email.split('@')[0]}</h2>
              <p className="text-muted fw-bold d-flex align-items-center justify-content-center gap-2 mb-4">
                <Mail size={16} /> {user.email}
              </p>
              <div className="d-flex justify-content-center gap-3 border-top border-light pt-4">
                <span className={`badge rounded-pill px-4 py-2 fw-black text-uppercase tracking-widest shadow-sm ${user.role === 'admin' ? 'bg-dark' : 'bg-light text-muted'}`}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="d-flex flex-column gap-4">
            <div className="card border-0 shadow-sm rounded-5 p-4 p-lg-5 bg-dark text-white position-relative overflow-hidden">
              <div className="position-relative z-1">
                <h3 className="fw-black display-6 tracking-tighter mb-4">个人空间 VIP 特权</h3>
                <p className="text-secondary fw-medium mb-5">解锁由冷丶布丁开发的全部高级工具，包括最新的 AI 智能引擎。一次开通，终身享用。</p>
                {user.is_premium_user ? (
                  <div className="d-flex align-items-center gap-2 text-info fw-black h5">
                    <CheckCircle2 /> 已解锁所有高级特权
                  </div>
                ) : (
                  <button className="btn btn-blue btn-lg px-5 py-3 rounded-pill">立即升级 ¥19.9</button>
                )}
              </div>
              <Crown size={120} className="position-absolute end-0 bottom-0 opacity-10 m-n4" />
            </div>

            <div className="row g-4 text-center">
              <div className="col-md-4">
                <div className="card border-0 bg-white shadow-sm rounded-5 p-5">
                  <div className="text-muted fw-black text-uppercase tracking-widest small mb-2">读过文章</div>
                  <div className="display-4 fw-black tracking-tighter">12</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 bg-white shadow-sm rounded-5 p-5 border-primary border-2 border-opacity-10">
                  <div className="text-primary fw-black text-uppercase tracking-widest small mb-2">发表评论</div>
                  <div className="display-4 fw-black tracking-tighter">05</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 bg-white shadow-sm rounded-5 p-5">
                  <div className="text-muted fw-black text-uppercase tracking-widest small mb-2">收藏工具</div>
                  <div className="display-4 fw-black tracking-tighter">08</div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-5 p-4 p-lg-5 bg-white">
              <h4 className="fw-black mb-5 tracking-tight d-flex align-items-center gap-2">
                <Cpu size={24} className="text-primary" /> 我的足迹
              </h4>
              <div className="d-flex flex-column gap-4">
                <div className="d-flex align-items-center gap-4 bg-light p-4 rounded-4 group cursor-pointer hover-bg-white shadow-hover">
                   <div className="bg-white rounded-3 p-3 fw-black shadow-sm">冷</div>
                   <div>
                     <p className="fw-bold mb-1">你在文章 <span className="text-blue-600">《现代前端架构》</span> 下发表了评论。</p>
                     <span className="small text-muted fw-black text-uppercase tracking-widest">2 HOURS AGO</span>
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
