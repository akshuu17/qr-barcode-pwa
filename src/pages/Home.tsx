import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserForm } from '../components/UserForm';
import { submitForm } from '../services/api';
import type { UserRegistrationPayload } from '../types/record';
import toast from 'react-hot-toast';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (data: UserRegistrationPayload) => {
    try {
      setIsLoading(true);
      const response = await submitForm(data);

      if (response.success) {
        toast.success('Registration saved successfully!');
        navigate('/success', {
          state: {
            recordId: response.id,
          },
        });
      } else {
        toast.error('Submission failed.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-white">
      
      {/* 3D Animated Colorful Background spheres */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        
        {/* Sphere 1: Royal Indigo - floating top-left to bottom-right */}
        <div className="absolute top-[10%] left-[15%] w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] rounded-full bg-indigo-600/20 blur-[110px] animate-float-1" />
        
        {/* Sphere 2: Hot Magenta - floating bottom-right to top-left */}
        <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] rounded-full bg-pink-500/15 blur-[120px] animate-float-2" />
        
        {/* Sphere 3: Electric Violet - pulsing in the center */}
        <div className="absolute top-[35%] left-[40%] w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] rounded-full bg-purple-600/15 blur-[100px] animate-float-3" />
        
        {/* Subtle grid mesh layer overlay for professional finish */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />
      </div>

      {/* Centered Main Content Area */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 flex items-center justify-center relative z-10">
        
        {/* 3D Frosted Glassmorphism Registration Form Card */}
        <div className="w-full max-w-md mx-auto flex justify-center animate-slideUp">
          <div className="w-full bg-white/[0.02] border border-white/[0.08] backdrop-blur-3xl p-8 rounded-[32px] shadow-[0_30px_70px_rgba(0,0,0,0.6)] shadow-indigo-950/20 relative group hover:-translate-y-2 hover:scale-[1.01] hover:border-white/[0.15] hover:shadow-[0_40px_80px_rgba(79,70,229,0.15)] transition-all duration-500 ease-out">
            
            {/* Glossy top-highlight line inside the 3D card */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent rounded-t-[32px]" />
            
            <div className="mb-6 relative z-10">
              <h2 className="text-2xl font-black text-white text-center tracking-tight leading-none bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Create a Record
              </h2>
              <p className="text-xs text-slate-400 mt-2 text-center font-medium tracking-wide">
                Please enter your credentials for instant scanning
              </p>
            </div>

            <div className="relative z-10">
              <UserForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 py-6 border-t border-indigo-950/40 text-center text-xs text-slate-500 relative z-10">
        <p>© 2026 QR Barcode PWA. Designed for premium speed, efficiency, and reliability.</p>
      </footer>
    </div>
  );
};

export default Home;
