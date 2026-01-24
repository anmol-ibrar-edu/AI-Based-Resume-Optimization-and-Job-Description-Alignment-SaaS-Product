const ScoreCard = ({ score }) => {
  const getScoreLabel = (val) => {
    if (val >= 90) return 'Excellent';
    if (val >= 70) return 'Good';
    if (val >= 50) return 'Needs Improvement';
    return 'Poor';
  };

  const getScoreColor = (val) => {
    if (val >= 90) return 'text-green-600';
    if (val >= 70) return 'text-blue-600';
    if (val >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCircleColor = (val) => {
    if (val >= 90) return 'stroke-green-500';
    if (val >= 70) return 'stroke-blue-500';
    if (val >= 50) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };

  const circumference = 2 * Math.PI * 90;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">ATS Score</h3>
      <div className="relative inline-flex items-center justify-center">
        <svg className="transform -rotate-90 w-48 h-48">
          <circle
            cx="96"
            cy="96"
            r="90"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="96"
            cy="96"
            r="90"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`transition-all duration-1000 ${getCircleColor(score)}`}
          />
        </svg>
        <div className="absolute">
          <div className={`text-5xl font-bold ${getScoreColor(score)}`}>
            {score.toFixed(0)}
          </div>
          <div className="text-sm text-gray-500 mt-1">/ 100</div>
        </div>
      </div>
      <div className={`mt-6 text-xl font-semibold ${getScoreColor(score)}`}>
        {getScoreLabel(score)}
      </div>
    </div>
  );
};

export default ScoreCard;

