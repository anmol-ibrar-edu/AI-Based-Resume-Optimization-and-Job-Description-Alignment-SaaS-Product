import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { dashboardAPI, analysisAPI, reviewAPI } from '../services/api';
import Button from '../components/common/Button';
import AnimatedCounter from '../components/common/AnimatedCounter';
import { 
  FileText, TrendingUp, Award, Activity, Trash2, Plus, Zap, 
  Eye, Calendar, ArrowRight, Target, MessageSquare, Star, X, 
  ChevronRight, Loader2, Sparkles, BarChart3
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import hiredImg from '../assets/2.png';
import ResumeTypingPreview from '../components/common/ResumeTypingPreview';
import Loader from '../components/common/Loader';
import Rating from '../components/common/Rating';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const navigate = useNavigate();

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (reviewContent.trim().length < 10) {
      toast.error('Review must be at least 10 characters.');
      return;
    }
    setSubmittingReview(true);
    const toastId = toast.loading('Submitting review...');
    try {
      await reviewAPI.create({ content: reviewContent, rating: reviewRating });
      toast.success('Review submitted successfully! It will be visible after admin approval.', { id: toastId });
      setShowReviewModal(false);
      setReviewContent('');
      setReviewRating(5);
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit review.', { id: toastId });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteAnalysis = async (analysisId) => {
    if (!window.confirm('Are you sure you want to delete this analysis?')) {
      return;
    }

    const deleteToast = toast.loading('Deleting analysis...');
    try {
      await analysisAPI.delete(analysisId);
      const [statsResponse, historyResponse] = await Promise.all([
        dashboardAPI.getStats(),
        analysisAPI.getHistory(20),
      ]);
      setStats(statsResponse.data);
      setHistory(historyResponse.data);
      toast.success('Analysis removed from history', { id: deleteToast });
    } catch (error) {
      console.error('Failed to delete analysis:', error);
      toast.error('Failed to delete analysis. Please try again.', { id: deleteToast });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, historyResponse] = await Promise.all([
          dashboardAPI.getStats(),
          analysisAPI.getHistory(20),
        ]);
        setStats(statsResponse.data);
        setHistory(historyResponse.data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const latestScore = history.length > 0 ? Math.round(history[0].ats_score) : 0;
  const bestScore = stats?.best_score ? Math.round(stats.best_score) : 0;
  const improvement = stats?.improvement ? Math.round(stats.improvement) : 0;

  const getScoreStatus = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20' };
    if (score >= 60) return { label: 'Good', color: 'text-brand-600 dark:text-brand-400', bg: 'bg-brand-50 dark:bg-brand-900/20', border: 'border-brand-200 dark:border-brand-800' };
    if (score >= 40) return { label: 'Fair', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20' };
    return { label: 'Needs Improvement', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10', border: 'border-rose-200 dark:border-rose-500/20' };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#0D0B09] font-sans text-slate-900 dark:text-[#F5F0E8] pt-32 pb-24 relative overflow-hidden">
      <Helmet>
        <title>Command Center | ResumeAI</title>
        <meta name="description" content="Manage your resume optimization history and performance metrics." />
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-[#EAE4DA] dark:border-slate-800 text-brand-600 dark:text-brand-400 text-xs font-[900] uppercase tracking-[0.2em] mb-6 shadow-sm">
              <Activity size={14} className="animate-pulse" /> Analytics Center
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-[900] text-slate-900 dark:text-white font-heading tracking-tight mb-4">Command Center</h1>
            <p className="text-[#6B6258] dark:text-[#A09890] text-lg font-medium max-w-2xl leading-relaxed">
              Monitor your optimization trajectory and track real-time ATS compatibility performance.
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowReviewModal(true)}
              className="group flex items-center gap-3 px-6 py-4 bg-white dark:bg-slate-900 border border-[#EAE4DA] dark:border-slate-800 text-slate-700 dark:text-white rounded-2xl text-sm font-black transition-all hover:border-brand-400 shadow-sm"
            >
              <MessageSquare size={18} className="text-amber-500 group-hover:scale-110 transition-transform" /> Leave Feedback
            </button>
            <Link
              to="/upload"
              className="btn-primary px-8 py-4 shadow-brand-lg"
            >
              <Plus size={20} /> <span className="ml-2">New Analysis</span>
            </Link>
          </motion.div>
        </div>

        {/* Bento-style Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { 
              label: 'Global Scans', 
              value: stats?.total_analyses || 0, 
              icon: BarChart3, 
              color: 'text-brand-600', 
              bg: 'bg-brand-50 dark:bg-brand-900/10' 
            },
            { 
              label: 'Latest Score', 
              value: latestScore, 
              isPercent: true, 
              icon: Activity, 
              color: latestScore >= 70 ? 'text-emerald-600' : 'text-amber-600', 
              bg: latestScore >= 70 ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-amber-50 dark:bg-amber-500/10' 
            },
            { 
              label: 'Peak Match', 
              value: bestScore, 
              isPercent: true, 
              icon: Award, 
              color: 'text-indigo-600', 
              bg: 'bg-indigo-50 dark:bg-indigo-500/10' 
            },
            { 
              label: 'Growth Rate', 
              value: improvement, 
              isPercent: true, 
              showSign: true, 
              icon: TrendingUp, 
              color: improvement >= 0 ? 'text-emerald-600' : 'text-rose-600', 
              bg: improvement >= 0 ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-rose-50 dark:bg-rose-500/10' 
            }
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-[#161310] border border-[#EAE4DA] dark:border-slate-800 rounded-[32px] p-8 shadow-card group transition-all"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                  <stat.icon size={22} />
                </div>
                <span className="text-[10px] font-black text-[#6B6258] dark:text-[#A09890] uppercase tracking-[0.2em]">{stat.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-[900] text-slate-900 dark:text-white font-heading">
                   {stat.showSign && stat.value > 0 && '+'}
                   <AnimatedCounter value={Math.abs(stat.value)} duration={1000} />
                </span>
                {stat.isPercent && <span className="text-xl font-black text-[#6B6258] dark:text-[#A09890] opacity-50">%</span>}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Strategy Advice Banner */}
        {history.length > 0 && (
          <motion.div 
            variants={itemVariants}
            className="relative rounded-[40px] p-10 md:p-12 mb-16 border border-[#EAE4DA] dark:border-slate-800 overflow-hidden shadow-card"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-50/40 via-white to-white dark:from-brand-900/5 dark:via-[#161310] dark:to-[#161310] -z-10" />
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand-500/10 blur-[100px] rounded-full" />
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="flex items-start gap-8">
                <div className="w-16 h-16 bg-brand-600 rounded-[20px] flex items-center justify-center shadow-brand-lg shrink-0 mt-1">
                  <Sparkles size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-[900] text-slate-900 dark:text-white font-heading tracking-tight mb-3">Optimization Strategy</h3>
                  <p className="text-[#6B6258] dark:text-[#A09890] text-lg font-medium leading-relaxed max-w-3xl">
                    {latestScore < 50
                      ? 'Critical semantic gaps identified. We recommend re-scanning with a focus on core technical competencies and industry-standard keywords.'
                      : latestScore < 75
                        ? 'Strategic progress noted. Focus on quantifying your achievements with concrete metrics to bridge the final compatibility gap.'
                        : 'Elite performance tier reached. Your current document has a high probability of bypassing automated filters.'}
                  </p>
                </div>
              </div>
              <Link
                to="/upload"
                className="btn-primary whitespace-nowrap px-10 py-5 shadow-brand-lg"
              >
                Boost Score <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Recent Scan History */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-8 border-b border-[#EAE4DA] dark:border-slate-800 pb-6">
            <h2 className="text-3xl font-[900] text-slate-900 dark:text-white font-heading tracking-tight">Recent Scans</h2>
            {history.length > 0 && (
              <span className="text-xs font-black text-[#6B6258] dark:text-[#A09890] uppercase tracking-widest bg-[#FAFAF7] dark:bg-slate-900 px-4 py-2 rounded-full border border-[#EAE4DA] dark:border-slate-800">
                {history.length} Scans Found
              </span>
            )}
          </div>

          {history.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {history.slice(0, 6).map((item, idx) => {
                const scoreStatus = getScoreStatus(item.ats_score);
                return (
                  <motion.div
                    key={item.id}
                    layoutId={item.id}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-[#161310] border border-[#EAE4DA] dark:border-slate-800 rounded-[32px] p-5 md:p-8 shadow-card hover:shadow-card-hover transition-all group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-[#FAFAF7] dark:bg-slate-900 rounded-[20px] flex items-center justify-center border border-[#EAE4DA] dark:border-slate-800 group-hover:bg-brand-600 group-hover:text-white transition-all shadow-sm">
                          <FileText size={20} className="text-[#6B6258] dark:text-[#A09890] group-hover:text-white" />
                        </div>
                        <div className="overflow-hidden">
                          <h3 className="text-lg md:text-xl font-[900] text-slate-900 dark:text-white font-heading truncate max-w-[140px] xs:max-w-[200px] lg:max-w-xs mb-1" title={item.resume_filename}>
                            {item.resume_filename?.replace(/\.[^/.]+$/, '') || 'Document Scan'}
                          </h3>
                          <div className="flex items-center gap-2 text-[10px] md:text-xs font-black text-[#6B6258] dark:text-[#A09890] uppercase tracking-widest">
                            <Target size={10} className="text-brand-600" />
                            <span className="truncate max-w-[100px] xs:max-w-[150px]">{item.job_title || 'General Match'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-start w-full sm:w-auto">
                        <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${scoreStatus.bg} ${scoreStatus.color} ${scoreStatus.border} shadow-sm`}>
                          {scoreStatus.label}
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="flex justify-between items-end mb-4">
                        <span className="text-[10px] font-black text-[#6B6258] dark:text-[#A09890] uppercase tracking-[0.2em]">Match Accuracy</span>
                        <span className={`text-4xl font-[900] font-heading ${scoreStatus.color}`}>
                           {Math.round(item.ats_score)}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-[#F1F1EF] dark:bg-slate-900 rounded-full overflow-hidden p-0.5 border border-[#EAE4DA] dark:border-slate-800">
                        <motion.div 
                          className={`h-full rounded-full ${item.ats_score >= 80 ? 'bg-emerald-500' : item.ats_score >= 60 ? 'bg-brand-600' : 'bg-rose-500'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.ats_score}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-[#F1F1EF] dark:border-slate-800/50">
                      <div className="flex items-center gap-2 text-[10px] font-black text-[#6B6258] dark:text-[#A09890] uppercase tracking-widest">
                        <Calendar size={14} />
                        {new Date(item.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleDeleteAnalysis(item.id)}
                          className="w-10 h-10 flex items-center justify-center bg-[#FAFAF7] dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-[#6B6258] hover:text-rose-600 rounded-xl border border-[#EAE4DA] dark:border-slate-800 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`/results/${item.id}`)}
                          className="flex items-center gap-2 px-6 py-2 bg-white dark:bg-slate-900 hover:bg-brand-600 text-slate-900 dark:text-white hover:text-white rounded-xl border border-[#EAE4DA] dark:border-slate-800 hover:border-brand-600 font-black text-xs uppercase tracking-widest transition-all shadow-sm"
                        >
                          Details <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-[#161310] border border-[#EAE4DA] dark:border-slate-800 rounded-[40px] p-20 text-center flex flex-col items-center shadow-card"
            >
              <div className="relative mb-10 group">
                <div className="absolute -inset-4 bg-brand-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
                <ResumeTypingPreview />
              </div>
              <h3 className="text-3xl font-[900] text-slate-900 dark:text-white font-heading tracking-tight mb-4">No Scans Recorded</h3>
              <p className="text-[#6B6258] dark:text-[#A09890] max-w-sm mb-10 text-lg font-medium">Your optimization journey starts here. Upload your first resume to generate insights.</p>
              <Link
                to="/upload"
                className="btn-primary px-12 py-5 shadow-brand-lg"
              >
                Run First Analysis <ArrowRight className="ml-2" />
              </Link>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Modern Feedback Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReviewModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-[40px] p-10 md:p-12 max-w-xl w-full border border-[#EAE4DA] dark:border-slate-800 shadow-2xl relative z-10"
            >
              <button
                onClick={() => setShowReviewModal(false)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              <h3 className="text-3xl font-[900] text-slate-900 dark:text-white font-heading tracking-tight mb-3">User Feedback</h3>
              <p className="text-[#6B6258] dark:text-[#A09890] mb-10 font-medium leading-relaxed">Your experience drives our evolution. Share your insights on the ResumeAI platform.</p>
              
              <form onSubmit={handleSubmitReview}>
                <div className="mb-10">
                  <label className="block text-xs font-black text-[#6B6258] dark:text-[#A09890] uppercase tracking-[0.2em] mb-4">Sentiment Rating</label>
                  <div className="flex justify-start">
                    <Rating 
                      value={reviewRating} 
                      onChange={(star) => setReviewRating(star)} 
                      name="dashboard-review"
                    />
                  </div>
                </div>
                
                <div className="mb-10">
                  <label className="block text-xs font-black text-[#6B6258] dark:text-[#A09890] uppercase tracking-[0.2em] mb-4">Detailed Insights</label>
                  <textarea
                    className="w-full bg-[#FAFAF7] dark:bg-slate-950 border border-[#EAE4DA] dark:border-slate-800 rounded-3xl p-6 text-slate-900 dark:text-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-600 outline-none transition-all min-h-[160px] resize-none font-medium"
                    placeholder="Describe your experience with the optimization engine..."
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    required
                  ></textarea>
                </div>
                
                <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 px-8 py-4 bg-[#FAFAF7] dark:bg-slate-950 border border-[#EAE4DA] dark:border-slate-800 text-slate-700 dark:text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={submittingReview} 
                    className="flex-1 btn-primary shadow-brand-lg"
                  >
                    {submittingReview ? 'Processing...' : 'Submit Entry'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
