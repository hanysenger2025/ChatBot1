
import React, { useState } from 'react';
import { TextChat } from './components/TextChat';
import { LiveChat } from './components/LiveChat';
import { APP_NAME } from './constants';

function App() {
  const [activeTab, setActiveTab] = useState<'text' | 'voice'>('text');
  const apiKey = process.env.API_KEY || '';

  if (!apiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] text-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-red-100 max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2 font-['Tajawal']">مفتاح API مفقود</h2>
          <p className="text-gray-600">يرجى التأكد من إعداد متغير البيئة <code className="bg-red-50 px-1 rounded text-red-700">API_KEY</code> بشكل صحيح.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-['Tajawal'] text-[#1e293b] selection:bg-blue-100" dir="rtl">
      {/* Dynamic Background Pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(#004b8d 1px, transparent 1px)', size: '20px 20px' }}></div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-blue-50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#004b8d] to-blue-400 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white p-1 rounded-xl shadow-sm border border-blue-100">
                {/* SVG representation of the provided logo */}
                <svg width="42" height="42" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#004b8d]">
                  <path d="M30 40V80M40 25V85M50 35V75M60 30V90M70 45V85" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
                  <circle cx="30" cy="40" r="4" fill="currentColor"/>
                  <circle cx="40" cy="25" r="4" fill="currentColor"/>
                  <circle cx="50" cy="55" r="4" fill="currentColor"/>
                  <circle cx="60" cy="30" r="4" fill="currentColor"/>
                  <circle cx="70" cy="85" r="4" fill="currentColor"/>
                  <path d="M20 90C20 90 30 110 50 110C70 110 80 90 80 90" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#004b8d] to-blue-600">
                {APP_NAME}
              </h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">Applied Technology Hub</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 bg-gray-100/50 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setActiveTab('text')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                activeTab === 'text' ? 'bg-white text-[#004b8d] shadow-md' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              المساعد النصي
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'voice' ? 'bg-white text-[#004b8d] shadow-md' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <span>اتصال مباشر</span>
              {activeTab === 'voice' && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-10 relative z-10">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-white p-8 mb-10 transition-all hover:shadow-2xl hover:shadow-blue-900/10 group">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#004b8d] text-xs font-bold mb-4 border border-blue-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#004b8d]"></span>
                </span>
                نظام ذكي متكامل
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">بوابة التكنولوجيا التطبيقية الذكية</h2>
              <p className="text-gray-600 leading-relaxed text-lg max-w-2xl">
                استكشف مستقبلك التعليمي مع رفيقك الذكي. نحن هنا لتزويدك بكافة المعلومات حول المدارس، التخصصات، ومواعيد التقديم بدقة فائقة.
              </p>
            </div>
            <div className="hidden lg:block">
               <div className="w-40 h-40 bg-gradient-to-br from-blue-50 to-white rounded-3xl flex items-center justify-center border border-blue-100 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#004b8d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M12 8v4"/>
                    <path d="M12 16h.01"/>
                  </svg>
               </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher for Mobile */}
        <div className="md:hidden flex bg-white/50 backdrop-blur p-1.5 rounded-2xl mb-8 border border-white shadow-sm">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'text' ? 'bg-[#004b8d] text-white shadow-lg' : 'text-gray-500'
            }`}
          >
            نصي
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'voice' ? 'bg-[#004b8d] text-white shadow-lg' : 'text-gray-500'
            }`}
          >
            صوتي
          </button>
        </div>

        {/* Content Area */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {activeTab === 'text' ? (
            <TextChat apiKey={apiKey} />
          ) : (
            <LiveChat apiKey={apiKey} />
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between border-t border-gray-200/50 mt-10">
        <div className="flex items-center gap-2 mb-4 md:mb-0 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
          <div className="w-6 h-6 bg-[#004b8d] rounded flex items-center justify-center text-white text-[10px] font-bold">M</div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{APP_NAME}</span>
        </div>
        <p className="text-gray-400 text-[13px] font-medium">
          جميع الحقوق محفوظة © {new Date().getFullYear()} • مدعوم بتقنيات Gemini 2.5
        </p>
      </footer>
    </div>
  );
}

export default App;
