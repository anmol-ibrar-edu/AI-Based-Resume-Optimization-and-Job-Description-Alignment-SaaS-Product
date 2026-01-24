import { useState } from 'react';
import { AlertTriangle, Info, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

const Recommendations = ({ recommendations }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (index) => {
    setExpanded({ ...expanded, [index]: !expanded[index] });
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'medium':
        return <Info className="h-5 w-5 text-yellow-600" />;
      case 'low':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-200 hover:bg-red-100';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
      case 'low':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
          Recommendations
        </h3>
        <p className="text-gray-500">No recommendations available.</p>
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
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <AlertTriangle className="h-6 w-6 text-orange-600 mr-2" />
        Recommendations
      </h3>
      
      <div className="space-y-4">
        {['high', 'medium', 'low'].map(priority => (
          grouped[priority].length > 0 && (
            <div key={priority}>
              <h4 className="text-sm font-medium text-gray-600 mb-2 uppercase tracking-wide flex items-center">
                {getPriorityIcon(priority)}
                <span className="ml-2">{priority} Priority</span>
              </h4>
              <div className="space-y-3">
                {grouped[priority].map((rec, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 transition-all duration-200 ${getPriorityColor(rec.priority)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs font-semibold px-2 py-1 rounded bg-white/50">
                            {rec.priority.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-600">{rec.category}</span>
                        </div>
                        <p className="font-medium text-sm mb-1">{rec.message}</p>
                        {expanded[index] && rec.details && (
                          <p className="text-sm mt-2 opacity-90 animate-fade-in">{rec.details}</p>
                        )}
                      </div>
                      {rec.details && (
                        <button
                          onClick={() => toggleExpand(index)}
                          className="ml-2 text-sm font-medium hover:underline flex items-center transition-colors"
                        >
                          {expanded[index] ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" />
                              Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" />
                              More
                            </>
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

