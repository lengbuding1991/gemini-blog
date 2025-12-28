
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MessageCircle, Send, Share2, Calendar, Tag, Trash2 } from 'lucide-react';
import { marked } from 'marked';
import { supabase } from '../lib/supabaseClient';

interface ArticleDetailProps {
  user: { id: string; email: string; role: string; display_name?: string } | null;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const [commentText, setCommentText] = useState('');
  const [article, setArticle] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticleAndComments = async () => {
    if (!id) return;
    
    // 1. 获取文章详情
    const { data: artData } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (artData) setArticle(artData);

    // 2. 获取评论
    const { data: commData } = await supabase
      .from('comments')
      .select('*')
      .eq('article_id', id)
      .order('created_at', { ascending: false });
    
    if (commData) setComments(commData);
    setLoading(false);
  };

  useEffect(() => {
    fetchArticleAndComments();
  }, [id]);

  const handlePostComment = async () => {
    if (!user) return alert('请先登录后发表评论');
    if (!commentText.trim()) return;

    const { error } = await supabase
      .from('comments')
      .insert([{
        article_id: id,
        user_name: user.display_name || user.email.split('@')[0],
        content: commentText
      }]);

    if (error) {
      alert('评论发表失败，请稍后再试');
    } else {
      setCommentText('');
      fetchArticleAndComments(); // 重新加载评论
    }
  };

  const htmlContent = useMemo(() => {
    if (!article || !article.content) return '';
    try {
      return marked.parse(article.content);
    } catch (e) {
      console.error('Markdown 渲染错误:', e);
      return article.content;
    }
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

      <section className="bg-dark text-white rounded-5 p-4 p-lg-10 shadow-2xl mb-5">
        <h3 className="fw-black mb-5 d-flex align-items-center gap-3">
          <MessageCircle className="text-primary" /> 交流互动 <span className="opacity-50 small">({comments.length})</span>
        </h3>

        <div className="list-group list-group-flush mb-5">
          {comments.length > 0 ? comments.map(comment => (
            <div key={comment.id} className="list-group-item bg-transparent border-secondary border-opacity-25 py-4 px-0 text-white">
              <div className="d-flex gap-4">
                <div className="bg-secondary bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center fw-black text-info" style={{width:'48px', height:'48px', flexShrink: 0}}>
                  {comment.user_name[0].toUpperCase()}
                </div>
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2 gap-3">
                    <h6 className="fw-black mb-0">{comment.user_name}</h6>
                    <span className="small text-muted fw-bold">{new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-secondary fw-medium mb-0 small">{comment.content}</p>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-4 text-secondary text-center fw-bold opacity-50">暂无评论，来当第一个沙发吧！</div>
          )}
        </div>

        <div className="bg-white bg-opacity-5 p-4 rounded-5 border border-white border-opacity-10">
          <h6 className="fw-black text-uppercase tracking-widest small mb-4">留下你的见解</h6>
          {user ? (
            <div className="position-relative">
              <textarea className="form-control bg-dark border-secondary border-opacity-50 text-white p-4 rounded-4 shadow-none focus-ring-primary" rows={4} value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="写点什么..." />
              <button onClick={handlePostComment} className="btn btn-blue position-absolute bottom-0 end-0 m-3 p-3 rounded-3 shadow"><Send size={18}/></button>
            </div>
          ) : (
            <div className="text-center py-5">
              <p className="text-secondary fw-bold mb-4">请登录后参与讨论</p>
              <Link to="/auth" className="btn btn-light rounded-pill px-5 fw-black small text-uppercase tracking-widest text-decoration-none">前往登录</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ArticleDetail;
