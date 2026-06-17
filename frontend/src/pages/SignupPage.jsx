import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, ArrowRight, Eye, EyeOff, CheckCircle2, ShieldCheck, Sparkles, Target, Zap } from 'lucide-react';
import LogoImg from '../assets/Logo-transparent.png';
import characterImg from '../assets/4.png'; // User's requested image
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const SignupPage = () => {
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '', confirmPassword: '' });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordReqs = [
    { label: '8+ chars', check: (p) => p.length >= 8 },
    { label: 'A-Z / a-z', check: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
    { label: 'Num/Symbol', check: (p) => /[\d\W]/.test(p) },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.full_name.trim()) e.full_name = 'Required';
    if (!formData.email.trim()) e.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Invalid email';
    if (!formData.password) e.password = 'Required';
    else if (formData.password.length < 8) e.password = 'Minimum 8 characters';
    if (formData.password !== formData.confirmPassword) e.confirmPassword = "Passwords don't match";
    if (!acceptTerms) e.terms = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ full_name: formData.full_name, email: formData.email, password: formData.password });
      toast.success('Account created! Check your email to verify.');
      setSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FAFAF7] dark:bg-[#0D0B09] font-sans px-4">
        <div className="bg-white dark:bg-[#161310] border border-[#EAE4DA] dark:border-[#2A231A] rounded-3xl p-12 w-full max-w-md text-center shadow-card-hover">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-3xl font-[900] text-slate-900 dark:text-[#F5F0E8] mb-2 font-heading tracking-tight">Verify Your Email</h2>
          <p className="text-[#6B6258] dark:text-[#A09890] mb-8 text-sm font-medium">
            We sent a verification link to <strong>{formData.email}</strong>. Click it to activate your account.
          </p>
          <Link to="/login">
            <button className="btn-primary w-full py-4 shadow-brand">
              Go to Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#FAFAF7] dark:bg-[#0D0B09] font-sans flex overflow-hidden">
      <Helmet><title>Create Account | ResumeAI</title></Helmet>

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
                Create Your <br />
                <span className="text-brand-600">Account.</span>
              </h1>
              <p className="text-lg text-[#6B6258] dark:text-[#A09890] font-medium mb-10 leading-relaxed max-w-sm">
                Start getting hired with AI-powered optimization and real-time ATS compatibility scores.
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

      {/* Right: Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 bg-white dark:bg-[#0D0B09] overflow-y-auto scrollbar-hide">
        <div className="w-full max-w-sm py-12">
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
            <h2 className="text-3xl font-[900] text-slate-900 dark:text-white tracking-tight font-heading">Get <span className="text-brand-600">Started</span></h2>
            <p className="text-sm text-[#6B6258] dark:text-[#A09890] mt-2 font-medium">Join 5,000+ job seekers optimizing their careers.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#6B6258] dark:text-[#A09890] mb-2">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  className="w-full px-5 py-4 pl-12 rounded-2xl border border-[#EAE4DA] dark:border-[#2A231A] bg-[#FAFAF7] dark:bg-[#161310] text-slate-900 dark:text-[#F5F0E8] focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium"
                  placeholder="John Doe"
                />
              </div>
              {errors.full_name && <p className="text-[11px] text-rose-500 font-bold mt-2 ml-1">{errors.full_name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#6B6258] dark:text-[#A09890] mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-5 py-4 pl-12 rounded-2xl border border-[#EAE4DA] dark:border-[#2A231A] bg-[#FAFAF7] dark:bg-[#161310] text-slate-900 dark:text-[#F5F0E8] focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium"
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-500 font-bold mt-2 ml-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#6B6258] dark:text-[#A09890] mb-2">Create Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full px-5 py-4 pl-12 rounded-2xl border border-[#EAE4DA] dark:border-[#2A231A] bg-[#FAFAF7] dark:bg-[#161310] text-slate-900 dark:text-[#F5F0E8] focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex gap-2 mt-3">
                {passwordReqs.map((req) => (
                  <span key={req.label} className={`text-[10px] font-black px-2.5 py-1 rounded-full border transition-all ${
                    req.check(formData.password)
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 text-emerald-600'
                      : 'bg-[#FAFAF7] dark:bg-[#161310] border-[#EAE4DA] dark:border-[#2A231A] text-[#6B6258] dark:text-[#A09890]'
                  }`}>{req.label}</span>
                ))}
              </div>
              {errors.password && <p className="text-[11px] text-rose-500 font-bold mt-2 ml-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#6B6258] dark:text-[#A09890] mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className="w-full px-5 py-4 pl-12 rounded-2xl border border-[#EAE4DA] dark:border-[#2A231A] bg-[#FAFAF7] dark:bg-[#161310] text-slate-900 dark:text-[#F5F0E8] focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-[11px] text-rose-500 font-bold mt-2 ml-1">{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-center gap-3 py-2">
              <input
                id="terms"
                type="checkbox"
                required
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="h-5 w-5 rounded-lg border-[#EAE4DA] accent-brand-600 transition-all cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-[#6B6258] dark:text-[#A09890] font-medium cursor-pointer">
                I agree to the <span className="text-brand-600 font-black">Terms</span> &amp; <span className="text-brand-600 font-black">Privacy Policy</span>
              </label>
            </div>
            {errors.terms && <p className="text-[11px] text-rose-500 font-bold ml-1">{errors.terms}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2"
            >
              {loading ? 'Creating Account...' : 'Create My Account'}
              <div className="btn-icon">
                 {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowRight size={20} />}
              </div>
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
             <p className="text-sm text-[#6B6258] dark:text-[#A09890] font-medium">
               Already have an account?{' '}
               <Link to="/login" className="text-brand-600 font-black hover:text-brand-700 transition-colors">Sign In Instead</Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
