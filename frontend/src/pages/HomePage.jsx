import { Link } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Footer from '../components/common/Footer';
import Navbar from '../components/common/Navbar';
import AnimatedCounter from '../components/common/AnimatedCounter';
import {
  Target, Sparkles, CheckCircle2, ArrowRight,
  TrendingUp, Users, Briefcase, Star,
  Upload, BarChart2, Lightbulb, Lock, Shield, ShieldCheck, ShieldAlert, Play, ChevronRight, Zap, CheckCircle, User,
  Mail, Phone, MapPin, Settings
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import characterImg from '../assets/5.png'; // Right character
import characterLeftImg from '../assets/4.png'; // Left character

/* ────────── Animation helpers ────────── */
const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };
const fadeLeft = { hidden: { opacity: 0, x: -30 }, show: { opacity: 1, x: 0 } };
const fadeRight = { hidden: { opacity: 0, x: 30 }, show: { opacity: 1, x: 0 } };

const Section = ({ children, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ────────── Typing Line Component ────────── */
const TypingLine = ({ width, delay = 0, duration = 1 }) => {
  return (
    <div className="relative h-2 bg-[#F1F1EF] dark:bg-[#1E1A16] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: width }}
        viewport={{ once: true }}
        transition={{ duration, delay, ease: "linear" }}
        className="absolute top-0 left-0 h-full bg-[#EAE4DA] dark:bg-slate-800"
      />
    </div>
  );
};

/* ────────── Typewriter Animation Component ────────── */
const TypedText = ({ text, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    let index = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, index + 1));
        index++;
        if (index >= text.length) {
          clearInterval(interval);
        }
      }, 25); // Fast, premium typewriter speed
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return <span>{displayedText}</span>;
};

/* ────────── Page ────────── */
const HomePage = () => {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  // For the mock dashboard animation
  const dashboardRef = useRef(null);
  const dashboardInView = useInView(dashboardRef, { once: true, margin: "-100px" });

  const [showResume, setShowResume] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#0D0B09] font-sans text-[#0F0E0C] dark:text-[#F5F0E8] overflow-x-hidden">
      <Helmet>
        <title>ResumeAI — High Performance Career Optimization</title>
        <meta name="description" content="AI-powered resume optimization. Outsmart the ATS, close skill gaps, and land more interviews." />
      </Helmet>

      {/* ── Hero Section ── */}
      <section className="relative pt-24 pb-16 lg:pt-56 lg:pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            
            {/* Left/Top Content: Heading, Subtext, CTA */}
            <div ref={heroRef} className="w-full lg:col-span-5 relative z-10 text-left mb-20 lg:mb-0">
              <motion.div
                variants={fadeUp} initial="hidden" animate={heroInView ? 'show' : 'hidden'}
                transition={{ duration: 0.5 }}
                className="tag mb-6 lg:mb-8"
              >
                <Zap size={14} className="fill-brand-600 text-brand-600" /> AI-DRIVEN CAREER ACCELERATION
              </motion.div>

              <motion.h1
                variants={fadeUp} initial="hidden" animate={heroInView ? 'show' : 'hidden'}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-[clamp(2.5rem,8vw,4.5rem)] font-[900] leading-[1] lg:leading-[0.95] tracking-tight mb-6 font-heading"
              >
                Outsmart <br />
                the ATS. <br />
                <span className="text-brand-600">Land the <br className="hidden lg:block" /> Dream Job.</span>
              </motion.h1>

              <motion.p
                variants={fadeUp} initial="hidden" animate={heroInView ? 'show' : 'hidden'}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg lg:text-xl text-[#6B6258] dark:text-[#A09890] max-w-lg mb-10 lg:mb-12 leading-relaxed font-medium"
              >
                The ultimate platform for resume optimization. Use our neural scoring engine to identify gaps and rewrite your profile for maximum hiring impact.
              </motion.p>

              <motion.div
                variants={fadeUp} initial="hidden" animate={heroInView ? 'show' : 'hidden'}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10 lg:mb-12"
              >
                <Link to="/signup" className="btn-primary">
                  Optimize My Resume <div className="btn-icon"><ArrowRight /></div>
                </Link>
                <button className="btn-outline">
                  Watch Showcase <div className="btn-icon"><Play className="fill-current" /></div>
                </button>
              </motion.div>

              <motion.div
                variants={fadeUp} initial="hidden" animate={heroInView ? 'show' : 'hidden'}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-6 pt-8 border-t border-[#EAE4DA] dark:border-slate-900"
              >
                {[
                  { icon: ShieldCheck, text: 'No Credit Card' },
                  { icon: Sparkles, text: 'Instant Analysis' },
                  { icon: Lock, text: 'Privacy First' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <item.icon size={16} className="text-brand-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#6B6258]">{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right/Bottom Content: Illustration and Dashboard */}
            <motion.div
              variants={fadeRight} initial="hidden" animate={heroInView ? 'show' : 'hidden'}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full lg:col-span-7 relative mt-16 lg:mt-0 lg:pl-10"
            >
              <div className="relative flex items-center justify-center lg:justify-end min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
                
                {/* Premium Dashboard Preview Card - Behind the boy, to the right */}
                <motion.div
                  ref={dashboardRef}
                  initial={{ opacity: 0, x: 100, rotate: 0 }}
                  animate={dashboardInView ? { opacity: 1, x: 0, rotate: -1 } : { opacity: 0, x: 100, rotate: 0 }}
                  transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full sm:w-[500px] lg:w-[680px] bg-white dark:bg-slate-900 rounded-[32px] lg:rounded-[48px] border-2 border-slate-900 dark:border-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.18)] flex overflow-hidden z-10 ml-auto"
                >
                  {/* Dashboard Sidebar - Icons logic */}
                  <div className="w-12 lg:w-20 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700 flex flex-col items-center py-6 lg:py-10 gap-6 lg:gap-10">
                    {[User, Briefcase, BarChart2, Zap].map((Icon, idx) => (
                       <div key={idx} className={`w-8 h-8 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center transition-colors ${idx === 0 ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' : 'text-slate-400'}`}>
                          <Icon size={idx === 0 ? 20 : 18} />
                       </div>
                    ))}
                    <div className="mt-auto mb-6 lg:mb-10 text-slate-300"><Settings size={20} /></div>
                  </div>

                  {/* Main Content Area */}
                  <div className="flex-1 p-6 lg:p-12 flex flex-col">
                    {/* TOP: Primary Metrics */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-8 lg:gap-12 mb-10 lg:mb-16">
                       <div className="text-left">
                          <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Resume Score</p>
                          <div className="relative w-24 h-24 lg:w-36 lg:h-36 flex items-center justify-center">
                             <svg className="w-full h-full -rotate-180" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" strokeDasharray="131.9 263.8" />
                                <motion.circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" strokeLinecap="round"
                                  initial={{ strokeDashoffset: 131.9 }}
                                  animate={dashboardInView ? { strokeDashoffset: 131.9 * (1 - 0.87) } : { strokeDashoffset: 131.9 }}
                                  transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
                                  strokeDasharray="131.9 263.8" className="text-brand-600" />
                             </svg>
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                 <motion.span className="text-4xl lg:text-5xl font-black block leading-tight">
                                    <AnimatedCounter value={87} />
                                 </motion.span>
                                 <span className="text-[8px] lg:text-[10px] font-black uppercase text-emerald-500 tracking-widest -mt-1 block">Excellent</span>
                              </div>
                          </div>
                       </div>

                       <div className="flex-1 w-full space-y-6 lg:space-y-8">
                          {/* Keyword Match */}
                          <div className="bg-slate-50/50 dark:bg-slate-800/30 p-4 lg:p-6 rounded-2xl lg:rounded-3xl border border-slate-100 dark:border-slate-800">
                             <div className="flex justify-between items-center mb-3">
                                <p className="text-[9px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest">Keywords</p>
                                <span className="text-lg lg:text-2xl font-black text-brand-600">92%</span>
                             </div>
                             <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                                <motion.div initial={{ width: 0 }} animate={dashboardInView ? { width: '92%' } : { width: 0 }} transition={{ duration: 1.2, delay: 0.8, ease: "circOut" }} className="h-full bg-brand-600 relative">
                                   <div className="absolute top-0 right-0 h-full w-4 bg-white/20 blur-[2px]" />
                                </motion.div>
                             </div>
                          </div>
                          
                          {/* Analysis Status */}
                          <div className="flex justify-between items-center px-2">
                             <p className="text-[9px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest">Analysis Status</p>
                             <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs lg:text-sm font-black text-emerald-500 uppercase tracking-tighter">Stable</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* MIDDLE: Visual Insights (Line Graph) */}
                    <div className="mb-10 lg:mb-12">
                       <div className="flex justify-between items-end mb-4">
                          <p className="text-[9px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest">Hiring Impact Trend</p>
                          <span className="text-[10px] lg:text-xs font-bold text-brand-600">+12% this week</span>
                       </div>
                       <div className="h-24 lg:h-32 w-full relative">
                          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                             {/* Grid Lines */}
                             <line x1="0" y1="10" x2="100" y2="10" stroke="currentColor" strokeWidth="0.5" className="text-slate-100 dark:text-slate-800" />
                             <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="0.5" className="text-slate-100 dark:text-slate-800" />
                             <line x1="0" y1="30" x2="100" y2="30" stroke="currentColor" strokeWidth="0.5" className="text-slate-100 dark:text-slate-800" />
                             
                             {/* Cubic Growth Line */}
                             <motion.path
                                d="M0 35 Q 20 38, 35 25 T 60 15 T 85 8 L 100 5"
                                fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={dashboardInView ? { pathLength: 1 } : { pathLength: 0 }}
                                transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
                                className="text-brand-600"
                             />
                             {/* Gradient Fill */}
                             <motion.path
                                d="M0 35 Q 20 38, 35 25 T 60 15 T 85 8 L 100 5 V 40 H 0 Z"
                                fill="url(#graphGradient)"
                                initial={{ opacity: 0 }}
                                animate={dashboardInView ? { opacity: 0.1 } : { opacity: 0 }}
                                transition={{ duration: 1, delay: 2.5 }}
                             />
                             <defs>
                                <linearGradient id="graphGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                   <stop offset="0%" stopColor="var(--brand-600)" stopOpacity="1" />
                                   <stop offset="100%" stopColor="var(--brand-600)" stopOpacity="0" />
                                </linearGradient>
                             </defs>
                          </svg>
                       </div>
                    </div>

                    {/* BOTTOM: Action Section */}
                    <div className="mt-auto bg-slate-50 dark:bg-slate-800/30 -mx-6 lg:-mx-12 px-6 lg:px-12 py-6 lg:py-10 border-t border-slate-100 dark:border-slate-800">
                       <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                          <div className="flex items-start gap-4 text-left lg:max-w-xs">
                             <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center shrink-0">
                                <Sparkles size={14} className="text-brand-600" />
                             </div>
                             <p className="text-[11px] lg:text-sm font-bold leading-relaxed">
                                AI Suggestion: Focus on <span className="text-brand-600 font-black">Python/SQL</span> skills for maximum hiring impact.
                             </p>
                          </div>
                          <motion.button
                             whileHover={{ scale: 1.02 }}
                             whileTap={{ scale: 0.98 }}
                             className="btn-premium w-full lg:w-auto"
                          >
                             Apply Suggestions
                             <div className="btn-icon"><ChevronRight /></div>
                          </motion.button>
                       </div>
                    </div>
                  </div>
                </motion.div>

                {/* Illustration (Boy) - Standing in front, on the left */}
                <motion.img
                  src={characterImg} alt="Professional"
                  initial={{ opacity: 0, x: -80 }}
                  animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -80 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                  className="absolute left-[-10%] sm:left-0 lg:left-[-5%] bottom-[-5%] lg:bottom-0 w-[60%] sm:w-[48%] lg:w-[52%] h-auto object-contain z-20 drop-shadow-[40px_40px_80px_rgba(0,0,0,0.3)]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats Counter Section ── */}
      <section className="py-20 lg:py-24 border-y border-[#EAE4DA] dark:border-slate-950 bg-white dark:bg-[#110E0B]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-12">
               {[
                 { label: 'Analyses Run', value: 45800, suffix: '+' },
                 { label: 'Resumes Optimized', value: 12000, suffix: '+' },
                 { label: 'Interview Rate', value: 88, suffix: '%' },
                 { label: 'Hiring Success', value: 94, suffix: '%' },
               ].map((stat, i) => (
                 <div key={i} className="text-center sm:text-left border-l-4 sm:border-l-0 sm:border-t-4 border-brand-600 pl-6 sm:pl-0 sm:pt-6">
                    <p className="text-4xl lg:text-5xl font-[900] font-heading mb-2">
                       <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-xs font-black uppercase tracking-widest text-[#A09890]">{stat.label}</p>
                 </div>
               ))}
            </div>
          </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 lg:py-32 bg-[#FAFAF7] dark:bg-[#0D0B09]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-left lg:text-center mb-16 lg:mb-24">
            <div className="tag mb-6 lg:mx-auto"><Sparkles size={14} /> INTELLIGENT FEATURES</div>
            <h2 className="text-4xl lg:text-6xl font-[900] tracking-tight mb-8 font-heading leading-[1.1]">Engineered for <br className="lg:hidden" /> Success.</h2>
            <p className="text-lg lg:text-xl text-[#6B6258] dark:text-[#A09890] max-w-2xl lg:mx-auto font-medium">Our platform combines industrial-grade OCR with advanced career taxonomies to give you an unfair advantage.</p>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                title: 'Neural Parsing',
                desc: 'Extract deep semantic meaning from your resume, not just keywords.',
                icon: Briefcase,
                color: 'bg-brand-50 text-brand-600 border-brand-100',
              },
              {
                title: 'Skill Gap Matrix',
                desc: 'Instantly identify critical missing skills based on real job requirements.',
                icon: Target,
                color: 'bg-rose-50 text-rose-600 border-rose-100',
              },
              {
                title: 'Live Score Tracking',
                desc: 'Watch your compatibility score climb as you refine your document.',
                icon: TrendingUp,
                color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 lg:p-10 bg-white dark:bg-[#161310] border border-[#EAE4DA] dark:border-slate-800 rounded-[32px] lg:rounded-[40px] shadow-sm hover:shadow-xl transition-all"
              >
                <div className={`w-14 h-14 lg:w-16 lg:h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-8 border shadow-sm group-hover:scale-110 transition-transform`}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl lg:text-2xl font-[900] mb-4 font-heading tracking-tight">{feature.title}</h3>
                <p className="text-[#6B6258] dark:text-[#A09890] leading-relaxed font-medium mb-8 text-sm lg:text-base">{feature.desc}</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-brand-600 transition-colors">
                  Learn More <ChevronRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dashboard Deep Dive Section ── */}
      <section className="py-24 lg:py-40 bg-[#FAFAF7] dark:bg-[#0D0B09] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
             
             {/* Text Content Area */}
             <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-12 text-left lg:text-center mb-10 lg:mb-20"
             >
                <div className="tag mb-6 lg:mx-auto">SEE IT IN ACTION</div>
                <h2 className="text-4xl lg:text-7xl font-[900] tracking-tighter mb-8 font-heading leading-none">
                  Live insights. <br /> 
                  <span className="text-slate-400">Real-time optimization.</span>
                </h2>
                <p className="text-lg lg:text-xl text-slate-500 max-w-2xl lg:mx-auto font-medium">
                  Watch our neural engine dismantle and rebuild a professional profile in seconds, optimizing for every critical hiring signal.
                </p>
             </motion.div>

             {/* Split View Container */}
             <div className="lg:col-span-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white dark:bg-slate-900 rounded-[40px] lg:rounded-[60px] border-2 border-slate-900 dark:border-white shadow-2xl overflow-hidden">
                
                {/* RIGHT: AI Analysis (Dashboard) - 3D Hover Effect Enabled */}
                <div className="order-1 lg:order-2 relative bg-slate-50/50 dark:bg-slate-900/50 p-8 lg:p-16 flex flex-col border-b lg:border-b-0 lg:border-l border-slate-100 dark:border-slate-800 [perspective:1000px] group/dashboard">
                   <motion.div 
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                      className="w-full h-full flex flex-col transition-all duration-700 ease-in-out group-hover/dashboard:[transform:rotate3d(1,1,0,5deg)] [transform-style:preserve-3d]"
                   >
                      <div className="flex items-center justify-between mb-10 lg:mb-12 [transform:translate3d(0,0,30px)]">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/20">
                               <Zap size={16} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Neural Analysis Active</span>
                         </div>
                         <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Status: Stable</span>
                         </div>
                      </div>

                      <div className="space-y-10 lg:space-y-12 mb-12 lg:mb-16">
                         {/* ATS Score */}
                         <div className="flex items-center gap-6 lg:gap-10 [transform:translate3d(0,0,50px)]">
                            <div className="relative w-24 h-24 lg:w-28 lg:h-28 flex items-center justify-center shrink-0">
                               <svg className="w-full h-full -rotate-90">
                                  <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                                  <motion.circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="8" fill="transparent" strokeLinecap="round"
                                     initial={{ strokeDashoffset: 276.4 }}
                                     whileInView={{ strokeDashoffset: 276.4 * (1 - 0.87) }}
                                     viewport={{ once: true }}
                                     transition={{ duration: 1.5, delay: 0.8 }}
                                     strokeDasharray="276.4" className="text-brand-600" />
                               </svg>
                               <div className="absolute inset-0 flex flex-col items-center justify-center">
                                  <span className="text-3xl lg:text-4xl font-black leading-none">87</span>
                                  <span className="text-[7px] lg:text-[8px] font-black uppercase text-emerald-500 tracking-widest">Excel</span>
                               </div>
                            </div>
                            <div>
                               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Resume Score</p>
                               <h4 className="text-lg lg:text-xl font-black mb-1">Highly Compatible</h4>
                               <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">+12% Hiring Impact Trend</p>
                            </div>
                         </div>

                         {/* Keyword Progress */}
                         <div className="[transform:translate3d(0,0,40px)]">
                            <div className="flex justify-between items-center mb-3">
                               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Keywords Match</p>
                               <span className="text-lg lg:text-xl font-black text-brand-600">92%</span>
                         </div>
                            <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                               <motion.div 
                                  initial={{ width: 0 }}
                                  whileInView={{ width: '92%' }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1.2, delay: 1 }}
                                  className="h-full bg-brand-600 relative"
                               >
                                  <div className="absolute top-0 right-0 h-full w-4 bg-white/20 blur-[2px]" />
                               </motion.div>
                            </div>
                         </div>

                         {/* Staggered Suggestions */}
                         <div className="[transform:translate3d(0,0,60px)]">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">AI Suggestion Engine</p>
                            <div className="space-y-3 lg:space-y-4">
                               <motion.div 
                                  initial={{ opacity: 0, y: 10 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ delay: 1.2 }}
                                  className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-2xl border border-brand-200 dark:border-brand-800/40 shadow-xl shadow-brand-500/5 relative overflow-hidden group/tip"
                               >
                                  <div className="absolute top-0 left-0 w-1 h-full bg-brand-600" />
                                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-600 shrink-0">
                                     <Sparkles size={16} />
                                  </div>
                                  <span className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                                     Focus on <span className="text-brand-600">Python/SQL</span> skills for maximum hiring impact.
                                  </span>
                               </motion.div>
                               
                               <div className="grid grid-cols-2 gap-4">
                                  {[
                                     { text: 'Quantify impact', icon: Target },
                                     { text: 'Refine format', icon: CheckCircle2 }
                                  ].map((tip, i) => (
                                     <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 1.4 + (i * 0.1) }}
                                        className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800"
                                     >
                                        <tip.icon size={12} className="text-slate-400" />
                                        <span className="text-[10px] font-bold">{tip.text}</span>
                                     </motion.div>
                                  ))}
                               </div>
                            </div>
                         </div>
                      </div>

                      <motion.button
                         initial={{ opacity: 0 }}
                         whileInView={{ opacity: 1 }}
                         viewport={{ once: true }}
                         transition={{ delay: 2 }}
                         className="btn-premium w-full mt-auto [transform:translate3d(0,0,70px)] shadow-2xl"
                      >
                         Apply Suggestions
                         <div className="btn-icon"><ArrowRight /></div>
                      </motion.button>
                   </motion.div>
                </div>

                {/* LEFT: Human Content (Resume Preview) - Second on mobile */}
                <motion.div 
                   initial={{ opacity: 0, x: -30 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.2 }}
                   className="order-2 lg:order-1 p-8 lg:p-16 flex flex-col"
                >
                   {/* Mobile Toggle Button (Visible only on small screens) */}
                   <button 
                      onClick={() => setShowResume(!showResume)}
                      className="lg:hidden w-full py-4 mb-8 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-center gap-3"
                   >
                      {showResume ? 'Collapse Resume' : 'View Resume Preview'}
                      <ChevronRight size={14} className={`transition-transform ${showResume ? 'rotate-90' : ''}`} />
                   </button>

                   <div className={`${showResume ? 'block' : 'hidden lg:block'} space-y-10`}>
                      <div className="flex justify-between items-start mb-12">
                         <div>
                            <h3 className="text-3xl lg:text-4xl font-black font-heading mb-2"><TypedText text="John Doe" /></h3>
                            <p className="text-xs font-black uppercase tracking-widest text-brand-600"><TypedText text="Software Engineer" delay={300} /></p>
                         </div>
                         <div className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
                            <p><TypedText text="john@ai.com" delay={600} /></p>
                            <p><TypedText text="New York, USA" delay={900} /></p>
                         </div>
                      </div>

                      <div className="space-y-10">
                         <section>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 border-b border-slate-50 dark:border-slate-800 pb-2">Professional Summary</h4>
                            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 leading-relaxed italic">
                               "<TypedText text="Software engineer with 5+ years of experience building scalable cloud solutions and microservices architecture for modern enterprises." delay={1200} />"
                            </p>
                         </section>

                         <section>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 border-b border-slate-50 dark:border-slate-800 pb-2">Experience</h4>
                            <div className="mb-6">
                               <div className="flex justify-between items-center mb-2">
                                  <p className="text-sm font-black"><TypedText text="Senior Developer @ Tech Solutions" delay={2500} /></p>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase hidden sm:block">2021 — Present</span>
                               </div>
                               <ul className="space-y-3">
                                  {[
                                     { text: 'Architected microservices that handled 1M+ req/day', delay: 3500 },
                                     { text: 'Reduced API latency by 40% through Redis caching', delay: 4800 },
                                     { text: 'Led a team of 5 engineers for the core product launch', delay: 6000 }
                                  ].map((point, idx) => (
                                     <li key={idx} className="flex gap-3 text-xs font-medium text-slate-500">
                                        <span className="text-brand-600 mt-1">•</span>
                                        <TypedText text={point.text} delay={point.delay} />
                                     </li>
                                  ))}
                               </ul>
                            </div>
                         </section>

                         <section>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 border-b border-slate-50 dark:border-slate-800 pb-2">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                               {['Python', 'SQL', 'React', 'AWS', 'Docker', 'K8s', 'PyTorch', 'TensorFlow', 'LLMs', 'Prompt Eng', 'LangChain', 'FastAPI', 'Redis', 'CI/CD'].map(skill => (
                                  <span key={skill} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600">{skill}</span>
                               ))}
                            </div>
                         </section>
                      </div>
                   </div>
                </motion.div>
             </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 lg:py-40 relative overflow-hidden bg-white dark:bg-[#0D0B09]">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/5 blur-[120px] rounded-full pointer-events-none" />
         
         <div className="max-w-4xl mx-auto px-6 text-left lg:text-center relative z-10">
            <h2 className="text-[4rem] lg:text-[7rem] font-[900] leading-[0.9] lg:leading-[0.85] tracking-tighter mb-10 lg:mb-12 font-heading">Ready to Fix <br /> Your Career?</h2>
            <p className="text-lg lg:text-xl text-[#6B6258] dark:text-[#A09890] mb-12 lg:mb-16 font-medium max-w-2xl lg:mx-auto">Join a elite community of job seekers using advanced AI to secure high-growth professional opportunities.</p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full lg:w-auto flex justify-center"
            >
              <Link to="/signup" className="btn-primary !h-[4.5em] !pl-12 !pr-[5.5em] !text-lg">
                 Optimize Now <div className="btn-icon"><ArrowRight /></div>
              </Link>
            </motion.div>
            
            <div className="mt-16 flex flex-wrap items-center justify-start lg:justify-center gap-8 opacity-40 grayscale">
               {[ShieldCheck, Lock, Star].map((Icon, i) => (
                 <div key={i} className="flex items-center gap-2">
                    <Icon size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Enterprise Ready</span>
                 </div>
               ))}
            </div>
         </div>
         
         {/* Background Illustrations - Hidden on mobile for less overcrowding */}
         <div className="absolute bottom-0 left-[-150px] w-[500px] opacity-10 pointer-events-none grayscale hidden lg:block scale-x-[-1]">
            <img src={characterLeftImg} alt="" className="w-full h-auto" />
         </div>

         <div className="absolute bottom-0 right-[-150px] w-[500px] opacity-10 pointer-events-none grayscale hidden lg:block">
            <img src={characterImg} alt="Success" className="w-full h-auto" />
         </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
