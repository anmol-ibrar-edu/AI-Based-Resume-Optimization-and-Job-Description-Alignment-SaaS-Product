const ProgressBar = ({ value, label, className = '' }) => {
  const getColor = (val) => {
    if (val >= 90) return 'bg-gradient-to-r from-green-400 to-green-600';
    if (val >= 70) return 'bg-gradient-to-r from-blue-400 to-blue-600';
    if (val >= 50) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    return 'bg-gradient-to-r from-red-400 to-red-600';
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-medium text-gray-700">{value}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
        <div
          className={`h-full transition-all duration-1000 ease-out ${getColor(value)} shadow-sm`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

