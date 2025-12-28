
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Zap, 
  ChevronRight, 
  Code, 
  FileJson, 
  Cpu, 
  Activity,
  Calendar,
  Tag,
  ShieldCheck,
  Crown
} from 'lucide-react';

interface HomePageProps {
  user: any | null;
}

const HomePage: React.FC<HomePageProps> = ({ user }) => {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('site_articles');
    if (saved) {
      const list = JSON.parse(saved);
      setArticles(list.slice(0, 2));
    } else {
      const defaults = [
        { 
          id: '1', 
          title: '现代前端架构演进之路', 
          excerpt: '探讨前端架构在过去十年的变化与未来趋势。', 
          content: '## 架构的演进\n\n从最初的 jQuery 时代到现在的 React/Vue 大行其道...',
          category: '技术架构', 
          date: '2024-03-20', 
          cover_image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800' 
        },
        { 
          id: '2', 
          title: '深度学习在生产环境的落地挑战', 
          excerpt: '分享部署 AI 模型时遇到的性能瓶颈。', 
          content: '## AI 的挑战\n\n将模型部署到生产环境不仅仅是模型训练的问题...',
          category: '人工智能', 
          date: '2024-03-18', 
          cover_image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800' 
        }
      ];
      setArticles(defaults);
      localStorage.setItem('site_articles', JSON.stringify(defaults));
    }
  }, []);

  const toolsPreview = [
    { id: 'markdown', name: 'Markdown 编辑器', desc: '实时渲染预览', icon: <Code className="text-blue-600" /> },
    { id: 'json-format', name: 'JSON 格式化', desc: '智能缩进排版', icon: <FileJson className="text-primary" /> },
    { id: 'gemini-ai', name: 'AI 文案生成', desc: 'Gemini 引擎驱动', icon: <Sparkles className="text-warning" /> },
  ];

  return (
    <div className="animate-fade-in">
      <section className="position-relative py-5 overflow-hidden">
        <div className="container py-lg-5">
          <div className="row align-items-center gy-5">
            <div className="col-lg-7 text-center text-lg-start">
              <div className="d-inline-flex align-items-center gap-3 bg-white border px-4 py-2 rounded-pill shadow-sm mb-4">
                {user?.role === 'admin' ? (
                  <><ShieldCheck size={14} className="text-blue-600" /> <span className="text-slate-900 fw-black text-uppercase tracking-widest" style={{fontSize: '10px'}}>ADMIN ACCESS GRANTED</span></>
                ) : user?.is_premium_user ? (
                  <><Crown size={14} className="text-warning" /> <span className="text-slate-900 fw-black text-uppercase tracking-widest" style={{fontSize: '10px'}}>WELCOME BACK VIP</span></>
                ) : (
                  <><span className="badge bg-blue-600 rounded-pill px-2">v2.5</span> <span className="text-muted fw-black text-uppercase tracking-widest" style={{fontSize: '10px'}}>SYSTEM ONLINE / 极客空间</span></>
                )}
              </div>
              
              <h1 className="display-1 fw-black tracking-tighter lh-1 mb-4 text-gradient">
                CODE <br />
                CREATES <br />
                FUTURE.
              </h1>

              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-4 mb-5">
                <div className="d-flex align-items-center gap-2">
                  <Activity size={20} className="text-blue-600" />
                  <span className="small fw-black text-slate-900 text-uppercase tracking-widest">42+ 深度思考</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Zap size={20} className="text-warning" />
                  <span className="small fw-black text-slate-900 text-uppercase tracking-widest">12+ 智能工具</span>
                </div>
              </div>

              <p className="lead text-muted mb-5 fw-medium mx-auto mx-lg-0" style={{ maxWidth: '540px', lineHeight: '1.8' }}>
                {user?.role === 'admin' 
                  ? '您好，主理人。系统核心已全面就绪，所有模块运行正常，随时可以开始新的内容沉淀。'
                  : '在这里，代码不仅是冷冰冰的指令。我们探索前端架构的艺术，挖掘人工智能的潜力，记录每一个创造价值的瞬间。'}
              </p>

              <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-4">
                <Link to="/articles" className="btn btn-blue d-flex align-items-center justify-content-center gap-3 shadow-lg">
                  开始阅读 <ArrowRight size={22} />
                </Link>
                <Link to="/tools" className="btn btn-outline-dark px-5 py-3 fs-6 rounded-pill fw-black border-2 text-uppercase tracking-widest shadow-sm">
                  工具实验室
                </Link>
              </div>
            </div>

            <div className="col-lg-5 d-none d-lg-block text-end">
              <div className="position-relative d-inline-block">
                <div className="bg-slate-900 rounded-5 p-5 shadow-2xl border border-white border-opacity-10" style={{ width: '420px', textAlign: 'left' }}>
                   <div className="d-flex gap-2 mb-4">
                     <div className="rounded-circle bg-danger" style={{width:'10px', height:'10px'}}></div>
                     <div className="rounded-circle bg-warning" style={{width:'10px', height:'10px'}}></div>
                     <div className="rounded-circle bg-success" style={{width:'10px', height:'10px'}}></div>
                   </div>
                   <div className="font-monospace small text-info">
                     <p className="mb-1 text-white opacity-50 fw-bold">$ session auth --user={user?.role || 'guest'}</p>
                     <p className="mb-1 text-white fw-black">&gt; Identity Confirmed.</p>
                     <p className="mb-1 text-success fw-black">&gt; Access Level: {user?.role === 'admin' ? 'ROOT' : user?.is_premium_user ? 'VIP' : 'USER'}</p>
                     <p className="mb-1 text-warning fw-black">&gt; AI Engine: Active</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 博客精选部分 */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container py-lg-5">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h2 className="fw-black display-5 tracking-tighter text-slate-900 mb-2">深度思考<span className="text-blue-600">.</span></h2>
              <p className="text-muted fw-bold text-uppercase tracking-widest small mb-0">LATEST DEEP THOUGHTS</p>
            </div>
            <Link to="/articles" className="btn btn-link text-decoration-none fw-black text-dark text-uppercase tracking-widest small d-flex align-items-center gap-2 transition-all hover-gap">
              查看全部 <ChevronRight size={16} />
            </Link>
          </div>

          <div className="row g-5">
            {articles.length > 0 ? articles.map(article => (
              <div key={article.id} className="col-lg-6">
                <div className="card border-0 bg-light rounded-5 p-3 h-100 transition-all shadow-sm hover-shadow">
                  <div className="rounded-5 overflow-hidden mb-4" style={{ height: '320px' }}>
                    <img src={article.cover_image} className="w-100 h-100 object-fit-cover transition-transform" alt={article.title} />
                  </div>
                  <div className="px-3 pb-3">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <span className="badge bg-white text-primary rounded-pill fw-black px-3 py-2 shadow-sm small">
                        <Tag size={12} className="me-1" /> {article.category}
                      </span>
                      <span className="small text-muted fw-bold"><Calendar size={12} className="me-1" /> {article.date}</span>
                    </div>
                    <h3 className="h4 fw-black mb-3 text-slate-900 tracking-tight">
                      <Link to={`/articles/${article.id}`} className="text-decoration-none text-slate-900 hover-blue">{article.title}</Link>
                    </h3>
                    <p className="text-muted fw-medium small line-clamp-2 mb-4">{article.excerpt}</p>
                    <Link to={`/articles/${article.id}`} className="btn btn-outline-dark rounded-pill px-4 py-2 fw-black small text-uppercase tracking-widest border-2">
                      阅读全文
                    </Link>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-12 text-center py-5">
                <p className="text-muted fw-black text-uppercase tracking-widest opacity-50">正在同步博文内容...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 实验室预览部分 */}
      <section className="py-5 py-lg-10">
        <div className="container">
          <div className="bg-slate-900 rounded-5 p-5 p-lg-10 text-white shadow-2xl position-relative overflow-hidden">
            <div className="position-absolute top-0 end-0 p-5 opacity-10">
              <Cpu size={280} color="white" />
            </div>
            <div className="row align-items-center gy-5 position-relative z-1">
              <div className="col-lg-6">
                <h2 className="display-4 fw-black tracking-tighter mb-4 text-blue-400">
                  极客实验室
                </h2>
                <p className="lead text-white text-opacity-75 fw-medium mb-5" style={{ maxWidth: '400px', lineHeight: '1.8' }}>
                  从 AI 创意写作到开发者调试工具，这里是我打磨效率的私人领地。
                </p>
                <Link to="/tools" className="btn btn-blue btn-lg px-5 shadow-lg border-0 transition-all">
                  进入实验之旅 <Zap size={20} className="ms-1" />
                </Link>
              </div>
              <div className="col-lg-6">
                <div className="row g-3">
                  {toolsPreview.map(tool => (
                    <div key={tool.id} className="col-12">
                      <div className="bg-white bg-opacity-10 border border-white border-opacity-10 p-4 rounded-5 d-flex align-items-center gap-4 transition-all hover-bg-opacity-20 cursor-pointer">
                        <div className="bg-white rounded-4 p-3 d-flex align-items-center justify-content-center shadow-lg" style={{width:'68px', height:'68px'}}>
                          {React.cloneElement(tool.icon as React.ReactElement<any>, { size: 32 })}
                        </div>
                        <div>
                          <h4 className="fw-black mb-1 h5 tracking-tight text-white">{tool.name}</h4>
                          <span className="text-white text-opacity-50 small fw-black text-uppercase tracking-widest opacity-75">{tool.desc}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
