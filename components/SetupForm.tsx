import React, { useState } from 'react';
import { JobConfig, Difficulty, InterviewStyle, Strictness } from '../types';
import { PLACEHOLDER_JD } from '../constants';
import { motion } from 'framer-motion';
import { Briefcase, Clock, Settings, ArrowRight } from 'lucide-react';

interface SetupFormProps {
  onComplete: (config: JobConfig) => void;
  isLoading?: boolean;
}

const SetupForm: React.FC<SetupFormProps> = ({ onComplete, isLoading }) => {
  const [roleTitle, setRoleTitle] = useState('Frontend Engineer');
  const [jobDescription, setJobDescription] = useState(PLACEHOLDER_JD);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);
  const [duration, setDuration] = useState(30);
  const [style, setStyle] = useState<InterviewStyle>(InterviewStyle.Formal);
  const [strictness, setStrictness] = useState<Strictness>(Strictness.Balanced);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      roleTitle,
      jobDescription,
      difficulty,
      durationMinutes: duration,
      style,
      strictness
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-slate-800/50 border border-slate-700 backdrop-blur-md rounded-2xl p-8 shadow-2xl"
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Configure Your Interview</h2>
          <p className="text-slate-400">Paste the job description and customize the AI interviewer's persona.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Job Info */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Target Role Title</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 text-slate-500" size={18} />
                <input 
                  type="text" 
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="e.g. Senior Product Manager"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Job Description</label>
              <textarea 
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm leading-relaxed resize-none"
                placeholder="Paste the full job description here..."
                required
              />
            </div>
          </div>

          {/* Right Column: Settings */}
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
                <Settings size={16} /> Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(Difficulty).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                      difficulty === level 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
                <Settings size={16} /> Interview Style
              </label>
              <select 
                value={style}
                onChange={(e) => setStyle(e.target.value as InterviewStyle)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {Object.values(InterviewStyle).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
                <Settings size={16} /> Interviewer Strictness
              </label>
              <div className="flex gap-4 items-center">
                 <input 
                    type="range" 
                    min="0" 
                    max="2" 
                    step="1"
                    value={Object.values(Strictness).indexOf(strictness)}
                    onChange={(e) => setStrictness(Object.values(Strictness)[parseInt(e.target.value)])}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                 />
                 <span className="text-sm font-mono text-blue-400 w-24 text-right">{strictness}</span>
              </div>
            </div>

             <div>
              <label className="block text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
                <Clock size={16} /> Duration (Minutes)
              </label>
              <div className="flex gap-2">
                {[15, 30, 45, 60].map(m => (
                    <button
                        key={m}
                        type="button"
                        onClick={() => setDuration(m)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${duration === m ? 'bg-slate-600 text-white ring-1 ring-blue-500' : 'bg-slate-800 text-slate-500'}`}
                    >
                        {m}m
                    </button>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                    <span className="animate-pulse">Analyzing Job Description...</span>
                ) : (
                    <>Start Interview <ArrowRight size={20} /></>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SetupForm;
