import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { UserRecord } from '../types/record';
import { apiService } from '../services/api';
import { QRCard } from '../components/QRCard';
import { BarcodeCard } from '../components/BarcodeCard';
import { ArrowLeft, Share2, Printer, AlertTriangle, RefreshCw, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export const ViewRecord: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [record, setRecord] = useState<UserRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadRecord = async (recordId: string) => {
    setLoading(true);
    setError(false);
    try {
      const data = await apiService.fetchRecord(recordId);
      setRecord(data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      Promise.resolve().then(() => {
        loadRecord(id);
      });
    } else {
      Promise.resolve().then(() => {
        setError(true);
        setLoading(false);
      });
    }
  }, [id]);

  const handleShare = async () => {
    if (!record) return;
    const shareData = {
      title: `Scan Codes & Info - Record ${record.id}`,
      text: `QR, Barcode and registration info for logistics ID ${record.id}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Shared successfully!');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard for sharing!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative font-sans print:bg-white print:text-slate-900">
      
      {/* Background decorations - Hidden during print */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 print:hidden opacity-20">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Main Container */}
      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 flex flex-col justify-center relative z-10">
        
        {/* Navigation Bar - Hidden during print */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Dashboard</span>
          </button>

          {record && (
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="p-2.5 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
                title="Share Record"
              >
                <Share2 size={16} />
              </button>
              <button
                onClick={handlePrint}
                className="p-2.5 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
                title="Print Record"
              >
                <Printer size={16} />
              </button>
            </div>
          )}
        </div>

        {/* 1. LOADING STATE (SKELETON WRAPPER) */}
        {loading && (
          <div className="w-full max-w-2xl mx-auto bg-white/5 border border-slate-800 p-8 rounded-3xl space-y-6 animate-pulse">
            <div className="h-4 bg-slate-800 rounded-lg w-1/4" />
            <div className="h-8 bg-slate-800 rounded-lg w-3/4" />
            <hr className="border-slate-800" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-[280px] bg-slate-800 rounded-2xl" />
              <div className="h-[280px] bg-slate-800 rounded-2xl" />
            </div>
          </div>
        )}

        {/* 2. ERROR STATE (NOT FOUND) */}
        {!loading && (error || !record) && (
          <div className="w-full max-w-md mx-auto bg-white/5 border border-red-500/20 p-8 rounded-3xl text-center space-y-6 backdrop-blur-xl animate-fadeIn">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={32} />
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-white">Record Not Found</h2>
              <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                The Logistics ID: <code className="text-red-400 font-mono text-xs">{id}</code> was not found or the connection failed.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {id && (
                <button
                  onClick={() => loadRecord(id)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-6 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl cursor-pointer transition-colors"
                >
                  <RefreshCw size={14} />
                  <span>Retry Search</span>
                </button>
              )}
              <button
                onClick={() => navigate('/')}
                className="w-full sm:w-auto py-2.5 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl cursor-pointer transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* 3. SUCCESS / RECORD DISPLAY */}
        {!loading && !error && record && (
          <div className="space-y-8 animate-slideUp">
            {/* Registered Info Data Card */}
            <div className="w-full max-w-2xl mx-auto bg-slate-900 border border-slate-850 p-8 rounded-3xl shadow-xl relative print:border-none print:shadow-none print:p-0">
              {/* Highlight Line */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent rounded-t-3xl print:hidden" />
              
              {/* ID Ribbon */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-850">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Registered Info</span>
                  <h1 className="text-2xl font-extrabold text-white mt-1">{record.name}</h1>
                </div>
                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold font-mono tracking-wider">
                    ID: {record.id}
                  </span>
                </div>
              </div>

              {/* Field Entries */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mobile Entry */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-400 shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Mobile Number</h4>
                    <p className="text-sm font-semibold text-slate-200 mt-0.5">{record.mobile}</p>
                  </div>
                </div>

                {/* Email Entry */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-400 shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Email Address</h4>
                    <p className="text-sm font-semibold text-slate-200 mt-0.5 truncate max-w-[200px]">{record.email}</p>
                  </div>
                </div>

                {/* Address Entry */}
                <div className="flex gap-4 items-start md:col-span-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-400 shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Address</h4>
                    <p className="text-sm font-semibold text-slate-200 mt-0.5 leading-relaxed">{record.address}</p>
                  </div>
                </div>

                {/* Created At Entry */}
                <div className="flex gap-4 items-start md:col-span-2 border-t border-slate-850 pt-4 mt-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-400 shrink-0">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Created Date</h4>
                    <p className="text-sm font-semibold text-slate-200 mt-0.5">{formatDate(record.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Display Codes Side-By-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full print:hidden">
              <div className="h-full">
                <QRCard id={record.id} />
              </div>
              <div className="h-full">
                <BarcodeCard id={record.id} />
              </div>
            </div>
          </div>
        )}

      </main>

      <footer className="w-full text-center py-6 text-xs text-slate-600 relative z-10 print:hidden">
        <p>© 2026 QR Barcode PWA. Secured Logistics Platform.</p>
      </footer>
    </div>
  );
};
