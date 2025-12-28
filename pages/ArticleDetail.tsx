
import React, { useState, useEffect, useMemo, useContext, createContext, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MessageCircle, Send, Share2, Calendar, Tag, Trash2, MessageSquare, Loader2, X } from 'lucide-react';
import { marked } from 'marked';
import { supabase } from '../lib/supabaseClient';
import { UserProfile, Comment as CommentType } from '../types';

const ConfirmModal: React.FC<{
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onConfirm, onCancel, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3" style={{backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)'}}>
      <div className="bg-white rounded-5 shadow-2xl p-4 p-lg-5 animate-fade-in" style={{maxWidth: '450px', width: '90%'}}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-black tracking-tight mb-0 text-slate-900">{title}</h4>
          <button onClick={onCancel} className="btn btn-light rounded-circle p-2 lh-1"><X size={20}/></button>
        </div>
        <p className="text-muted fw-medium mb-4">{children}</p>
        <div className="d-flex gap-3">
          <button onClick={onConfirm} className="btn btn-danger w-100 py-3 rounded-4 fw-black text-uppercase tracking-widest small shadow-sm">确认删除</button>
          <button onClick={onCancel} className="btn btn-light w-100 py-3 rounded-4 fw-black text-uppercase tracking-widest small shadow-sm">取消</button>
        </div>
      </div>
    </div>
  );
};

const CommentActionsContext = createContext<{
  onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onPostReply: (content: string, parentId: string) => void;
  onSetReplyingTo: (id: string | null, userName?: string | null) => void;
  deletingCommentId: string | null;
} | null>(null);

interface ArticleDetailProps {
  user: UserProfile | null;
}

interface CommentComponentProps {
  comment: CommentType;
  level?: number;
  user: UserProfile | null;
  replyingTo: string | null;
  replyText: string;
  onSetReplyText: (text: string) => void;
}

const CommentComponent: React.FC<CommentComponentProps> = ({
  comment,
  level = 0,
  user,
  replyingTo,
  replyText,
  onSetReplyText,
}) => {
  const actions = useContext(CommentActionsContext);
  if (!actions) return null;
  const { onDelete, onPostReply, onSetReplyingTo, deletingCommentId } = actions;

  return (
    <div className={`list-group-item bg-transparent text-white px-0 ${level === 0 ? 'border-secondary border-opacity-25 py-4' : 'border-0 pt-4'}`}>
      <div className="d-flex gap-3">
        <div className="bg-secondary bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center fw-black text-info flex-shrink-0" style={{width:'48px', height:'48px'}}>
          {(comment.user_name || '?').charAt(0).toUpperCase()}
        </div>
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-center mb-2 gap-3 flex-wrap">
            <h6 className="fw-black mb-0">{comment.user_name || '匿名用户'}</h6>
            <div className="d-flex align-items-center gap-3">
                <span className="small text-muted fw-bold">{new Date(comment.created_at).toLocaleDateString()}</span>
                {user && (
                    <button onClick={() => onSetReplyingTo(comment.id, comment.user_name)} className="btn btn-sm btn-link text-white text-opacity-50 p-0 d-flex align-items-center gap-1">
                        <MessageSquare size={14} /> 回复
                    </button>
                )}
                {(user?.id === comment.user_id || user?.role === 'admin') && (
                    <button 
                      onClick={onDelete} 
                      data-id={comment.id} 
                      className="btn btn-sm btn-link text-danger p-0" 
                      title="删除评论"
                      disabled={deletingCommentId === comment.id}
                    >
                      {deletingCommentId === comment.id ? <Loader2 size={14} className="animate-spin"/> : <Trash2 size={14} />}
                    </button>
                )}
            </div>
          </div>
          <p className="text-secondary fw-medium mb-0 small" style={{wordBreak: 'break-word'}}>{comment.content}</p>

          {replyingTo === comment.id && (
            <div className="bg-white bg-opacity-5 p-3 rounded-4 border border-white border-opacity-10 mt-3 animate-fade-in">
                <textarea 
                  className="form-control bg-dark border-secondary border-opacity-50 text-white p-3 rounded-3 shadow-none focus-ring-primary small" 
                  rows={2} 
                  value={replyText} 
                  onChange={(e) => onSetReplyText(e.target.value)} 
                  placeholder={`回复 ${comment.user_name || '匿名用户'}...`} 
                  autoFocus
                />
                <div className="d-flex gap-2 mt-2">
                  <button onClick={() => onPostReply(replyText, comment.id)} className="btn btn-primary btn-sm rounded-pill px-3 fw-bold">提交回复</button>
                  <button onClick={() => onSetReplyingTo(null)} className="btn btn-secondary btn-sm rounded-pill px-3">取消</button>
                </div>
            </div>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="ps-4 mt-4 border-start border-white border-opacity-10" style={{marginLeft: '24px'}}>
          {comment.replies.map(reply => 
            <CommentComponent 
              key={reply.id} 
              comment={reply} 
              level={level + 1}
              user={user}
              replyingTo={replyingTo}
              replyText={replyText}
              onSetReplyText={onSetReplyText}
            />
          )}
        </div>
      )}
    </div>
  );
};


const ArticleDetail: React.FC<ArticleDetailProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [article, setArticle] = useState<any>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const fetchArticleAndComments = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const { data: artData } = await supabase.from('articles').select('*').eq('id', id).single();
    if (artData) setArticle(artData);
    const { data: commData } = await supabase.from('comments').select('*').eq('article_id', id).order('created_at', { ascending: true });
    if (commData) setComments(commData);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchArticleAndComments();
  }, [fetchArticleAndComments]);

  const handlePostComment = useCallback(async (content: string, parentId: string | null = null) => {
    if (!user) return alert('请先登录后发表评论');
    if (!content.trim()) return;

    const { error } = await supabase.from('comments').insert([{
        article_id: id,
        user_id: user.id,
        user_name: user.display_name || user.email.split('@')[0],
        content,
        parent_id: parentId
      }]);

    if (error) {
       if (error.message?.includes('security policy')) {
         alert(`评论发表失败：数据库拒绝了本次操作。\n\n这通常是由于 'comments' 表的行级安全策略 (RLS) 未正确配置。请检查 README.md 文件中的 '4. 行级安全策略 (RLS) 配置' 章节，并确保已为 comments 表启用了 RLS 并添加了相应的 INSERT 策略。`);
      } else {
        alert('评论发表失败: ' + error.message);
      }
    } else {
      setCommentText('');
      setReplyText('');
      setReplyingTo(null);
      await fetchArticleAndComments();
    }
  }, [user, id, fetchArticleAndComments]);

  const handleDeleteComment = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const commentId = event.currentTarget.dataset.id;
    if (!commentId) return;
    setCommentToDelete(commentId);
    setShowConfirmModal(true);
  }, []);
  
  const confirmDeletion = useCallback(async () => {
    if (!commentToDelete) return;
    
    setShowConfirmModal(false);
    setDeletingCommentId(commentToDelete);
    try {
      const { data, error } = await supabase.from('comments').delete().eq('id', commentToDelete).select();

      if (error) throw error;
      if (!data || data.length === 0) throw new Error("NO_PERMISSION_OR_NOT_FOUND");
      
      await fetchArticleAndComments();

    } catch (err: any) {
      let errorMessage = '删除评论时发生未知错误。';
      if (err.message === "NO_PERMISSION_OR_NOT_FOUND") {
        errorMessage = '删除失败：操作被数据库拒绝。\n\n这通常是由于权限不足。请确认您是该评论的作者或拥有管理员权限，并检查 README.md 中最新的 RLS 策略是否已正确应用。';
      } else if (err.message) {
        errorMessage = `删除失败：\n${err.message}\n\n请检查网络连接或联系管理员。`;
      }
      alert(errorMessage);
    } finally {
      setDeletingCommentId(null);
      setCommentToDelete(null);
    }
  }, [commentToDelete, fetchArticleAndComments]);

  const cancelDeletion = useCallback(() => {
    setShowConfirmModal(false);
    setCommentToDelete(null);
  }, []);

  const handleSetReplyingTo = useCallback((id: string | null, userName?: string | null) => {
    if (id === null || replyingTo === id) {
      setReplyingTo(null);
    } else {
      setReplyingTo(id);
      setReplyText(`@${userName || '匿名用户'} `);
    }
  }, [replyingTo]);
  
  const commentActions = useMemo(() => ({
    onDelete: handleDeleteComment,
    onPostReply: handlePostComment,
    onSetReplyingTo: handleSetReplyingTo,
    deletingCommentId: deletingCommentId,
  }), [handleDeleteComment, handlePostComment, handleSetReplyingTo, deletingCommentId]);

  const nestedComments = useMemo(() => {
    const commentsCopy: CommentType[] = comments.map(c => ({ ...c, replies: [] }));
    const commentMap: { [key: string]: CommentType } = {};
    commentsCopy.forEach(comment => { commentMap[comment.id] = comment; });

    const topLevelComments: CommentType[] = [];
    commentsCopy.forEach(comment => {
      if (comment.parent_id && commentMap[comment.parent_id]) {
        commentMap[comment.parent_id].replies!.push(comment);
      } else {
        topLevelComments.push(comment);
      }
    });
    return topLevelComments;
  }, [comments]);

  const htmlContent = useMemo(() => {
    if (!article || !article.content) return '';
    try { return marked.parse(article.content); } catch (e) { return article.content; }
  }, [article]);

  if (loading) return <div className="container py-5 text-center fw-black text-muted text-uppercase tracking-widest min-vh-50 d-flex align-items-center justify-content-center">正在从云端读取博文内容...</div>;
  if (!article) return <div className="container py-5 text-center fw-black text-muted mt-5">文章不存在或已被删除。</div>;

  return (
    <div className="container py-5 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <Link to="/articles" className="btn btn-white border-light bg-white rounded-pill shadow-sm px-4 py-2 d-flex align-items-center gap-2 fw-black small text-uppercase tracking-widest text-decoration-none">
          <ChevronLeft size={16} /> 返回列表
        </Link>
        <button className="btn btn-white border-light bg-white rounded-circle shadow-sm p-2"><Share2 size={16} /></button>
      </div>

      <div className="card border-0 shadow-sm rounded-5 overflow-hidden mb-5">
        {article.cover_image && (
          <div className="w-100 overflow-hidden" style={{height: '450px'}}>
            <img src={article.cover_image} className="w-100 h-100 object-fit-cover" alt={article.title} />
          </div>
        )}
        <div className="card-body p-4 p-lg-10">
          <div className="d-flex align-items-center gap-4 mb-4">
            <span className="badge bg-dark rounded-pill px-4 py-2 fw-black text-uppercase tracking-widest"><Tag size={12} className="me-2" />{article.category}</span>
            <span className="small text-muted fw-bold"><Calendar size={14} className="me-2" />{new Date(article.created_at).toLocaleDateString()}</span>
          </div>
          <h1 className="display-4 fw-black tracking-tighter mb-5">{article.title}</h1>
          <div className="d-flex align-items-center gap-3 border-top border-light pt-5 mb-5">
            <div className="bg-light rounded-4 d-flex align-items-center justify-content-center fw-black fs-4" style={{width:'56px', height:'56px'}}>冷</div>
            <div>
              <div className="fw-black h6 mb-0">冷丶布丁</div>
              <div className="text-muted small fw-bold text-uppercase tracking-widest" style={{fontSize: '10px'}}>主理人 / 极客</div>
            </div>
          </div>
          <div className="article-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
          {!htmlContent && <p className="text-muted italic">暂无正文内容。</p>}
        </div>
      </div>
      
      <CommentActionsContext.Provider value={commentActions}>
        <section className="bg-dark text-white rounded-5 p-4 p-lg-10 shadow-2xl mb-5">
          <h3 className="fw-black mb-5 d-flex align-items-center gap-3">
            <MessageCircle className="text-primary" /> 交流互动 <span className="opacity-50 small">({comments.length})</span>
          </h3>

          <div className="list-group list-group-flush mb-5">
            {nestedComments.length > 0 ? nestedComments.map(comment => (
              <CommentComponent 
                key={comment.id}
                comment={comment}
                user={user}
                replyingTo={replyingTo}
                replyText={replyText}
                onSetReplyText={setReplyText}
              />
            )) : (
              <div className="py-4 text-secondary text-center fw-bold opacity-50">暂无评论，来当第一个沙发吧！</div>
            )}
          </div>

          <div className="bg-white bg-opacity-5 p-4 rounded-5 border border-white border-opacity-10">
            <h6 className="fw-black text-uppercase tracking-widest small mb-4">开启新的讨论</h6>
            {user ? (
              <div className="position-relative">
                <textarea className="form-control bg-dark border-secondary border-opacity-50 text-white p-4 rounded-4 shadow-none focus-ring-primary" rows={4} value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="写点什么..." />
                <button onClick={() => handlePostComment(commentText)} className="btn btn-blue position-absolute bottom-0 end-0 m-3 p-3 rounded-3 shadow"><Send size={18}/></button>
              </div>
            ) : (
              <div className="text-center py-5">
                <p className="text-secondary fw-bold mb-4">请登录后参与讨论</p>
                <Link to="/auth" className="btn btn-light rounded-pill px-5 fw-black small text-uppercase tracking-widest text-decoration-none">前往登录</Link>
              </div>
            )}
          </div>
        </section>
      </CommentActionsContext.Provider>

      <ConfirmModal
        isOpen={showConfirmModal}
        onConfirm={confirmDeletion}
        onCancel={cancelDeletion}
        title="确认删除评论"
      >
        确定要删除这条评论吗？其下的所有回复也将被删除。此操作不可撤销。
      </ConfirmModal>
    </div>
  );
};

export default ArticleDetail;
