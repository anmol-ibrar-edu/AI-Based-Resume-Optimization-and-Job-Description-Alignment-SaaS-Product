import { useState } from 'react';

const JobInput = ({ onJobChange, jobData }) => {
  const [title, setTitle] = useState(jobData?.title || '');
  const [company, setCompany] = useState(jobData?.company || '');
  const [description, setDescription] = useState(jobData?.raw_text || '');

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    onJobChange({ title: e.target.value, company, raw_text: description });
  };

  const handleCompanyChange = (e) => {
    setCompany(e.target.value);
    onJobChange({ title, company: e.target.value, raw_text: description });
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    onJobChange({ title, company, raw_text: e.target.value });
  };

  const handleClear = () => {
    setTitle('');
    setCompany('');
    setDescription('');
    onJobChange({ title: '', company: '', raw_text: '' });
  };

  return (
    <div className="w-full space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Job Title Input */}
        <div>
          <label className="block text-sm font-bold dark:font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">
            Job Title <span className="text-slate-400 font-medium text-xs ml-1">(Optional)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="e.g. Software Engineer"
            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-500 focus:border-indigo-500 dark:focus:border-cyan-500 transition-all duration-200 bg-white dark:bg-slate-950/50 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm dark:shadow-none text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>

        {/* Company Input */}
        <div>
          <label className="block text-sm font-bold dark:font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">
            Company <span className="text-slate-400 font-medium text-xs ml-1">(Optional)</span>
          </label>
          <input
            type="text"
            value={company}
            onChange={handleCompanyChange}
            placeholder="e.g. Google"
            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-500 focus:border-indigo-500 dark:focus:border-cyan-500 transition-all duration-200 bg-white dark:bg-slate-950/50 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm dark:shadow-none text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>
      </div>

      {/* Job Description Textarea */}
      <div>
        <div className="flex justify-between items-center mb-2 px-1">
          <label className="block text-sm font-bold dark:font-semibold text-slate-700 dark:text-slate-300">
            Job Description <span className="text-rose-500">*</span>
          </label>
          {description && (
            <button
              onClick={handleClear}
              className="text-xs text-rose-500 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-bold transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Paste the full job description here to compare skills, keywords, and ATS compatibility."
          rows={10}
          className="w-full px-4 py-4 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-500 focus:border-indigo-500 dark:focus:border-cyan-500 transition-all duration-200 bg-white dark:bg-slate-950/50 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm dark:shadow-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 resize-y min-h-[150px]"
        />
      </div>
    </div>
  );
};

export default JobInput;
