
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Tag, Calendar } from 'lucide-react';

const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    const savedArticles = localStorage.getItem('site_articles');
    if (savedArticles) {
      setArticles(JSON.parse(savedArticles));
    } else {
      const defaults = [
        { 
          id: '1', 
          title: '现代前端架构演进之路', 
          excerpt: '探讨前端架构在过去十年的变化与未来趋势。', 
          content: '## 架构的演进\n\n从最初的 jQuery 时代到现在的 React/Vue 大行其道，前端架构经历了翻天覆地的变化。\n\n### 核心逻辑\n\n1. 组件化开发\n2. 状态管理\n3. 声明式 UI\n\n未来，我们将看到更多边缘计算与前端的结合。',
          category: '技术架构', 
          date: '2024-03-20', 
          cover_image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800' 
        },
        { 
          id: '2', 
          title: '深度学习在生产环境的落地挑战', 
          excerpt: '分享部署 AI 模型时遇到的性能瓶颈。', 
          content: '## AI 的挑战\n\n将模型部署到生产环境不仅仅是模型训练的问题，更多的是工程化挑战。\n\n- 推理延迟优化\n- 显存占用平衡\n- 自动化流水线\n\n我们需要更高效的推理引擎，例如 Gemini。',
          category: '人工智能', 
          date: '2024-03-18', 
          cover_image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800' 
        },
        { 
          id: '3', 
          title: 'Supabase 实战指南：从入门到进阶', 
          excerpt: '如何利用开源 Firebase 替代品快速构建全栈应用。', 
          content: '## 为什么选择 Supabase？\n\n它是 Postgres 的力量，加上现代化的 API 层。它可以让你在几分钟内启动一个带 Auth 和 DB 的应用。',
          category: '实战教程', 
          date: '2024-03-15', 
          cover_image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800' 
        },
      ];
      setArticles(defaults);
      localStorage.setItem('site_articles', JSON.stringify(defaults));
    }
  }, []);

  return (
    <div className="container py-5">
      <header className="mb-5 py-5 animate-fade-in text-center text-md-start">
        <h1 className="display-4 fw-black tracking-tighter mb-3">技术博客<span className="text-blue-600">.</span></h1>
        <p className="lead text-muted fw-medium max-w-600">探索技术前沿，沉淀实战经验。记录关于前端、AI 以及架构设计的深度思考。</p>
      </header>

      <div className="row g-5">
        <div className="col-lg-8">
          <div className="d-flex flex-column gap-5">
            {articles.map(article => (
              <article key={article.id} className="row g-4 align-items-center group">
                <div className="col-md-5">
                  <div className="rounded-5 overflow-hidden shadow-sm" style={{height: '240px'}}>
                     <img src={article.cover_image || `https://picsum.photos/seed/${article.id}/800/600`} className="w-100 h-100 object-fit-cover transition-transform" alt={article.title} />
                  </div>
                </div>
                <div className="col-md-7">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <span className="badge bg-light text-primary rounded-pill fw-black px-3 py-2 small tracking-widest text-uppercase">
                      <Tag size={12} className="me-1" /> {article.category}
                    </span>
                    <span className="small text-muted fw-bold text-uppercase tracking-widest">
                      <Calendar size={12} className="me-1" /> {article.date}
                    </span>
                  </div>
                  <h2 className="h3 fw-black mb-3 tracking-tight">
                    <Link to={`/articles/${article.id}`} className="text-dark text-decoration-none hover-blue">{article.title}</Link>
                  </h2>
                  <p className="text-muted fw-medium mb-4 small line-clamp-2">{article.excerpt}</p>
                  <Link to={`/articles/${article.id}`} className="fw-black text-dark text-decoration-none small text-uppercase tracking-widest d-inline-flex align-items-center gap-2 hover-gap">
                    阅读全文 <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="col-lg-4">
          <aside className="position-sticky" style={{top: '120px'}}>
            <div className="card border-0 shadow-sm rounded-5 p-4 mb-4">
              <h5 className="fw-black text-uppercase tracking-widest small mb-4">搜寻灵感</h5>
              <div className="input-group">
                <span className="input-group-text bg-light border-0 ps-3"><Search size={16} className="text-muted" /></span>
                <input type="text" className="form-control bg-light border-0 py-3 rounded-end-4 small fw-bold" placeholder="输入关键字..." />
              </div>
            </div>

            <div className="card bg-dark text-white border-0 shadow-lg rounded-5 p-4">
              <h5 className="fw-black text-uppercase tracking-widest small mb-4 text-info">热门分类</h5>
              <div className="list-group list-group-flush bg-transparent">
                {['技术架构', '前端开发', '人工智能', '实战教程'].map((cat, i) => (
                  <button key={i} className="list-group-item list-group-item-action bg-transparent border-secondary border-opacity-25 text-secondary fw-bold px-0 py-3 d-flex justify-content-between align-items-center border-bottom">
                    <span className="small">{cat}</span>
                    <span className="badge bg-dark border border-secondary border-opacity-50 rounded-pill small">0{i+1}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ArticleList;
