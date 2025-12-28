
import React from 'react';
import { Mail, Github, Twitter } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="container py-5 animate-fade-in">
      <header className="text-center mb-5 py-5">
        <h1 className="display-3 fw-black tracking-tighter mb-3 text-slate-900">
          与我联系<span className="text-blue-600">.</span>
        </h1>
        <p className="text-muted fw-bold text-uppercase tracking-widest small">
          GET IN TOUCH / LET'S CREATE TOGETHER
        </p>
      </header>
      
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-5 p-4 p-lg-5 bg-white text-center">
            <p className="lead fw-medium text-muted mb-5">
              我总是乐于探索新的想法、合作项目或只是聊聊技术。如果你有任何问题、建议，或者想和我一起创造一些酷的东西，请随时通过以下方式与我联系。
            </p>
            <div className="d-flex justify-content-center flex-wrap gap-4">
              <a href="#" className="btn btn-outline-dark rounded-pill px-4 py-3 fw-black d-flex align-items-center gap-2">
                <Mail size={18} /> Email
              </a>
              <a href="#" className="btn btn-outline-dark rounded-pill px-4 py-3 fw-black d-flex align-items-center gap-2">
                <Github size={18} /> GitHub
              </a>
              <a href="#" className="btn btn-outline-dark rounded-pill px-4 py-3 fw-black d-flex align-items-center gap-2">
                <Twitter size={18} /> Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
