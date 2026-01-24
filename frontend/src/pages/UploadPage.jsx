import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI, jobAPI, analysisAPI } from '../services';
import FileUpload from '../components/upload/FileUpload';
import JobInput from '../components/upload/JobInput';
import Button from '../components/common/Button';
import { Upload, FileText, BarChart3, CheckCircle, Search, Lightbulb, Target, Shield } from 'lucide-react';

const UploadPage = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobData, setJobData] = useState({ title: '', company: '', raw_text: '' });
  const [resumeId, setResumeId] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Calculate current step for progress indicator
  const getCurrentStep = () => {
    if (resumeId || resumeFile) {
      if (jobId || (jobData.raw_text && jobData.raw_text.length >= 10)) {
        return 3;
      }
      return 2;
    }
    return 1;
  };

  const currentStep = getCurrentStep();

  const handleAnalyze = async () => {
    if (!resumeId && !resumeFile) {
      setError('Please upload a resume file first');
      return;
    }

    if (!jobId && (!jobData.raw_text || jobData.raw_text.length < 10)) {
      setError('Please enter a job description (at least 10 characters)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let currentResumeId = resumeId;
      if (!currentResumeId) {
        const resumeResponse = await resumeAPI.upload(resumeFile);
        currentResumeId = resumeResponse.data.id;
        setResumeId(currentResumeId);
      }

      let currentJobId = jobId;
      if (!currentJobId) {
        const jobResponse = await jobAPI.create(jobData);
        currentJobId = jobResponse.data.id;
        setJobId(currentJobId);
      }

      const response = await analysisAPI.analyze(currentResumeId, currentJobId);
      navigate(`/results/${response.data.id}`);
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (typeof detail === 'object') {
        setError(detail.message || detail.reason || detail.error || 'Analysis failed. Please try again.');
      } else {
        setError(detail || 'Analysis failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isReadyToAnalyze = (resumeId || resumeFile) && (jobId || (jobData.raw_text && jobData.raw_text.length >= 10));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Analyze Your Resume with <span className="text-primary-600">ATS</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your resume and job description to get an instant ATS compatibility score.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4 md:space-x-8">
              {/* Step 1 */}
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 ${currentStep >= 1 ? 'bg-primary-600' : 'bg-gray-300'}`}>
                  {currentStep > 1 ? <CheckCircle className="h-5 w-5" /> : '1'}
                </div>
                <span className={`ml-3 font-medium hidden sm:block ${currentStep >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                  Upload Resume
                </span>
              </div>

              {/* Arrow */}
              <div className={`w-12 md:w-20 h-1 rounded ${currentStep >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>

              {/* Step 2 */}
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 ${currentStep >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}>
                  {currentStep > 2 ? <CheckCircle className="h-5 w-5" /> : '2'}
                </div>
                <span className={`ml-3 font-medium hidden sm:block ${currentStep >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                  Job Description
                </span>
              </div>

              {/* Arrow */}
              <div className={`w-12 md:w-20 h-1 rounded ${currentStep >= 3 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>

              {/* Step 3 */}
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 ${currentStep >= 3 ? 'bg-primary-600' : 'bg-gray-300'}`}>
                  3
                </div>
                <span className={`ml-3 font-medium hidden sm:block ${currentStep >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
                  ATS Results
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-sm max-w-4xl mx-auto">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Main Two-Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-10">

          {/* LEFT COLUMN - Resume Upload */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Step 1: Upload Your Resume</h2>
                <p className="text-gray-500 text-sm">Supported formats: PDF, DOCX (Max 5MB)</p>
              </div>
            </div>

            <FileUpload onFileSelect={setResumeFile} selectedFile={resumeFile} />

            {/* Success State */}
            {(resumeId || resumeFile) && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center">
                <CheckCircle className="h-5 w-5 mr-3" />
                <div>
                  <span className="font-medium">
                    {resumeFile ? `✔ ${resumeFile.name}` : 'Resume uploaded successfully'}
                  </span>
                  {resumeFile && !resumeId && (
                    <button
                      onClick={() => setResumeFile(null)}
                      className="ml-3 text-sm text-green-600 hover:text-green-800 underline"
                    >
                      Replace File
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Trust Text */}
            <div className="mt-6 flex items-center text-gray-500 text-sm">
              <Shield className="h-4 w-4 mr-2" />
              Your resume is secure and never shared
            </div>
          </div>

          {/* RIGHT COLUMN - Job Description */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Step 2: Paste Job Description</h2>
                <p className="text-gray-500 text-sm">Enter the job details for analysis</p>
              </div>
            </div>

            <JobInput onJobChange={setJobData} jobData={jobData} />

            {/* Character Count */}
            <div className="mt-3 text-right text-sm text-gray-500">
              {jobData.raw_text?.length || 0} characters
              <span className={jobData.raw_text?.length >= 200 ? 'text-green-600' : 'text-gray-400'}>
                {' '}(Minimum 200 recommended)
              </span>
            </div>

            {/* Success State */}
            {(jobId || (jobData.raw_text && jobData.raw_text.length >= 10)) && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center">
                <CheckCircle className="h-5 w-5 mr-3" />
                <span className="font-medium">Job description ready for analysis</span>
              </div>
            )}
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className="text-center mb-12">
          <Button
            onClick={handleAnalyze}
            loading={loading}
            disabled={!isReadyToAnalyze || loading}
            size="lg"
            className={`px-12 py-5 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 ${isReadyToAnalyze
                ? 'bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 hover:shadow-2xl hover:scale-105'
                : 'bg-gray-300 cursor-not-allowed'
              }`}
          >
            <Search className="h-5 w-5 mr-2 inline" />
            {loading ? 'Analyzing...' : 'Analyze Resume & Get ATS Score'}
          </Button>

          <p className="mt-4 text-gray-500">
            {!isReadyToAnalyze && 'Complete both steps above to analyze your resume'}
            {isReadyToAnalyze && '✓ Ready to analyze!'}
          </p>
        </div>

        {/* Feature List */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-medium text-gray-700">Keyword Match Analysis</span>
            </div>
            <div className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Search className="h-5 w-5 text-green-600" />
              </div>
              <span className="font-medium text-gray-700">Skills Gap Detection</span>
            </div>
            <div className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Lightbulb className="h-5 w-5 text-purple-600" />
              </div>
              <span className="font-medium text-gray-700">ATS-Friendly Suggestions</span>
            </div>
            <div className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <BarChart3 className="h-5 w-5 text-orange-600" />
              </div>
              <span className="font-medium text-gray-700">Resume Improvement Tips</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-gray-400 text-sm">
          <Shield className="h-4 w-4 inline mr-1" />
          Your data is processed securely. Files are auto-deleted after analysis.
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
