import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  Brain, 
  ArrowRight, 
  Play, 
  Check, 
  BarChart, 
  Zap, 
  Globe,
  FileText,
  Cpu,
  Code2,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Shield,
  Layers,
  MessageSquare,
  Activity,
  CheckCircle2,
  TrendingUp,
  Bot
} from 'lucide-react';
import { User } from '../types';

interface LandingPageProps {
  onStart: () => void;
  onLoginClick: () => void;
  user: User | null;
  onLogout: () => void;
  onDashboardClick: () => void;
}

const LandingHero: React.FC<LandingPageProps> = ({ onStart, onLoginClick, user, onLogout, onDashboardClick }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // States for visuals in Hero
  const [activeServer, setActiveServer] = useState(0);
  const [confidenceScore, setConfidenceScore] = useState(85);
  const [activeSkill, setActiveSkill] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setActiveServer(prev => (prev + 1) % 5);
        // Simulate fluctuating confidence
        setConfidenceScore(prev => {
            const change = (Math.random() - 0.5) * 5;
            return Math.min(98, Math.max(75, prev + change));
        });
        // Rotate active skill highlight
        setActiveSkill(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      
      {/* --- Navbar --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-slate-900 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 text-white">
              <Mic size={18} />
            </div>
            <span className="font-display">MockMate</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#process" className="hover:text-indigo-600 transition-colors">Process</a>
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
               <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 hover:bg-slate-50 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-100"
                  >
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-slate-200" />
                    <span className="text-sm font-medium text-slate-700 hidden sm:block">{user.name}</span>
                    <ChevronDown size={14} className="text-slate-400" />
                  </button>

                  {showUserMenu && (
                     <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)}></div>
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                           <button onClick={onDashboardClick} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2">
                              <BarChart size={16} /> Dashboard
                           </button>
                           <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2">
                              <UserIcon size={16} /> Profile
                           </button>
                           <div className="h-px bg-slate-100 my-1"></div>
                           <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                              <LogOut size={16} /> Sign out
                           </button>
                        </div>
                     </>
                  )}
               </div>
            ) : (
                <>
                    <button onClick={onLoginClick} className="hidden md:block text-slate-600 hover:text-indigo-600 text-sm font-medium transition-colors px-4 py-2">
                    Log in
                    </button>
                    <button 
                    onClick={onStart} 
                    className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all hover:shadow-lg hover:shadow-slate-900/20 active:scale-95 flex items-center gap-2"
                    >
                    Sign up free <ArrowRight size={14} />
                    </button>
                </>
            )}
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 relative overflow-hidden bg-white">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[700px] h-[700px] rounded-full bg-indigo-50/50 blur-3xl opacity-60 mix-blend-multiply filter"></div>
            <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-blue-50/50 blur-3xl opacity-60 mix-blend-multiply filter"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
            {/* Social Proof Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Used by engineers from Google, Meta, and Amazon
            </motion.div>
            
            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6 font-display"
            >
              Interview prep that <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                 feels like the real thing.
              </span>
            </motion.h1>
            
            {/* Subhead */}
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed"
            >
              Stop memorizing generic answers. MockMate's AI conducts realistic voice interviews tailored to your specific job description.
            </motion.p>
            
            {/* Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <button 
                onClick={onStart}
                className="h-14 px-8 rounded-full bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Start Practice Free <ArrowRight size={18} />
              </button>
              <button className="h-14 px-8 rounded-full bg-white text-slate-700 border border-slate-200 font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2 hover:border-slate-300">
                <Play size={18} className="fill-slate-700" /> Watch Demo
              </button>
            </motion.div>

            {/* --- Insightful Visual --- */}
            <motion.div 
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
                className="relative w-full max-w-5xl mt-20"
            >
                {/* Main Dashboard Screen Container */}
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative z-10 aspect-[16/9] md:aspect-[2/1] group">
                    {/* Simulated Browser Bar */}
                    <div className="h-10 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400/20 border border-red-400/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400/20 border border-yellow-400/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400/20 border border-green-400/50"></div>
                        </div>
                        <div className="mx-auto w-1/3 h-5 bg-slate-100 rounded-md text-[10px] text-slate-400 flex items-center justify-center font-mono">
                            mockmate.ai/live-session
                        </div>
                    </div>

                    {/* App Interface Simulation */}
                    <div className="p-4 md:p-6 h-full flex flex-col md:flex-row gap-4 md:gap-6 bg-slate-50/50">
                        {/* Left: Live Session View */}
                        <div className="w-full md:w-1/3 flex flex-col gap-4">
                            {/* Active Speaker Card */}
                            <div className="bg-white rounded-xl border border-slate-100 flex-1 relative flex items-center justify-center overflow-hidden shadow-sm">
                                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-white"></div>
                                    <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-white rounded-2xl shadow-lg border border-slate-100 p-2 mb-4 relative">
                                        <div className="w-full h-full bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                                            <Bot size={32} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                    </div>
                                    <div className="flex gap-1 h-6 items-end justify-center">
                                            {[...Array(6)].map((_, i) => (
                                            <div 
                                                key={i} 
                                                className="w-1.5 bg-indigo-500 rounded-full animate-[music-bar_1s_ease-in-out_infinite]" 
                                                style={{ height: 8 + Math.random()*16, animationDelay: `${i*0.15}s` }}
                                            ></div>
                                            ))}
                                    </div>
                                    <div className="mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Interviewer</div>
                                    </div>
                            </div>
                            
                            {/* Transcript Snippet */}
                            <div className="bg-white rounded-xl border border-slate-100 p-3 shadow-sm hidden md:block">
                                <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center justify-between">
                                    <span>Transcript</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded-lg rounded-tl-none border border-slate-100">
                                        Can you explain optimistic locking?
                                    </div>
                                    <div className="text-[10px] text-white bg-indigo-600 p-2 rounded-lg rounded-tr-none ml-4 shadow-md shadow-indigo-600/10">
                                        Yes, it assumes conflicts are rare...
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Insights Dashboard */}
                        <div className="flex-1 grid grid-cols-2 gap-4 content-start">
                            {/* Score Card */}
                            <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex flex-col justify-between relative overflow-hidden group-hover:border-indigo-100 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-slate-400 text-[10px] font-bold uppercase mb-1">Confidence Score</div>
                                        <div className="text-2xl font-bold text-slate-900">{Math.floor(confidenceScore)}%</div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                        <Activity size={16} />
                                    </div>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                    <div className="h-full bg-green-500 transition-all duration-700 ease-out" style={{ width: `${confidenceScore}%` }}></div>
                                </div>
                            </div>

                            {/* Skills Detected */}
                            <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm group-hover:border-indigo-100 transition-colors">
                                <div className="text-slate-400 text-[10px] font-bold uppercase mb-3 flex items-center gap-1">
                                    <Zap size={12} className="text-yellow-500"/> Skills Detected
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {['React', 'System Design', 'Databases', 'API'].map((skill, i) => (
                                        <div key={skill} className={`text-[10px] font-bold px-2 py-1 rounded-md border transition-all duration-300 ${i === activeSkill ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-white border-slate-100 text-slate-500'}`}>
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Real-time Feedback Large Card */}
                            <div className="col-span-2 bg-slate-900 rounded-xl border border-slate-800 p-4 flex items-center justify-between shadow-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 relative">
                                        <Brain size={20} />
                                        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-slate-800"></div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">Real-time Feedback</div>
                                        <div className="text-[10px] text-slate-400">Analysis active • 12ms latency</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-0.5 items-end h-3">
                                        <div className="w-0.5 bg-green-500 h-2 rounded-full animate-pulse"></div>
                                        <div className="w-0.5 bg-green-500 h-3 rounded-full animate-pulse delay-75"></div>
                                        <div className="w-0.5 bg-green-500 h-1 rounded-full animate-pulse delay-150"></div>
                                    </div>
                                    <div className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-md border border-green-400/20">
                                        Excellent Pace
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Elements (Parallax) */}
                    <motion.div style={{ y: y1 }} className="absolute -left-12 bottom-20 bg-white p-4 rounded-xl shadow-2xl border border-slate-100 z-20 hidden lg:block hover:scale-105 transition-transform">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                            <CheckCircle2 size={20} />
                        </div>
                        <div>
                            <div className="text-xs text-slate-400 font-bold uppercase">Answer Quality</div>
                            <div className="text-sm font-bold text-slate-900">Star Method Used</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div style={{ y: y2 }} className="absolute -right-8 top-12 bg-white p-4 rounded-xl shadow-2xl border border-slate-100 z-20 hidden lg:block hover:scale-105 transition-transform">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <div className="text-xs text-slate-400 font-bold uppercase">Growth</div>
                            <div className="text-sm font-bold text-slate-900">Top 5% Candidate</div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Process Flow Section --- */}
      <section id="process" className="py-24 bg-slate-50 border-y border-slate-100 overflow-hidden relative">
         <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20">
               <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">Preparation flow, perfected.</h2>
               <p className="text-slate-500 text-lg">Turn a job description into a job offer in three automated steps.</p>
            </div>

            <div className="relative max-w-6xl mx-auto">
               {/* Desktop Connection Line */}
               <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-slate-200 z-0"></div>

               <div className="grid md:grid-cols-3 gap-12 relative z-10">
                   {[
                     { 
                        step: "01",
                        title: "Import Role", 
                        desc: "Paste a Job Description URL or text. We analyze requirements instantly.",
                        icon: <Briefcase className="text-indigo-600" size={24} />,
                        color: "bg-indigo-50 border-indigo-100"
                     },
                     { 
                        step: "02",
                        title: "Voice Interview", 
                        desc: "Engage in a realistic voice conversation tailored to the role's stack.",
                        icon: <Mic className="text-blue-600" size={24} />,
                        color: "bg-blue-50 border-blue-100"
                     },
                     { 
                        step: "03",
                        title: "Get Analytics", 
                        desc: "Receive actionable feedback, scores, and improvement tips.",
                        icon: <BarChart className="text-emerald-600" size={24} />,
                        color: "bg-emerald-50 border-emerald-100"
                     }
                  ].map((item, i) => (
                     <div key={i} className="flex flex-col items-center text-center group">
                        <div className={`w-28 h-28 rounded-3xl ${item.color} border-4 flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300 bg-white relative`}>
                            <div className="absolute -top-3 -right-3 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xs border-4 border-slate-50">
                                {item.step}
                            </div>
                            {item.icon}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                        <p className="text-slate-500 leading-relaxed max-w-xs">{item.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* --- Bento Grid Features Section --- */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
               <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">Why top engineers choose MockMate</h2>
               <p className="text-slate-500 text-lg">We combine advanced speech recognition with deep technical knowledge to simulate real-world pressure.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 max-w-6xl mx-auto h-auto md:h-[600px]">
                
                {/* Feature 1: Analytics (Large) */}
                <div className="md:col-span-2 row-span-1 bg-slate-50 rounded-3xl border border-slate-100 p-8 relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm mb-4">
                            <BarChart className="text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Deep Performance Analytics</h3>
                        <p className="text-slate-500 max-w-sm">Get scored on Communication, Technical Accuracy, and Problem Solving with granular breakdowns.</p>
                    </div>
                    {/* Visual: Simulated Chart */}
                    <div className="absolute bottom-0 right-0 w-1/2 h-4/5 flex items-end justify-end gap-2 p-8 opacity-80 group-hover:scale-105 transition-transform duration-500 origin-bottom-right">
                         {[40, 70, 50, 90, 60, 85].map((h, i) => (
                             <div key={i} className="w-full bg-indigo-200 rounded-t-lg relative group-hover:bg-indigo-300 transition-colors" style={{ height: `${h}%` }}>
                                <div className="absolute top-0 left-0 w-full h-full bg-indigo-600 opacity-20 animate-pulse" style={{ animationDelay: `${i*0.2}s` }}></div>
                             </div>
                         ))}
                    </div>
                </div>

                {/* Feature 2: Geo Map (Distributed Architecture) */}
                <div className="md:col-span-1 row-span-2 bg-slate-900 rounded-3xl border border-slate-800 p-8 relative overflow-hidden flex flex-col justify-between text-white">
                     <div className="relative z-10">
                        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 shadow-sm mb-4">
                            <Globe className="text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Global Low Latency</h3>
                        <p className="text-slate-400 text-sm">Servers in 12 regions ensure your voice is processed instantly, simulating a real conversation.</p>
                    </div>

                    {/* Visual: Geo Map Diagram */}
                    <div className="relative w-full h-48 mt-8">
                         {/* Simplified Map Dots */}
                         {[
                            { x: 20, y: 30 }, { x: 50, y: 40 }, { x: 80, y: 30 }, // NA, EU, Asia
                            { x: 30, y: 60 }, { x: 70, y: 70 }, { x: 90, y: 80 }  // SA, Africa, Aus
                         ].map((pos, i) => (
                             <div 
                                key={i} 
                                className="absolute w-2 h-2 bg-blue-500 rounded-full"
                                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                             >
                                <div className={`absolute -inset-2 bg-blue-500/30 rounded-full ${activeServer === i ? 'animate-ping' : ''}`}></div>
                             </div>
                         ))}
                         {/* Connecting Lines */}
                         <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                            <path d="M 60 100 Q 140 120 230 100" stroke="white" fill="none" />
                            <path d="M 100 180 Q 150 150 230 100" stroke="white" fill="none" />
                         </svg>
                    </div>
                </div>

                {/* Feature 3: Security */}
                <div className="md:col-span-1 row-span-1 bg-white rounded-3xl border border-slate-200 p-8 group">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shadow-sm mb-4 group-hover:bg-green-50 transition-colors">
                        <Shield className="text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Private & Secure</h3>
                    <p className="text-slate-500 text-sm">Your voice data is processed ephemerally and never stored for training.</p>
                </div>

                {/* Feature 4: Customization */}
                <div className="md:col-span-1 row-span-1 bg-white rounded-3xl border border-slate-200 p-8 group">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shadow-sm mb-4 group-hover:bg-orange-50 transition-colors">
                        <Layers className="text-orange-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Role Specific</h3>
                    <p className="text-slate-500 text-sm">Frontend, Backend, DevOps, or PM. We adapt the persona to fit the role.</p>
                </div>
            </div>
        </div>
      </section>

      {/* --- Testimonials Section --- */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
         <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-16 font-display">Loved by job seekers worldwide</h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[
                    {
                        text: "I failed my first 3 system design interviews. After practicing with MockMate for a week, I landed a Senior role at Uber.",
                        author: "Sarah J.",
                        role: "Senior Software Engineer",
                        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                    },
                    {
                        text: "The voice latency is incredible. It actually feels like interrupting a real person. The feedback on my 'ums' and 'ahs' was eye-opening.",
                        author: "Michael C.",
                        role: "Product Manager",
                        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
                    },
                    {
                        text: "Being able to paste a specific job description and get grilled on those exact requirements is a game changer.",
                        author: "David L.",
                        role: "DevOps Engineer",
                        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David"
                    }
                ].map((testimonial, i) => (
                    <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex gap-1 mb-4">
                            {[1,2,3,4,5].map(s => <div key={s} className="w-4 h-4 bg-yellow-400 rounded-sm"></div>)}
                        </div>
                        <p className="text-slate-600 mb-6 leading-relaxed">"{testimonial.text}"</p>
                        <div className="flex items-center gap-3">
                            <img src={testimonial.image} alt={testimonial.author} className="w-10 h-10 rounded-full bg-slate-100" />
                            <div>
                                <div className="font-bold text-slate-900 text-sm">{testimonial.author}</div>
                                <div className="text-slate-400 text-xs">{testimonial.role}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* --- Pricing Section --- */}
      <section id="pricing" className="py-24 bg-white">
        <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
               <h2 className="text-3xl font-bold text-slate-900 mb-4 font-display">Simple, transparent pricing</h2>
               <p className="text-slate-500">Start for free, upgrade when you're ready to master the interview.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Free Plan */}
                <div className="border border-slate-200 rounded-3xl p-8 hover:border-slate-300 transition-colors">
                    <h3 className="font-bold text-xl text-slate-900 mb-2">Free</h3>
                    <div className="text-4xl font-bold text-slate-900 mb-6">$0<span className="text-lg text-slate-400 font-normal">/mo</span></div>
                    <p className="text-slate-500 text-sm mb-6">Perfect for testing the waters.</p>
                    <button onClick={onStart} className="w-full py-3 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 transition-colors mb-8">Get Started</button>
                    <ul className="space-y-4 text-sm text-slate-600">
                        <li className="flex items-center gap-3"><Check size={16} className="text-green-500"/> 1 Interview Credit</li>
                        <li className="flex items-center gap-3"><Check size={16} className="text-green-500"/> Basic Feedback</li>
                        <li className="flex items-center gap-3"><Check size={16} className="text-green-500"/> Standard Latency</li>
                    </ul>
                </div>

                {/* Pro Plan */}
                <div className="border-2 border-indigo-600 rounded-3xl p-8 relative shadow-xl shadow-indigo-600/10 bg-indigo-50/50">
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">POPULAR</div>
                    <h3 className="font-bold text-xl text-indigo-900 mb-2">Pro</h3>
                    <div className="text-4xl font-bold text-slate-900 mb-6">$19<span className="text-lg text-slate-400 font-normal">/mo</span></div>
                    <p className="text-indigo-700/80 text-sm mb-6">For serious job seekers.</p>
                    <button onClick={onStart} className="w-full py-3 rounded-xl bg-indigo-600 font-bold text-white hover:bg-indigo-700 transition-colors mb-8 shadow-lg shadow-indigo-600/20">Subscribe Now</button>
                    <ul className="space-y-4 text-sm text-slate-700">
                        <li className="flex items-center gap-3"><Check size={16} className="text-indigo-600"/> Unlimited Interviews</li>
                        <li className="flex items-center gap-3"><Check size={16} className="text-indigo-600"/> Advanced Analytics</li>
                        <li className="flex items-center gap-3"><Check size={16} className="text-indigo-600"/> Priority Support</li>
                        <li className="flex items-center gap-3"><Check size={16} className="text-indigo-600"/> System Design Mode</li>
                    </ul>
                </div>

                {/* Team Plan */}
                <div className="border border-slate-200 rounded-3xl p-8 hover:border-slate-300 transition-colors">
                    <h3 className="font-bold text-xl text-slate-900 mb-2">Team</h3>
                    <div className="text-4xl font-bold text-slate-900 mb-6">$49<span className="text-lg text-slate-400 font-normal">/mo</span></div>
                    <p className="text-slate-500 text-sm mb-6">For bootcamps and agencies.</p>
                    <button className="w-full py-3 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 transition-colors mb-8">Contact Sales</button>
                    <ul className="space-y-4 text-sm text-slate-600">
                        <li className="flex items-center gap-3"><Check size={16} className="text-green-500"/> 5+ User Seats</li>
                        <li className="flex items-center gap-3"><Check size={16} className="text-green-500"/> Admin Dashboard</li>
                        <li className="flex items-center gap-3"><Check size={16} className="text-green-500"/> Candidate Export</li>
                    </ul>
                </div>
            </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-slate-900 text-slate-400 pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
             <div className="col-span-2">
                <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-white mb-6">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                    <Mic size={16} />
                  </div>
                  MockMate
                </div>
                <p className="mb-6 max-w-sm">The world's most advanced AI interview simulator. Built for engineers, by engineers.</p>
             </div>
             
             <div>
                <h4 className="text-white font-bold mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-indigo-400 transition-colors">Features</a></li>
                    <li><a href="#" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
                    <li><a href="#" className="hover:text-indigo-400 transition-colors">Enterprise</a></li>
                </ul>
             </div>
             
             <div>
                <h4 className="text-white font-bold mb-4">Resources</h4>
                 <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
                    <li><a href="#" className="hover:text-indigo-400 transition-colors">Interview Guide</a></li>
                    <li><a href="#" className="hover:text-indigo-400 transition-colors">Help Center</a></li>
                </ul>
             </div>

             <div>
                <h4 className="text-white font-bold mb-4">Legal</h4>
                 <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a></li>
                    <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms</a></li>
                    <li><a href="#" className="hover:text-indigo-400 transition-colors">Security</a></li>
                </ul>
             </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
             <span>© 2024 MockMate AI Inc. All rights reserved.</span>
             <div className="flex gap-4">
                 <a href="#" className="hover:text-white transition-colors">Twitter</a>
                 <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                 <a href="#" className="hover:text-white transition-colors">GitHub</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper for brevity
const Briefcase = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>

export default LandingHero;