
import React from 'react';
import { motion } from 'framer-motion';
import { Mic, ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  onBack: () => void;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, onBack, title, subtitle }) => {
  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-900">
      {/* Left Side - Visual / Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12 text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500 rounded-full blur-[100px] opacity-20 translate-y-1/3 -translate-x-1/3"></div>

        <div className="relative z-10 max-w-lg">
          <div className="mb-12 flex items-center gap-3 text-2xl font-bold">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Mic size={20} className="text-white" />
            </div>
            <span>MockMate AI</span>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl font-display font-bold mb-6 leading-tight">
              Master your interview skills with real-time AI feedback.
            </h2>
            <div className="space-y-6">
               <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                     <span className="font-bold text-lg">JD</span>
                  </div>
                  <div>
                    <p className="text-lg italic text-slate-300">"MockMate helped me land my Senior Engineer role at Google. The system design questions were spot on!"</p>
                    <p className="mt-2 text-sm font-bold text-indigo-400">John Doe, Software Engineer</p>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 sm:p-12 lg:p-24 overflow-y-auto">
        <div className="mb-8">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium"
            >
                <ArrowLeft size={16} /> Back
            </button>
        </div>

        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full"
        >
            <div className="mb-10">
                <h1 className="text-3xl font-display font-bold text-slate-900 mb-3">{title}</h1>
                <p className="text-slate-500">{subtitle}</p>
            </div>

            {children}

        </motion.div>
        
        <div className="mt-8 text-center text-xs text-slate-400">
            © 2024 MockMate AI Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
