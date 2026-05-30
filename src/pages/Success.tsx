import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCard } from '../components/QRCard';
import { BarcodeCard } from '../components/BarcodeCard';
import { ArrowLeft, Eye, CheckCircle, Copy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

export const Success: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract generated record ID from router state
  const state = location.state as { recordId?: string } | null;
  const recordId = state?.recordId;

  // Protect route - if no recordId exists, redirect to home
  useEffect(() => {
    if (!recordId) {
      toast.error('No record ID found. Please submit a new registration.');
      navigate('/', { replace: true });
      return;
    }

    // Launch celebratory confetti spray
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#6366f1', '#a855f7', '#ec4899']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#6366f1', '#a855f7', '#ec4899']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    frame();
  }, [recordId, navigate]);

  const copyRecordId = async () => {
    if (!recordId) return;
    try {
      await navigator.clipboard.writeText(recordId);
      toast.success('Record ID copied to clipboard!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to copy ID');
    }
  };

  if (!recordId) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative font-sans">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
        {/* Clean subtle grid pattern only */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>


      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center relative z-10">
        
        {/* Success Header Card */}
        <div className="text-center space-y-4 max-w-2xl mb-12 animate-fadeIn">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
            <CheckCircle size={36} className="animate-bounce" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
            Registration Successful!
          </h1>
          
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Your credentials have been securely stored in your Google Sheets database. The codes below have been generated for your unique Record ID.
          </p>

          {/* Record ID Ribbon */}
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 dark:border-slate-800/40 pl-4 pr-2 py-2 rounded-2xl backdrop-blur-md shadow-inner mt-4">
            <span className="text-slate-400 font-medium text-xs tracking-wider uppercase">Record ID:</span>
            <code className="font-mono text-indigo-400 text-base font-bold tracking-widest">{recordId}</code>
            <button
              onClick={copyRecordId}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Copy Record ID"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>

        {/* Dynamic Scan Codes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl animate-slideUp">
          <div className="h-full">
            <QRCard id={recordId} />
          </div>
          <div className="h-full">
            <BarcodeCard id={recordId} />
          </div>
        </div>

        {/* Primary Page Navigation / Action footer */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mt-12 animate-fadeIn">
          <button
            onClick={() => navigate(`/view/${recordId}`)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-8 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          >
            <Eye size={18} />
            <span>View Full Record</span>
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-6 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 font-medium rounded-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Create New Record</span>
          </button>
        </div>

      </main>

      <footer className="w-full text-center py-6 text-xs text-slate-600 relative z-10">
        <div className="flex items-center justify-center gap-1">
          <Sparkles size={12} className="text-indigo-500 animate-pulse" />
          <span>Interactive verification synced with Google Sheets</span>
        </div>
      </footer>
    </div>
  );
};

export default Success;
