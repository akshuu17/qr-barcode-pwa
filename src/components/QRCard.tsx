import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Copy, Check, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';

interface QRCardProps {
  id: string;
}

export const QRCard: React.FC<QRCardProps> = ({ id }) => {
  const [copied, setCopied] = useState(false);
  const recordUrl = `${window.location.origin}/view/${id}`;
  const canvasId = `qr-canvas-${id}`;

  const downloadQR = () => {
    try {
      const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
      if (!canvas) {
        toast.error('Failed to generate download');
        return;
      }
      
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `QR_${id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR Code downloaded successfully!');
    } catch (error) {
      console.error('Failed to download QR code:', error);
      toast.error('Failed to download QR code');
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(recordUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl border border-white/10 dark:border-slate-800/40 p-6 rounded-2xl flex flex-col items-center justify-between text-center transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/20 group h-full">
      {/* Header */}
      <div className="mb-4">
        <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mx-auto mb-3 group-hover:scale-110 transition-transform">
          <QrCode size={24} />
        </div>
        <h3 className="font-semibold text-lg text-white">QR Code</h3>
        <p className="text-xs text-slate-400 mt-1">Scan to view full registration details</p>
      </div>

      {/* QR Code Container */}
      <div className="p-4 bg-white rounded-xl shadow-lg relative group/qr overflow-hidden flex items-center justify-center mb-6">
        <QRCodeCanvas
          id={canvasId}
          value={recordUrl}
          size={160}
          level="H"
          includeMargin={true}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/qr:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
          <button
            onClick={downloadQR}
            className="p-3 bg-white text-slate-900 rounded-full hover:scale-110 active:scale-95 transition-transform shadow-lg cursor-pointer"
            title="Download PNG"
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-2 mt-auto">
        <button
          onClick={downloadQR}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-all duration-300 active:scale-[0.98] cursor-pointer"
        >
          <Download size={16} />
          <span>Download QR PNG</span>
        </button>
        
        <button
          onClick={copyLink}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-300 font-medium text-sm rounded-xl transition-all duration-300 active:scale-[0.98] cursor-pointer"
        >
          {copied ? (
            <>
              <Check size={16} className="text-emerald-400" />
              <span className="text-emerald-400">Copied Link!</span>
            </>
          ) : (
            <>
              <Copy size={16} />
              <span>Copy Record Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
