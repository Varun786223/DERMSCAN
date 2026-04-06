import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllScans, deleteScan } from '../services/storageService';
import { ScanRecord } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Calendar, ChevronRight, ArrowLeft, AlertCircle } from 'lucide-react';

interface ScanHistoryProps {
  onBack: () => void;
  onSelect: (scan: ScanRecord) => void;
}

export default function ScanHistory({ onBack, onSelect }: ScanHistoryProps) {
  const { t, i18n } = useTranslation();
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = async () => {
    const data = await getAllScans();
    setScans(data.reverse()); // Newest first
    setLoading(false);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteScan(id);
    loadScans();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h2 className="text-2xl font-display font-bold text-slate-800">{t('viewHistory')}</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : scans.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">{t('historyEmpty')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {scans.map((scan) => (
              <motion.div
                key={scan.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => onSelect(scan)}
                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer hover:border-indigo-200 transition-all group"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img src={scan.image} className="w-full h-full object-cover" alt="Scan" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 truncate">
                    {i18n.language === 'hi' ? scan.result.conditions[0].hindiName : scan.result.conditions[0].name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(scan.timestamp).toLocaleDateString()}
                    <span className={`ml-2 px-2 py-0.5 rounded-full font-bold ${
                      scan.result.urgency === 'NOW' ? 'bg-red-100 text-red-600' :
                      scan.result.urgency === 'WEEK' ? 'bg-amber-100 text-amber-600' :
                      'bg-emerald-100 text-emerald-600'
                    }`}>
                      {scan.result.urgency}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDelete(e, scan.id)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
