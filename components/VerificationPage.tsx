import React, { useState, useRef, useEffect } from 'react';
import AuthLayout from './AuthLayout';
import { Loader2, ArrowRight } from 'lucide-react';

interface VerificationPageProps {
  email: string;
  onVerify: () => void;
  onBack: () => void;
}

const VerificationPage: React.FC<VerificationPageProps> = ({ email, onVerify, onBack }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto advance
    if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API verification
    setTimeout(() => {
        setIsLoading(false);
        onVerify();
    }, 1500);
  };

  return (
    <AuthLayout 
        title="Check your email" 
        subtitle={`We sent a verification code to ${email}`}
        onBack={onBack}
    >
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex gap-2 justify-center">
                {code.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-14 bg-slate-50 border border-slate-200 rounded-lg text-center text-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                    />
                ))}
            </div>

            <button 
                type="submit" 
                disabled={isLoading || code.some(c => !c)}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                 {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>Verify email <ArrowRight size={16} /></>}
            </button>

            <div className="text-center text-sm text-slate-500">
                Didn't receive the code? {' '}
                <button type="button" className="font-bold text-indigo-600 hover:text-indigo-500">
                    Click to resend
                </button>
            </div>
        </form>
    </AuthLayout>
  );
};

export default VerificationPage;