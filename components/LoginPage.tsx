
import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onSignupClick: () => void;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSignupClick, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
        setIsLoading(false);
        // Mock user data
        onLogin({
            name: email.split('@')[0],
            email: email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        });
    }, 1500);
  };

  return (
    <AuthLayout 
        title="Welcome back" 
        subtitle="Please enter your details to access your dashboard."
        onBack={onBack}
    >
        <form onSubmit={handleSubmit} className="space-y-5">
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
                        placeholder="Enter your email"
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
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
            </div>

            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-2"
            >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>Sign in <ArrowRight size={16} /></>}
            </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
            Don't have an account? {' '}
            <button onClick={onSignupClick} className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                Sign up for free
            </button>
        </div>
    </AuthLayout>
  );
};

export default LoginPage;
