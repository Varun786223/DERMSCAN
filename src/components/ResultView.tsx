import React from 'react';
import { useTranslation } from 'react-i18next';
import { DiagnosisResult } from '../types';
import { motion } from 'motion/react';
import { AlertTriangle, MapPin, Share2, Info, CheckCircle2, Clock, Home } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ResultViewProps {
  result: DiagnosisResult;
  onReset: () => void;
}

export default function ResultView({ result, onReset }: ResultViewProps) {
  const { t, i18n } = useTranslation();

  const getUrgencyConfig = (urgency: string) => {
    switch (urgency) {
      case 'NOW':
        return {
          icon: AlertTriangle,
          color: 'bg-red-500',
          textColor: 'text-red-700',
          bgColor: 'bg-red-50',
          label: t('triageNow')
        };
      case 'WEEK':
        return {
          icon: Clock,
          color: 'bg-amber-500',
          textColor: 'text-amber-700',
          bgColor: 'bg-amber-50',
          label: t('triageWeek')
        };
      default:
        return {
          icon: Home,
          color: 'bg-emerald-500',
          textColor: 'text-emerald-700',
          bgColor: 'bg-emerald-50',
          label: t('triageHome')
        };
    }
  };

  const urgency = getUrgencyConfig(result.urgency);

  const handleShare = () => {
    const text = `*DermScan AI Assessment*\n\n` +
      `*Condition:* ${result.conditions[0].name} (${result.conditions[0].hindiName})\n` +
      `*Urgency:* ${urgency.label}\n\n` +
      `*Advice:* ${result.advice}\n\n` +
      `_Disclaimer: This is an AI assessment, not a diagnosis._`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleFindDoctor = () => {
    window.open(`https://www.google.com/maps/search/dermatologist+near+me`, '_blank');
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-12">
      {/* Urgency Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-3xl ${urgency.bgColor} border-2 border-white shadow-sm flex items-center gap-4`}
      >
        <div className={`p-3 rounded-2xl ${urgency.color} text-white`}>
          <urgency.icon className="w-8 h-8" />
        </div>
        <div>
          <h3 className={`text-sm font-bold uppercase tracking-wider ${urgency.textColor}`}>
            Urgency Level
          </h3>
          <p className={`text-xl font-bold ${urgency.textColor}`}>
            {urgency.label}
          </p>
        </div>
      </motion.div>

      {/* Main Results */}
      <div className="grid gap-6 md:grid-cols-1">
        {result.conditions.map((condition, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden"
          >
            {idx === 0 && (
              <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 rounded-bl-2xl text-xs font-bold">
                Most Likely
              </div>
            )}
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {i18n.language === 'hi' ? condition.hindiName : condition.name}
                </h2>
                <p className="text-slate-400 text-sm font-medium">
                  {i18n.language === 'hi' ? condition.name : condition.hindiName}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                condition.confidence === 'High' ? 'bg-emerald-100 text-emerald-700' :
                condition.confidence === 'Possible' ? 'bg-indigo-100 text-indigo-700' :
                'bg-slate-100 text-slate-600'
              }`}>
                {condition.confidence} Confidence
              </span>
            </div>

            <p className="text-slate-600 leading-relaxed mb-4">
              {condition.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Advice Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-indigo-900 text-white p-8 rounded-3xl shadow-xl"
      >
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-6 h-6 text-indigo-300" />
          <h3 className="text-xl font-bold">General Advice</h3>
        </div>
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown>{result.advice}</ReactMarkdown>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleFindDoctor}
          className="py-4 bg-white text-slate-800 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg border border-slate-100 active:scale-95 transition-transform"
        >
          <MapPin className="w-5 h-5 text-indigo-600" />
          {t('findDoctor')}
        </button>
        <button
          onClick={handleShare}
          className="py-4 bg-[#25D366] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
        >
          <Share2 className="w-5 h-5" />
          {t('shareWhatsApp')}
        </button>
      </div>

      <button
        onClick={onReset}
        className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
      >
        {t('startScan')}
      </button>

      {/* Disclaimer */}
      <div className="p-6 bg-slate-100 rounded-2xl text-xs text-slate-500 leading-relaxed">
        <p>{t('disclaimer')}</p>
      </div>
    </div>
  );
}
