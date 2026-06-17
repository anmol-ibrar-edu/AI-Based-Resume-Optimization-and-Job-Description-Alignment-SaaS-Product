import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { resumeAPI, jobAPI, analysisAPI } from '../services/api';
import FileUpload from '../components/upload/FileUpload';
import {
  FileText, Target, Search, ArrowRight, CheckCircle,
  Shield, Zap, Loader2, Sparkles, ChevronRight, Layout,
  PenTool, BarChart3, ShieldCheck, User, BarChart2, Activity
} from 'lucide-react';
import AnimatedCounter from '../components/common/AnimatedCounter';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';

import ProcessingOverlay from '../components/common/ProcessingOverlay';

const ANALYSIS_STEPS = [
  "Analyzing DNA",
  "Extracting semantic entities",
  "Matching compatibility vectors",
  "Parsing resume document",
  "Extracting skills & keywords",
  "Calculating ATS score",
  "Generating recommendations",
  "Building your personalized report"
];

const UploadPage = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobData, setJobData] = useState({ title: '', company: '', raw_text: '' });
  const [resumeId, setResumeId] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getCurrentStep = () => {
    if (resumeId || resumeFile) {
      if (jobData.raw_text && jobData.raw_text.length >= 10) return 3;
      return 2;
    }
    return 1;
  };

  const currentStep = getCurrentStep();
  const isReady = (resumeId || resumeFile) && (jobData.raw_text && jobData.raw_text.length >= 10);

  const handleAnalyze = async () => {
    if (!resumeId && !resumeFile) { toast.error('Please upload a resume first'); return; }
    if (!jobData.raw_text || jobData.raw_text.length < 10) { toast.error('Please enter the job description'); return; }

    setLoading(true);
    try {
      let currentResumeId = resumeId;
      if (!currentResumeId) {
        const res = await resumeAPI.upload(resumeFile);
        currentResumeId = res.data.id;
        setResumeId(currentResumeId);
      }

      let currentJobId = jobId;
      if (!currentJobId) {
        const res = await jobAPI.create(jobData);
        currentJobId = res.data.id;
        setJobId(currentJobId);
      }

      // Start analysis but wait for loader
      const resPromise = analysisAPI.analyze(currentResumeId, currentJobId);
      
      const [res] = await Promise.all([
        resPromise,
        new Promise(resolve => setTimeout(resolve, 6000))
      ]);

      toast.success('Analysis complete!');
      navigate(`/results/${res.data.id}`);
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = typeof detail === 'object'
        ? (detail.message || detail.reason || detail.error || 'Analysis failed')
        : (detail || 'Analysis failed. Please try again.');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#0D0B09] font-sans text-slate-900 dark:text-[#F5F0E8] pt-32 pb-24 relative overflow-hidden">
      <Helmet>
        <title>Upload & Optimize | ResumeAI</title>
        <meta name="description" content="AI-powered ATS optimization engine." />
      </Helmet>

      {/* Modern Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="tag mb-6 mx-auto lg:mx-0">
               <Zap size={14} className="text-brand-600" /> Advanced Diagnostic Engine
            </div>
            <h1 className="text-5xl md:text-6xl font-[900] text-slate-900 dark:text-white mb-6 font-heading tracking-tight leading-tight">
              ResumeAI <br />
              <span className="text-brand-600">Optimization.</span>
            </h1>
            <p className="text-lg text-[#6B6258] dark:text-[#A09890] leading-relaxed max-w-xl font-medium">
              Bridge the gap between your professional experience and modern recruiter expectations with our deep semantic audit system.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="hidden lg:flex flex-col w-[380px] bg-white dark:bg-[#161310] rounded-[40px] border-2 border-slate-900 dark:border-white shadow-2xl overflow-hidden p-8"
          >
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-brand">
                     <User size={18} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Ayesha Ali</p>
                     <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Senior UX Designer</p>
                  </div>
               </div>
               <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                  Match found
               </div>
            </div>

            <div className="flex items-end justify-between mb-8 gap-6">
               <div className="flex-1">
                  <div className="flex justify-between items-end mb-2">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compatibility</p>
                     <span className="text-2xl font-[900] text-brand-600 font-heading"><AnimatedCounter value={84} />%</span>
                  </div>
                  <div className="h-2 w-full bg-[#FAFAF7] dark:bg-slate-900 rounded-full overflow-hidden border border-[#EAE4DA] dark:border-slate-800">
                     <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: '84%' }} 
                        transition={{ duration: 2, delay: 0.5, ease: "circOut" }} 
                        className="h-full bg-brand-600 relative"
                     >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                     </motion.div>
                  </div>
               </div>
               <div className="w-16 h-16 bg-[#FAFAF7] dark:bg-slate-900 rounded-2xl border border-[#EAE4DA] dark:border-slate-800 flex items-center justify-center">
                  <Activity className="text-brand-600 animate-pulse" size={24} />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-[#FAFAF7] dark:bg-slate-900 p-4 rounded-2xl border border-[#EAE4DA] dark:border-slate-800">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Keywords</p>
                  <p className="text-sm font-[900] text-slate-900 dark:text-white font-heading">High Density</p>
               </div>
               <div className="bg-[#FAFAF7] dark:bg-slate-900 p-4 rounded-2xl border border-[#EAE4DA] dark:border-slate-800">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Semantic</p>
                  <p className="text-sm font-[900] text-slate-900 dark:text-white font-heading">Analyzed</p>
               </div>
            </div>
          </motion.div>
        </div>

        {/* API Key Prompt Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 p-6 bg-amber-500/10 border-2 border-amber-500/20 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 shrink-0 border border-amber-500/20">
                <Sparkles size={20} className="animate-pulse" />
             </div>
             <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Boost ATS Analysis Quality</h4>
                <p className="text-xs font-semibold text-amber-900 dark:text-amber-300 mt-1">
                   Get faster response times and premium rewrites by adding your own free Gemini API key.
                </p>
             </div>
          </div>
          <Link to="/settings" className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm shrink-0">
             Configure API Key & Model
          </Link>
        </motion.div>

        {/* Main Workspace Card */}
        <div className="bg-white dark:bg-[#161310] border-2 border-slate-900 dark:border-white rounded-[32px] md:rounded-[40px] lg:rounded-[60px] shadow-2xl overflow-hidden mb-16">
           
           {/* Stepper - Header */}
           <div className="px-6 md:px-16 py-6 md:py-10 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              {/* Mobile Stepper (< md) */}
              <div className="md:hidden flex flex-col items-center gap-3">
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${currentStep >= i ? 'bg-brand-600 w-8' : 'bg-slate-200 dark:bg-slate-800'}`} />
                  ))}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Step {currentStep} of 3: <span className="text-slate-900 dark:text-white">{currentStep === 1 ? 'Upload' : currentStep === 2 ? 'Details' : 'Analyze'}</span></span>
              </div>

              {/* Desktop Stepper (>= md) */}
              <div className="hidden md:flex items-center justify-center gap-8 lg:gap-16 max-w-5xl mx-auto relative">
                 {[
                   { id: 1, label: 'Upload Resume' },
                   { id: 2, label: 'Job Description' },
                   { id: 3, label: 'Analysis' }
                 ].map((step, i) => {
                   const active = currentStep >= step.id;
                   const isLast = i === 2;
                   return (
                     <div key={step.id} className="flex items-center group">
                        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 px-4 shrink-0 z-10">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500 shrink-0 ${
                             active ? 'bg-brand-600 text-white shadow-brand scale-110' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                           }`}>
                              {step.id}
                           </div>
                           <span className={`text-sm font-black uppercase tracking-widest whitespace-nowrap ${active ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                              {step.label}
                           </span>
                        </div>
                        {!isLast && (
                          <div className={`w-12 lg:w-24 h-px transition-colors duration-500 ${active && currentStep > step.id ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
                        )}
                     </div>
                   );
                 })}
              </div>
           </div>

           {/* Input Zone - Split View */}
           <div className="grid lg:grid-cols-2">
              
              {/* LEFT: Step 1 (Resume) */}
              <div className="p-6 md:p-10 lg:p-16 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800">
                 <div className="flex flex-col h-full">
                    <div className="mb-6 lg:mb-10">
                       <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest block mb-1">Step 1</span>
                       <h2 className="text-2xl lg:text-4xl font-[900] text-slate-900 dark:text-white font-heading">Upload Resume</h2>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                       <FileUpload onFileSelect={setResumeFile} selectedFile={resumeFile} />
                       
                       <AnimatePresence>
                         {(resumeId || resumeFile) && (
                           <motion.div 
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             className="mt-6 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between shadow-sm"
                           >
                             <div className="flex items-center gap-3 overflow-hidden">
                                <ShieldCheck className="text-emerald-600 shrink-0" size={20} />
                                <div className="min-w-0">
                                   <p className="text-xs font-black text-emerald-900 dark:text-white truncate">{resumeFile?.name || 'Document Ready'}</p>
                                   <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Securely Staged</p>
                                </div>
                             </div>
                             <button onClick={() => setResumeFile(null)} className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline shrink-0 ml-4">Remove</button>
                           </motion.div>
                         )}
                       </AnimatePresence>
                    </div>
                 </div>
              </div>

              {/* RIGHT: Step 2 (Job Description) */}
              <div className="p-6 md:p-10 lg:p-16 bg-slate-50/30 dark:bg-slate-900/30 flex flex-col justify-between">
                 <div>
                    <div className="mb-6 lg:mb-10">
                       <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest block mb-1">Step 2</span>
                       <h2 className="text-2xl lg:text-4xl font-[900] text-slate-900 dark:text-white font-heading">Target Position</h2>
                    </div>

                    <div className="space-y-5 lg:space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="group">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block group-focus-within:text-brand-600 transition-colors">Job Title (Optional)</label>
                             <input 
                               type="text"
                               placeholder="e.g. Software Engineer"
                               className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-brand-600/10 focus:border-brand-600 transition-all font-medium"
                               value={jobData.title}
                               onChange={(e) => setJobData({...jobData, title: e.target.value})}
                             />
                          </div>
                          <div className="group">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block group-focus-within:text-brand-600 transition-colors">Company (Optional)</label>
                             <input 
                               type="text"
                               placeholder="e.g. Google"
                               className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-brand-600/10 focus:border-brand-600 transition-all font-medium"
                               value={jobData.company}
                               onChange={(e) => setJobData({...jobData, company: e.target.value})}
                             />
                          </div>
                       </div>
                       <div className="group">
                          <div className="flex justify-between items-center mb-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-brand-600 transition-colors">Job Description *</label>
                             <span className={`text-[10px] font-black ${jobData.raw_text.length >= 200 ? 'text-emerald-600' : 'text-slate-400'}`}>{jobData.raw_text.length} chars</span>
                          </div>
                          <textarea 
                             placeholder="Paste the full job description here to compare skills, keywords, and ATS compatibility."
                             className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-brand-600/10 focus:border-brand-600 transition-all min-h-[220px] lg:min-h-[260px] resize-none font-medium leading-relaxed"
                             value={jobData.raw_text}
                             onChange={(e) => setJobData({...jobData, raw_text: e.target.value})}
                          />
                       </div>
                    </div>
                 </div>

                 {/* Action Bar */}
                 <div className="mt-10 p-6 bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-white rounded-[28px] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 transition-all">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isReady ? 'bg-brand-600 text-white shadow-brand' : 'bg-slate-100 text-slate-300'}`}>
                          <Zap size={24} className={isReady ? 'fill-white' : ''} />
                       </div>
                       <div>
                          <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none mb-1">Run Diagnostics</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isReady ? 'System Primed' : 'Awaiting input'}</p>
                       </div>
                    </div>
                    
                    <motion.button
                      whileHover={isReady && !loading ? { scale: 1.05 } : {}}
                      whileTap={isReady && !loading ? { scale: 0.95 } : {}}
                      onClick={handleAnalyze}
                      disabled={!isReady || loading}
                      className={`relative flex items-center justify-center h-[3.8em] min-w-[200px] w-full sm:w-auto px-10 rounded-2xl font-black text-xs uppercase tracking-[0.1em] transition-all duration-300 ${
                        isReady 
                          ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30 border-none hover:bg-brand-700' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                       <span className="mr-8">{loading ? 'Processing...' : 'Start Analysis'}</span>
                       <div className={`absolute right-2 w-11 h-11 rounded-xl flex items-center justify-center transition-all ${isReady ? 'bg-white text-brand-600' : 'bg-slate-200 text-slate-400'}`}>
                          {loading ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
                       </div>
                    </motion.button>
                 </div>
              </div>
           </div>
        </div>

        {/* Features Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-16 border-t border-slate-100 dark:border-slate-900">
           {[
             { icon: Layout, title: 'Contextual Engine', desc: 'AI understands context and matches requirements.' },
             { icon: Search, title: 'Missing Keywords', desc: 'Identify critical skills missing from profile.' },
             { icon: PenTool, title: 'Action Verbs', desc: 'Smart suggestions to strengthen your impact.' },
             { icon: BarChart3, title: 'Deep Analytics', desc: 'In-depth scoring and detailed AI insights.' }
           ].map((feat, i) => (
             <div key={i} className="flex gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-brand-600 shadow-sm group-hover:scale-110 transition-transform">
                   <feat.icon size={20} />
                </div>
                <div>
                   <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">{feat.title}</h4>
                   <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{feat.desc}</p>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Processing Overlay */}
      <ProcessingOverlay isVisible={loading} steps={ANALYSIS_STEPS} />
    </div>
  );
};

export default UploadPage;
