import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles, Target, Zap, ShieldCheck } from 'lucide-react';
import LogoImg from '../assets/Logo-transparent.png';
import characterImg from '../assets/4.png'; // User's requested image
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resending, setResending] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Required';
    if (!password) e.password = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    setShowResend(false);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/upload');
    } catch (err) {
      if (err.response?.status === 403) {
        setShowResend(true);
        toast.error('Please verify your email first.');
      } else {
        toast.error(err.response?.data?.detail || 'Login failed. Check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authAPI.resendVerification(email);
      toast.success('Verification email sent!');
    } catch {
      toast.error('Failed to resend. Try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="h-screen bg-[#FAFAF7] dark:bg-[#0D0B09] font-sans flex overflow-hidden">
      <Helmet><title>Sign In | ResumeAI</title></Helmet>

      {/* Left: Branding & Character */}
      <div className="hidden lg:flex flex-1 relative flex-col overflow-hidden bg-[#FFF8ED] dark:bg-[#161310] border-r border-[#EAE4DA] dark:border-[#2A231A]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 blur-3xl rounded-full -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-500/5 blur-3xl rounded-full -ml-20 -mb-20" />

        {/* Logo */}
        <div className="px-10 pt-10 z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-brand">
              <ShieldCheck size={22} />
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter font-heading">
              Resume<span className="text-brand-600">AI</span>
            </span>
          </Link>
        </div>

        {/* Content + Image side by side */}
        <div className="flex-1 flex flex-col justify-center px-10 xl:px-16 py-8 z-10 relative">
          
          <div className="grid grid-cols-12 gap-10 items-start">
            
            {/* Text column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="col-span-6 flex flex-col"
            >
              <h1 className="text-6xl xl:text-7xl font-[900] text-slate-900 dark:text-white leading-[1] mb-6 font-heading tracking-tight">
                Welcome <br />
                <span className="text-brand-600">Back.</span>
              </h1>
              <p className="text-lg text-[#6B6258] dark:text-[#A09890] font-medium mb-10 leading-relaxed max-w-sm">
                Sign in to continue your journey towards the perfect career. Your next interview is just a few clicks away.
              </p>

              {/* Feature Highlights */}
              <div className="space-y-6">
                {[
                  { icon: Target,   title: 'Precision Scoring',    desc: 'Real-time ATS compatibility tracking.' },
                  { icon: Sparkles, title: 'AI Suggestions',       desc: 'Smarter ways to present your experience.' },
                  { icon: Zap,      title: 'Instant Optimization', desc: 'Fix gaps in seconds, not hours.' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-5 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#2A231A] shadow-md flex items-center justify-center text-brand-600 border border-[#EAE4DA] dark:border-[#2A231A] transition-transform group-hover:scale-110 flex-shrink-0">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white text-base leading-none mb-1 font-heading">{item.title}</h4>
                      <p className="text-sm text-[#6B6258] dark:text-[#A09890] font-medium">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Character image — Large, starting top with text */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-span-6 relative flex justify-center lg:justify-end"
            >
              <div className="absolute -inset-10 bg-brand-500/10 blur-[80px] rounded-full animate-pulse" />
              <img
                src={characterImg}
                alt=""
                aria-hidden="true"
                className="relative w-full max-w-[480px] object-contain drop-shadow-2xl"
              />
            </motion.div>
          </div>

        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 bg-white dark:bg-[#0D0B09]">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-12">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-brand">
                 <ShieldCheck size={24} />
              </div>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter font-heading">Resume<span className="text-brand-600">AI</span></span>
            </Link>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-[900] text-slate-900 dark:text-white tracking-tight font-heading">Sign in to <span className="text-brand-600">ResumeAI</span></h2>
            <p className="text-sm text-[#6B6258] dark:text-[#A09890] mt-2 font-medium">Please enter your credentials to access your account.</p>
          </div>

          {showResend && (
            <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl flex items-center justify-between">
              <p className="text-xs text-amber-700 dark:text-amber-400 font-bold">Please verify your email first.</p>
              <button onClick={handleResend} disabled={resending} className="text-xs font-black text-amber-600 underline ml-4 shrink-0 hover:text-amber-700 transition-colors">
                {resending ? 'Sending...' : 'Resend Link'}
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#6B6258] dark:text-[#A09890] mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 pl-12 rounded-2xl border border-[#EAE4DA] dark:border-[#2A231A] bg-[#FAFAF7] dark:bg-[#161310] text-slate-900 dark:text-[#F5F0E8] focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium"
                  placeholder="admin@example.com"
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-500 font-bold mt-2 ml-1">{errors.email}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#6B6258] dark:text-[#A09890]">Password</label>
                <Link to="/forgot-password" size="sm" className="text-[11px] font-black text-brand-600 hover:text-brand-700 transition-colors uppercase tracking-widest">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 pl-12 rounded-2xl border border-[#EAE4DA] dark:border-[#2A231A] bg-[#FAFAF7] dark:bg-[#161310] text-slate-900 dark:text-[#F5F0E8] focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium"
                  placeholder="•••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-rose-500 font-bold mt-2 ml-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Authenticating...' : 'Sign In to Account'}
              <div className="btn-icon">
                 {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowRight size={20} />}
              </div>
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800 text-center">
             <p className="text-sm text-[#6B6258] dark:text-[#A09890] font-medium">
               New to ResumeAI?{' '}
               <Link to="/signup" className="text-brand-600 font-black hover:text-brand-700 transition-colors">Create Account for Free</Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
