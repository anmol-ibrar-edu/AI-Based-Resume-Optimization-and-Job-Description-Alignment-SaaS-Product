import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../services/api';
import { Target, CheckCircle2, XCircle, Loader2, ArrowRight, Mail, Sparkles } from 'lucide-react';
import LogoImg from '../assets/Logo-transparent.png';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // loading | success | error | no-token
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('no-token');
      setMessage('No verification token found. Please check the link in your email.');
      return;
    }
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await authAPI.verifyEmail(token);
      setStatus('success');
      setMessage(response.data.message || 'Email verified successfully!');
      toast.success('Email verified!');
    } catch (err) {
      setStatus('error');
      const errorMsg = err.response?.data?.detail || err.message || 'Verification failed. The link may have expired.';
      setMessage(errorMsg);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail.trim()) {
      toast.error('Please enter your email');
      return;
    }
    setResending(true);
    try {
      await authAPI.resendVerification(resendEmail);
      toast.success('A new verification link has been sent.');
      setResendEmail('');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-brand-50 dark:bg-brand-900/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Loader2 className="h-10 w-10 text-brand-600 animate-spin" />
            </div>
            <h2 className="text-3xl font-[900] text-slate-900 dark:text-white font-heading tracking-tight mb-4">Verifying Identity</h2>
            <p className="text-[#6B6258] dark:text-[#A09890] font-medium animate-pulse">Establishing secure connection to core...</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-[900] text-slate-900 dark:text-white font-heading tracking-tight mb-4">Email Verified!</h2>
            <p className="text-[#6B6258] dark:text-[#A09890] font-medium mb-10 leading-relaxed">{message}</p>
            <Link
              to="/login"
              className="w-full py-5 bg-brand-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-brand-700 transition-all shadow-brand flex items-center justify-center gap-3"
            >
              Enter Dashboard <ArrowRight size={16} />
            </Link>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
              <XCircle className="h-10 w-10 text-rose-600" />
            </div>
            <h2 className="text-3xl font-[900] text-slate-900 dark:text-white font-heading tracking-tight mb-4">Verification Link Expired</h2>
            <p className="text-[#6B6258] dark:text-[#A09890] font-medium mb-10 leading-relaxed">{message}</p>

            <div className="w-full space-y-4">
              <p className="text-[10px] font-black text-[#6B6258] uppercase tracking-[0.2em] mb-4">Need a new link?</p>
              <form onSubmit={handleResend} className="flex flex-col gap-4">
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B6258]" />
                  <input
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-14 pr-5 py-4 rounded-2xl border border-[#EAE4DA] dark:border-slate-800 bg-[#FAFAF7] dark:bg-slate-950 text-slate-900 dark:text-white placeholder-[#A09890] outline-none text-sm font-medium transition-all focus:ring-4 focus:ring-brand-500/10 focus:border-brand-600"
                  />
                </div>
                <button
                  type="submit"
                  disabled={resending}
                  className="w-full py-4 bg-slate-900 dark:bg-slate-800 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-black transition-all"
                >
                  {resending ? 'Sending...' : 'Resend Verification Link'}
                </button>
              </form>
            </div>
          </div>
        );

      case 'no-token':
      default:
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-amber-50 dark:bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Mail className="h-10 w-10 text-amber-600" />
            </div>
            <h2 className="text-3xl font-[900] text-slate-900 dark:text-white font-heading tracking-tight mb-4">Invalid Link</h2>
            <p className="text-[#6B6258] dark:text-[#A09890] font-medium mb-10 leading-relaxed">{message}</p>
            <Link
              to="/login"
              className="w-full py-5 bg-brand-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-brand-700 transition-all shadow-brand flex items-center justify-center gap-3"
            >
              Back to Login <ArrowRight size={16} />
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7] dark:bg-[#0D0B09] font-sans text-slate-900 dark:text-slate-300 px-4 relative overflow-hidden">
      <Helmet>
        <title>Verify Email | ResumeAI</title>
      </Helmet>

      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-500/5 blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-500/5 blur-[120px] pointer-events-none -z-10"></div>

      {/* Branding */}
      <div className="fixed top-10 left-10 z-20">
        <Link to="/" className="flex items-center gap-3 group font-black text-xs uppercase tracking-widest">
          <img src={LogoImg} alt="ResumeAI" className="h-6 w-auto grayscale group-hover:grayscale-0 transition-all" />
          <span className="text-slate-900 dark:text-white">ResumeAI</span>
        </Link>
      </div>

      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={containerVariants}
        className="bg-white dark:bg-[#161310] border border-[#EAE4DA] dark:border-slate-800 rounded-[40px] p-10 md:p-12 w-full max-w-md shadow-card relative overflow-hidden z-10"
      >
        <div className="relative z-10">
          {renderContent()}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
