
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Calendar, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
      setArticles(data || []);
      setLoading(false);
    };
    fetchArticles();
  }, []);

  if (loading) return <div className="container py-5 text-center fw-black opacity-50">加载内容中...</div>;

  return (
    <div className="container py-5">
      <h1 className="display-4 fw-black mb-5">技术博客<span className="text-blue-600">.</span></h1>
      <div className="row g-5">
        <div className="col-lg-8">
           <div className="d-flex flex-column gap-5">
             {articles.map(art => (
               <article key={art.id} className="row g-4 align-items-center">
                 <div className="col-md-5">
                   <div className="bg-light rounded-5 overflow-hidden shadow-sm" style={{height:'220px'}}>
                     <img src={art.cover_image || 'https://picsum.photos/800/600'} className="w-100 h-100 object-fit-cover" alt="" />
                   </div>
                 </div>
                 <div className="col-md-7">
                    <div className="d-flex gap-2 mb-2">
                       <span className="badge bg-light text-blue-600 rounded-pill">{art.category}</span>
                       <span className="small text-muted">{new Date(art.created_at).toLocaleDateString()}</span>
                    </div>
                    <h2 className="h4 fw-black mb-3"><Link to={`/articles/${art.id}`} className="text-dark text-decoration-none">{art.title}</Link></h2>
                    <p className="text-muted small line-clamp-2">{art.excerpt}</p>
                    <Link to={`/articles/${art.id}`} className="fw-black text-dark text-decoration-none small d-flex align-items-center gap-2">阅读全文 <ArrowRight size={14}/></Link>
                 </div>
               </article>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleList;
