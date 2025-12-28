import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Calendar, ArrowRight, Star, Layers } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Article } from '../types';

const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      let query = supabase.from('articles').select('*').order('created_at', { ascending: false });
      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }
      const { data, error } = await query;
      
      setArticles(data || []);
      setLoading(false);
    };
    fetchArticles();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchSidebarData = async () => {
      // 1. 获取精选（最新）文章
      const { data: featuredData } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      setFeaturedArticle(featuredData);
      
      // 2. 获取所有分类
      const { data: categoriesData, error } = await supabase.rpc('get_distinct_categories');
      if (categoriesData) {
        setCategories(categoriesData.map((c: any) => c.category));
      } else {
        console.error("获取分类失败:", error);
      }
    };
    fetchSidebarData();
  }, []);

  const Sidebar = () => (
    <div className="sticky-lg-top" style={{ top: '120px' }}>
      {featuredArticle && (
        <div className="card border-0 shadow-sm rounded-5 mb-4 bg-light p-3">
          <div className="position-relative">
            <div className="rounded-4 overflow-hidden shadow-sm" style={{ height: '200px' }}>
              <img src={featuredArticle.cover_image || 'https://picsum.photos/800/600'} className="w-100 h-100 object-fit-cover" alt={featuredArticle.title} />
            </div>
            <span className="badge bg-blue-600 text-white rounded-pill py-2 px-3 fw-black small text-uppercase tracking-widest shadow position-absolute top-0 start-0 m-3 d-flex align-items-center gap-1">
              <Star size={12} /> 最新发布
            </span>
          </div>
          <div className="p-3">
            <h5 className="fw-black text-slate-900 mb-2">{featuredArticle.title}</h5>
            <p className="text-muted small line-clamp-2 mb-3">{featuredArticle.excerpt}</p>
            <Link to={`/articles/${featuredArticle.id}`} className="btn btn-dark btn-sm rounded-pill px-4 fw-black text-uppercase tracking-widest small">深入阅读</Link>
          </div>
        </div>
      )}
      <div className="card border-0 shadow-sm rounded-5 p-4">
        <h5 className="fw-black text-slate-900 mb-3 d-flex align-items-center gap-2"><Layers size={20} className="text-blue-600" /> 文章分类</h5>
        <div className="list-group list-group-flush">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`list-group-item list-group-item-action border-0 fw-bold ${!selectedCategory ? 'text-blue-600' : 'text-muted'}`}
          >
            查看全部
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`list-group-item list-group-item-action border-0 fw-bold ${selectedCategory === cat ? 'text-blue-600' : 'text-muted'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-5 animate-fade-in">
      <header className="mb-5 pb-4 border-bottom">
        <h1 className="display-4 fw-black tracking-tighter mb-1 text-slate-900">
          {selectedCategory ? selectedCategory : '深度思考'}<span className="text-blue-600">.</span>
        </h1>
        <p className="text-muted fw-bold text-uppercase tracking-widest small mb-0">INSIGHTS & REFLECTIONS / {selectedCategory ? `筛选结果` : '全部文章'}</p>
      </header>

      <div className="row g-5">
        <div className="col-lg-8">
           {loading ? (
             <div className="text-center py-5 fw-black opacity-50 text-uppercase tracking-widest">正在加载文章...</div>
           ) : articles.length > 0 ? (
             <div className="d-flex flex-column gap-5">
               {articles.map(art => (
                 <article key={art.id} className="row g-4 align-items-center bg-white p-3 rounded-5 shadow-sm border transition-all hover-shadow-lg">
                   <div className="col-md-5">
                     <div className="rounded-4 overflow-hidden shadow-sm" style={{height:'220px'}}>
                       <Link to={`/articles/${art.id}`}>
                         <img src={art.cover_image || 'https://picsum.photos/800/600'} className="w-100 h-100 object-fit-cover transition-transform" alt={art.title} />
                       </Link>
                     </div>
                   </div>
                   <div className="col-md-7">
                      <div className="d-flex align-items-center gap-3 mb-2">
                         <span className="badge bg-light text-blue-600 rounded-pill fw-black px-3 py-2 small d-flex align-items-center gap-1"><Tag size={12}/> {art.category}</span>
                         <span className="small text-muted fw-bold d-flex align-items-center gap-1"><Calendar size={12}/> {new Date(art.created_at).toLocaleDateString()}</span>
                      </div>
                      <h2 className="h4 fw-black mb-3"><Link to={`/articles/${art.id}`} className="text-slate-900 text-decoration-none hover-blue">{art.title}</Link></h2>
                      <p className="text-muted small line-clamp-2 mb-4">{art.excerpt}</p>
                      <Link to={`/articles/${art.id}`} className="fw-black text-dark text-decoration-none small d-flex align-items-center gap-1 hover-translate">
                        阅读全文 <ArrowRight size={14}/>
                      </Link>
                   </div>
                 </article>
               ))}
             </div>
           ) : (
            <div className="text-center bg-light rounded-5 py-5">
              <h4 className="fw-black text-muted">暂无文章</h4>
              <p className="small text-muted fw-bold">该分类下还没有发布任何内容哦。</p>
              <button onClick={() => setSelectedCategory(null)} className="btn btn-dark rounded-pill fw-black small">返回查看全部</button>
            </div>
           )}
        </div>
        <div className="col-lg-4">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default ArticleList;