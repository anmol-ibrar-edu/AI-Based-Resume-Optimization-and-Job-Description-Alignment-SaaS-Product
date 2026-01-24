import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI, analysisAPI } from '../services';
import Button from '../components/common/Button';
import AnimatedCounter from '../components/common/AnimatedCounter';
import { FileText, TrendingUp, Award, Activity, Trash2, Plus, Zap, Eye, Calendar } from 'lucide-react';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleDeleteAnalysis = async (analysisId) => {
    if (!window.confirm('Are you sure you want to delete this analysis?')) {
      return;
    }

    try {
      await analysisAPI.delete(analysisId);
      const [statsResponse, historyResponse] = await Promise.all([
        dashboardAPI.getStats(),
        analysisAPI.getHistory(20),
      ]);
      setStats(statsResponse.data);
      setHistory(historyResponse.data);
    } catch (error) {
      console.error('Failed to delete analysis:', error);
      alert('Failed to delete analysis. Please try again.');
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Get latest analysis score
  const latestScore = history.length > 0 ? Math.round(history[0].ats_score) : 0;
  const bestScore = stats?.best_score ? Math.round(stats.best_score) : 0;
  const improvement = stats?.improvement ? Math.round(stats.improvement) : 0;

  // Get score status
  const getScoreStatus = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 60) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 40) return { label: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'Needs Work', color: 'text-red-600', bg: 'bg-red-100' };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 2. PAGE TITLE + CTA */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Track your resume analysis and ATS performance</p>
          </div>
          <Button
            onClick={() => navigate('/upload')}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-5 w-5" />
            New Analysis
          </Button>
        </div>

        {/* 3. SUMMARY STATS - 4 Cards Same Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Analyses */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Total Analyses</span>
            </div>
            <div className="text-3xl font-bold text-primary-600">
              <AnimatedCounter value={stats?.total_analyses || 0} duration={1000} />
            </div>
          </div>

          {/* Current Score */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Current Score</span>
            </div>
            <div className="text-3xl font-bold text-primary-600">
              {latestScore > 0 ? (
                <><AnimatedCounter value={latestScore} duration={1000} />%</>
              ) : '—'}
            </div>
          </div>

          {/* Best Score */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Best Score</span>
            </div>
            <div className="text-3xl font-bold text-primary-600">
              {bestScore > 0 ? (
                <><AnimatedCounter value={bestScore} duration={1000} />%</>
              ) : '—'}
            </div>
          </div>

          {/* Improvement */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Improvement</span>
            </div>
            <div className={`text-3xl font-bold ${improvement > 0 ? 'text-green-600' : 'text-primary-600'}`}>
              {improvement !== 0 ? (
                <>{improvement > 0 ? '+' : ''}<AnimatedCounter value={Math.abs(improvement)} duration={1000} />%</>
              ) : '—'}
            </div>
          </div>
        </div>

        {/* 4. NEXT ACTION - Recommended Step */}
        {history.length > 0 && (
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6 mb-8 border border-primary-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Recommended Next Step</h3>
                  <p className="text-gray-600 mt-1">
                    {latestScore < 50
                      ? 'Your resume needs improvement. Add missing skills and keywords to increase ATS compatibility.'
                      : latestScore < 70
                        ? 'Good progress! Optimize your experience section to boost your score further.'
                        : 'Great score! Fine-tune your resume for specific job applications.'}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/upload')}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-medium whitespace-nowrap"
              >
                Improve Resume
              </Button>
            </div>
          </div>
        )}

        {/* 5. RECENT ANALYSES */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Analyses</h2>

          {history.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {history.slice(0, 4).map((item) => {
                const scoreStatus = getScoreStatus(item.ats_score);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 truncate max-w-[200px]">
                            {item.resume_filename?.replace(/\.[^/.]+$/, '') || 'Resume'}
                          </h3>
                          <p className="text-sm text-gray-500">{item.job_title || 'Job Analysis'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-sm text-gray-500">ATS Score</span>
                        <div className={`text-2xl font-bold ${scoreStatus.color}`}>
                          {item.ats_score.toFixed(0)}%
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${scoreStatus.bg} ${scoreStatus.color}`}>
                        {scoreStatus.label}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                      <div
                        className={`h-2 rounded-full transition-all ${item.ats_score >= 80 ? 'bg-green-500' :
                            item.ats_score >= 60 ? 'bg-blue-500' :
                              item.ats_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                        style={{ width: `${item.ats_score}%` }}
                      ></div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => navigate(`/results/${item.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteAnalysis(item.id)}
                        className="flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* 6. EMPTY STATE */
            <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No analyses yet</h3>
              <p className="text-gray-500 mb-6">You haven't analyzed any resumes yet.</p>
              <Button
                onClick={() => navigate('/upload')}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-medium"
              >
                Analyze Your First Resume
              </Button>
            </div>
          )}

          {/* View All Link */}
          {history.length > 4 && (
            <div className="text-center mt-6">
              <button className="text-primary-600 hover:text-primary-700 font-medium">
                View all {history.length} analyses →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
