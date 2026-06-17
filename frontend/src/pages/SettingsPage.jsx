import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { userAPI } from '../services/api';
import { 
  Zap, Key, Eye, EyeOff, Save, ExternalLink, ShieldAlert,
  ArrowLeft, CheckCircle2, ChevronRight, HelpCircle, Laptop
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SettingsPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-1.5-flash');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const res = await userAPI.getMe();
        if (res.data) {
          setApiKey(res.data.gemini_api_key || '');
          setModel(res.data.gemini_model || 'gemini-1.5-flash');
        }
      } catch (err) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userAPI.update({
        gemini_api_key: apiKey || null,
        gemini_model: model,
      });
      toast.success('Settings updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const MODELS = [
    { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Super Fast & Light)', desc: 'Best for standard resumes and lightning-fast optimization responses.' },
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (Extremely Smart & Thorough)', desc: 'Deep contextual understanding. Highly accurate missing keyword mapping.' },
    { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (Latest Balanced)', desc: 'Optimized for high-speed analysis and state-of-the-art recommendation quality.' },
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (Premium Quality)', desc: 'Premium analysis with excellent tone adjustment and active-voice summaries.' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#0D0B09] font-sans text-slate-900 dark:text-[#F5F0E8] pt-32 pb-24 relative overflow-hidden">
      <Helmet>
        <title>Settings & API | ResumeAI</title>
      </Helmet>

      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-6">
        
        {/* Back Link */}
        <Link 
          to="/upload" 
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-brand-600 mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Engine
        </Link>

        {/* Title */}
        <div className="mb-12">
          <div className="tag mb-4">
            <Key size={12} className="text-brand-600" /> API Control Center
          </div>
          <h1 className="text-4xl md:text-5xl font-[900] text-slate-900 dark:text-white font-heading tracking-tight">
            Diagnostic Settings.
          </h1>
          <p className="text-[#6B6258] dark:text-[#A09890] mt-3 font-medium">
            Customize your AI models and enter your private API keys to bypass default limits and get premium results.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Configuration...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10">
            
            {/* Guide: How to get free API key */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#161310] border-2 border-slate-900 dark:border-white rounded-[32px] p-8 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center text-brand-600 border border-brand-500/20">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight font-heading">How to Get a FREE Gemini API Key</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Step-by-step from Google AI Studio</p>
                </div>
              </div>

              <div className="space-y-4 font-medium text-sm text-[#6B6258] dark:text-[#A09890] leading-relaxed">
                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-lg bg-brand-600 text-white font-black text-xs flex items-center justify-center shrink-0">1</span>
                  <p>
                    Visit <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-brand-600 font-bold inline-flex items-center gap-0.5 hover:underline">Google AI Studio <ExternalLink size={12} /></a> and sign in with any Google account.
                  </p>
                </div>
                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-lg bg-brand-600 text-white font-black text-xs flex items-center justify-center shrink-0">2</span>
                  <p>
                    On the left sidebar, click the blue button that says <strong>"Get API Key"</strong>.
                  </p>
                </div>
                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-lg bg-brand-600 text-white font-black text-xs flex items-center justify-center shrink-0">3</span>
                  <p>
                    Click <strong>"Create API Key"</strong>. You can choose to create it in a new Google Cloud project instantly with one click.
                  </p>
                </div>
                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-lg bg-brand-600 text-white font-black text-xs flex items-center justify-center shrink-0">4</span>
                  <p>
                    Copy the generated API Key (a long string starting with <code>AIzaSy...</code>) and paste it in the form below.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.form 
              onSubmit={handleSave}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-[#161310] border-2 border-slate-900 dark:border-white rounded-[32px] p-8 md:p-10 shadow-xl space-y-8"
            >
              {/* API Key field */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Your Gemini API Key</label>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Optional — Falls back to system key if blank</span>
                </div>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Key size={18} />
                  </div>
                  <input 
                    type={showKey ? 'text' : 'password'}
                    placeholder="AIzaSy..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full pl-14 pr-16 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-mono outline-none focus:ring-4 focus:ring-brand-600/10 focus:border-brand-600 transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Model selection */}
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white block">Preferred Intelligence Model</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MODELS.map((item) => {
                    const active = model === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setModel(item.value)}
                        className={`p-5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                          active
                            ? 'border-brand-600 bg-brand-500/5 text-brand-600 shadow-sm'
                            : 'border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 hover:border-slate-200 dark:hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center ${active ? 'border-brand-600' : 'border-slate-400'}`}>
                              {active && <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />}
                            </span>
                            <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">{item.label.split('(')[0]}</span>
                          </div>
                          <p className="text-[11px] text-[#6B6258] dark:text-[#A09890] leading-relaxed font-semibold">
                            {item.desc}
                          </p>
                        </div>
                        <span className="text-[9px] font-black uppercase text-slate-400 mt-4 tracking-widest">{item.label.includes('Fast') ? '⚡ Speed Optimized' : '🧠 Quality Optimized'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notice */}
              <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-4 items-start shadow-sm">
                <ShieldAlert className="text-amber-600 shrink-0 mt-0.5" size={20} />
                <div className="text-xs font-semibold leading-relaxed text-amber-900 dark:text-amber-300">
                  <p className="font-bold uppercase tracking-widest text-[10px] mb-1 text-amber-600">Privacy & Security Notice</p>
                  Your API Key is stored securely in an encrypted state inside the database. It is ONLY ever used directly to process requests sent from your own authenticated session to Google Generative Language APIs.
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-premium !h-[3.6em] !pl-8 !pr-[4em] !text-xs"
                >
                  {saving ? 'Updating Configuration...' : 'Save Configuration'}
                  <div className="btn-icon">
                    <Save size={16} />
                  </div>
                </button>
              </div>

            </motion.form>

          </div>
        )}

      </div>
    </div>
  );
};

export default SettingsPage;
