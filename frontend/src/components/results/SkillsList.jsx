import { CheckCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react';
import AnimatedCounter from '../common/AnimatedCounter';

const SkillsList = ({ matched, missing }) => {
  const matchedCount = matched?.length || 0;
  const missingCount = missing?.length || 0;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Matched Skills */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Matched Skills</h3>
              <p className="text-sm text-gray-600">Skills that match the job</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600">
              <AnimatedCounter value={matchedCount} duration={1200} />
            </div>
            <div className="text-sm text-gray-500">skills found</div>
          </div>
        </div>

        <div className="space-y-3">
          {matched && matched.length > 0 ? (
            matched.map((skill, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 bg-white border border-green-200 rounded-lg px-4 py-3 hover:bg-green-50 transition-all duration-200 hover:shadow-md animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">{skill}</span>
                <div className="ml-auto">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No matched skills found</p>
              <p className="text-sm text-gray-400 mt-1">Try optimizing your resume with relevant keywords</p>
            </div>
          )}
        </div>
      </div>

      {/* Missing Skills */}
      <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6 rounded-xl border border-red-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-500 rounded-lg">
              <XCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Missing Skills</h3>
              <p className="text-sm text-gray-600">Skills to consider adding</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-red-600">
              <AnimatedCounter value={missingCount} duration={1200} />
            </div>
            <div className="text-sm text-gray-500">skills needed</div>
          </div>
        </div>

        <div className="space-y-3">
          {missing && missing.length > 0 ? (
            missing.map((skill, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 bg-white border border-red-200 rounded-lg px-4 py-3 hover:bg-red-50 transition-all duration-200 hover:shadow-md animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex-shrink-0">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <span className="text-gray-700 font-medium">{skill}</span>
                <div className="ml-auto">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">Great job!</p>
              <p className="text-sm text-gray-400 mt-1">All required skills are present</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsList;

