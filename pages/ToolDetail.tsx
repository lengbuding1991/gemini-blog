
import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ChevronLeft, Copy, Trash2, Download, Sparkles, Zap } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface ToolDetailProps {
  user: { email: string; role: string; is_premium_user?: boolean } | null;
}

const ToolDetail: React.FC<ToolDetailProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const [input, setInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  if (!user) return <Navigate to="/auth" />;

  const handleCopy = () => {
    const textToCopy = id === 'gemini-ai' ? aiResponse : input;
    navigator.clipboard.writeText(textToCopy);
    alert('已成功复制');
  };

  const handleGenerateAI = async () => {
    if (!input.trim()) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: input,
      });
      setAiResponse(response.text || '');
    } catch (error) {
      console.error('AI Error:', error);
      alert('AI 服务暂时不可用，请检查配置。');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderTool = () => {
    switch (id) {
      case 'markdown':
        return (
          <div className="row g-4" style={{ minHeight: '500px' }}>
            <div className="col-lg-6 d-flex flex-column">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="bg-slate-900 rounded-circle" style={{width: '8px', height: '8px'}}></div>
                <label className="text-slate-400 fw-black text-uppercase small tracking-widest">源文件 (Markdown)</label>
              </div>
              <textarea 
                className="form-control flex-grow-1 bg-light border-0 rounded-4 p-4 font-monospace shadow-inner"
                style={{ fontSize: '14px', resize: 'none' }}
                placeholder="# 书写你的内容..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <div className="col-lg-6 d-flex flex-column">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="bg-blue-600 rounded-circle" style={{width: '8px', height: '8px'}}></div>
                <label className="text-slate-400 fw-black text-uppercase small tracking-widest">实时预览</label>
              </div>
              <div className="flex-grow-1 bg-white border rounded-4 p-4 overflow-auto shadow-sm" style={{ maxHeight: '500px' }}>
                {input || <span className="text-muted italic opacity-50">预览区域...</span>}
              </div>
            </div>
          </div>
        );
      case 'json-format':
        return (
          <div className="d-flex flex-column gap-4">
            <textarea 
              className="form-control bg-light border-0 rounded-4 p-4 font-monospace shadow-inner"
              style={{ height: '320px' }}
              placeholder='在此处粘贴 JSON 字符串...'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="d-flex gap-3 mt-2">
              <button 
                onClick={() => {
                  try {
                    setInput(JSON.stringify(JSON.parse(input), null, 2));
                  } catch (e) {
                    alert('JSON 格式错误，请检查输入。');
                  }
                }}
                className="btn btn-dark rounded-pill px-5 py-3 fw-black text-uppercase tracking-widest small shadow"
              >
                智能美化
              </button>
              <button 
                onClick={() => setInput('')}
                className="btn btn-light rounded-pill px-4 py-3 fw-black text-uppercase tracking-widest small text-muted"
              >
                清空重置
              </button>
            </div>
          </div>
        );
      case 'gemini-ai':
        return (
          <div className="animate-fade-in">
            <div className="mb-4">
               <label className="text-slate-400 fw-black text-uppercase small tracking-widest mb-3 d-block">AI 指令 (Prompt)</label>
               <textarea 
                className="form-control bg-slate-900 text-white border-0 rounded-4 p-4 fw-medium shadow-lg"
                style={{ height: '120px' }}
                placeholder="例如：写一段吸引人的产品推广文案..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <button 
              onClick={handleGenerateAI}
              disabled={isGenerating || !input.trim()}
              className="btn btn-blue w-100 py-4 rounded-4 fs-6 d-flex align-items-center justify-content-center gap-3 shadow-lg mb-5"
            >
              {isGenerating ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : (
                <><Sparkles size={20} /> 立即生成智能文案</>
              )}
            </button>
            {aiResponse && (
              <div className="animate-fade-in">
                <label className="text-slate-400 fw-black text-uppercase small tracking-widest mb-3 d-block">生成结果</label>
                <div className="bg-white border-2 rounded-5 p-4 p-lg-5 text-slate-900 fw-medium shadow-sm position-relative" style={{ whiteSpace: 'pre-wrap' }}>
                  {aiResponse}
                </div>
              </div>
            )}
          </div>
        );
      default:
        return <div className="p-5 text-center text-muted fw-black text-uppercase tracking-widest opacity-50">工具正在维护中...</div>;
    }
  };

  return (
    <div className="container py-5">
      <Link to="/tools" className="btn btn-dark rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2 fw-black small text-uppercase tracking-widest text-decoration-none shadow-sm mb-5 transition-all">
        <ChevronLeft size={16} /> 返回实验室
      </Link>

      <div className="bg-white rounded-5 shadow-2xl border overflow-hidden">
        <div className="bg-slate-900 px-4 px-lg-5 py-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
          <div>
            <h1 className="h4 fw-black text-white tracking-tight mb-1">{id === 'gemini-ai' ? 'AI 智能引擎' : '工具 / ' + id?.toUpperCase()}</h1>
            <span className="text-slate-400 fw-bold small text-uppercase tracking-widest" style={{fontSize: '10px'}}>Efficiency & Innovation</span>
          </div>
          <div className="d-flex gap-2">
            <button onClick={handleCopy} className="btn btn-light bg-opacity-10 text-white border-0 p-3 rounded-4 hover-blue"><Copy size={18} /></button>
            <button onClick={() => { setInput(''); setAiResponse(''); }} className="btn btn-light bg-opacity-10 text-danger border-0 p-3 rounded-4 hover-bg-danger"><Trash2 size={18} /></button>
          </div>
        </div>
        
        <div className="p-4 p-lg-5">
          {renderTool()}
        </div>
      </div>
    </div>
  );
};

export default ToolDetail;
