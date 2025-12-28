
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MessageCircle, Send, Share2, Calendar, Tag } from 'lucide-react';
import { marked } from 'marked';

interface ArticleDetailProps {
  user: { email: string; role: string } | null;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const [commentText, setCommentText] = useState('');
  const [article, setArticle] = useState<any>(null);
  const [comments, setComments] = useState([
    { id: '1', user: '技术达人', content: '文章写得很透彻，学到了！', date: '2024-03-21' },
    { id: '2', user: '极客范', content: '期待下一篇关于微前端的介绍。', date: '2024-03-22' }
  ]);

  useEffect(() => {
    const savedArticles = localStorage.getItem('site_articles');
    if (savedArticles) {
      const list = JSON.parse(savedArticles);
      const found = list.find((a: any) => a.id === id);
      if (found) setArticle(found);
    }
  }, [id]);

  const handlePostComment = () => {
    if (!user) return alert('请先登录后发表评论');
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now().toString(),
      user: user.email.split('@')[0],
      content: commentText,
      date: new Date().toISOString().split('T')[0]
    };
    setComments([...comments, newComment]);
    setCommentText('');
  };

  const htmlContent = useMemo(() => article ? marked.parse(article.content) : '', [article]);

  if (!article) return <div className="container py-10 text-center fw-black text-muted text-uppercase tracking-widest">加载中...</div>;

  return (
    <div className="container py-5 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <Link to="/articles" className="btn btn-white border-light bg-white rounded-pill shadow-sm px-4 py-2 d-flex align-items-center gap-2 fw-black small text-uppercase tracking-widest">
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
            <span className="small text-muted fw-bold"><Calendar size={14} className="me-2" />{article.date}</span>
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
        </div>
      </div>

      <section className="bg-dark text-white rounded-5 p-4 p-lg-10 shadow-2xl">
        <h3 className="fw-black mb-5 d-flex align-items-center gap-3">
          <MessageCircle className="text-primary" /> 交流互动 <span className="opacity-50 small">({comments.length})</span>
        </h3>

        <div className="list-group list-group-flush mb-5">
          {comments.map(comment => (
            <div key={comment.id} className="list-group-item bg-transparent border-secondary border-opacity-25 py-4 px-0 text-white">
              <div className="d-flex gap-4">
                <div className="bg-secondary bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center fw-black text-info" style={{width:'48px', height:'48px', flexShrink: 0}}>
                  {comment.user[0].toUpperCase()}
                </div>
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2 gap-3">
                    <h6 className="fw-black mb-0">{comment.user}</h6>
                    <span className="small text-muted fw-bold">{comment.date}</span>
                  </div>
                  <p className="text-secondary fw-medium mb-0 small">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
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
              <Link to="/auth" className="btn btn-light rounded-pill px-5 fw-black small text-uppercase tracking-widest">前往登录</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ArticleDetail;
