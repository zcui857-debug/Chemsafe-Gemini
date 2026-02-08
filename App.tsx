
import React, { useState } from 'react';
import { ChemicalInfo } from './types.ts';
import { fetchChemicalInfo } from './services/geminiService.ts';
import { assessCompatibility } from './logic.ts';

const App: React.FC = () => {
  const [casA, setCasA] = useState('');
  const [casB, setCasB] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [result, setResult] = useState<{
    chemA: ChemicalInfo;
    chemB: ChemicalInfo;
    compatibility: { compatible: boolean; message: string };
  } | null>(null);

  const handleAssess = async () => {
    if (!casA || !casB) {
      setError('请输入完整的两个CAS号');
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const [infoA, infoB] = await Promise.all([
        fetchChemicalInfo(casA),
        fetchChemicalInfo(casB)
      ]);

      const assessment = assessCompatibility(infoA, infoB);
      setResult({
        chemA: infoA,
        chemB: infoB,
        compatibility: assessment
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || '评估过程中发生错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2 flex items-center justify-center gap-2">
          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.675.337a2 2 0 00-.894.894l-.337.675a6 6 0 00-.517 3.86l.477 2.387a2 2 0 00.547 1.022l1.586 1.585a2 2 0 002.828 0l6.414-6.414a2 2 0 000-2.828l-1.586-1.585zM14.5 10a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          化学品相容性评估
        </h1>
        <p className="text-slate-500 text-lg">基于GHS分类标准与H短语自动判断</p>
      </header>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">化学品 A (CAS号)</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="例如: 64-17-5"
              value={casA}
              onChange={(e) => setCasA(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">化学品 B (CAS号)</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="例如: 7664-93-9"
              value={casB}
              onChange={(e) => setCasB(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleAssess}
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
            loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              正在智能分析中...
            </span>
          ) : '开始评估'}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r flex items-center gap-2">
             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
             {error}
          </div>
        )}
      </div>

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ChemicalCard title="化学品 A" data={result.chemA} color="blue" />
            <ChemicalCard title="化学品 B" data={result.chemB} color="indigo" />
          </div>

          <div className={`p-8 rounded-2xl border-2 flex flex-col items-center text-center ${
            result.compatibility.compatible 
              ? 'bg-emerald-50 border-emerald-200' 
              : 'bg-rose-50 border-rose-200'
          }`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              result.compatibility.compatible ? 'bg-emerald-500' : 'bg-rose-500'
            }`}>
              {result.compatibility.compatible ? (
                <span className="text-white text-3xl font-bold">O</span>
              ) : (
                <span className="text-white text-3xl font-bold">X</span>
              )}
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${
              result.compatibility.compatible ? 'text-emerald-800' : 'text-rose-800'
            }`}>
              评估结果：{result.compatibility.compatible ? '相容' : '不相容'}
            </h2>
            <p className="text-slate-600 max-w-lg leading-relaxed">
              {result.compatibility.message}
            </p>
          </div>
        </div>
      )}

      <footer className="mt-16 text-center text-slate-400 text-sm">
        <p>评估结果仅供参考，实际操作请务必参考官方安全数据单(MSDS)。</p>
      </footer>
    </div>
  );
};

interface ChemicalCardProps {
  title: string;
  data: ChemicalInfo;
  color: string;
}

const ChemicalCard: React.FC<ChemicalCardProps> = ({ title, data, color }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-left">
      <h3 className={`text-lg font-bold mb-3 text-${color === 'blue' ? 'blue-600' : 'indigo-600'} border-b pb-2`}>{title}</h3>
      <div className="space-y-3">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase">化学品名称</span>
          <p className="font-semibold text-slate-800">{data.name}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">CAS号</span>
            <p className="text-sm font-mono text-slate-700">{data.cas}</p>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">存储分类</span>
            <p className="text-sm font-bold text-blue-700">{data.category}</p>
          </div>
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase">H短语</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {data.hPhrases.length > 0 ? data.hPhrases.map(h => (
              <span key={h} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-mono border border-slate-200">
                {h}
              </span>
            )) : <span className="text-xs text-slate-400 italic">无</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
