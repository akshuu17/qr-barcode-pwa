import React, { useEffect, useState } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import { Download, X, Smartphone, ArrowUpToLine, PlusSquare, Monitor, CheckCircle, Database, Eye, Trash2 } from 'lucide-react';

import type { UserRecord } from './types/record';
import toast from 'react-hot-toast';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

export const App: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [historyRecords, setHistoryRecords] = useState<UserRecord[]>([]);
  
  // Lazy initialize to avoid calling setState synchronously inside useEffect
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches || 
           ('standalone' in window.navigator && (window.navigator as NavigatorStandalone).standalone === true);
  });

  // Fetch history records from LocalStorage
  const loadHistory = () => {
    try {
      const data = localStorage.getItem('qr_barcode_pwa_records');
      if (data) {
        setHistoryRecords(JSON.parse(data));
      } else {
        setHistoryRecords([]);
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  };

  useEffect(() => {
    loadHistory();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      (window as any).deferredPrompt = promptEvent; // Make it globally accessible!
      setShowInstallBanner(true);
    };

    const handleOpenGuide = () => {
      setShowGuideModal(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('openpwaguide', handleOpenGuide);

    // Capture successful installation event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
      (window as any).deferredPrompt = null;
      console.log('App was successfully installed!');
      toast.success('ScanSuite installed successfully!');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('openpwaguide', handleOpenGuide);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    const prompt = deferredPrompt || (window as any).deferredPrompt;
    if (prompt) {
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      setDeferredPrompt(null);
      (window as any).deferredPrompt = null;
      setShowInstallBanner(false);
    } else {
      setShowGuideModal(true);
    }
  };

  const handleOpenHistory = () => {
    loadHistory();
    setShowHistoryDrawer(true);
  };

  const handleDeleteRecord = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const data = localStorage.getItem('qr_barcode_pwa_records');
      if (data) {
        const records: UserRecord[] = JSON.parse(data);
        const filtered = records.filter(r => r.id !== id);
        localStorage.setItem('qr_barcode_pwa_records', JSON.stringify(filtered));
        setHistoryRecords(filtered);
        toast.success('Record removed from history');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove record');
    }
  };

  return (
    <BrowserRouter>
      {/* Toast Notification Provider */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.95)',
            color: '#f8fafc',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            padding: '12px 18px',
            fontSize: '14px',
            fontWeight: 500,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />

      {/* Global Simple & Professional Header */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/70 border-b border-white/5 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-end gap-3">
          {/* All Generated Codes History Button */}
          <button
            onClick={handleOpenHistory}
            className="inline-flex items-center gap-2 py-1.5 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-medium text-xs rounded-xl transition-all cursor-pointer"
          >
            <Database size={13} />
            <span className="hidden sm:inline">My Codes</span>
            {historyRecords.length > 0 && (
              <span className="bg-indigo-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                {historyRecords.length}
              </span>
            )}
          </button>

          {/* Install Button */}
          {isInstalled ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <CheckCircle size={12} />
              <span className="hidden sm:inline">Standalone</span>
            </span>
          ) : (
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-2 py-1.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Download size={13} />
              <span>Install</span>
            </button>
          )}
        </div>
      </header>


      {/* Main Routes */}
      <AppRoutes />

      {/* 1. Floating PWA Bottom Banner (captured via prompt) */}
      {showInstallBanner && !isInstalled && (
        <div className="fixed bottom-6 right-6 left-6 sm:left-auto sm:max-w-sm z-50 bg-slate-900/95 border border-indigo-500/30 p-4 rounded-2xl shadow-2xl backdrop-blur-xl animate-slideUp flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 shrink-0">
              <Download size={20} className="animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Install App</h4>
              <p className="text-xs text-slate-400">Launch from your screen with offline support</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Install
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 2. Visual "How to Install" Modal Guide */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 relative shadow-2xl animate-slideUp text-left">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                <Smartphone size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">How to Install App</h3>
                <p className="text-xs text-slate-400">Follow these quick setup guidelines</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* iOS Safari Guide */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center shrink-0">
                  <ArrowUpToLine size={16} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-white text-sm">Apple iOS (iPhone / iPad)</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Open the app in <span className="text-white font-medium">Safari</span>, tap the <span className="text-pink-400 font-bold">Share</span> button, and select <span className="text-white font-medium">"Add to Home Screen"</span>.
                  </p>
                </div>
              </div>

              {/* Android Chrome Guide */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                  <PlusSquare size={16} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-white text-sm">Google Android (Chrome / Firefox)</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Tap the browser menu <span className="text-indigo-400 font-bold">⋮</span> in the top-right corner, and select <span className="text-white font-medium">"Install App"</span> or <span className="text-white font-medium">"Add to Home Screen"</span>.
                  </p>
                </div>
              </div>

              {/* PC Desktop Guide */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Monitor size={16} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-white text-sm">Windows / macOS Laptop</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Look for the <span className="text-emerald-400 font-bold">Install icon</span> inside the address bar at the top of your Chrome/Edge browser window.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full mt-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl transition-colors cursor-pointer text-center block"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}

      {/* 3. Generated Codes History slide-over Drawer */}
      {showHistoryDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 p-6 shadow-2xl flex flex-col justify-between animate-slideUp">
            
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Database size={20} className="text-indigo-400" />
                  <h3 className="text-lg font-bold text-white">Generated Records</h3>
                </div>
                <button
                  onClick={() => setShowHistoryDrawer(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer List */}
              <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-160px)] pr-1">
                {historyRecords.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <p className="text-sm">No generated records found.</p>
                    <p className="text-xs mt-1">Submit a registration to generate QR and Barcodes!</p>
                  </div>
                ) : (
                  historyRecords.map((rec) => (
                    <div 
                      key={rec.id}
                      className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl flex items-center justify-between gap-4 hover:border-slate-750 transition-all group"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-slate-100 truncate">{rec.name}</p>
                        <code className="text-xs text-indigo-400 font-mono tracking-wider">{rec.id}</code>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{rec.mobile}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Link
                          to={`/view/${rec.id}`}
                          onClick={() => setShowHistoryDrawer(false)}
                          className="p-2 bg-slate-900 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
                          title="Inspect Codes & Info"
                        >
                          <Eye size={14} />
                        </Link>
                        <button
                          onClick={(e) => handleDeleteRecord(rec.id, e)}
                          className="p-2 bg-slate-900 hover:bg-red-900/50 text-slate-400 hover:text-red-400 rounded-xl transition-all cursor-pointer"
                          title="Delete History"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowHistoryDrawer(false)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl transition-colors cursor-pointer text-center block"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

    </BrowserRouter>
  );
};

export default App;
