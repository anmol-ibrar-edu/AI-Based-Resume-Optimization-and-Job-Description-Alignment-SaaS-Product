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
    <div className="w-full space-y-5">
      {/* Job Title Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Job Title <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="e.g. Software Engineer – Backend"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 hover:bg-white"
        />
      </div>

      {/* Company Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Company <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <input
          type="text"
          value={company}
          onChange={handleCompanyChange}
          placeholder="e.g. Google, Amazon"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 hover:bg-white"
        />
      </div>

      {/* Job Description Textarea */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-semibold text-gray-700">
            Job Description <span className="text-red-500">*</span>
          </label>
          {description && (
            <button
              onClick={handleClear}
              className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
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
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
        />
      </div>
    </div>
  );
};

export default JobInput;


