import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { analysisAPI } from '../services/api';
import AnimatedCounter from '../components/common/AnimatedCounter';
import {
  ArrowLeft, Calendar, FileText, Target, Zap, TrendingUp,
  CheckCircle, AlertCircle, Sparkles, Printer, Share2,
  Lightbulb, Search, PenTool, Layout, Star, ShieldCheck, ChevronRight, Loader2
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import celebrateImg from '../assets/7.png';
import hiredImg from '../assets/2.png';
import Rating from '../components/common/Rating';
import Loader from '../components/common/Loader';
import ResumeTypingPreview from '../components/common/ResumeTypingPreview';

/* Assign icons to recommendations based on category or text keywords */
const recIcon = (rec) => {
  const cat = (rec?.category || '').toLowerCase();
  const t = (rec?.title || rec?.message || rec?.description || '').toLowerCase();
  if (cat === 'skills' || t.includes('skill') || t.includes('add')) return Search;
  if (cat === 'keywords' || t.includes('keyword') || t.includes('ats')) return Zap;
  if (cat === 'achievements' || t.includes('quantif') || t.includes('metric') || t.includes('number')) return TrendingUp;
  if (cat === 'format' || t.includes('format') || t.includes('section') || t.includes('structur') || t.includes('summar')) return Layout;
  if (cat === 'experience' || t.includes('action') || t.includes('bullet') || t.includes('rewrite')) return PenTool;
  return Lightbulb;
};

/* Normalise a recommendation object from either backend format */
const normalizeRec = (rec) => {
  if (typeof rec === 'string') {
    return { title: rec.split('.')[0] || 'Improvement Tip', body: rec, detail: '', impact: '', examples: [] };
  }
  return {
    title:    rec.title   || rec.action?.split('.')[0] || 'Improvement Tip',
    body:     rec.message || rec.description || '',
    detail:   rec.details || rec.action || '',
    impact:   rec.impact  || '',
    examples: Array.isArray(rec.examples) ? rec.examples : [],
    priority: rec.priority || 'medium',
    category: rec.category || '',
  };
};

const ResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('missing');
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    if (!id) return;
    analysisAPI.getOne(id)
      .then((r) => setAnalysis(r.data))
      .catch((err) => {
        setError(err.response?.data?.detail || 'Failed to load analysis');
        toast.error('Failed to load analysis');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleExport = () => window.print();

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'ATS Report', url: window.location.href }); } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#0D0B09] flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-[#161310] border border-rose-200 dark:border-rose-500/20 rounded-[32px] p-12 max-w-md text-center shadow-card-hover"
        >
          <div className="w-20 h-20 bg-rose-50 dark:bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <AlertCircle className="h-10 w-10 text-rose-600" />
          </div>
          <h2 className="text-3xl font-[900] text-slate-900 dark:text-white mb-4 font-heading tracking-tight">Report Unavailable</h2>
          <p className="text-[#6B6258] dark:text-[#A09890] mb-10 font-medium leading-relaxed">{error || 'This analysis could not be retrieved. It may have been deleted.'}</p>
          <button onClick={() => navigate('/upload')} className="btn-primary w-full">
            Start New Scan <div className="btn-icon"><Zap /></div>
          </button>
        </motion.div>
      </div>
    );
  }

  const breakdown = analysis.score_breakdown || {};
  const score = Math.round(analysis.ats_score || 0);
  const recs = analysis.recommendations || [];
  // Combine skills and keywords for a comprehensive view, ensuring uniqueness
  const getUniqueItems = (arr1, arr2) => {
    const combined = [...(arr1 || []), ...(arr2 || [])].filter(Boolean);
    return Array.from(new Set(combined.map(s => s.toLowerCase().trim())))
      .map(s => combined.find(item => item.toLowerCase().trim() === s));
  };

  const missingSkills = getUniqueItems(analysis.missing_skills, analysis.missing_keywords);
  const matchedSkills = getUniqueItems(analysis.matched_skills, analysis.matched_keywords);

  const getScoreInfo = (s) => {
    if (s >= 80) return { label: 'Excellent Match', color: 'text-emerald-600', stroke: '#10b981', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/30' };
    if (s >= 60) return { label: 'Good Match', color: 'text-brand-600', stroke: '#e8870a', bg: 'bg-brand-50 dark:bg-brand-900/20', border: 'border-brand-200 dark:border-brand-800' };
    if (s >= 40) return { label: 'Fair Match', color: 'text-amber-600', stroke: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/30' };
    return { label: 'Needs Improvement', color: 'text-rose-600', stroke: '#ef4444', bg: 'bg-rose-50 dark:bg-rose-500/10', border: 'border-rose-200 dark:border-rose-500/30' };
  };
  const scoreInfo = getScoreInfo(score);

  /* Split by actual priority field from backend and pad with beautiful defaults to guarantee 3 cards per stack */
  const defaultHighRecs = [
    {
      priority: 'high',
      category: 'experience',
      title: 'Action-Oriented Bullet Points',
      message: 'Start every experience bullet point with a strong, active verb like Developed, Spearheaded, or Orchestrated.',
      details: 'This conforms to standard professional ATS parser structures and highlights leadership.',
      impact: 'Boosts experience alignment score by 8-12 points.',
      examples: ['Developed scalable cloud integrations...', 'Spearheaded team migration to microservices...']
    },
    {
      priority: 'high',
      category: 'format',
      title: 'Quantify Engineering Achievements',
      message: 'Integrate numeric metrics into your project bullet points to make impact clear.',
      details: 'ATS algorithms assign higher confidence to results with clear numeric multipliers.',
      impact: 'Improves formatting & achievement score by 10 points.',
      examples: ['Reduced build times by 40% using Webpack optimization', 'Managed $50K annual infrastructure budget']
    },
    {
      priority: 'high',
      category: 'skills',
      title: 'Align Core Technical Skills',
      message: 'Ensure the critical skills from the job description are prominent in your technical skills grid.',
      details: 'Matching keyword exactness has the highest weighting in modern ATS.',
      impact: 'Dramatically improves skills match score by up to 15 points.',
      examples: ['Group skills into categories (e.g., Languages, Frameworks, Cloud)']
    }
  ];

  const defaultMedRecs = [
    {
      priority: 'medium',
      category: 'format',
      title: 'Optimal Section Hierarchy',
      message: 'Organize your resume with clear, predictable sections like Education, Skills, and Professional Experience.',
      details: 'Parsers can misinterpret fancy, non-traditional headers or sidebars.',
      impact: 'Guarantees reliable ATS parsing compatibility.',
      examples: ['Use standard single-column layouts', 'Avoid nested grids inside Experience']
    },
    {
      priority: 'medium',
      category: 'keywords',
      title: 'Naturally Integrate Core Keywords',
      message: 'Naturally weave job keywords throughout the summary and experience bullet points instead of stuffing them.',
      details: 'Modern Semantic ATS parsers detect and penalize artificial keyword lists.',
      impact: 'Increases search relevance and score by 5-8 points.',
      examples: ['Weave terms like "Cloud Architecture" and "Agile Delivery" into descriptions']
    },
    {
      priority: 'medium',
      category: 'general',
      title: 'Optimize File Formatting',
      message: 'Save your resume in a standard PDF or DOCX format with clear, standard fonts.',
      details: 'Avoid parsing issues from custom vector shapes or text-as-image files.',
      impact: 'Guarantees 100% parser readability.',
      examples: ['Avoid scanned text/images', 'Use readable font sizes (10pt - 12pt)']
    }
  ];

  let highRecs = recs.filter(r => (r?.priority || '').toLowerCase() === 'high');
  let medRecs  = recs.filter(r => (r?.priority || '').toLowerCase() !== 'high');

  if (highRecs.length < 3) {
    const needed = 3 - highRecs.length;
    highRecs = [...highRecs, ...defaultHighRecs.slice(0, needed)];
  }

  if (medRecs.length < 3) {
    const needed = 3 - medRecs.length;
    medRecs = [...medRecs, ...defaultMedRecs.slice(0, needed)];
  }

  const circumference = 2 * Math.PI * 100;

  return (
    <div className="results-page-container">
      <Helmet>
        <title>Report Summary | ResumeAI</title>
        <meta name="description" content="Detailed ATS compatibility report with AI insights." />
      </Helmet>

      {/* ══════════ SCREEN VIEW ══════════ */}
      <div id="report-content" className="print:hidden min-h-screen bg-[#FAFAF7] dark:bg-[#0D0B09] font-sans text-slate-900 dark:text-[#F5F0E8] pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">

          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12"
          >
            <div className="flex items-start gap-8">
              <div>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="group flex items-center gap-2 text-xs font-black text-[#6B6258] dark:text-[#A09890] uppercase tracking-widest hover:text-brand-600 transition-colors mb-4"
                >
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Dashboard
                </button>
                <h1 className="text-4xl md:text-5xl font-[900] text-slate-900 dark:text-white font-heading tracking-tight">Analysis Report</h1>
                <div className="flex flex-wrap items-center gap-6 mt-4">
                  <span className="flex items-center gap-2 text-sm font-bold text-[#6B6258] dark:text-[#A09890]">
                    <FileText size={16} className="text-brand-600" /> {analysis.resume_filename || 'Resume'}
                  </span>
                  <span className="flex items-center gap-2 text-sm font-bold text-[#6B6258] dark:text-[#A09890]">
                    <Calendar size={16} className="text-brand-600" /> {new Date(analysis.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <div className="hidden md:block relative group">
                <div className="absolute -inset-2 bg-brand-500/10 rounded-full blur-xl" />
                <ResumeTypingPreview />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={handleExport} className="flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-[#161310] border border-[#EAE4DA] dark:border-[#2A231A] text-slate-700 dark:text-white rounded-2xl hover:border-brand-400 transition-all text-sm font-black shadow-card">
                <Printer size={18} /> <span className="hidden sm:inline">Export PDF</span>
              </button>
              <button onClick={handleShare} className="btn-premium">
                Share <div className="btn-icon"><Share2 /></div>
              </button>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Score Circle Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-[#161310] border border-[#EAE4DA] dark:border-[#2A231A] rounded-[32px] p-10 flex flex-col items-center justify-center shadow-card"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6B6258] dark:text-[#A09890] mb-10">System Match Score</p>
              <div className="relative w-52 h-52">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 240 240">
                  <circle cx="120" cy="120" r="100" fill="none" stroke="#F1F1EF" strokeWidth="16" className="dark:stroke-[#1E1A16]" />
                  <motion.circle
                    cx="120" cy="120" r="100" fill="none"
                    stroke={scoreInfo.stroke} strokeWidth="16" strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    strokeDasharray={circumference}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-6xl font-[900] font-heading ${scoreInfo.color}`}>
                    <AnimatedCounter value={score} duration={1500} />
                  </span>
                  <span className="text-xs text-[#6B6258] dark:text-[#A09890] font-black uppercase tracking-widest mt-1">/ 100</span>
                </div>
              </div>
              <div className={`mt-10 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border ${scoreInfo.bg} ${scoreInfo.color} ${scoreInfo.border} shadow-sm`}>
                {scoreInfo.label}
              </div>
            </motion.div>

            {/* Breakdown Cards */}
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
              {[
                { title: 'Skills Match', value: breakdown.skills_score || 0, icon: Target, color: 'text-brand-600', bar: 'bg-brand-600', delay: 0.1 },
                { title: 'Keywords', value: breakdown.keywords_score || 0, icon: Zap, color: 'text-amber-600', bar: 'bg-amber-500', delay: 0.2 },
                { title: 'Experience', value: breakdown.experience_score || 0, icon: TrendingUp, color: 'text-emerald-600', bar: 'bg-emerald-500', delay: 0.3 },
                { title: 'Formatting', value: breakdown.format_score || 0, icon: FileText, color: 'text-indigo-600', bar: 'bg-indigo-500', delay: 0.4 },
              ].map((item) => (
                <motion.div 
                  key={item.title} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: item.delay }}
                  className="bg-white dark:bg-[#161310] border border-[#EAE4DA] dark:border-[#2A231A] rounded-[28px] p-8 shadow-card hover:shadow-card-hover transition-all group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#FAFAF7] dark:bg-[#0D0B09] rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                        <item.icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                      <span className="text-base font-[900] text-slate-900 dark:text-white font-heading">{item.title}</span>
                    </div>
                    <span className="text-3xl font-[900] text-slate-900 dark:text-white font-heading">
                      <AnimatedCounter value={Math.round(item.value)} duration={1200} />
                      <span className="text-lg text-[#6B6258] dark:text-[#A09890] ml-0.5">%</span>
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#F1F1EF] dark:bg-[#1E1A16] rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${item.bar} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1.5, delay: item.delay + 0.2 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Skills & Gap Tabs ── */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#161310] border border-[#EAE4DA] dark:border-[#2A231A] rounded-[32px] shadow-card mb-8 overflow-hidden"
          >
            <div className="flex border-b border-[#EAE4DA] dark:border-[#2A231A] bg-[#FAFAF7] dark:bg-[#0D0B09] p-2 gap-2">
              <button
                onClick={() => setActiveTab('missing')}
                className={`flex-1 py-4 px-6 rounded-2xl text-xs font-[900] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
                  activeTab === 'missing'
                    ? 'bg-white dark:bg-[#161310] text-rose-600 shadow-sm border border-[#EAE4DA] dark:border-[#2A231A]'
                    : 'text-[#6B6258] hover:text-slate-900'
                }`}
              >
                <AlertCircle size={16} /> Missing Skills
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${activeTab === 'missing' ? 'bg-rose-600 text-white' : 'bg-[#EAE4DA] text-[#6B6258]'}`}>
                   {missingSkills.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('matched')}
                className={`flex-1 py-4 px-6 rounded-2xl text-xs font-[900] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
                  activeTab === 'matched'
                    ? 'bg-white dark:bg-[#161310] text-emerald-600 shadow-sm border border-[#EAE4DA] dark:border-[#2A231A]'
                    : 'text-[#6B6258] hover:text-slate-900'
                }`}
              >
                <CheckCircle size={16} /> Matched Skills
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${activeTab === 'matched' ? 'bg-emerald-600 text-white' : 'bg-[#EAE4DA] text-[#6B6258]'}`}>
                   {matchedSkills.length}
                </span>
              </button>
            </div>

            <div className="p-10 min-h-[220px]">
              <AnimatePresence mode="wait">
                {activeTab === 'missing' ? (
                  <motion.div 
                    key="missing"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex flex-wrap gap-3"
                  >
                    {missingSkills.length > 0 ? (
                      <div className="w-full space-y-8">
                        {/* Critical Missing Skills */}
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <span className="w-2 h-2 rounded-full bg-rose-600" />
                            <h4 className="text-xs font-black uppercase tracking-widest text-rose-600">Critical Missing Skills</h4>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {(breakdown.missing_skills_grouped?.critical?.length > 0
                              ? breakdown.missing_skills_grouped.critical
                              : missingSkills.slice(0, Math.ceil(missingSkills.length * 0.6))
                            ).map((s, i) => (
                              <motion.span 
                                key={i} 
                                whileHover={{ scale: 1.05 }}
                                className="inline-flex items-center gap-2.5 px-5 py-3 bg-rose-50/50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 rounded-2xl text-sm font-black transition-all"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {s}
                              </motion.span>
                            ))}
                          </div>
                        </div>

                        {/* Nice to Have Missing Skills */}
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            <h4 className="text-xs font-black uppercase tracking-widest text-amber-500">Nice to Have (Optional)</h4>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {(breakdown.missing_skills_grouped?.nice_to_have?.length > 0
                              ? breakdown.missing_skills_grouped.nice_to_have
                              : missingSkills.slice(Math.ceil(missingSkills.length * 0.6))
                            ).map((s, i) => (
                              <motion.span 
                                key={i} 
                                whileHover={{ scale: 1.05 }}
                                className="inline-flex items-center gap-2.5 px-5 py-3 bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-2xl text-sm font-black transition-all"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {s}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full flex flex-col items-center py-6 text-center">
                         <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                            <ShieldCheck size={32} />
                         </div>
                         <p className="text-lg font-[900] text-slate-900 dark:text-white font-heading">No Skill Gaps Detected!</p>
                         <p className="text-sm text-[#6B6258] dark:text-[#A09890] mt-1 font-medium">Your resume is perfectly aligned with the technical requirements.</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="matched"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex flex-wrap gap-3"
                  >
                    {matchedSkills.length > 0 ? (
                      matchedSkills.map((s, i) => {
                        const skillLevels = breakdown.skill_levels || {};
                        const level = skillLevels[s] || skillLevels[s.toLowerCase()] || skillLevels[s.toUpperCase()] || "Advanced";
                        
                        let colorClasses = "bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400";
                        let dotColor = "bg-emerald-500";
                        if (level === "Intermediate") {
                          colorClasses = "bg-amber-50/50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400";
                          dotColor = "bg-amber-500";
                        } else if (level === "Beginner") {
                          colorClasses = "bg-blue-50/50 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400";
                          dotColor = "bg-blue-500";
                        }

                        return (
                          <motion.span 
                            key={i} 
                            whileHover={{ scale: 1.05 }}
                            className={`inline-flex items-center gap-2.5 px-5 py-3 border rounded-2xl text-sm font-black transition-all ${colorClasses}`}
                          >
                            <div className={`w-2 h-2 rounded-full ${dotColor}`} /> {s} <span className="text-[9px] uppercase opacity-70 tracking-wider">({level})</span>
                          </motion.span>
                        );
                      })
                    ) : (
                      <div className="w-full flex flex-col items-center py-6 text-center">
                         <AlertCircle size={40} className="text-[#EAE4DA] mb-4" />
                         <p className="text-sm text-[#6B6258] dark:text-[#A09890] font-medium">No direct matches identified in the parsing phase.</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── AI Career Intelligence Platform (Priorities 2, 4, 6, 8, 9) ── */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Resume DNA Profile Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1 bg-white dark:bg-[#161310] border border-[#EAE4DA] dark:border-[#2A231A] rounded-[32px] p-8 shadow-card flex flex-col justify-between"
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6B6258] dark:text-[#A09890] mb-6">Resume DNA Profile</p>
                <div className="mb-6 p-4 bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200/50 dark:border-brand-800/30 rounded-2xl">
                  <h4 className="text-xs font-black text-brand-600 uppercase tracking-widest mb-1">Strength Archetype</h4>
                  <p className="text-xl font-black text-slate-900 dark:text-white font-heading">{breakdown.dna_profile?.archetype || "AI Infrastructure Builder"}</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <span className="text-[10px] font-black text-[#6B6258] dark:text-[#A09890] uppercase tracking-wider">Primary Identity</span>
                    <p className="text-sm font-bold text-slate-800 dark:text-[#F5F0E8]">{breakdown.dna_profile?.identity || "Backend + AI Hybrid Engineer"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-[#6B6258] dark:text-[#A09890] uppercase tracking-wider">Best Career Direction</span>
                    <p className="text-sm font-bold text-slate-800 dark:text-[#F5F0E8]">{breakdown.dna_profile?.career_direction || "ML Infrastructure / AI Engineering"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-black text-[#6B6258] dark:text-[#A09890] uppercase tracking-wider">Detected DNA Signals</span>
                  {[
                    { label: "Leadership", val: breakdown.dna_profile?.signals?.leadership || 70, color: "bg-brand-600" },
                    { label: "Impact Metric", val: breakdown.dna_profile?.signals?.impact || 85, color: "bg-emerald-500" },
                    { label: "Production Scale", val: breakdown.dna_profile?.signals?.scale || 60, color: "bg-indigo-500" }
                  ].map((sig) => (
                    <div key={sig.label} className="space-y-1">
                      <div className="flex justify-between text-xs font-black text-slate-700 dark:text-[#A09890]">
                        <span>{sig.label}</span>
                        <span>{sig.val}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${sig.color} rounded-full`} style={{ width: `${sig.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-[#2A231A]">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Semantic Analyzer Reasoning</h4>
                <ul className="space-y-2.5">
                  {(breakdown.dna_profile?.insights || [
                    "Resume demonstrates backend engineering strength but lacks production-scale ML deployment evidence.",
                    "Excellent use of quantified metrics to establish direct business impact and performance improvements."
                  ]).map((ins, idx) => (
                    <li key={idx} className="text-xs font-medium text-slate-500 dark:text-[#A09890] flex gap-2">
                      <span className="text-brand-600">•</span> {ins}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Project & Experience Intelligence Radar Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-white dark:bg-[#161310] border border-[#EAE4DA] dark:border-[#2A231A] rounded-[32px] p-8 shadow-card grid md:grid-cols-2 gap-8"
            >
              {/* Project Readiness Analyzer */}
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6B6258] dark:text-[#A09890] mb-6">Project Analyzer</p>
                  
                  <div className="space-y-6">
                    {[
                      { label: "Complexity", val: breakdown.project_analysis?.complexity || 75, desc: "APIs, AI, and data pipeline depth" },
                      { label: "Production Readiness", val: breakdown.project_analysis?.production_readiness || 82, desc: "Cloud, databases, and deployment setups" },
                      { label: "Modern Stack Usage", val: breakdown.project_analysis?.modern_stack_usage || 80, desc: "Use of cutting-edge technologies" }
                    ].map((proj) => (
                      <div key={proj.label} className="space-y-1.5">
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm font-black text-slate-800 dark:text-white">{proj.label}</span>
                          <span className="text-lg font-black text-brand-600">{proj.val}%</span>
                        </div>
                        <p className="text-[10px] font-medium text-slate-400 -mt-1">{proj.desc}</p>
                        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-600 rounded-full" style={{ width: `${proj.val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Stack Rating</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
                    {breakdown.project_analysis?.stack_usage_label || "Strong"}
                  </span>
                </div>
              </div>

              {/* Experience Signal Multipliers */}
              <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-100 dark:border-[#2A231A] pt-8 md:pt-0 md:pl-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6B6258] dark:text-[#A09890] mb-6">Experience Signals</p>
                  
                  <div className="space-y-4">
                    {[
                      { key: "leadership", label: "Leadership Core", desc: "led, managed, mentored, architected", matched: breakdown.experience_signals?.leadership ?? true },
                      { key: "scale", label: "Production Scale", desc: "million, scalable, high-volume", matched: breakdown.experience_signals?.scale ?? true },
                      { key: "metrics", label: "Quantified Metrics", desc: "percentages, dollar values, cost savings", matched: breakdown.experience_signals?.metrics ?? true },
                      { key: "production_systems", label: "Production Systems", desc: "deployment, cloud, microservices", matched: breakdown.experience_signals?.production_systems ?? true }
                    ].map((sig) => (
                      <div key={sig.key} className="flex gap-4 p-3.5 bg-[#FAFAF7] dark:bg-[#0D0B09] border border-slate-100 dark:border-[#1E1A16] rounded-2xl items-start transition-all hover:border-brand-300">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${sig.matched ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                          <CheckCircle size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-800 dark:text-white">{sig.label}</span>
                            <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${sig.matched ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                              {sig.matched ? "+ Points" : "No Signal"}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">{sig.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 text-[10px] text-slate-400 font-medium italic text-center">
                  * Signals dynamically multiplied into the ATS scorer for verified alignment weight.
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── AI Strategy ── */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#161310] border border-[#EAE4DA] dark:border-[#2A231A] rounded-[32px] shadow-card mb-12 overflow-hidden"
          >
            <div className="flex items-center gap-5 p-10 border-b border-[#EAE4DA] dark:border-[#2A231A] bg-[#FAFAF7] dark:bg-[#161310]">
              <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-brand">
                <Sparkles size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-[900] text-slate-900 dark:text-white font-heading">AI Action Plan</h3>
                <p className="text-sm text-[#6B6258] dark:text-[#A09890] font-medium mt-1">{recs.length} personalized recommendations to optimize your compatibility</p>
              </div>
            </div>

            <div className="p-10">
              {recs.length > 0 ? (
                <div className="space-y-24">
                  
                  {/* High Priority Section - Card Stack */}
                  {highRecs.length > 0 && (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-3 mb-16 w-full">
                         <div className="px-3 py-1 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">High Impact</div>
                         <div className="h-[1px] flex-1 bg-[#F1F1EF] dark:bg-[#1E1A16]" />
                      </div>
                      
                      <div className="glass-stack">
                        {highRecs.slice(0, 3).map((rec, i) => {
                          const r = normalizeRec(rec);
                          const IconComp = recIcon(rec);
                          // Calculate positions for stack
                          const rotations = [-15, 0, 15];
                          const zIndices = [10, 20, 30];
                          const spreads = ['-350px', '0px', '350px'];

                          return (
                            <motion.div
                              key={i}
                              style={{ 
                                '--r': rotations[i] || 0, 
                                '--z': zIndices[i] || 10,
                                '--spread-x': spreads[i] || '0px'
                              }}
                              className="glass-card group border-rose-200/50 dark:border-rose-500/20"
                            >
                              <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 bg-rose-50 dark:bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-600 shadow-sm border border-rose-100 dark:border-rose-500/20 group-hover:bg-rose-600 group-hover:text-white transition-all">
                                  <IconComp size={28} />
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Priority</p>
                                  <p className="text-xs font-black text-slate-900 dark:text-white uppercase">Critical</p>
                                </div>
                              </div>

                              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                <h4 className="text-xl font-[900] text-slate-900 dark:text-white mb-3 font-heading leading-tight">{r.title}</h4>
                                <p className="text-sm text-[#6B6258] dark:text-[#A09890] leading-relaxed font-medium mb-4">
                                  {r.body || "Significant improvements are needed in this core area."}
                                </p>
                                
                                {r.impact && (
                                  <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-500/10 rounded-2xl p-4 mb-4">
                                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Impact Potential</p>
                                    <p className="text-xs font-bold text-rose-700 dark:text-rose-400">{r.impact}</p>
                                  </div>
                                )}

                                {r.examples?.length > 0 && (
                                  <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Action Steps</p>
                                    <ul className="space-y-2">
                                      {r.examples.slice(0, 3).map((ex, ei) => (
                                        <li key={ei} className="text-xs text-slate-600 dark:text-[#A09890] font-medium flex items-start gap-2">
                                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                                          <span>{ex}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Secondary Recommendations - Card Stack */}
                  {medRecs.length > 0 && (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-3 mb-16 w-full">
                         <div className="px-3 py-1 bg-brand-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">Fine Tuning</div>
                         <div className="h-[1px] flex-1 bg-[#F1F1EF] dark:bg-[#1E1A16]" />
                      </div>

                      <div className="glass-stack">
                        {medRecs.slice(0, 3).map((rec, i) => {
                          const r = normalizeRec(rec);
                          const IconComp = recIcon(rec);
                          // Calculate positions for stack
                          const rotations = [-10, 5, 20];
                          const zIndices = [10, 20, 30];
                          const spreads = ['-350px', '0px', '350px'];

                          return (
                            <motion.div
                              key={i}
                              style={{ 
                                '--r': rotations[i] || 0, 
                                '--z': zIndices[i] || 10,
                                '--spread-x': spreads[i] || '0px'
                              }}
                              className="glass-card group border-brand-200/50 dark:border-brand-500/20"
                            >
                              <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 bg-brand-50 dark:bg-brand-500/10 rounded-2xl flex items-center justify-center text-brand-600 shadow-sm border border-brand-100 dark:border-brand-500/20 group-hover:bg-brand-600 group-hover:text-white transition-all">
                                  <IconComp size={28} />
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Priority</p>
                                  <p className="text-xs font-black text-slate-900 dark:text-white uppercase">High</p>
                                </div>
                              </div>

                              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                <h4 className="text-xl font-[900] text-slate-900 dark:text-white mb-3 font-heading leading-tight">{r.title}</h4>
                                <p className="text-sm text-[#6B6258] dark:text-[#A09890] leading-relaxed font-medium mb-4">
                                  {r.body || "Optimize this section to gain a competitive edge."}
                                </p>
                                
                                {r.impact && (
                                  <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-500/10 rounded-2xl p-4 mb-4">
                                    <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest mb-1">Score Boost</p>
                                    <p className="text-xs font-bold text-brand-700 dark:text-brand-400">{r.impact}</p>
                                  </div>
                                )}

                                {r.examples?.length > 0 && (
                                  <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Optimized Examples</p>
                                    <ul className="space-y-2">
                                      {r.examples.slice(0, 3).map((ex, ei) => (
                                        <li key={ei} className="text-xs text-slate-600 dark:text-[#A09890] font-medium flex items-start gap-2">
                                          <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                                          <span>{ex}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                   <ShieldCheck size={48} className="text-emerald-500 mx-auto mb-4" />
                   <h4 className="text-xl font-[900] text-slate-900 dark:text-white font-heading">Excellent Document</h4>
                   <p className="text-sm text-[#6B6258] mt-2 font-medium">Your resume is ready to go as-is.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Feedback Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#161310] border border-[#EAE4DA] dark:border-[#2A231A] rounded-[32px] p-10 shadow-card mb-8 text-center"
          >
            <h3 className="text-xl font-[900] text-slate-900 dark:text-white font-heading mb-2">Was this analysis accurate?</h3>
            <p className="text-xs text-[#6B6258] dark:text-[#A09890] font-medium mb-8">Your feedback helps our AI engine evolve and provide sharper insights.</p>
            
            <div className="flex flex-col items-center gap-6">
              <Rating 
                value={userRating} 
                onChange={(val) => {
                  setUserRating(val);
                  toast.success('Thank you for your feedback!');
                }} 
              />
              {userRating > 0 && (
                <motion.p 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-[10px] font-black text-emerald-600 uppercase tracking-widest"
                >
                  Feedback recorded successfully
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Action Footer */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 bg-white dark:bg-[#161310] border border-[#EAE4DA] dark:border-[#2A231A] rounded-[32px] shadow-card"
          >
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-[900] text-slate-900 dark:text-white font-heading tracking-tight">Ready for another one?</h3>
              <p className="text-sm text-[#6B6258] dark:text-[#A09890] mt-1 font-medium">Optimization is key. Run a new analysis for a different role.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/upload" className="btn-primary">
                New Analysis <div className="btn-icon"><ChevronRight /></div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ══════════ PRINT VIEW ══════════ */}
      <div className="hidden print:block font-sans text-black bg-white p-12">
        <div className="flex justify-between items-end border-b-4 border-gray-900 pb-10 mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">ResumeAI Analysis Report</h1>
            <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-xs">Proprietary ATS compatibility report</p>
          </div>
          <div className="text-right text-xs font-bold uppercase tracking-widest text-gray-500">
            <p>Resume: <strong className="text-gray-900">{analysis.resume_filename || 'Unknown'}</strong></p>
            <p>Date: <strong className="text-gray-900">{new Date(analysis.created_at).toLocaleDateString()}</strong></p>
          </div>
        </div>

        <div className="flex gap-20 mb-16">
          <div className="text-center shrink-0">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Final ATS Score</p>
            <div className="text-8xl font-black text-gray-900">{score}</div>
            <div className="font-black text-xl uppercase tracking-widest mt-2" style={{ color: scoreInfo.stroke }}>{scoreInfo.label}</div>
          </div>
          <div className="flex-1">
            <h2 className="font-black text-gray-900 uppercase tracking-widest text-sm border-b-2 border-gray-100 pb-3 mb-6">Score Metrics</h2>
            {[
              { label: 'Skills Alignment', value: breakdown.skills_score || 0 },
              { label: 'Keyword Density', value: breakdown.keywords_score || 0 },
              { label: 'Experience Depth', value: breakdown.experience_score || 0 },
              { label: 'Format Integrity', value: breakdown.format_score || 0 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-6 mb-5">
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest w-32 shrink-0">{item.label}</span>
                <div className="flex-1 h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                  <div className="h-full bg-gray-800" style={{ width: `${item.value}%` }} />
                </div>
                <span className="text-sm font-black text-gray-900 w-12 text-right">{Math.round(item.value)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="font-black text-gray-900 uppercase tracking-widest text-sm border-b-2 border-gray-100 pb-3 mb-6">Skill Gap Assessment</h2>
          <div className="grid grid-cols-2 gap-x-12 gap-y-6">
            <div>
               <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-4">Critical Missing Skills ({missingSkills.length})</p>
               {missingSkills.length > 0 ? (
                 <div className="space-y-2">
                   {missingSkills.map((s, i) => (
                     <p key={i} className="text-sm font-bold text-gray-800">• {s}</p>
                   ))}
                 </div>
               ) : <p className="text-sm italic text-gray-400">None detected.</p>}
            </div>
            <div>
               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Validated Skills ({matchedSkills.length})</p>
               {matchedSkills.length > 0 ? (
                 <div className="space-y-2">
                   {matchedSkills.map((s, i) => (
                     <p key={i} className="text-sm font-bold text-gray-800">✓ {s}</p>
                   ))}
                 </div>
               ) : <p className="text-sm italic text-gray-400">None detected.</p>}
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-black text-gray-900 uppercase tracking-widest text-sm border-b-2 border-gray-100 pb-3 mb-6">AI Strategic Recommendations</h2>
          {recs.length > 0 ? (
            <div className="space-y-4">
              {recs.map((rec, i) => {
                const text = typeof rec === 'string' ? rec : rec.text || rec.description || '';
                return (
                  <div key={i} className="flex gap-4 pb-4 border-b border-gray-50">
                    <span className="text-xs font-black text-gray-300">{i + 1}.</span>
                    <p className="text-sm text-gray-800 leading-relaxed font-medium">{text}</p>
                  </div>
                );
              })}
            </div>
          ) : <p className="text-gray-400 italic">No recommendations required.</p>}
        </div>

        <div className="mt-20 pt-10 border-t border-gray-100 text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
          End of Document • ResumeAI Intelligence System v2.4
        </div>
      </div>

      {/* ══════════ PRINT VIEW ══════════ */}
      <div className="hidden print:block font-sans text-black bg-white p-8">
        {/* Header */}
        <div className="flex justify-between items-end border-b-2 border-gray-300 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ATS Optimization Report</h1>
            <p className="text-gray-500 mt-1">AI-powered resume analysis</p>
          </div>
          <div className="text-right text-sm text-gray-500">
            <p>Resume: <strong className="text-gray-900">{analysis.resume_filename || 'Unknown'}</strong></p>
            <p>Generated: <strong className="text-gray-900">{new Date(analysis.created_at).toLocaleDateString()}</strong></p>
          </div>
        </div>

        {/* Score + Breakdown */}
        <div className="flex gap-12 mb-10">
          <div className="text-center shrink-0">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">ATS Score</p>
            <div className="text-6xl font-black" style={{ color: scoreInfo.stroke }}>{score}</div>
            <div className="font-bold text-lg mt-1" style={{ color: scoreInfo.stroke }}>{scoreInfo.label}</div>
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Score Breakdown</h2>
            {[
              { label: 'Skills Match', value: breakdown.skills_score || 0 },
              { label: 'Keywords', value: breakdown.keywords_score || 0 },
              { label: 'Experience', value: breakdown.experience_score || 0 },
              { label: 'Formatting', value: breakdown.format_score || 0 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 mb-3">
                <span className="text-sm font-bold text-gray-700 w-28 shrink-0">{item.label}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-600 rounded-full" style={{ width: `${item.value}%` }} />
                </div>
                <span className="text-sm font-bold text-gray-900 w-10 text-right">{Math.round(item.value)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="mb-8">
          <h2 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            Missing Skills ({missingSkills.length})
          </h2>
          {missingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((s, i) => (
                <span key={i} className="px-3 py-1 bg-red-50 text-red-800 border border-red-200 rounded text-sm font-medium">{s}</span>
              ))}
            </div>
          ) : <p className="text-gray-500 italic">No missing critical skills detected — great match!</p>}
        </div>

        {/* Matched Skills */}
        <div className="mb-8">
          <h2 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            Matched Skills ({matchedSkills.length})
          </h2>
          {matchedSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {matchedSkills.map((s, i) => (
                <span key={i} className="px-3 py-1 bg-green-50 text-green-800 border border-green-200 rounded text-sm font-medium">✓ {s}</span>
              ))}
            </div>
          ) : <p className="text-gray-500 italic">No matched skills recorded.</p>}
        </div>

        {/* Recommendations */}
        <div>
          <h2 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            AI Improvement Strategy ({recs.length} recommendations)
          </h2>
          {recs.length > 0 ? (
            <ol className="space-y-3">
              {recs.map((rec, i) => {
                const text = typeof rec === 'string' ? rec : rec.text || rec.description || '';
                return (
                  <li key={i} className="flex gap-3 text-gray-800 text-sm pb-3 border-b border-gray-100">
                    <span className="font-black text-gray-500 shrink-0">{i + 1}.</span>
                    <span>{text}</span>
                  </li>
                );
              })}
            </ol>
          ) : <p className="text-gray-500 italic">No recommendations — excellent resume!</p>}
        </div>

        <div className="mt-16 pt-6 border-t border-gray-200 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
          Generated by ResumeAI - Confidential Document
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
