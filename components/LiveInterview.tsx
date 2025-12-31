import React, { useEffect, useRef, useState } from 'react';
import { useGeminiLive } from '../hooks/useGeminiLive';
import { JobConfig, Message } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, PhoneOff, BarChart2, Star, X } from 'lucide-react';
import { SYSTEM_INSTRUCTION_TEMPLATE } from '../constants';

interface LiveInterviewProps {
  jobConfig: JobConfig;
  jdSummary: string;
  onEndInterview: (messages: Message[]) => void;
}

const LiveInterview: React.FC<LiveInterviewProps> = ({ jobConfig, jdSummary, onEndInterview }) => {
  
  // Modal State
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');

  // Construct the system instruction dynamically
  const systemInstruction = SYSTEM_INSTRUCTION_TEMPLATE
    .replace('{{ROLE}}', jobConfig.roleTitle)
    .replace('{{COMPANY}}', jobConfig.companyName || 'Generic Tech Co')
    .replace('{{JD_SUMMARY}}', jdSummary)
    .replace('{{DIFFICULTY}}', jobConfig.difficulty)
    .replace('{{STYLE}}', jobConfig.style)
    .replace('{{STRICTNESS}}', jobConfig.strictness);

  const { 
    connect, 
    disconnect, 
    isConnected, 
    isSpeaking, 
    volume, 
    messages,
    realtimeInput,
    realtimeOutput,
    error 
  } = useGeminiLive({
    apiKey: process.env.API_KEY || '',
    systemInstruction,
    onDisconnect: () => {
        // When disconnected from hook, we don't automatically trigger "End Interview" flow 
        // because user might want to review transcript or it might be an error.
    }
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  // Auto-scroll to bottom when messages or realtime text updates
  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      scrollContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, realtimeInput, realtimeOutput]);

  const handleEndInteraction = () => {
    disconnect();
    setShowRatingModal(true);
  };

  const handleSubmitFeedback = () => {
    // In a real app, send this data to backend
    console.log("User Rating:", rating, "Comment:", feedbackComment);
    onEndInterview(messages);
  };

  return (
    <div className="h-screen bg-slate-950 flex flex-col relative overflow-hidden text-white">
      {/* Header */}
      <header className="px-6 py-4 bg-slate-900/80 backdrop-blur border-b border-slate-800 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <h1 className="font-semibold tracking-wide">Interview Session: {jobConfig.roleTitle}</h1>
        </div>
        <div className="text-sm text-slate-400 font-mono">
            {new Date().toLocaleTimeString()}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        
        {/* Central Avatar / Visualizer */}
        <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center mb-12 transform translate-y-[-5%]">
           {/* Ripple Effect for AI Speaking */}
           <AnimatePresence>
             {isSpeaking && (
                <>
                  <motion.div initial={{ scale: 0.8, opacity: 0.5 }} animate={{ scale: 1.5, opacity: 0 }} transition={{ repeat: Infinity, duration: 2 }} className="absolute w-full h-full rounded-full border border-blue-500/30" />
                  <motion.div initial={{ scale: 0.8, opacity: 0.5 }} animate={{ scale: 1.3, opacity: 0 }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} className="absolute w-full h-full rounded-full border border-blue-400/20" />
                </>
             )}
           </AnimatePresence>
           
           {/* Avatar Container */}
           <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-b from-slate-800 to-slate-900 border-4 flex items-center justify-center shadow-2xl relative z-10 transition-all duration-300 ${isSpeaking ? 'border-blue-500 shadow-blue-500/50' : 'border-slate-700'}`}>
              <div className="flex gap-1 items-end h-16">
                  {/* Dynamic Visualizer Bars */}
                  {[...Array(5)].map((_, i) => (
                      <motion.div 
                        key={i}
                        animate={{ 
                            height: isSpeaking ? [20, 60, 30, 70, 40][i] + Math.random() * 20 : 10,
                            backgroundColor: isSpeaking ? '#3b82f6' : '#64748b'
                        }}
                        transition={{ duration: 0.2 }}
                        className="w-3 md:w-4 rounded-full"
                      />
                  ))}
              </div>
           </div>

           {/* User Mic Visualizer Overlay */}
            {!isSpeaking && isConnected && (
                <div className="absolute -bottom-16 flex flex-col items-center gap-2">
                    <div className="flex gap-1 items-center h-8">
                         {[...Array(12)].map((_, i) => (
                            <div 
                                key={`mic-${i}`}
                                className="w-1 bg-green-500 rounded-full transition-all duration-75"
                                style={{ 
                                    height: `${Math.min(32, Math.max(4, volume * 150 * (Math.random() + 0.5)))}px`,
                                    opacity: volume > 0.01 ? 1 : 0.3
                                }}
                            />
                        ))}
                    </div>
                    <div className="text-xs font-bold tracking-wider text-green-400 uppercase">Listening</div>
                </div>
            )}
        </div>

        {/* Live Transcript Panel (Desktop) */}
        <div className="absolute right-6 top-24 bottom-28 w-[400px] bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl flex flex-col overflow-hidden shadow-2xl z-20 hidden lg:flex">
             <div className="p-4 border-b border-slate-700/50 bg-slate-800/80 flex justify-between items-center">
                 <span className="font-semibold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-slate-500'}`} />
                    Live Transcript
                 </span>
             </div>
             
             <div 
                className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth" 
                ref={scrollContainerRef}
             >
                {messages.length === 0 && !realtimeInput && !realtimeOutput && (
                    <div className="text-center text-slate-500 text-sm mt-10 italic">
                        Waiting for conversation to start...
                    </div>
                )}
                
                {/* Historical Messages */}
                {messages.map((m) => (
                    <div key={m.timestamp} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`text-[10px] mb-1 font-bold uppercase tracking-wider ${m.role === 'user' ? 'text-green-400' : 'text-blue-400'}`}>
                            {m.role === 'user' ? 'You' : 'AI Interviewer'}
                        </div>
                        <div className={`px-4 py-3 rounded-2xl text-sm max-w-[90%] leading-relaxed ${
                            m.role === 'user' 
                            ? 'bg-slate-800 text-slate-200 rounded-tr-none border border-slate-700' 
                            : 'bg-blue-950/40 text-blue-100 border border-blue-500/20 rounded-tl-none'
                        }`}>
                            {m.text}
                        </div>
                    </div>
                ))}

                {/* Realtime Updates Area */}
                {(realtimeInput || realtimeOutput) && (
                    <div className="py-2 animate-in fade-in zoom-in-95 duration-300">
                        {realtimeInput && (
                            <div className="flex flex-col items-end">
                                <div className="text-[10px] mb-1 uppercase tracking-wider font-bold text-green-400 flex items-center gap-1">
                                    You <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                </div>
                                <div className="px-4 py-3 rounded-2xl text-sm max-w-[90%] bg-slate-800/80 text-slate-200 rounded-tr-none border border-green-500/40 italic shadow-lg shadow-green-900/20">
                                    {realtimeInput}
                                </div>
                            </div>
                        )}
                        {realtimeOutput && (
                             <div className="flex flex-col items-start mt-2">
                                <div className="text-[10px] mb-1 uppercase tracking-wider font-bold text-blue-400 flex items-center gap-1">
                                    AI Interviewer <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                                </div>
                                <div className="px-4 py-3 rounded-2xl text-sm max-w-[90%] bg-blue-900/30 text-blue-100 rounded-tl-none border border-blue-500/40 italic shadow-lg shadow-blue-900/20">
                                    {realtimeOutput}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                {/* Spacer for bottom scroll */}
                <div ref={scrollRef} className="h-4" />
             </div>
        </div>

        {/* Mobile Caption Overlay */}
        <div className="lg:hidden absolute bottom-32 left-0 w-full px-6 flex flex-col items-center pointer-events-none z-30">
            <AnimatePresence>
                {realtimeInput && (
                     <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-slate-900/90 backdrop-blur text-slate-200 px-4 py-3 rounded-xl text-sm border border-green-500/30 mb-2 max-w-full text-center shadow-lg"
                    >
                        <span className="text-green-400 font-bold text-xs block mb-1 tracking-wider">YOU</span>
                        {realtimeInput}
                    </motion.div>
                )}
                 {realtimeOutput && (
                     <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-blue-950/90 backdrop-blur text-blue-100 px-4 py-3 rounded-xl text-sm border border-blue-500/30 mb-2 max-w-full text-center shadow-lg"
                    >
                        <span className="text-blue-400 font-bold text-xs block mb-1 tracking-wider">AI INTERVIEWER</span>
                        {realtimeOutput}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {error && (
            <div className="absolute top-24 bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg backdrop-blur-md">
                {error}
            </div>
        )}

      </div>

      {/* Controls Footer */}
      <footer className="h-24 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-8 relative z-20">
         <button className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition text-slate-300 border border-slate-700">
            <BarChart2 size={20} />
         </button>
         
         <div className="flex items-center gap-6">
             {/* Mic Toggle (Visual only for now, could be functional) */}
             <div className="relative">
                 <div className={`absolute inset-0 bg-blue-500 rounded-full blur opacity-20 ${isConnected ? 'animate-pulse' : 'hidden'}`}></div>
                 <button className="relative w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition text-white border border-slate-600">
                    <Mic size={24} className={isConnected ? 'text-blue-400' : 'text-slate-400'} />
                 </button>
             </div>

             {/* End Call */}
             <button 
                onClick={handleEndInteraction}
                className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-500 transition text-white shadow-lg shadow-red-600/30 scale-100 hover:scale-105 active:scale-95 group"
            >
                <PhoneOff size={28} className="group-hover:animate-pulse" />
             </button>
         </div>
         
         <div className="w-12" /> {/* Spacer to balance layout */}
      </footer>

      {/* Rating Modal */}
      <AnimatePresence>
        {showRatingModal && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
                >
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">How was your interviewer?</h2>
                            <button 
                                onClick={() => onEndInterview(messages)} 
                                className="text-slate-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="flex justify-center gap-3 mb-8">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className="transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star 
                                        size={32} 
                                        className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-600"} 
                                    />
                                </button>
                            ))}
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Any feedback for the AI? (Optional)
                            </label>
                            <textarea
                                value={feedbackComment}
                                onChange={(e) => setFeedbackComment(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
                                placeholder="The voice was too fast, questions were too hard, etc."
                            />
                        </div>

                        <div className="flex gap-3">
                            <button 
                                onClick={() => onEndInterview(messages)}
                                className="flex-1 py-3 rounded-xl font-medium text-slate-300 hover:bg-slate-800 transition"
                            >
                                Skip
                            </button>
                            <button 
                                onClick={handleSubmitFeedback}
                                className="flex-1 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-500 transition shadow-lg shadow-blue-600/20"
                            >
                                Submit Feedback
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveInterview;