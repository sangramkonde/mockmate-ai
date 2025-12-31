
import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2 } from 'lucide-react';
import { User } from '../types';

interface SignupPageProps {
  onSignup: (user: User) => void;
  onLoginClick: () => void;
  onBack: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onLoginClick, onBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
        setIsLoading(false);
        onSignup({
            name,
            email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
        });
    }, 1500);
  };

  return (
    <AuthLayout 
        title="Create an account" 
        subtitle="Start your journey to interview mastery today."
        onBack={onBack}
    >
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                    <UserIcon className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                        placeholder="John Doe"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                        placeholder="john@example.com"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                        placeholder="Create a password"
                    />
                </div>
                <p className="text-xs text-slate-400 mt-1">Must be at least 8 characters.</p>
            </div>

            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 active:scale-95 flex items-center justify-center gap-2 mt-2"
            >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>Create account <ArrowRight size={16} /></>}
            </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
            Already have an account? {' '}
            <button onClick={onLoginClick} className="font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                Log in
            </button>
        </div>
    </AuthLayout>
  );
};

export default SignupPage;
