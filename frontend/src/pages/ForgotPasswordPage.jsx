import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../services/api';
import { Target, Mail, AlertCircle, ArrowLeft, KeyRound, Send, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import LogoImg from '../assets/Logo-transparent.png';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent! Check your inbox.');
    } catch (err) {
      toast.error(err.response?.data?.detail || err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7] dark:bg-[#0D0B09] font-sans px-4 relative overflow-hidden">
        <Helmet><title>Check Your Email | ResumeAI</title></Helmet>
        
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-500/5 blur-[120px] pointer-events-none -z-10"></div>
        
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={containerVariants}
          className="bg-white dark:bg-[#161310] border border-[#EAE4DA] dark:border-slate-800 rounded-[40px] p-10 md:p-12 w-full max-w-md text-center shadow-card relative z-10"
        >
          <div className="w-20 h-20 bg-brand-50 dark:bg-brand-900/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
            <CheckCircle2 className="h-10 w-10 text-brand-600" />
          </div>
          <h2 className="text-3xl font-[900] text-slate-900 dark:text-white font-heading tracking-tight mb-4">Check Your Email</h2>
          <p className="text-[#6B6258] dark:text-[#A09890] font-medium mb-3 leading-relaxed">We've sent a secure password reset link to:</p>
          <p className="text-brand-600 font-black mb-8 break-all text-lg">{email}</p>
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => { setSent(false); setEmail(''); }} 
              className="w-full py-4 border border-[#EAE4DA] dark:border-slate-800 text-slate-700 dark:text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-[#FAFAF7] dark:hover:bg-slate-900 transition-all"
            >
              Try Different Email
            </button>
            <Link 
              to="/login" 
              className="w-full py-4 bg-brand-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-brand-700 transition-all shadow-brand text-center"
            >
              Back to Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7] dark:bg-[#0D0B09] font-sans text-slate-900 dark:text-slate-300 relative overflow-hidden">
      <Helmet>
        <title>Forgot Password | ResumeAI</title>
      </Helmet>

      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-500/5 blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-500/5 blur-[120px] pointer-events-none -z-10"></div>

      <div className="p-10 relative z-10">
        <Link to="/login" className="inline-flex items-center gap-3 text-[#6B6258] hover:text-brand-600 transition-all group font-black text-xs uppercase tracking-widest">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <div className="flex items-center gap-3">
            <img src={LogoImg} alt="ResumeAI" className="h-6 w-auto grayscale group-hover:grayscale-0 transition-all" />
            <span className="text-slate-900 dark:text-white">ResumeAI</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-20 relative z-10 w-full">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={containerVariants}
          className="bg-white dark:bg-[#161310] border border-[#EAE4DA] dark:border-slate-800 rounded-[40px] p-10 md:p-12 w-full max-w-md shadow-card group overflow-hidden"
        >
          <div className="text-center mb-10 relative">
            <div className="w-16 h-16 bg-[#FAFAF7] dark:bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm border border-[#EAE4DA] dark:border-slate-800 text-brand-600 group-hover:rotate-6 transition-transform">
              <KeyRound className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-[900] text-slate-900 dark:text-white mb-4 font-heading tracking-tight">Forgot Password?</h1>
            <p className="text-[#6B6258] dark:text-[#A09890] font-medium leading-relaxed">No worries. Enter your email and we'll send you a secure reset link.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative" noValidate>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-[#6B6258] dark:text-[#A09890] uppercase tracking-[0.2em] ml-1">Email Address</label>
              <div className="relative group/input">
                <Mail className={`absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${errors.email ? 'text-rose-400' : 'text-[#6B6258] group-focus-within/input:text-brand-600'}`} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({}); }}
                  className={`w-full px-5 py-4 pl-14 rounded-2xl border ${errors.email ? 'border-rose-400 focus:ring-rose-400/10' : 'border-[#EAE4DA] dark:border-slate-800 focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10'} bg-[#FAFAF7] dark:bg-slate-950 text-slate-900 dark:text-white placeholder-[#A09890] outline-none transition-all duration-300 font-medium`}
                  placeholder="Enter your registered email" 
                />
              </div>
              {errors.email && <p className="mt-2 text-xs text-rose-600 font-bold flex items-center gap-1.5 ml-1"><AlertCircle className="h-3.5 w-3.5" />{errors.email}</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="relative w-full py-5 mt-4 bg-brand-600 text-white font-black rounded-2xl shadow-brand-lg hover:bg-brand-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-widest"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <><Send size={16} /> Send Reset Link</>}
              </span>
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-[#F1F1EF] dark:border-slate-800 text-center">
            <p className="text-sm font-medium text-[#6B6258]">
              Remember your password?{' '}
              <Link to="/login" className="text-brand-600 font-black hover:underline ml-1">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
