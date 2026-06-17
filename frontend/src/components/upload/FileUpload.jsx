import { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';

const FileUpload = ({ onFileSelect, selectedFile }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError('');

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    setError('');
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split('.').pop();

    const validExtensions = ['pdf', 'docx'];
    if (!validExtensions.includes(fileExtension)) {
      setError('❌ Invalid file type! Please upload a PDF or DOCX file only.');
      onFileSelect(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('❌ File too large! Maximum file size is 5MB.');
      onFileSelect(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setError('');
    onFileSelect(file);
  };

  const removeFile = () => {
    setError('');
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl text-rose-700 dark:text-rose-400 flex items-center">
          <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
          <span className="font-medium text-sm">{error}</span>
        </div>
      )}

      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300 ${dragActive
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 scale-[1.02]'
            : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-cyan-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="flex flex-col items-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 shadow-sm border ${dragActive ? 'bg-indigo-100 dark:bg-indigo-500/30 border-indigo-200 dark:border-indigo-500/50' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}>
              <Upload className={`h-8 w-8 transition-colors ${dragActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
            </div>

            <p className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">
              Drag & Drop your resume here
            </p>
            <p className="text-slate-500 dark:text-slate-400 mb-5 font-medium text-sm">OR</p>

            <button
              type="button"
              className="px-6 py-3 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-indigo-600 dark:text-cyan-400 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm dark:shadow-[0_0_15px_rgba(6,182,212,0.1)]"
            >
              Browse Files
            </button>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-5 font-medium tracking-wide">
              PDF or DOCX only • Maximum 5MB
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-6 bg-emerald-50 dark:bg-emerald-500/10 shadow-sm dark:shadow-none transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white dark:bg-emerald-500/20 border border-emerald-100 dark:border-emerald-500/30 rounded-xl flex items-center justify-center shadow-sm">
                <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{selectedFile.name}</p>
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-2 text-rose-500 dark:text-rose-400 hover:text-white hover:bg-rose-500 dark:hover:bg-rose-600 rounded-lg transition-colors border border-transparent dark:border-white/5"
              title="Remove file"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
