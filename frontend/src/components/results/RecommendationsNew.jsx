import { useState } from 'react';
import { AlertTriangle, Info, CheckCircle, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

const Recommendations = ({ recommendations }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (index) => {
    setExpanded({ ...expanded, [index]: !expanded[index] });
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case 'medium':
        return <Info className="h-6 w-6 text-yellow-600" />;
      case 'low':
        return <CheckCircle className="h-6 w-6 text-blue-600" />;
      default:
        return <Info className="h-6 w-6 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-gradient-to-r from-red-50 to-red-100 border-red-200 hover:from-red-100 hover:to-red-150';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 hover:from-yellow-100 hover:to-yellow-150';
      case 'low':
        return 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-150';
      default:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 hover:from-gray-100 hover:to-gray-150';
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[priority] || colors.medium;
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-8 border border-green-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Excellent Work!</h3>
          <p className="text-gray-600 text-lg">No recommendations needed. Your resume is well-optimized!</p>
        </div>
      </div>
    );
  }

  // Group by priority
  const grouped = {
    high: recommendations.filter(r => r.priority === 'high'),
    medium: recommendations.filter(r => r.priority === 'medium'),
    low: recommendations.filter(r => r.priority === 'low'),
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-primary-100 rounded-lg">
          <Lightbulb className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">AI Recommendations</h3>
          <p className="text-gray-600">Personalized tips to improve your resume</p>
        </div>
      </div>

      <div className="space-y-6">
        {['high', 'medium', 'low'].map(priority => (
          grouped[priority].length > 0 && (
            <div key={priority} className="animate-fade-in">
              <div className="flex items-center space-x-3 mb-4">
                {getPriorityIcon(priority)}
                <h4 className="text-xl font-bold text-gray-800 capitalize">
                  {priority} Priority
                </h4>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getPriorityBadge(priority)}`}>
                  {grouped[priority].length} {grouped[priority].length === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="space-y-4 ml-9">
                {grouped[priority].map((rec, index) => (
                  <div
                    key={index}
                    className={`border rounded-xl p-6 transition-all duration-300 hover:shadow-lg cursor-pointer ${getPriorityColor(rec.priority)}`}
                    onClick={() => rec.details && toggleExpand(index)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getPriorityBadge(priority)}`}>
                            {rec.priority.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-600 font-medium">{rec.category}</span>
                        </div>
                        <h5 className="font-bold text-gray-800 text-lg mb-2">{rec.message}</h5>
                        {expanded[index] && rec.details && (
                          <div className="mt-4 p-4 bg-white/70 rounded-lg border border-gray-200 animate-fade-in">
                            <p className="text-gray-700 leading-relaxed">{rec.details}</p>
                          </div>
                        )}
                      </div>
                      {rec.details && (
                        <button
                          className="ml-4 p-2 hover:bg-white/50 rounded-lg transition-colors duration-200"
                        >
                          {expanded[index] ? (
                            <ChevronUp className="h-5 w-5 text-gray-600" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-600" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Recommendations;