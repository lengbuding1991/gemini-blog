
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Zap, 
  ChevronRight, 
  Code, 
  FileJson, 
  Cpu, 
  Terminal,
  Activity
} from 'lucide-react';

const HomePage: React.FC = () => {
  const featuredArticles = [
    { id: '1', title: '现代前端架构演进之路', excerpt: '从 MVC 到微前端，探讨前端架构在过去十年的变化与未来趋势。深度解析组件化开发的核心逻辑。', category: '技术架构', date: '2024-03-20', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800' },
    { id: '2', title: '深度学习在生产环境的落地', excerpt: '分享在生产环境中部署 AI 模型时遇到的性能瓶颈与解决方案。如何利用云原生技术加速推理过程。', category: '人工智能', date: '2024-03-18', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800' },
  ];

  const toolsPreview = [
    { id: 'markdown', name: 'Markdown 编辑器', desc: '实时渲染预览', icon: <Code className="text-blue-600" /> },
    { id: 'json-format', name: 'JSON 格式化', desc: '智能缩进排版', icon: <FileJson className="text-primary" /> },
    { id: 'gemini-ai', name: 'AI 文案生成', desc: 'Gemini 引擎驱动', icon: <Sparkles className="text-warning" /> },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="position-relative py-5 py-lg-5 overflow-hidden">
        <div className="container py-lg-5">
          <div className="row align-items-center gy-5">
            <div className="col-lg-7 text-center text-lg-start">
              <div className="d-inline-flex align-items-center gap-3 bg-white border px-4 py-2 rounded-pill small fw-black text-uppercase tracking-widest mb-4 shadow-sm">
                <span className="badge bg-blue-600 rounded-pill px-2">v2.5</span>
                <span className="text-muted" style={{fontSize: '10px'}}>SYSTEM ONLINE / 极客空间</span>
              </div>
              
              <h1 className="display-1 fw-black tracking-tighter lh-1 mb-4 text-gradient">
                CODE <br />
                CREATES <br />
                FUTURE<span className="text-light">.</span>
              </h1>

              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-4 mb-5">
                <div className="d-flex align-items-center gap-2">
                  <Activity size={20} className="text-blue-600" />
                  <span className="small fw-black text-muted text-uppercase tracking-widest">42+ 深度思考</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Zap size={20} className="text-warning" />
                  <span className="small fw-black text-muted text-uppercase tracking-widest">12+ 智能工具</span>
                </div>
              </div>

              <p className="lead text-muted mb-5 fw-medium mx-auto mx-lg-0" style={{ maxWidth: '540px', lineHeight: '1.8' }}>
                在这里，代码不仅是冷冰冰的指令。我们探索前端架构的艺术，挖掘人工智能的潜力，记录每一个创造价值的瞬间。
              </p>

              <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-4">
                <Link to="/articles" className="btn btn-blue d-flex align-items-center justify-content-center gap-3">
                  阅读博文 <ArrowRight size={22} />
                </Link>
                <Link to="/tools" className="btn btn-outline-dark px-5 py-3 fs-6 rounded-pill fw-black border-2 text-uppercase tracking-widest">
                  进入实验室
                </Link>
              </div>
            </div>

            <div className="col-lg-5 d-none d-lg-block text-end">
              <div className="position-relative d-inline-block">
                <div className="bg-slate-900 rounded-5 p-5 shadow-2xl border border-secondary border-opacity-25" style={{ width: '420px', textAlign: 'left' }}>
                   <div className="d-flex gap-2 mb-4">
                     <div className="rounded-circle bg-danger" style={{width:'10px', height:'10px'}}></div>
                     <div className="rounded-circle bg-warning" style={{width:'10px', height:'10px'}}></div>
                     <div className="rounded-circle bg-success" style={{width:'10px', height:'10px'}}></div>
                   </div>
                   <div className="font-monospace small text-info opacity-75">
                     <p className="mb-1 text-white opacity-50 fw-bold">$ personal-space init --mode creative</p>
                     <p className="mb-1 text-white fw-black">&gt; Compiling Ideas...</p>
                     <p className="mb-1 text-success fw-black">&gt; Architecture: Solid [100%]</p>
                     <p className="mb-1 text-warning fw-black">&gt; AI Agent: Ready</p>
                     <p className="mb-0 text-white opacity-50 mt-3">_</p>
                   </div>
                </div>
                
                <div className="position-absolute bg-white rounded-5 p-4 shadow-lg border border-light" style={{top: '-40px', right: '-30px', width: '260px', textAlign: 'left'}}>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="bg-blue-600 rounded-circle" style={{width:'10px', height:'10px'}}></div>
                    <span className="fw-black text-muted text-uppercase tracking-widest" style={{fontSize: '10px'}}>System Status</span>
                  </div>
                  <div className="fw-black h3 mb-0 text-dark">OPTIMIZED</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-5 py-lg-8 bg-white">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h2 className="fw-black h1 tracking-tighter mb-2">精选内容</h2>
              <p className="text-muted fw-black text-uppercase tracking-widest small mb-0 opacity-50">TECH INSIGHTS · DISCOVERIES</p>
            </div>
            <Link to="/articles" className="text-blue-600 fw-black text-decoration-none d-flex align-items-center gap-2 hover-gap text-uppercase tracking-widest" style={{fontSize: '12px'}}>
              查看全部 <ChevronRight size={18} />
            </Link>
          </div>
          
          <div className="row g-5">
            {featuredArticles.map(article => (
              <div key={article.id} className="col-md-6">
                <div className="card h-100 card-custom border-0 overflow-hidden shadow-sm">
                  <div className="position-relative overflow-hidden" style={{height: '300px'}}>
                    <img src={article.image} className="w-100 h-100 object-fit-cover transition-transform" alt={article.title} />
                    <div className="position-absolute bottom-0 start-0 w-100 p-4 bg-gradient-to-t from-dark to-transparent">
                      <span className="bg-white text-dark px-3 py-1 rounded-pill fw-black text-uppercase" style={{fontSize: '9px', letterSpacing: '0.15em'}}>
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="card-body p-4 p-lg-5">
                    <h3 className="card-title fw-black mb-3 h2 tracking-tight leading-tight">{article.title}</h3>
                    <p className="card-text text-muted fw-medium mb-5 line-clamp-2">{article.excerpt}</p>
                    <div className="d-flex justify-content-between align-items-center mt-auto border-top border-light pt-4">
                      <span className="text-muted fw-black text-uppercase tracking-widest" style={{fontSize: '10px'}}>{article.date}</span>
                      <Link to={`/articles/${article.id}`} className="btn btn-dark rounded-circle p-0 d-flex align-items-center justify-content-center shadow-lg" style={{width:'52px', height:'52px'}}>
                        <ArrowRight size={22} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lab Preview */}
      <section className="py-5 py-lg-10">
        <div className="container">
          <div className="bg-slate-900 rounded-5 p-5 p-lg-10 text-white shadow-2xl position-relative overflow-hidden">
            <div className="position-absolute top-0 end-0 p-5 opacity-10">
              <Cpu size={280} />
            </div>
            <div className="row align-items-center gy-5 position-relative z-1">
              <div className="col-lg-6">
                <h2 className="display-4 fw-black tracking-tighter mb-4 text-blue-400">
                  极客实验室
                </h2>
                <p className="lead text-secondary fw-medium mb-5" style={{ maxWidth: '400px', lineHeight: '1.8' }}>
                  从 AI 创意写作到开发者调试工具，这里是我打磨效率的私人领地。
                </p>
                <Link to="/tools" className="btn btn-blue btn-lg px-5 shadow-lg">
                  开启实验之旅 <Zap size={20} className="ms-1" />
                </Link>
              </div>
              <div className="col-lg-6">
                <div className="row g-3">
                  {toolsPreview.map(tool => (
                    <div key={tool.id} className="col-12">
                      <div className="bg-white bg-opacity-5 border border-white border-opacity-10 p-4 rounded-5 d-flex align-items-center gap-4 hover-bg-opacity-10 transition-all">
                        <div className="bg-white rounded-4 p-3 d-flex align-items-center justify-content-center shadow-lg" style={{width:'68px', height:'68px'}}>
                          {React.cloneElement(tool.icon as React.ReactElement<any>, { size: 32 })}
                        </div>
                        <div>
                          <h4 className="fw-black mb-1 h5 tracking-tight">{tool.name}</h4>
                          <span className="text-secondary small fw-black text-uppercase tracking-widest opacity-75">{tool.desc}</span>
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

      {/* CTA Section */}
      <section className="py-5 py-lg-10 text-center">
        <div className="container">
          <h2 className="display-3 fw-black tracking-tighter mb-4">开启你的技术旅程</h2>
          <p className="lead text-muted fw-medium mb-5">与冷丶布丁一起探索数字世界的无限可能。</p>
          <Link to="/auth" className="btn btn-blue btn-lg px-5 py-3 shadow-2xl">
            免费注册加入空间
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
