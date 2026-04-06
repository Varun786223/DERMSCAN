import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, RefreshCw, Check, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface CameraCaptureProps {
  onCapture: (base64: string) => void;
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Unable to access camera. Please check permissions.");
    }
  };

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        setIsProcessing(true);
        // Client-side compression: Max 800px width/height
        const maxWidth = 800;
        const maxHeight = 800;
        let width = video.videoWidth;
        let height = video.videoHeight;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
        
        // 70% quality for 2G optimization
        const base64 = canvas.toDataURL('image/jpeg', 0.7);
        setCapturedImage(base64);
        setIsProcessing(false);
      }
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  return (
    <div className="relative w-full max-w-md mx-auto aspect-[3/4] bg-black rounded-3xl overflow-hidden shadow-2xl">
      <AnimatePresence mode="wait">
        {!capturedImage ? (
          <motion.div 
            key="camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-full"
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 camera-overlay pointer-events-none flex flex-col items-center justify-center">
              <div className="w-[300px] h-[300px] border-2 border-white/50 rounded-full border-dashed animate-pulse" />
              <p className="mt-8 text-white text-sm font-medium px-6 text-center bg-black/40 py-2 rounded-full backdrop-blur-sm">
                {t('cameraGuide')}
              </p>
            </div>

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6 text-center">
                <div className="text-white">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                  <p>{error}</p>
                  <button 
                    onClick={startCamera}
                    className="mt-4 px-6 py-2 bg-white text-black rounded-full font-bold"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            <div className="absolute bottom-8 left-0 right-0 flex justify-center">
              <button
                onClick={capture}
                disabled={isProcessing}
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="w-10 h-10 text-slate-900 animate-spin" />
                ) : (
                  <div className="w-16 h-16 border-4 border-slate-900 rounded-full" />
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="preview"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full h-full"
          >
            <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
            
            <div className="absolute bottom-8 left-0 right-0 px-6 flex gap-4">
              <button
                onClick={handleRetake}
                className="flex-1 py-4 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                {t('retakeButton')}
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
              >
                <Check className="w-5 h-5" />
                {t('confirmPhoto')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
