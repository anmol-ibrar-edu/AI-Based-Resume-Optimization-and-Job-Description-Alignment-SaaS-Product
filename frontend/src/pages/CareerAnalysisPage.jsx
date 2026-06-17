import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  Sparkles, Target, Briefcase, TrendingUp, GraduationCap,
  DollarSign, Star, ChevronDown, ChevronUp, CheckCircle,
  XCircle, Lightbulb, BarChart3, Compass, Rocket, BookOpen,
  Layers, Upload, FileText, AlertCircle, Zap, Brain,
  ArrowRight, Shield, ShieldCheck, Loader2
} from 'lucide-react';
import { resumeAPI } from '../services/api';
import api from '../services/api';
import careerCharImg from '../assets/1.png';
import ProcessingOverlay from '../components/common/ProcessingOverlay';

const CareerAnalysisPage = () => {
  const [resumes, setResumes]               = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [analysis, setAnalysis]             = useState(null);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState(null);
  const [expandedCareer, setExpandedCareer] = useState(null);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [uploadLoading, setUploadLoading]   = useState(false);
  const [uploadError, setUploadError]       = useState(null);
  const [dragActive, setDragActive]         = useState(false);
  const fileInputRef = useRef(null);

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

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    try {
      const res = await api.get('/resume/');
      const raw = res.data?.resumes || res.data || [];
      const seen = new Map();
      for (const r of raw) {
        const name = r.filename || r.file_name || `Resume #${r.id}`;
        if (!seen.has(name) || r.id > seen.get(name).id) seen.set(name, r);
      }
      const data = Array.from(seen.values());
      setResumes(data);
      if (data.length > 0) setSelectedResume(data[0].id);
    } catch { /* silent */ } finally { setLoadingResumes(false); }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'doc'].includes(ext)) {
      setUploadError('Only PDF or DOCX files are accepted.');
      return;
    }
    setUploadLoading(true);
    setUploadError(null);
    const t = toast.loading('Uploading resume...');
    try {
      const res = await resumeAPI.upload(file);
      const newResume = res.data;
      setResumes(prev => {
        const filtered = prev.filter(
          r => (r.filename || r.file_name) !== (newResume.filename || newResume.file_name)
        );
        return [newResume, ...filtered];
      });
      setSelectedResume(newResume.id);
      toast.success('Resume ready for analysis.', { id: t });
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = typeof detail === 'object'
        ? (detail.reason || detail.message || 'Resume rejected — not a valid CV.')
        : (detail || 'Upload failed. Please try again.');
      setUploadError(msg);
      toast.error(msg, { id: t });
    } finally { setUploadLoading(false); }
  };

  const handleAnalyze = async () => {
    if (!selectedResume) { toast.error('Please select or upload a resume first.'); return; }
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      // Start the API call in background
      const resPromise = api.post('/career/analyze', { resume_id: Number(selectedResume) });
      
      // Wait for at least 6 seconds to show the typewriter animation (or longer if API is slow)
      const [res] = await Promise.all([
        resPromise,
        new Promise(resolve => setTimeout(resolve, 6000))
      ]);
      
      setAnalysis(res.data);
      toast.success('Career analysis complete!');
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = typeof detail === 'string' ? detail : 'Analysis failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally { 
      setLoading(false); 
    }
  };

  const getMatchGradient = (p) => p >= 75 ? 'from-emerald-500 to-green-400' : p >= 55 ? 'from-brand-500 to-brand-400' : p >= 40 ? 'from-amber-500 to-orange-400' : 'from-rose-500 to-pink-400';
  const getMatchBorder   = (p) => p >= 75 ? 'border-emerald-500/30 bg-emerald-500/5' : p >= 55 ? 'border-brand-500/30 bg-brand-600/5' : p >= 40 ? 'border-amber-500/30 bg-amber-500/5' : 'border-rose-500/30 bg-rose-500/5';
  const getDemandColor   = (d) => ({ 'Extremely High': 'text-brand-600', 'Very High': 'text-emerald-600', 'High': 'text-blue-500', 'Growing': 'text-amber-500', 'Medium': 'text-yellow-500' })[d] || 'text-[#6B6258]';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#0D0B09] font-sans text-slate-900 dark:text-[#F5F0E8] relative pt-32 pb-24 overflow-hidden">
      <Helmet>
        <title>Career Insights | ResumeAI</title>
        <meta name="description" content="Discover career paths matching your skill set." />
      </Helmet>

      {/* Modern Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-50/50 to-transparent dark:from-brand-900/10 dark:to-transparent pointer-events-none -z-10" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-brand-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
      >
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-20">
          <motion.div variants={itemVariants} className="flex-1 text-center lg:text-left">
            <div className="tag mb-6 mx-auto lg:mx-0">
               <Compass size={14} className="text-brand-600" /> Career Exploration Engine
            </div>
            <h1 className="text-5xl md:text-6xl font-[900] text-slate-900 dark:text-white mb-6 font-heading tracking-tight leading-tight">
              Predict Your <br />
              <span className="text-brand-600">Career Trajectory.</span>
            </h1>
            <p className="text-lg text-[#6B6258] dark:text-[#A09890] leading-relaxed max-w-xl font-medium">
              Analyze your core competencies and discover high-growth career paths optimized for your specific professional DNA.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex-1 relative hidden lg:block">
             <div className="relative bg-white dark:bg-[#161310] border border-[#EAE4DA] dark:border-slate-800 rounded-[40px] p-10 shadow-2xl overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
                <img src={careerCharImg} alt="" className="relative w-48 mx-auto drop-shadow-2xl" />
                <div className="mt-8 space-y-4">
                   <div className="h-2 w-full bg-[#FAFAF7] dark:bg-slate-900 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-brand-600" transition={{ delay: 1, duration: 1.5 }} />
                   </div>
                   <div className="h-2 w-3/4 bg-[#FAFAF7] dark:bg-slate-900 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '60%' }} className="h-full bg-emerald-500" transition={{ delay: 1.2, duration: 1.5 }} />
                   </div>
                </div>
             </div>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Star, title: 'Elite Matching', desc: 'Top 1% career matches', color: 'text-brand-600', bg: 'bg-brand-50 dark:bg-brand-900/20' },
            { icon: Briefcase, title: 'Ranked Catalog', desc: '30+ paths analyzed', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
            { icon: Lightbulb, title: 'Skill Roadmap', desc: 'Targeted learning paths', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
            { icon: TrendingUp, title: 'Market Data', desc: 'Live salary & demand', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          ].map((feat, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-[#161310] border border-[#EAE4DA] dark:border-slate-800 rounded-[32px] p-8 shadow-card flex flex-col items-center text-center group"
            >
              <div className={`w-14 h-14 ${feat.bg} ${feat.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                 <feat.icon size={24} />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">{feat.title}</h3>
              <p className="text-xs text-[#6B6258] dark:text-[#A09890] font-medium leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Upload/Select Section */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-[#161310] border-2 border-slate-900 dark:border-white rounded-[40px] md:rounded-[60px] p-10 md:p-16 shadow-2xl mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:rotate-12 transition-transform">
            <Compass className="w-80 h-80" />
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
             <div>
                <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest block mb-1">Step 1</span>
                <h2 className="text-3xl lg:text-4xl font-[900] text-slate-900 dark:text-white font-heading mb-4 tracking-tight">Source Document</h2>
                <p className="text-[#6B6258] dark:text-[#A09890] mb-10 font-medium leading-relaxed max-w-md">Select an existing resume or upload a new document to begin the deep semantic analysis.</p>
                
                <div className="space-y-8">
                   <div 
                      onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                      onDragOver={(e)  => { e.preventDefault(); setDragActive(true); }}
                      onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`cursor-pointer border-2 border-dashed rounded-[32px] p-12 text-center transition-all duration-500 group ${
                        dragActive ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-900/10 scale-[1.02]' : 'border-[#EAE4DA] dark:border-slate-800 hover:border-brand-600/50 bg-[#FAFAF7] dark:bg-slate-900/30'
                      }`}
                   >
                      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleDrop} />
                      {uploadLoading ? (
                        <div className="flex flex-col items-center gap-6">
                           <Loader2 className="animate-spin text-brand-600" size={40} />
                           <span className="text-sm font-black text-brand-600 uppercase tracking-[0.2em]">Uploading DNA...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-6">
                           <div className="w-16 h-16 bg-brand-600 rounded-[20px] flex items-center justify-center text-white shadow-brand rotate-3 group-hover:rotate-0 transition-transform">
                              <Upload size={28} />
                           </div>
                           <div>
                              <p className="text-slate-900 dark:text-white font-black text-base uppercase tracking-widest">Drop Resume Here</p>
                              <p className="text-xs text-[#6B6258] dark:text-[#A09890] font-medium mt-2">PDF or DOCX — Maximum 5MB</p>
                           </div>
                        </div>
                      )}
                   </div>

                   <div className="flex items-center gap-6">
                      <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Quick Select</span>
                      <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                   </div>

                   {loadingResumes ? (
                     <div className="h-16 bg-[#FAFAF7] dark:bg-slate-900 rounded-2xl animate-pulse border border-slate-100 dark:border-slate-800" />
                   ) : resumes.length > 0 ? (
                     <select
                        value={selectedResume}
                        onChange={(e) => setSelectedResume(e.target.value)}
                        className="w-full bg-[#FAFAF7] dark:bg-slate-900 border-2 border-[#EAE4DA] dark:border-slate-800 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:border-brand-600 focus:ring-4 focus:ring-brand-600/5 outline-none transition-all font-black text-xs uppercase tracking-widest appearance-none cursor-pointer"
                     >
                        {resumes.map((r) => (
                           <option key={r.id} value={r.id}>{r.filename || r.file_name || `Resume #${r.id}`}</option>
                        ))}
                     </select>
                   ) : (
                     <div className="p-8 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl text-center">
                        <p className="text-xs font-black text-[#A09890] uppercase tracking-widest">No saved resumes found</p>
                     </div>
                   )}
                </div>
             </div>

             <div className="flex flex-col items-center lg:items-end">
                <motion.button
                  whileHover={selectedResume && !loading ? { scale: 1.05 } : {}}
                  whileTap={selectedResume && !loading ? { scale: 0.95 } : {}}
                  onClick={handleAnalyze}
                  disabled={loading || !selectedResume}
                  className={`relative flex items-center justify-center h-[4.2em] min-w-[280px] w-full lg:w-auto px-12 rounded-[24px] font-black text-sm uppercase tracking-[0.1em] transition-all duration-300 ${
                    selectedResume 
                      ? 'bg-brand-600 text-white shadow-brand-lg border-none hover:bg-brand-700' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700 shadow-none'
                  }`}
                >
                   <span className="mr-10">Run Deep Insights</span>
                   <div className={`absolute right-3 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${selectedResume ? 'bg-white text-brand-600 shadow-sm' : 'bg-slate-200 text-slate-400'}`}>
                      {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                   </div>
                </motion.button>
                <div className="mt-8 flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full animate-pulse ${selectedResume ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                   <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${selectedResume ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {selectedResume ? 'System ready for scan' : 'Upload document to proceed'}
                   </p>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Results Area */}
        <AnimatePresence>
           {analysis && (
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-12"
             >
                {/* Score Summary Banner */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                   {[
                     { icon: Briefcase, label: 'Eligible Paths', value: analysis.overall_profile?.total_eligible_careers ?? 0, color: 'text-brand-600' },
                     { icon: Layers, label: 'Active Fields', value: analysis.overall_profile?.total_eligible_fields ?? 0, color: 'text-indigo-600' },
                     { icon: Target, label: 'Semantic Skills', value: analysis.skills_summary?.total_skills_found ?? 0, color: 'text-emerald-600' },
                     { icon: GraduationCap, label: 'Profile Level', value: analysis.overall_profile?.career_level ?? 'N/A', color: 'text-amber-600' },
                   ].map((stat, i) => (
                     <div key={i} className="bg-white dark:bg-[#161310] border border-[#EAE4DA] dark:border-slate-800 rounded-[32px] p-8 text-center shadow-card group">
                        <div className={`w-12 h-12 bg-[#FAFAF7] dark:bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-400 group-hover:${stat.color} transition-colors`}>
                           <stat.icon size={20} />
                        </div>
                        <p className={`text-3xl font-[900] text-slate-900 dark:text-white font-heading ${stat.label === 'Profile Level' ? 'text-lg' : ''}`}>{stat.value}</p>
                        <p className="text-[10px] font-black text-[#6B6258] dark:text-[#A09890] uppercase tracking-widest mt-1">{stat.label}</p>
                     </div>
                   ))}
                </div>

                {/* Best Fit Hero */}
                {analysis.best_fit && (
                  <div className="relative bg-white dark:bg-[#161310] border border-[#EAE4DA] dark:border-slate-800 rounded-[48px] p-12 shadow-card overflow-hidden">
                     <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-500/5 -z-10" />
                     <div className="flex flex-col lg:flex-row justify-between gap-12">
                        <div className="flex-1">
                           <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-900/20 rounded-xl text-brand-600 text-xs font-black uppercase tracking-widest mb-8">
                              <Star size={14} className="fill-brand-500" /> Optimal Match
                           </div>
                           <h2 className="text-4xl md:text-5xl font-[900] text-slate-900 dark:text-white font-heading mb-4 tracking-tight leading-tight">{analysis.best_fit.career_title}</h2>
                           <p className="text-brand-600 font-black text-sm uppercase tracking-[0.1em] mb-6">{analysis.best_fit.field}</p>
                           <p className="text-[#6B6258] dark:text-[#A09890] text-lg leading-relaxed max-w-2xl mb-10 font-medium">{analysis.best_fit.description}</p>
                           
                           <div className="flex flex-wrap gap-8">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-[#FAFAF7] dark:bg-slate-900 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm"><DollarSign size={20} /></div>
                                 <div><p className="text-xs font-black uppercase tracking-widest text-[#A09890]">Salary</p><p className="text-sm font-black text-slate-900 dark:text-white">{analysis.best_fit.salary_range}</p></div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-[#FAFAF7] dark:bg-slate-900 rounded-xl flex items-center justify-center text-brand-600 shadow-sm"><TrendingUp size={20} /></div>
                                 <div><p className="text-xs font-black uppercase tracking-widest text-[#A09890]">Demand</p><p className="text-sm font-black text-slate-900 dark:text-white">{analysis.best_fit.market_demand}</p></div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-[#FAFAF7] dark:bg-slate-900 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm"><BarChart3 size={20} /></div>
                                 <div><p className="text-xs font-black uppercase tracking-widest text-[#A09890]">Growth</p><p className="text-sm font-black text-slate-900 dark:text-white">{analysis.best_fit.growth_rate}</p></div>
                              </div>
                           </div>
                        </div>

                        <div className="lg:w-64 shrink-0 flex flex-col items-center justify-center bg-[#FAFAF7] dark:bg-slate-900 rounded-[40px] p-10 border border-[#EAE4DA] dark:border-slate-800">
                           <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                 <circle cx="50" cy="50" r="45" fill="none" stroke="#EAE4DA" strokeWidth="6" className="dark:stroke-slate-800" />
                                 <motion.circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-brand-600"
                                    initial={{ strokeDasharray: "0 283" }}
                                    animate={{ strokeDasharray: `${(analysis.best_fit.match_percentage / 100) * 283} 283` }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                 />
                              </svg>
                              <span className="absolute text-4xl font-[900] text-slate-900 dark:text-white font-heading">{analysis.best_fit.match_percentage}%</span>
                           </div>
                           <p className="text-[10px] font-black text-[#6B6258] uppercase tracking-[0.2em]">Match Compatibility</p>
                        </div>
                     </div>
                  </div>
                )}

                {/* All Eligible Paths List */}
                <div className="bg-white dark:bg-[#161310] border border-[#EAE4DA] dark:border-slate-800 rounded-[40px] p-10 shadow-card">
                   <h3 className="text-2xl font-[900] text-slate-900 dark:text-white font-heading mb-10 tracking-tight">Compatible Career Paths</h3>
                   <div className="space-y-4">
                      {analysis.eligible_careers?.map((career, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`group border rounded-[24px] p-6 transition-all cursor-pointer ${expandedCareer === idx ? 'bg-[#FAFAF7] dark:bg-slate-900 border-brand-600/50 shadow-sm' : 'bg-white dark:bg-slate-950/20 border-[#EAE4DA] dark:border-slate-800 hover:border-brand-600/30'}`}
                          onClick={() => setExpandedCareer(expandedCareer === idx ? null : idx)}
                        >
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-6">
                                 <div className={`text-2xl font-[900] font-heading w-16 ${career.match_percentage >= 70 ? 'text-brand-600' : 'text-[#6B6258]'}`}>
                                    {career.match_percentage}%
                                 </div>
                                 <div>
                                    <h4 className="text-base font-[900] text-slate-900 dark:text-white font-heading mb-1">{career.career_title}</h4>
                                    <p className="text-[10px] font-black text-[#6B6258] uppercase tracking-widest">{career.field} • <span className={getDemandColor(career.market_demand)}>{career.market_demand} Demand</span></p>
                                 </div>
                              </div>
                              <div className="w-10 h-10 rounded-xl bg-[#F1F1EF] dark:bg-slate-800 flex items-center justify-center text-[#6B6258] group-hover:bg-brand-600 group-hover:text-white transition-colors">
                                 {expandedCareer === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                              </div>
                           </div>

                           <AnimatePresence>
                              {expandedCareer === idx && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                   <div className="pt-8 mt-6 border-t border-[#EAE4DA] dark:border-slate-800">
                                      <p className="text-[#6B6258] dark:text-[#A09890] font-medium leading-relaxed mb-8">{career.description}</p>
                                      <div className="grid md:grid-cols-2 gap-8 mb-8">
                                         <div>
                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-4">Competent In</p>
                                            <div className="flex flex-wrap gap-2">
                                               {career.matched_skills.map((s, i) => <span key={i} className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase rounded-lg border border-emerald-100 dark:border-emerald-500/20">{s}</span>)}
                                            </div>
                                         </div>
                                         <div>
                                            <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-4">Growth Gaps</p>
                                            <div className="flex flex-wrap gap-2">
                                               {career.missing_skills.slice(0, 8).map((s, i) => <span key={i} className="px-3 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase rounded-lg border border-rose-100 dark:border-rose-500/20">{s}</span>)}
                                            </div>
                                         </div>
                                      </div>
                                      <div className="flex flex-wrap gap-6 text-[10px] font-black text-[#A09890] uppercase tracking-widest pt-6 border-t border-[#F1F1EF] dark:border-slate-800/50">
                                         <span>Range: {career.salary_range}</span>
                                         <span>Level: {career.experience_level}</span>
                                         <span>Growth: {career.growth_rate}</span>
                                      </div>
                                   </div>
                                </motion.div>
                              )}
                           </AnimatePresence>
                        </motion.div>
                      ))}
                   </div>
                </div>

                {/* Skills Expansion Roadmap with Premium Go-Corner Bubble Animation */}
                {analysis.skills_summary?.skills_to_learn?.length > 0 && (
                  <StyledUpskilling>
                    <div className="upskilling-card group">
                      
                      {/* Go-Corner Decoration */}
                      <div className="go-corner">
                        <div className="go-arrow">→</div>
                      </div>

                      <div className="card-content z-10 relative flex flex-col h-full justify-between">
                        <div>
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                            <div className="flex items-center gap-6">
                              <div className="w-16 h-16 bg-brand-600 rounded-[20px] flex items-center justify-center shadow-brand-lg text-white group-hover:bg-white group-hover:text-brand-600 transition-colors">
                                <Brain size={32} />
                              </div>
                              <div>
                                <h3 className="text-3xl font-[900] font-heading text-slate-900 dark:text-white group-hover:text-white transition-colors tracking-tight">Strategic Upskilling</h3>
                                <p className="text-[#6B6258] dark:text-[#A09890] group-hover:text-white/80 transition-colors font-medium text-sm mt-1">Master core competencies to unlock elite tier career paths.</p>
                              </div>
                            </div>
                            <div className="px-5 py-2 bg-[#FAFAF7] dark:bg-slate-900 border border-[#EAE4DA] dark:border-slate-800 rounded-full text-[10px] font-black text-[#6B6258] dark:text-[#A09890] uppercase tracking-[0.2em] group-hover:bg-white/20 group-hover:border-white/30 group-hover:text-white transition-all self-start md:self-auto shrink-0">
                              {analysis.skills_summary.skills_to_learn.length} Critical Targets
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
                            {analysis.skills_summary.skills_to_learn.map((skill, i) => (
                              <motion.div 
                                key={i}
                                whileHover={{ scale: 1.05, y: -3 }}
                                className="px-6 py-4 bg-[#FAFAF7] dark:bg-slate-900 border border-[#EAE4DA] dark:border-slate-800 rounded-[20px] text-xs font-black uppercase tracking-widest text-slate-700 dark:text-[#F5F0E8] group-hover:bg-white/10 group-hover:border-white/20 group-hover:text-white transition-all cursor-default text-center flex items-center justify-center backdrop-blur-md shadow-sm"
                              >
                                {skill}
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-[#EAE4DA] dark:border-slate-800 group-hover:border-white/20 transition-colors">
                          <div className="flex items-center gap-3 text-brand-600 group-hover:text-white font-black uppercase tracking-[0.2em] text-[10px] transition-colors">
                            <Zap size={14} className="animate-pulse" /> Hover to activate elite roadmap
                          </div>
                          <button className="w-full sm:w-auto px-8 py-4 bg-brand-600 text-white group-hover:bg-white group-hover:text-brand-600 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg hover:scale-105 transition-all">
                            Download Learning Path
                          </button>
                        </div>
                      </div>
                    </div>
                  </StyledUpskilling>
                )}
             </motion.div>
           )}
        </AnimatePresence>
      </motion.div>

      {/* Processing Overlay */}
      <ProcessingOverlay isVisible={loading} steps={ANALYSIS_STEPS} />
    </div>
  );
};

export default CareerAnalysisPage;

const StyledUpskilling = styled.div`
  .upskilling-card {
    display: block;
    position: relative;
    background-color: white;
    border: 1px solid #EAE4DA;
    border-radius: 40px;
    padding: 60px;
    text-decoration: none;
    z-index: 0;
    overflow: hidden;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
  }

  .dark .upskilling-card {
    background-color: #161310;
    border-color: #2A231A;
    box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.3);
  }

  .go-corner {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 48px;
    height: 48px;
    overflow: hidden;
    top: 0;
    right: 0;
    background-color: var(--brand-600);
    border-radius: 0 40px 0 32px;
    z-index: 2;
    transition: all 0.4s ease;
  }

  .go-arrow {
    margin-top: -6px;
    margin-right: -6px;
    color: white;
    font-size: 16px;
    font-weight: bold;
    font-family: 'Inter', sans-serif;
  }

  .upskilling-card:before {
    content: "";
    position: absolute;
    z-index: -1;
    top: -30px;
    right: -30px;
    background: linear-gradient(135deg, var(--brand-500), var(--brand-600));
    height: 60px;
    width: 60px;
    border-radius: 50%;
    transform: scale(1);
    transform-origin: 50% 50%;
    transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .upskilling-card:hover:before {
    transform: scale(35);
  }

  .upskilling-card:hover {
    border-color: var(--brand-600);
    box-shadow: 0 20px 40px -4px rgba(232, 135, 10, 0.2);
  }

  .dark .upskilling-card:hover {
    box-shadow: 0 20px 40px -4px rgba(232, 135, 10, 0.4);
  }

  .upskilling-card:hover .go-corner {
    background-color: white;
  }

  .upskilling-card:hover .go-arrow {
    color: var(--brand-600);
  }

  @media (max-width: 768px) {
    .upskilling-card {
      padding: 30px;
    }
  }
`;
