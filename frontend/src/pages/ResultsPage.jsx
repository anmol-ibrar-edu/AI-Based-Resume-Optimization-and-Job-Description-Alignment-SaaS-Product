import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { analysisAPI } from '../services';
import Button from '../components/common/Button';
import AnimatedCounter from '../components/common/AnimatedCounter';
import { ArrowLeft, Share2, Calendar, FileText, Target, Zap, TrendingUp, CheckCircle, AlertTriangle, Sparkles, ChevronRight, Printer } from 'lucide-react';

const ResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSkillTab, setActiveSkillTab] = useState('missing');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await analysisAPI.getOne(id);
        setAnalysis(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load analysis');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAnalysis();
  }, [id]);

  const handleExport = () => window.print();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ATS Analysis - ${analysis?.resume_filename || 'Resume'}`,
          text: `ATS Score: ${Math.round(analysis?.ats_score || 0)}%`,
          url: window.location.href
        });
      } catch (err) { }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Analysis Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The analysis does not exist.'}</p>
          <Button onClick={() => navigate('/upload')} className="w-full">Upload New Resume</Button>
        </div>
      </div>
    );
  }

  const breakdown = analysis.score_breakdown || {};
  const score = Math.round(analysis.ats_score || 0);

  const getScoreStatus = (score) => {
    if (score >= 80) return { label: 'Excellent Match', color: 'text-green-600', printColor: '#16a34a' };
    if (score >= 60) return { label: 'Good Match', color: 'text-blue-600', printColor: '#2563eb' };
    if (score >= 40) return { label: 'Fair Match', color: 'text-yellow-600', printColor: '#ca8a04' };
    return { label: 'Needs Improvement', color: 'text-red-600', printColor: '#dc2626' };
  };

  const scoreStatus = getScoreStatus(score);

  const { high: highRecs, medium: mediumRecs } = (() => {
    const recs = analysis.recommendations || [];
    return { high: recs.slice(0, Math.ceil(recs.length / 2)), medium: recs.slice(Math.ceil(recs.length / 2)) };
  })();

  return (
    <>
      {/* SCREEN UI - Hidden in Print */}
      <div className="print:hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-500 hover:text-primary-600 transition-colors text-sm font-medium mb-1">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Analysis Results</h1>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1"><FileText className="h-4 w-4" />{analysis.resume_filename || 'Resume'}</span>
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(analysis.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium shadow-md">
                <Printer className="h-4 w-4" /> Export PDF
              </button>
              <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>
          </div>

          {/* Score Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-600 mb-6">ATS Compatibility Score</h2>
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="88" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                  <circle cx="96" cy="96" r="88" fill="none" stroke={scoreStatus.printColor} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(score / 100) * 553} 553`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-5xl font-bold ${scoreStatus.color}`}><AnimatedCounter value={score} duration={1500} /></span>
                  <span className="text-gray-400 text-lg">/ 100</span>
                </div>
              </div>
              <span className={`inline-block px-4 py-2 rounded-full font-semibold ${scoreStatus.color} bg-gray-100`}>{scoreStatus.label}</span>
            </div>
          </div>

          {/* Key Insights */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { title: 'Skills', value: breakdown.skills_score || 0, icon: Target, color: '#3b82f6' },
              { title: 'Keywords', value: breakdown.keywords_score || 0, icon: Zap, color: '#8b5cf6' },
              { title: 'Experience', value: breakdown.experience_score || 0, icon: TrendingUp, color: '#22c55e' },
              { title: 'Format', value: breakdown.format_score || 0, icon: FileText, color: '#f97316' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <item.icon className="h-5 w-5 text-gray-400" />
                  <span className="text-2xl font-bold" style={{ color: item.color }}><AnimatedCounter value={Math.round(item.value)} duration={1200} />%</span>
                </div>
                <div className="text-sm font-medium text-gray-700 mb-2">{item.title}</div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Skills Tabs */}
          <div className="bg-white rounded-2xl shadow-lg mb-8 border border-gray-100 overflow-hidden">
            <div className="flex border-b">
              <button onClick={() => setActiveSkillTab('missing')} className={`flex-1 py-4 text-center font-semibold ${activeSkillTab === 'missing' ? 'text-red-600 border-b-2 border-red-600 bg-red-50' : 'text-gray-500'}`}>
                Missing Skills ({analysis.missing_skills?.length || 0})
              </button>
              <button onClick={() => setActiveSkillTab('matched')} className={`flex-1 py-4 text-center font-semibold ${activeSkillTab === 'matched' ? 'text-green-600 border-b-2 border-green-600 bg-green-50' : 'text-gray-500'}`}>
                Matched Skills ({analysis.matched_skills?.length || 0})
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {activeSkillTab === 'missing' ? (
                  analysis.missing_skills?.length > 0 ? analysis.missing_skills.map((s, i) => (
                    <span key={i} className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100">{s}</span>
                  )) : <span className="text-gray-500">No missing skills</span>
                ) : (
                  analysis.matched_skills?.length > 0 ? analysis.matched_skills.map((s, i) => (
                    <span key={i} className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100"><CheckCircle className="h-3 w-3" />{s}</span>
                  )) : <span className="text-gray-500">No matched skills</span>
                )}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-2xl shadow-lg mb-8 border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Sparkles className="h-6 w-6 text-primary-600" />AI Recommendations</h3>
            {highRecs.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-red-700 mb-4 flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-full"></span>High Priority</h4>
                <div className="space-y-3">
                  {highRecs.slice(0, 5).map((rec, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                      <ChevronRight className="h-5 w-5 text-red-500 flex-shrink-0" />
                      <p className="text-gray-700 text-sm">{typeof rec === 'string' ? rec : rec.text || rec.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {mediumRecs.length > 0 && (
              <div>
                <h4 className="font-semibold text-yellow-700 mb-4 flex items-center gap-2"><span className="w-3 h-3 bg-yellow-500 rounded-full"></span>Medium Priority</h4>
                <div className="space-y-3">
                  {mediumRecs.slice(0, 5).map((rec, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                      <ChevronRight className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                      <p className="text-gray-700 text-sm">{typeof rec === 'string' ? rec : rec.text || rec.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/upload')} className="px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg">
              <Sparkles className="h-5 w-5 mr-2" />Analyze Another Resume
            </Button>
            <Button onClick={() => navigate('/dashboard')} variant="secondary" className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl">
              View Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* ========== PRINT-ONLY LAYOUT ========== */}
      <div className="hidden print:block">
        {/* PAGE 1: Header + Score */}
        <div className="print-page">
          <div className="print-header">
            <h1 className="print-title">ATS Analysis Report</h1>
            <div className="print-meta">
              <span>{analysis.resume_filename || 'Resume'}</span>
              <span>{new Date(analysis.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          <div className="print-score-section">
            <h2 className="print-section-title">ATS Compatibility Score</h2>
            <div className="print-score-circle">
              <span className="print-score-value" style={{ color: scoreStatus.printColor }}>{score}</span>
              <span className="print-score-max">/ 100</span>
            </div>
            <div className="print-score-label" style={{ color: scoreStatus.printColor }}>{scoreStatus.label}</div>
          </div>

          <div className="print-breakdown">
            <h2 className="print-section-title">Score Breakdown</h2>
            <div className="print-breakdown-grid">
              {[
                { label: 'Skills Match', value: breakdown.skills_score || 0 },
                { label: 'Keywords Match', value: breakdown.keywords_score || 0 },
                { label: 'Experience', value: breakdown.experience_score || 0 },
                { label: 'Formatting', value: breakdown.format_score || 0 },
              ].map((item, i) => (
                <div key={i} className="print-breakdown-item">
                  <div className="print-breakdown-label">{item.label}</div>
                  <div className="print-breakdown-value">{Math.round(item.value)}%</div>
                  <div className="print-breakdown-bar">
                    <div className="print-breakdown-fill" style={{ width: `${item.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PAGE 2: Skills */}
        <div className="print-page">
          <h2 className="print-section-title">Skills Analysis</h2>

          <div className="print-skills-section">
            <h3 className="print-skills-heading print-skills-missing">Missing Skills ({analysis.missing_skills?.length || 0})</h3>
            <div className="print-skills-list">
              {analysis.missing_skills?.length > 0 ? (
                analysis.missing_skills.map((skill, i) => (
                  <span key={i} className="print-skill-tag print-skill-missing">{skill}</span>
                ))
              ) : (
                <span className="print-no-items">No missing skills detected</span>
              )}
            </div>
          </div>

          <div className="print-skills-section">
            <h3 className="print-skills-heading print-skills-matched">Matched Skills ({analysis.matched_skills?.length || 0})</h3>
            <div className="print-skills-list">
              {analysis.matched_skills?.length > 0 ? (
                analysis.matched_skills.map((skill, i) => (
                  <span key={i} className="print-skill-tag print-skill-matched">✓ {skill}</span>
                ))
              ) : (
                <span className="print-no-items">No matched skills found</span>
              )}
            </div>
          </div>
        </div>

        {/* PAGE 3: Recommendations */}
        <div className="print-page">
          <h2 className="print-section-title">AI Recommendations</h2>

          {highRecs.length > 0 && (
            <div className="print-rec-section">
              <h3 className="print-rec-heading print-rec-high">High Priority</h3>
              <ul className="print-rec-list">
                {highRecs.slice(0, 6).map((rec, i) => (
                  <li key={i} className="print-rec-item">
                    → {typeof rec === 'string' ? rec : rec.text || rec.description}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {mediumRecs.length > 0 && (
            <div className="print-rec-section">
              <h3 className="print-rec-heading print-rec-medium">Medium Priority</h3>
              <ul className="print-rec-list">
                {mediumRecs.slice(0, 6).map((rec, i) => (
                  <li key={i} className="print-rec-item">
                    → {typeof rec === 'string' ? rec : rec.text || rec.description}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="print-footer">
            <p>Generated by AI Resume Optimizer</p>
            <p>© {new Date().getFullYear()} All rights reserved</p>
          </div>
        </div>
      </div>

      {/* PRINT STYLES */}
      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { margin: 0; padding: 0; background: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          nav, .print\\:hidden { display: none !important; }
          .hidden.print\\:block { display: block !important; }
          
          .print-page {
            width: 210mm;
            min-height: 297mm;
            padding: 20mm 25mm;
            background: white;
            page-break-after: always;
            box-sizing: border-box;
          }
          .print-page:last-child { page-break-after: auto; }
          
          .print-header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; }
          .print-title { font-size: 28px; font-weight: bold; margin: 0 0 10px 0; color: #111827; }
          .print-meta { display: flex; justify-content: center; gap: 30px; color: #6b7280; font-size: 14px; }
          
          .print-score-section { text-align: center; margin: 40px 0; }
          .print-section-title { font-size: 18px; font-weight: 600; color: #374151; margin-bottom: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
          .print-score-circle { margin: 20px 0; }
          .print-score-value { font-size: 72px; font-weight: bold; }
          .print-score-max { font-size: 24px; color: #9ca3af; margin-left: 5px; }
          .print-score-label { font-size: 20px; font-weight: 600; margin-top: 10px; }
          
          .print-breakdown { margin-top: 40px; }
          .print-breakdown-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .print-breakdown-item { padding: 15px; border: 1px solid #e5e7eb; background: #f9fafb; }
          .print-breakdown-label { font-size: 14px; color: #6b7280; margin-bottom: 5px; }
          .print-breakdown-value { font-size: 24px; font-weight: bold; color: #111827; }
          .print-breakdown-bar { height: 8px; background: #e5e7eb; margin-top: 10px; }
          .print-breakdown-fill { height: 100%; background: #3b82f6; }
          
          .print-skills-section { margin-bottom: 30px; }
          .print-skills-heading { font-size: 16px; font-weight: 600; margin-bottom: 15px; padding: 8px 12px; display: inline-block; }
          .print-skills-missing { color: #dc2626; background: #fef2f2; }
          .print-skills-matched { color: #16a34a; background: #f0fdf4; }
          .print-skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
          .print-skill-tag { padding: 6px 12px; font-size: 12px; font-weight: 500; border: 1px solid; }
          .print-skill-missing { color: #dc2626; border-color: #fecaca; background: #fef2f2; }
          .print-skill-matched { color: #16a34a; border-color: #bbf7d0; background: #f0fdf4; }
          .print-no-items { color: #9ca3af; font-style: italic; }
          
          .print-rec-section { margin-bottom: 25px; }
          .print-rec-heading { font-size: 14px; font-weight: 600; padding: 6px 12px; display: inline-block; margin-bottom: 12px; }
          .print-rec-high { color: #dc2626; background: #fef2f2; }
          .print-rec-medium { color: #ca8a04; background: #fefce8; }
          .print-rec-list { list-style: none; padding: 0; margin: 0; }
          .print-rec-item { padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px; color: #374151; }
          
          .print-footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px; }
        }
      `}</style>
    </>
  );
};

export default ResultsPage;
