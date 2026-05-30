import React from 'react';
import Barcode from 'react-barcode';
import { Download, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';


interface BarcodeCardProps {
  id: string;
}

export const BarcodeCard: React.FC<BarcodeCardProps> = ({ id }) => {
  const barcodeId = `barcode-svg-${id}`;

  const downloadBarcode = () => {
    try {
      const container = document.getElementById(barcodeId);
      const svg = container?.querySelector('svg');
      if (!svg) {
        toast.error('Barcode not found for download');
        return;
      }

      // Convert SVG to string
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      
      // Setup image and canvas to convert to PNG
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const DOMURL = window.URL || window.webkitURL || window;
      const url = DOMURL.createObjectURL(svgBlob);
      
      const img = new Image();
      
      // High-res rendering scaling factor
      const scale = 2;
      const svgWidth = svg.viewBox.baseVal.width || svg.clientWidth || 300;
      const svgHeight = svg.viewBox.baseVal.height || svg.clientHeight || 100;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = svgWidth * scale;
        canvas.height = svgHeight * scale;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Fill background with white to ensure barcode contrast
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw scaled image
          ctx.scale(scale, scale);
          ctx.drawImage(img, 0, 0);
          
          const pngUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = pngUrl;
          link.download = `Barcode_${id}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success('Barcode downloaded successfully!');
        } else {
          toast.error('Could not render barcode image');
        }
        DOMURL.revokeObjectURL(url);
      };
      
      img.src = url;
    } catch (error) {
      console.error('Failed to download barcode:', error);
      toast.error('Failed to download barcode');
    }
  };

  return (
    <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl border border-white/10 dark:border-slate-800/40 p-6 rounded-2xl flex flex-col items-center justify-between text-center transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/10 hover:border-pink-500/20 group h-full">
      {/* Header */}
      <div className="mb-4">
        <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-400 mx-auto mb-3 group-hover:scale-110 transition-transform">
          <BarChart2 size={24} className="rotate-90" />
        </div>
        <h3 className="font-semibold text-lg text-white">Barcode</h3>

        <p className="text-xs text-slate-400 mt-1">1D Code-128 linear barcode for ID scanning</p>
      </div>

      {/* Barcode Display Container */}
      <div 
        id={barcodeId} 
        className="p-4 bg-white rounded-xl shadow-lg relative group/barcode overflow-hidden flex items-center justify-center mb-6 w-full max-w-[280px]"
      >
        <Barcode 
          value={id}
          width={1.6}
          height={65}
          format="CODE128"
          displayValue={true}
          background="#FFFFFF"
          lineColor="#0F172A"
          fontSize={13}
          margin={5}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/barcode:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
          <button
            onClick={downloadBarcode}
            className="p-3 bg-white text-slate-900 rounded-full hover:scale-110 active:scale-[0.95] transition-transform shadow-lg cursor-pointer"
            title="Download PNG"
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Action Button */}
      <div className="w-full mt-auto">
        <button
          onClick={downloadBarcode}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-pink-600 hover:bg-pink-500 text-white font-medium text-sm rounded-xl transition-all duration-300 active:scale-[0.98] cursor-pointer"
        >
          <Download size={16} />
          <span>Download Barcode PNG</span>
        </button>
      </div>
    </div>
  );
};
