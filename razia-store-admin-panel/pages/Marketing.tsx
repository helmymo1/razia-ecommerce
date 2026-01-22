
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  BarChart3, TrendingUp, Globe, Target, Sparkles, 
  Users, MousePointer2, Clock, ArrowRightLeft, 
  Activity, ArrowDown
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area
} from 'recharts';

const cityData = [
  { name: 'New York (نيويورك)', value: 45 },
  { name: 'London (لندن)', value: 25 },
  { name: 'Paris (باريس)', value: 20 },
  { name: 'Dubai (دبي)', value: 10 },
];

const conversionFunnel = [
  { name: 'Visitors (زوار)', count: 5000, fill: '#4f46e5' },
  { name: 'Product Views (مشاهدات)', count: 3200, fill: '#6366f1' },
  { name: 'Add to Cart (سلة)', count: 1200, fill: '#818cf8' },
  { name: 'Checkout (دفع)', count: 450, fill: '#a5b4fc' },
  { name: 'Success (نجاح)', count: 180, fill: '#c7d2fe' },
];

const liveTracking = [
  { id: 1, user: 'User #982', action: 'Viewing Summer Dress', location: 'Riyadh (الرياض)', time: '2 mins ago' },
  { id: 2, user: 'User #102', action: 'Added Denim to Cart', location: 'London (لندن)', time: '5 mins ago' },
  { id: 3, user: 'User #554', action: 'Completed Checkout', location: 'New York (نيويورك)', time: '12 mins ago' },
  { id: 4, user: 'User #321', action: 'Searching for "Silk"', location: 'Paris (باريس)', time: '15 mins ago' },
];

const COLORS = ['#4f46e5', '#818cf8', '#c7d2fe', '#e0e7ff'];

const MarketingPage: React.FC = () => {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);

  const getAiInsight = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Act as a senior marketing analyst for 'Razia Store'.
      Bilingual Context: Brand serves English and Arabic speakers.
      Tracking Data:
      - 45% New York, 10% Dubai.
      - Conversion Funnel: 5000 visitors -> 180 sales (3.6% Conv).
      - Retention: High in Dubai, low in New York.
      - Avg Session: 4 mins 20 secs.
      
      Generate a strategy in both English and Arabic. Focus on how to improve conversion from Cart to Checkout. 
      Format: Use bullet points for 3 actionable insights.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      setInsight(response.text || '');
    } catch (error) {
      setInsight("Unable to generate strategy. Strategy Tip: Focus on localized Arabic campaigns for the Gulf region to boost high-value conversions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            Marketing & User Tracking
            <span className="text-sm font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded ml-2 font-arabic" dir="rtl">التسويق وتتبع المستخدمين</span>
          </h1>
          <p className="text-gray-500">Real-time analysis of user behavior and campaign ROI.</p>
        </div>
        <button 
          onClick={getAiInsight}
          disabled={loading}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50"
        >
          <Sparkles size={18} />
          <span>{loading ? 'Analyzing Data...' : 'Generate Marketing AI Strategy'}</span>
        </button>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users size={20}/></div>
            <span className="text-xs font-bold text-green-500">+12%</span>
          </div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Users (نشطون)</p>
          <h4 className="text-2xl font-black text-gray-900 mt-1">1,284</h4>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><MousePointer2 size={20}/></div>
            <span className="text-xs font-bold text-green-500">+5%</span>
          </div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Click Rate (النقر)</p>
          <h4 className="text-2xl font-black text-gray-900 mt-1">4.2%</h4>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Clock size={20}/></div>
            <span className="text-xs font-bold text-amber-500">-2%</span>
          </div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Avg Session (الجلسة)</p>
          <h4 className="text-2xl font-black text-gray-900 mt-1">4m 20s</h4>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ArrowRightLeft size={20}/></div>
            <span className="text-xs font-bold text-green-500">+1.5%</span>
          </div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Conv. Rate (التحويل)</p>
          <h4 className="text-2xl font-black text-gray-900 mt-1">3.6%</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center">
              <BarChart3 size={20} className="mr-2 text-indigo-600" />
              Conversion Funnel (مسار التحويل)
            </h3>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionFunnel} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} 
                />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={40}>
                  {conversionFunnel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Tracking Feed */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center">
              <Activity size={20} className="mr-2 text-rose-500 animate-pulse" />
              Live User Activity (تتبع حي)
            </h3>
            <span className="flex items-center text-[10px] font-black uppercase text-rose-500 px-2 py-1 bg-rose-50 rounded-full">
              Live updates
            </span>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
            {liveTracking.map((track) => (
              <div key={track.id} className="p-4 bg-gray-50 rounded-xl flex items-center justify-between group hover:bg-indigo-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-400 font-bold border border-gray-100 group-hover:border-indigo-200">
                    {track.user.split('#')[1]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{track.user}</p>
                    <p className="text-xs text-gray-500">{track.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-indigo-600">{track.location}</p>
                  <p className="text-[10px] text-gray-400">{track.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 flex items-center">
            <Globe size={20} className="mr-2 text-indigo-600" />
            Geography (الجغرافيا)
          </h3>
          <div className="h-[250px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {cityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
              {cityData.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                    <span className="text-gray-600 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
        </div>

        {/* AI Insight Box */}
        <div className="lg:col-span-2 space-y-6">
          {insight ? (
            <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-indigo-100 animate-in slide-in-from-bottom-4 duration-500 h-full">
              <h3 className="text-lg font-black mb-6 flex items-center text-indigo-700">
                <Sparkles size={20} className="mr-2" />
                AI Bilingual Marketing Strategy
              </h3>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed font-medium">
                {insight}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center h-full">
              <Target size={48} className="text-gray-300 mb-4" />
              <h4 className="text-lg font-bold text-gray-400">Ready for Analysis</h4>
              <p className="text-sm text-gray-400 mt-2 max-w-sm">
                Click "Get AI Strategy" to analyze user tracking data and generate a bilingual growth strategy.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketingPage;
