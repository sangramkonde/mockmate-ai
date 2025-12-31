
import React, { useState } from 'react';
import { User } from '../types';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  Calendar, 
  Settings, 
  LogOut, 
  Plus, 
  Mic, 
  Clock, 
  ChevronDown, 
  Bell,
  Search
} from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onStartInterview: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onStartInterview }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <Mic size={16} />
            </div>
            <span className="font-display">MockMate</span>
        </div>

        <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Search interviews..." 
                    className="pl-9 pr-4 py-2 bg-slate-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all w-64"
                />
            </div>
            
            <button className="relative text-slate-500 hover:text-slate-700 transition">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
                <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 hover:bg-slate-100 p-1.5 pr-3 rounded-full transition-colors"
                >
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-slate-200" />
                    <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                    <ChevronDown size={14} className="text-slate-400" />
                </button>

                {showProfileMenu && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)}></div>
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-4 py-2 border-b border-slate-100 mb-2">
                                <div className="text-sm font-bold text-slate-900">{user.name}</div>
                                <div className="text-xs text-slate-500 truncate">{user.email}</div>
                            </div>
                            <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2">
                                <Settings size={16} /> Settings
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2">
                                <BarChart2 size={16} /> Analytics
                            </button>
                            <div className="h-px bg-slate-100 my-2"></div>
                            <button 
                                onClick={onLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <LogOut size={16} /> Sign out
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
                <h1 className="text-3xl font-display font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500">Track your progress and practice for your next role.</p>
            </div>
            <button 
                onClick={onStartInterview}
                className="bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
            >
                <Plus size={18} /> Start New Interview
            </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
                { label: "Interviews Completed", value: "12", icon: <Mic className="text-blue-600" size={24} />, bg: "bg-blue-50" },
                { label: "Avg. Performance", value: "8.4/10", icon: <BarChart2 className="text-green-600" size={24} />, bg: "bg-green-50" },
                { label: "Practice Time", value: "4h 30m", icon: <Clock className="text-purple-600" size={24} />, bg: "bg-purple-50" }
            ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                        {stat.icon}
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                        <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                    </div>
                </div>
            ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900">Recent Interviews</h3>
                <button className="text-indigo-600 text-sm font-bold hover:underline">View all</button>
            </div>
            <div className="divide-y divide-slate-100">
                {[
                    { role: "Senior Frontend Engineer", date: "Today, 10:30 AM", score: 9.2, status: "Completed" },
                    { role: "Product Manager", date: "Yesterday, 2:15 PM", score: 8.5, status: "Completed" },
                    { role: "System Architect", date: "Oct 24, 2024", score: 7.8, status: "Needs Review" },
                ].map((item, i) => (
                    <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                <Mic size={18} />
                            </div>
                            <div>
                                <div className="font-bold text-slate-900">{item.role}</div>
                                <div className="text-xs text-slate-400 flex items-center gap-1">
                                    <Calendar size={12} /> {item.date}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <div className="text-sm font-bold text-slate-900">{item.score} <span className="text-slate-400 text-xs font-normal">/10</span></div>
                                <div className="text-xs text-slate-500">Score</div>
                            </div>
                             <div className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {item.status}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
