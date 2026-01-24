import { Star, Quote } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import AnimatedCounter from './AnimatedCounter';

const CustomerReviews = () => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);

  const reviews = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "Tech Corp",
      rating: 5,
      review: "This tool completely transformed my resume! I went from getting rejected by ATS systems to landing interviews at top tech companies. The recommendations were spot-on.",
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Marketing Manager",
      company: "Global Brands Inc",
      rating: 5,
      review: "Incredibly accurate skill matching and keyword optimization. My ATS score went from 65% to 92% after following the suggestions. Highly recommend!",
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Data Analyst",
      company: "Analytics Pro",
      rating: 5,
      review: "The detailed analysis and actionable recommendations helped me tailor my resume perfectly for each job application. Got 3x more interview calls!",
      avatar: "ER"
    },
    {
      name: "David Kim",
      role: "Product Manager",
      company: "InnovateTech",
      rating: 4,
      review: "Great tool for optimizing resumes. The skill gap analysis was particularly helpful in identifying what I needed to learn. Very user-friendly interface.",
      avatar: "DK"
    },
    {
      name: "Lisa Thompson",
      role: "UX Designer",
      company: "Design Studio",
      rating: 5,
      review: "As a designer, I was skeptical about AI tools, but this one impressed me. The format recommendations and keyword suggestions were exactly what I needed.",
      avatar: "LT"
    },
    {
      name: "James Wilson",
      role: "Financial Analyst",
      company: "Capital Group",
      rating: 5,
      review: "The ATS score improvement was dramatic. From struggling to get past initial screening to multiple offers. This tool is a game-changer for job seekers.",
      avatar: "JW"
    }
  ];

  // Duplicate reviews for seamless infinite scroll
  const duplicatedReviews = [...reviews, ...reviews];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  // Auto-scroll functionality
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isPaused) return;

    const scrollSpeed = 1; // pixels per frame
    let animationId;

    const autoScroll = () => {
      if (scrollContainer) {
        scrollContainer.scrollLeft += scrollSpeed;

        // Reset scroll position when reaching the middle (duplicate content)
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(autoScroll);
    };

    animationId = requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPaused]);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of successful job seekers who have optimized their resumes with our AI-powered platform
          </p>
        </div>

        {/* Scrolling Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-hidden cursor-grab active:cursor-grabbing scroll-smooth"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {duplicatedReviews.map((review, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[350px] bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mr-4 shadow-md">
                  <span className="text-white font-semibold text-lg">{review.avatar}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{review.name}</h4>
                  <p className="text-sm text-gray-600">{review.role} at {review.company}</p>
                </div>
              </div>

              <div className="flex items-center mb-4">
                {renderStars(review.rating)}
                <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
              </div>

              <div className="relative">
                <Quote className="h-8 w-8 text-primary-200 absolute -top-2 -left-2" />
                <p className="text-gray-700 italic pl-6 line-clamp-4">"{review.review}"</p>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Indicator Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-primary-300 hover:bg-primary-500 transition-colors cursor-pointer"
            />
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-gray-100 hover:border-primary-200">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">👥</span>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-2">
                <AnimatedCounter value={10000} suffix="+" duration={2500} />
              </div>
              <div className="text-gray-600 font-medium">Happy Users</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-gray-100 hover:border-green-200">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">✅</span>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-2">
                <AnimatedCounter value={95} suffix="%" duration={2000} />
              </div>
              <div className="text-gray-600 font-medium">Success Rate</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-gray-100 hover:border-yellow-200">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">⭐</span>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-2">
                4.9/5
              </div>
              <div className="text-gray-600 font-medium">Average Rating</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-gray-100 hover:border-purple-200">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">🤖</span>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-gray-600 font-medium">AI Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;