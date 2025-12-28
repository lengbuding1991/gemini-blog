
import React, { useState, useEffect, useRef } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { User, Crown, Mail, CheckCircle2, Cpu, ShieldCheck, Zap, ArrowRight, Save, Loader2, Image as ImageIcon, UserCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { UserProfile } from '../types';

interface ProfilePageProps {
  user: UserProfile | null;
  onUpdateProfile: () => Promise<void>;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateProfile }) => {
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.display_name || '');
      setAvatarUrl(user.avatar_url || '');
    }
  }, [user]);

  if (!user) return <Navigate to="/auth" />;

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    // 用户只能在以自己 user.id 命名的文件夹下上传
    const filePath = `${user.id}/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(data.publicUrl);
      alert('头像预览已更新！点击“保存更改”以生效。');
    } catch (error: any) {
      if (error.message?.includes('Bucket not found')) {
        alert("上传失败：未找到 'avatars' 存储桶。\n\n请参考 README.md 的存储桶配置部分进行设置。");
      } else if (error.message?.includes('security policy')) {
        alert("上传失败：权限不足。\n\n请参考 README.md 检查 'avatars' 存储桶的 RLS 策略是否正确配置。");
      } else {
        alert('上传失败: ' + error.message);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          avatar_url: avatarUrl
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      await onUpdateProfile();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);

    } catch (error: any) {
      alert('个人资料更新失败：' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const isAdmin = user.role === 'admin';
  const isVIP = user.role === 'vip';
  const hasPremiumAccess = isAdmin || isVIP;

  const getInitials = () => (displayName || user.email?.split('@')[0] || 'U').charAt(0).toUpperCase();

  return (
    <div className="container py-5 animate-fade-in">
      <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleAvatarUpload} />
      <div className="row g-5">
        <div className="col-lg-4">
          <div className="card border-0 shadow-lg rounded-5 overflow-hidden">
            <div className={`${isAdmin ? 'bg-slate-900' : isVIP ? 'bg-warning' : 'bg-blue-600'} py-5 text-center position-relative shadow-inner`}>
              <div 
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className="bg-white rounded-5 d-inline-flex p-2 shadow-2xl mt-4 border border-white border-opacity-25 position-relative cursor-pointer"
                style={{width: '160px', height: '160px'}}
              >
                {avatarUrl ? (
                   <img src={avatarUrl} className="w-100 h-100 rounded-5 object-fit-cover" alt="avatar" />
                ) : (
                   <div className="w-100 h-100 rounded-5 d-flex align-items-center justify-content-center bg-secondary text-white fw-black" style={{fontSize: '80px'}}>
                     {getInitials()}
                   </div>
                )}

                {/* Hover & Loading States */}
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 rounded-5 d-flex align-items-center justify-content-center opacity-0 hover-opacity-100 transition-all">
                  <ImageIcon size={32} className="text-white" />
                </div>
                {isUploading && (
                  <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 rounded-5 d-flex align-items-center justify-content-center">
                    <Loader2 size={32} className="text-white animate-spin" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="card-body p-4 p-lg-5 text-center">
              <h2 className="fw-black display-6 tracking-tighter mb-2 text-slate-900">{displayName || user.email?.split('@')[0]}</h2>
              <p className="text-muted fw-bold d-flex align-items-center justify-content-center gap-2 mb-4">
                <Mail size={16} /> {user.email}
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="d-flex flex-column gap-4">

            {/* 编辑个人资料 */}
            <div className="card border-0 shadow-sm rounded-5 p-4 p-lg-5 bg-white border">
               <h4 className="fw-black mb-4 tracking-tight d-flex align-items-center gap-2 text-slate-900">
                <UserCircle size={24} className="text-blue-600" /> 编辑个人资料
              </h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="fw-black small text-uppercase mb-2 text-muted tracking-widest">昵称</label>
                  <input type="text" className="form-control py-3 rounded-4 px-4 fw-bold shadow-sm" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="设置一个响亮的昵称"/>
                </div>
                 <div className="col-md-6">
                  <label className="fw-black small text-uppercase mb-2 text-muted tracking-widest">头像 URL</label>
                  <input type="text" className="form-control py-3 rounded-4 px-4 fw-bold shadow-sm" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="粘贴图片链接或点击左侧上传"/>
                </div>
              </div>
              <div className="mt-4 d-flex align-items-center gap-3">
                <button onClick={handleSaveProfile} className="btn btn-dark rounded-pill px-5 py-3 fw-black small text-uppercase tracking-widest d-flex align-items-center gap-2" disabled={isSaving}>
                  {isSaving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16} />}
                  {isSaving ? '正在保存...' : '保存更改'}
                </button>
                {saveSuccess && <div className="text-success fw-black small d-flex align-items-center gap-1 animate-fade-in"><CheckCircle2 size={14} /> 更新成功!</div>}
              </div>
            </div>

            {/* VIP 状态卡片 */}
            <div className={`card border-0 shadow-sm rounded-5 p-4 p-lg-5 ${isAdmin ? 'bg-slate-900' : isVIP ? 'bg-warning bg-opacity-10 border-warning border-opacity-25' : 'bg-dark'} text-white position-relative overflow-hidden`}>
              <div className="position-relative z-1">
                <h3 className={`fw-black display-6 tracking-tighter mb-4 ${isVIP ? 'text-dark' : 'text-white'}`}>
                  {isAdmin ? '管理员全权接入' : isVIP ? '尊贵的 VIP 会员' : '解锁极客空间 VIP 特权'}
                </h3>
                <p className={`fw-medium mb-5 ${isVIP ? 'text-muted' : 'text-secondary'}`}>
                  {isAdmin 
                    ? '您拥有系统最高权限，所有高级工具已为您自动开启。'
                    : isVIP 
                      ? '感谢您的支持！您已解锁全部高级 AI 工具，探索之旅不再受限。'
                      : '解锁由冷丶布丁开发的全部高级工具，一次开通，终身享用。'}
                </p>
                {hasPremiumAccess ? (
                  <div className="d-flex flex-wrap gap-3">
                    <div className={`d-flex align-items-center gap-2 fw-black h5 mb-0 ${isVIP ? 'text-dark' : 'text-info'}`}>
                      <CheckCircle2 /> 权限：实验室全功能解锁
                    </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;