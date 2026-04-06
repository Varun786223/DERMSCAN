import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SymptomData } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Mic, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface SymptomQuizProps {
  onComplete: (data: SymptomData) => void;
}

export default function SymptomQuiz({ onComplete }: SymptomQuizProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [data, setData] = useState<SymptomData>({
    bodyArea: '',
    duration: 'days',
    itchBurn: false,
    spreading: false,
    allergies: '',
    skinTone: 'Type IV'
  });

  const steps = [
    {
      key: 'bodyArea',
      question: t('quizBodyArea'),
      type: 'diagram'
    },
    {
      key: 'skinTone',
      question: t('quizSkinTone'),
      type: 'skinTone'
    },
    {
      key: 'duration',
      question: t('quizDuration'),
      options: ['days', 'weeks', 'months']
    },
    {
      key: 'itchBurn',
      question: t('quizItchBurn'),
      type: 'boolean'
    },
    {
      key: 'spreading',
      question: t('quizSpreading'),
      type: 'boolean'
    },
    {
      key: 'allergies',
      question: t('quizAllergies'),
      type: 'text'
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setData({ ...data, allergies: transcript });
    };
    recognition.start();
  };

  const currentStep = steps[step];

  const bodyAreas = [
    { id: 'Face', pos: 'top-[10%] left-[40%] w-[20%] h-[15%]' },
    { id: 'Torso', pos: 'top-[25%] left-[30%] w-[40%] h-[30%]' },
    { id: 'Arms', pos: 'top-[25%] left-[10%] w-[20%] h-[40%]' },
    { id: 'Arms', pos: 'top-[25%] right-[10%] w-[20%] h-[40%]' },
    { id: 'Legs', pos: 'top-[55%] left-[25%] w-[20%] h-[40%]' },
    { id: 'Legs', pos: 'top-[55%] right-[25%] w-[20%] h-[40%]' },
    { id: 'Hands/Feet', pos: 'bottom-[0%] left-[40%] w-[20%] h-[10%]' },
  ];

  const skinTones = [
    { id: 'Type I', color: '#F3E5D8' },
    { id: 'Type II', color: '#EBCBB2' },
    { id: 'Type III', color: '#DEB08B' },
    { id: 'Type IV', color: '#AC7E54' },
    { id: 'Type V', color: '#905E36' },
    { id: 'Type VI', color: '#4B3121' },
  ];

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
      <div className="flex gap-2 mb-8">
        {steps.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-indigo-600' : 'bg-slate-100'}`} 
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="min-h-[350px]"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-8 leading-tight">
            {currentStep.question}
          </h2>

          <div className="space-y-3">
            {currentStep.type === 'diagram' ? (
              <div className="relative w-full aspect-[3/4] bg-slate-50 rounded-3xl border-2 border-slate-100 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <User className="w-full h-full" />
                </div>
                {bodyAreas.map((area, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setData({ ...data, bodyArea: area.id });
                      handleNext();
                    }}
                    className={cn(
                      "absolute rounded-xl border-2 transition-all flex items-center justify-center text-[10px] font-bold",
                      area.pos,
                      data.bodyArea === area.id 
                        ? "bg-indigo-600/20 border-indigo-600 text-indigo-700" 
                        : "bg-white/40 border-slate-200 text-slate-400 hover:border-indigo-300"
                    )}
                  >
                    {area.id}
                  </button>
                ))}
              </div>
            ) : currentStep.type === 'skinTone' ? (
              <div className="grid grid-cols-3 gap-4">
                {skinTones.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => {
                      setData({ ...data, skinTone: tone.id });
                      handleNext();
                    }}
                    className={cn(
                      "aspect-square rounded-2xl border-4 transition-all flex flex-col items-center justify-center p-2",
                      data.skinTone === tone.id ? "border-indigo-600 scale-105" : "border-transparent"
                    )}
                  >
                    <div className="w-full h-full rounded-xl shadow-inner" style={{ backgroundColor: tone.color }} />
                    <span className="text-[10px] font-bold mt-2 text-slate-500">{tone.id}</span>
                  </button>
                ))}
              </div>
            ) : currentStep.options ? (
              currentStep.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setData({ ...data, [currentStep.key]: opt });
                    handleNext();
                  }}
                  className={`w-full p-4 rounded-2xl text-left font-medium transition-all border-2 ${
                    data[currentStep.key as keyof SymptomData] === opt
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-100 hover:border-indigo-200 text-slate-600'
                  }`}
                >
                  {opt}
                </button>
              ))
            ) : currentStep.type === 'boolean' ? (
              <div className="flex gap-4">
                {[true, false].map((val) => (
                  <button
                    key={val.toString()}
                    onClick={() => {
                      setData({ ...data, [currentStep.key]: val });
                      handleNext();
                    }}
                    className={`flex-1 p-6 rounded-2xl font-bold transition-all border-2 ${
                      data[currentStep.key as keyof SymptomData] === val
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-100 hover:border-indigo-200 text-slate-600'
                    }`}
                  >
                    {val ? t('yes') : t('no')}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    value={data.allergies}
                    onChange={(e) => setData({ ...data, allergies: e.target.value })}
                    placeholder="e.g. Pollen, Dust, Medicines..."
                    className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:ring-0 min-h-[120px] resize-none"
                  />
                  <button
                    onClick={startVoiceInput}
                    className={cn(
                      "absolute bottom-4 right-4 p-3 rounded-full shadow-lg transition-all",
                      isListening ? "bg-red-500 text-white animate-pulse" : "bg-indigo-600 text-white"
                    )}
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-slate-400 text-center">{t('voiceInput')}</p>
                <button
                  onClick={handleNext}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  {t('confirmPhoto')}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={step === 0}
          className="text-slate-400 font-medium flex items-center gap-1 disabled:opacity-0"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <span className="text-slate-400 text-sm font-medium">
          Step {step + 1} of {steps.length}
        </span>
      </div>
    </div>
  );
}
