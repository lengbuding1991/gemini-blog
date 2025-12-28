
import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ChevronLeft, Copy, Trash2, Download, Sparkles, Zap, Layout } from 'lucide-react';
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 min-h-[600px]">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-slate-900"></div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">源文件</label>
              </div>
              <textarea 
                className="flex-grow p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] font-mono text-sm focus:border-slate-900 transition-all outline-none resize-none shadow-inner"
                placeholder="# 书写你的 Markdown 代码..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">预览模式</label>
              </div>
              <div className="flex-grow p-10 bg-white border-2 border-slate-100 rounded-[2.5rem] prose prose-slate prose-sm overflow-auto max-h-[600px] shadow-sm">
                {input || <span className="text-slate-300 font-bold italic">实时渲染预览区域...</span>}
              </div>
            </div>
          </div>
        );
      case 'json-format':
        return (
          <div className="space-y-8">
            <textarea 
              className="w-full h-80 p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] font-mono text-sm focus:border-slate-900 outline-none shadow-inner"
              placeholder='输入 JSON 数据串...'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  try {
                    setInput(JSON.stringify(JSON.parse(input), null, 2));
                  } catch (e) {
                    alert('JSON 格式错误');
                  }
                }}
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all"
              >
                智能美化
              </button>
              <button 
                onClick={() => setInput('')}
                className="bg-slate-100 text-slate-400 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                重置
              </button>
            </div>
          </div>
        );
      case 'gemini-ai':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-col">
               <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">输入指令 (Prompt)</label>
              <textarea 
                className="w-full h-40 p-8 bg-slate-900 text-white border-2 border-slate-800 rounded-[2.5rem] font-medium focus:border-blue-500 transition-all outline-none"
                placeholder="告诉我你想要生成的文案需求..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <button 
              onClick={handleGenerateAI}
              disabled={isGenerating || !input.trim()}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/20"
            >
              {isGenerating ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <><Sparkles size={20} className="text-blue-200" /> 立即生成智能文案</>
              )}
            </button>
            {aiResponse && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">生成结果</label>
                <div className="p-10 bg-white border-2 border-slate-100 rounded-[3rem] text-slate-800 font-medium leading-relaxed whitespace-pre-wrap shadow-xl">
                  {aiResponse}
                </div>
              </div>
            )}
          </div>
        );
      default:
        return <div className="p-20 text-center text-slate-400 font-black uppercase tracking-widest">Tool Under Construction...</div>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* 优化后的返回按钮 */}
      <Link to="/tools" className="group inline-flex items-center gap-4 px-7 py-3 bg-slate-900 text-white rounded-full hover:bg-blue-600 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-200 hover:-translate-y-1 mb-12">
        <ChevronLeft size={18} strokeWidth={3} className="group-hover:-translate-x-1.5 transition-transform duration-300" />
        <span className="text-xs font-black uppercase tracking-[0.2em]">返回个人实验室</span>
      </Link>

      <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-50 overflow-hidden">
        <div className="bg-slate-900 px-12 py-10 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-full bg-blue-600/10 skew-x-12 translate-x-32 -z-0"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-black text-white tracking-tight">{id === 'gemini-ai' ? 'AI 智能引擎' : '个人工具 / ' + id?.toUpperCase()}</h1>
            <p className="text-slate-400 font-bold text-sm mt-2 uppercase tracking-widest">Efficiency & Innovation</p>
          </div>
          <div className="flex gap-4 relative z-10">
            <button onClick={handleCopy} className="w-14 h-14 bg-slate-800 text-white rounded-2xl hover:bg-blue-600 transition-all flex items-center justify-center shadow-lg" title="复制">
              <Copy size={20} />
            </button>
            <button className="w-14 h-14 bg-slate-800 text-white rounded-2xl hover:bg-blue-600 transition-all flex items-center justify-center shadow-lg" title="下载">
              <Download size={20} />
            </button>
            <button onClick={() => { setInput(''); setAiResponse(''); }} className="w-14 h-14 bg-slate-800 text-rose-400 rounded-2xl hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shadow-lg" title="清空">
              <Trash2 size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-12">
          {renderTool()}
        </div>
      </div>
    </div>
  );
};

export default ToolDetail;
