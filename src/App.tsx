import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n';
import { AppStep, SymptomData, DiagnosisResult, ScanRecord } from './types';
import CameraCapture from './components/CameraCapture';
import SymptomQuiz from './components/SymptomQuiz';
import ResultView from './components/ResultView';
import ScanHistory from './components/ScanHistory';
import { analyzeSkinCondition } from './services/geminiService';
import { saveScan } from './services/storageService';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Languages, Stethoscope, Camera, ClipboardList, Activity, History, ChevronRight } from 'lucide-react';

export default function App() {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState<AppStep>('home');
  const [image, setImage] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<SymptomData | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleLanguage = () => {
    const langs = ['hi', 'en', 'ta', 'gu', 'mr'];
    const currentIdx = langs.indexOf(i18n.language);
    const nextLang = langs[(currentIdx + 1) % langs.length];
    i18n.changeLanguage(nextLang);
  };

  const handleCapture = (base64: string) => {
    setImage(base64);
    setStep('quiz');
  };

  const handleQuizComplete = async (data: SymptomData) => {
    setSymptoms(data);
    if (image) {
      setLoading(true);
      try {
        const res = await analyzeSkinCondition(image, data, i18n.language as any);
        setResult(res);
        await saveScan(image, data, res);
        setStep('result');
      } catch (error) {
        console.error("Analysis error:", error);
        alert("Something went wrong during analysis. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleHistorySelect = (scan: ScanRecord) => {
    setImage(scan.image);
    setSymptoms(scan.symptoms);
    setResult(scan.result);
    setStep('result');
  };

  const resetApp = () => {
    setStep('home');
    setImage(null);
    setSymptoms(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200/50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={resetApp}>
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Stethoscope className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display font-black text-xl text-slate-900 tracking-tight">DermScan AI</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Analysis</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setStep('history')}
              className="p-2.5 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
            >
              <History className="w-5 h-5" />
            </button>
            <button 
              onClick={toggleLanguage}
              className="px-4 py-2.5 rounded-2xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all text-xs font-black uppercase tracking-wider"
            >
              {i18n.language}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-4xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {step === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-16 text-center"
            >
              <div className="space-y-6">
                <h2 className="text-5xl md:text-7xl font-display font-black text-slate-900 leading-[1.1] tracking-tight">
                  {t('tagline')}
                </h2>
                <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                  Advanced AI diagnostic support optimized for Indian skin tones and rural connectivity.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                {[
                  { icon: Camera, title: t('step1Title'), desc: t('step1Desc'), color: 'bg-blue-50 text-blue-600' },
                  { icon: ClipboardList, title: t('step2Title'), desc: t('step2Desc'), color: 'bg-purple-50 text-purple-600' },
                  { icon: Activity, title: t('step3Title'), desc: t('step3Desc'), color: 'bg-emerald-50 text-emerald-600' }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
                    <div className={`w-14 h-14 ${item.color} rounded-[1.25rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-black text-slate-900 mb-3 text-lg">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center gap-6">
                <button
                  onClick={() => setStep('capture')}
                  className="group relative px-14 py-6 bg-slate-900 text-white rounded-full font-black text-xl shadow-2xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-4">
                    {t('startScan')}
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                
                <button 
                  onClick={() => setStep('history')}
                  className="text-slate-400 font-bold hover:text-slate-900 transition-colors flex items-center gap-2"
                >
                  <History className="w-4 h-4" />
                  {t('viewHistory')}
                </button>
              </div>

              <div className="flex items-center justify-center gap-8 pt-12 border-t border-slate-200/50">
                <div className="flex items-center gap-2.5 text-slate-400 text-xs font-black uppercase tracking-widest">
                  <Shield className="w-4 h-4" />
                  Stateless
                </div>
                <div className="flex items-center gap-2.5 text-slate-400 text-xs font-black uppercase tracking-widest">
                  <Activity className="w-4 h-4" />
                  2G Ready
                </div>
              </div>
            </motion.div>
          )}

          {step === 'capture' && (
            <motion.div 
              key="capture"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="mb-12 text-center space-y-2">
                <h2 className="text-3xl font-black text-slate-900">{t('step1Title')}</h2>
                <p className="text-slate-400 font-medium">{t('step1Desc')}</p>
              </div>
              <CameraCapture onCapture={handleCapture} />
              <button 
                onClick={() => setStep('home')}
                className="mt-12 text-slate-400 font-black hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          )}

          {step === 'quiz' && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-8">
                  <div className="relative">
                    <div className="w-32 h-32 border-8 border-slate-100 rounded-full" />
                    <div className="absolute inset-0 w-32 h-32 border-8 border-indigo-600 rounded-full border-t-transparent animate-spin" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-3xl font-black text-slate-900">{t('analyzing')}</h3>
                    <p className="text-slate-400 font-medium">{t('processing')}</p>
                  </div>
                </div>
              ) : (
                <SymptomQuiz onComplete={handleQuizComplete} />
              )}
            </motion.div>
          )}

          {step === 'result' && result && (
            <motion.div 
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <ResultView result={result} onReset={resetApp} />
            </motion.div>
          )}

          {step === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ScanHistory onBack={() => setStep('home')} onSelect={handleHistorySelect} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-12 text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] px-6">
        <p>© 2026 Team SXROL | NextGen 2026 Hackathon | PS-18</p>
      </footer>
    </div>
  );
}
