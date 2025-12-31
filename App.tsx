
import React, { useState } from 'react';
import LandingHero from './components/LandingHero';
import SetupForm from './components/SetupForm';
import LiveInterview from './components/LiveInterview';
import FeedbackReport from './components/FeedbackReport';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import VerificationPage from './components/VerificationPage';
import Dashboard from './components/Dashboard';

import { AppState, JobConfig, Message, InterviewFeedback, User } from './types';
import { parseJobDescription, generateFeedback } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [jobConfig, setJobConfig] = useState<JobConfig | null>(null);
  const [jdSummary, setJdSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [interviewMessages, setInterviewMessages] = useState<Message[]>([]);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [tempUser, setTempUser] = useState<User | null>(null); // For storing user details between Signup -> Verify

  // Navigation Logic
  const handleStartPractice = () => {
    if (user) {
        setAppState('setup');
    } else {
        setAppState('signup');
    }
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setAppState('dashboard');
  };

  const handleSignup = (newUser: User) => {
    setTempUser(newUser);
    setAppState('verification');
  };

  const handleVerify = () => {
    if (tempUser) {
        setUser(tempUser);
        setTempUser(null);
        setAppState('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAppState('landing');
  };

  const handleSetupComplete = async (config: JobConfig) => {
    setIsLoading(true);
    try {
        const summary = await parseJobDescription(config.jobDescription);
        setJdSummary(summary);
        setJobConfig(config);
        setAppState('interview');
    } catch (error) {
        console.error("Failed to setup interview", error);
        alert("Please ensure a valid API_KEY is set in your environment variables.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleEndInterview = async (messages: Message[]) => {
    setInterviewMessages(messages);
    setAppState('feedback');
    setIsLoading(true);

    try {
        if (!jobConfig) throw new Error("No job config");
        const result = await generateFeedback(messages, jobConfig);
        setFeedback(result);
    } catch (error) {
        console.error("Feedback generation failed", error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setAppState('dashboard');
    setJobConfig(null);
    setFeedback(null);
    setInterviewMessages([]);
  };

  return (
    <div className="min-h-screen font-sans">
      {appState === 'landing' && (
        <LandingHero 
            onStart={handleStartPractice}
            onLoginClick={() => setAppState('login')}
            user={user}
            onLogout={handleLogout}
            onDashboardClick={() => setAppState('dashboard')}
        />
      )}
      
      {appState === 'login' && (
        <LoginPage 
            onLogin={handleLogin} 
            onSignupClick={() => setAppState('signup')}
            onBack={() => setAppState('landing')}
        />
      )}

      {appState === 'signup' && (
        <SignupPage 
            onSignup={handleSignup} 
            onLoginClick={() => setAppState('login')}
            onBack={() => setAppState('landing')}
        />
      )}

      {appState === 'verification' && tempUser && (
        <VerificationPage 
            email={tempUser.email}
            onVerify={handleVerify}
            onBack={() => setAppState('signup')}
        />
      )}

      {appState === 'dashboard' && user && (
        <Dashboard 
            user={user}
            onLogout={handleLogout}
            onStartInterview={() => setAppState('setup')}
        />
      )}
      
      {appState === 'setup' && (
        <SetupForm onComplete={handleSetupComplete} isLoading={isLoading} />
      )}

      {appState === 'interview' && jobConfig && (
        <LiveInterview 
            jobConfig={jobConfig} 
            jdSummary={jdSummary}
            onEndInterview={handleEndInterview} 
        />
      )}

      {appState === 'feedback' && (
        <FeedbackReport 
            feedback={feedback} 
            isLoading={isLoading} 
            onRestart={handleRestart} 
            messages={interviewMessages}
        />
      )}
    </div>
  );
};

export default App;
