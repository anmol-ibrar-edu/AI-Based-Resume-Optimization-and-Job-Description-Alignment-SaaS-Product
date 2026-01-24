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
    // Get file extension
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split('.').pop();

    // Validate file extension (more reliable than MIME type)
    const validExtensions = ['pdf', 'docx'];
    if (!validExtensions.includes(fileExtension)) {
      setError('❌ Invalid file type! Please upload a PDF or DOCX file only.');
      onFileSelect(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Also check MIME type as secondary validation
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    // Some browsers may not detect MIME type correctly, so we rely on extension primarily
    if (file.type && !validTypes.includes(file.type) && file.type !== '') {
      // Log for debugging but don't block if extension is valid
      console.warn('MIME type mismatch:', file.type, 'but extension is valid:', fileExtension);
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('❌ File too large! Maximum file size is 5MB.');
      onFileSelect(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Clear any previous errors
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
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center">
          <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {!selectedFile ? (
        <div
          className={`border-3 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${dragActive
            ? 'border-primary-500 bg-primary-50 scale-[1.02]'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
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
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${dragActive ? 'bg-primary-100' : 'bg-gray-100'
              }`}>
              <Upload className={`h-8 w-8 transition-colors ${dragActive ? 'text-primary-600' : 'text-gray-400'}`} />
            </div>

            <p className="text-lg font-semibold text-gray-700 mb-1">
              📄 Drag & Drop your resume here
            </p>
            <p className="text-gray-500 mb-4">OR</p>
            <button
              type="button"
              className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
            >
              Browse File
            </button>
            <p className="text-xs text-gray-400 mt-4">
              PDF or DOCX only • Maximum 5MB
            </p>
          </div>
        </div>
      ) : (
        <div className="border-2 border-green-200 rounded-2xl p-6 bg-green-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
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


