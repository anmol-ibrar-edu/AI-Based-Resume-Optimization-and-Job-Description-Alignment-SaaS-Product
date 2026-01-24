import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Footer from '../components/common/Footer';
import { Upload, FileSearch, BarChart3, Sparkles, Target, Lightbulb, Search, CheckCircle, Users, Zap, Award, ChevronLeft, ChevronRight } from 'lucide-react';

// Hook for scroll-triggered animations
const useScrollAnimation = (threshold = 0.3) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, isVisible]);

  return [ref, isVisible];
};

// Animated Counter Component
const AnimatedCounter = ({ end, suffix = '', duration = 1200, isVisible }) => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return <>{count.toLocaleString()}{suffix}</>;
};

const HomePage = () => {
  const [heroRef, heroVisible] = useScrollAnimation(0.1);
  const [statsRef, statsVisible] = useScrollAnimation(0.5);
  const [howItWorksRef, howItWorksVisible] = useScrollAnimation(0.2);
  const [featuresRef, featuresVisible] = useScrollAnimation(0.2);
  const [testimonialsRef, testimonialsVisible] = useScrollAnimation(0.3);
  const [ctaRef, ctaVisible] = useScrollAnimation(0.5);

  // Testimonials horizontal scroll
  const scrollRef = useRef(null);
  const [isScrollPaused, setIsScrollPaused] = useState(false);

  const testimonials = [
    {
      quote: "This tool helped me understand why my resume wasn't passing ATS filters.",
      author: "Software Developer",
      type: "Early User"
    },
    {
      quote: "The skill matching feature showed me exactly which keywords I was missing.",
      author: "Marketing Manager",
      type: "Beta User"
    },
    {
      quote: "Finally got callbacks after optimizing my resume with this tool.",
      author: "Career Switcher",
      type: "Early User"
    },
    {
      quote: "Simple, effective, and helped me land interviews faster.",
      author: "Product Manager",
      type: "Beta User"
    },
    {
      quote: "The recommendations were spot-on and easy to implement.",
      author: "Data Analyst",
      type: "Early User"
    }
  ];

  // Horizontal auto-scroll effect
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isScrollPaused) return;

    let animationId;
    let scrollPos = 0;
    const speed = 0.5; // Very slow scroll

    const scroll = () => {
      scrollPos += speed;
      if (scrollPos >= scrollContainer.scrollWidth / 2) {
        scrollPos = 0;
      }
      scrollContainer.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isScrollPaused]);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Fade up animations */}
      <section
        ref={heroRef}
        className="bg-gradient-to-br from-primary-700 via-primary-600 to-blue-500 text-white py-20 lg:py-28 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge - fade up */}
          <span
            className={`inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            <Sparkles className="h-4 w-4" />
            AI-Powered Resume Optimization
          </span>

          {/* Headline - fade up with delay */}
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight transition-all duration-700 delay-100 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            Beat ATS Filters.
            <span className="block text-yellow-300">Get More Interviews.</span>
          </h1>

          {/* Subtext - fade up with delay */}
          <p
            className={`text-lg md:text-xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            Analyze and optimize your resume for real job descriptions using AI — instantly.
          </p>

          {/* CTAs - fade up with delay */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center mb-8 transition-all duration-700 delay-300 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            <Link to="/signup">
              <button className="bg-white text-primary-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 transform">
                Get Started Free
              </button>
            </Link>
            <Link to="/login">
              <button className="bg-transparent border-2 border-white/50 text-white hover:border-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300">
                Login
              </button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div
            className={`flex flex-wrap items-center justify-center gap-6 text-blue-200 text-sm transition-all duration-700 delay-400 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Instant results
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Free to start
            </span>
          </div>
        </div>
      </section>

      {/* Stats / Counters Section */}
      <section ref={statsRef} className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, value: 10000, suffix: '+', label: 'Resumes Optimized' },
              { icon: Award, value: 95, suffix: '%', label: 'Success Rate' },
              { icon: Zap, value: 3, suffix: 'x', label: 'More Interviews' },
            ].map((stat, index) => (
              <div
                key={index}
                className={`bg-white p-8 rounded-xl border border-gray-100 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${statsVisible
                  ? `opacity-100 translate-y-0`
                  : 'opacity-0 translate-y-4'
                  }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-7 w-7 text-primary-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  <AnimatedCounter
                    end={stat.value}
                    suffix={stat.suffix}
                    isVisible={statsVisible}
                    duration={1200}
                  />
                </div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={howItWorksRef} className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-14 transition-all duration-700 ${howItWorksVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Three simple steps to optimize your resume for ATS
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: 1, icon: Upload, title: 'Upload Resume', desc: 'Upload your resume in PDF or DOCX format' },
              { step: 2, icon: FileSearch, title: 'Paste Job Description', desc: 'Add the job description you\'re targeting' },
              { step: 3, icon: BarChart3, title: 'Get ATS Analysis', desc: 'Receive your score and recommendations' },
            ].map((item, index) => (
              <div
                key={index}
                className={`text-center group transition-all duration-700 ${howItWorksVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
                  }`}
                style={{ transitionDelay: `${(index + 1) * 120}ms` }}
              >
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-primary-50 transition-all duration-300">
                    <item.icon className="h-9 w-9 text-gray-400 group-hover:text-primary-600 transition-colors duration-300" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 text-white text-sm font-bold rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section ref={featuresRef} className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-14 transition-all duration-700 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Core Features</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Everything you need to optimize your resume for ATS systems
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              { icon: Target, title: 'ATS Score Analysis', desc: 'Get a detailed compatibility score showing how well your resume matches job requirements' },
              { icon: CheckCircle, title: 'Skill Matching', desc: 'See which skills you have and which ones are missing from the job description' },
              { icon: Lightbulb, title: 'Smart Recommendations', desc: 'Receive actionable, prioritized suggestions to improve your resume' },
              { icon: Search, title: 'Keyword Optimization', desc: 'Identify and add missing keywords to increase your resume visibility' },
            ].map((feature, index) => (
              <div
                key={index}
                className={`bg-white p-6 rounded-xl border border-gray-200 group hover:shadow-xl hover:-translate-y-1.5 hover:border-l-4 hover:border-l-primary-500 transition-all duration-300 ${featuresVisible
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-4 scale-[0.98]'
                  }`}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Horizontal Auto-Scroll */}
      <section ref={testimonialsRef} className="py-16 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-10 transition-all duration-700 ${testimonialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            <Sparkles className="h-6 w-6 text-primary-600 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-gray-900">What Users Are Saying</h2>
          </div>

          {/* Horizontal Scroll Container */}
          <div
            ref={scrollRef}
            className={`flex gap-5 overflow-x-hidden transition-all duration-700 delay-200 ${testimonialsVisible ? 'opacity-100' : 'opacity-0'
              }`}
            onMouseEnter={() => setIsScrollPaused(true)}
            onMouseLeave={() => setIsScrollPaused(false)}
            style={{ scrollBehavior: 'auto' }}
          >
            {/* Duplicate testimonials for infinite scroll effect */}
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[38%] bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                {/* 5 Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-700 mb-5 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-medium text-gray-900">— {testimonial.type}</p>
                  <p className="text-gray-500 text-sm">{testimonial.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        ref={ctaRef}
        className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-center"
      >
        <div
          className={`max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Optimize Your Resume?</h2>
          <p className="text-primary-100 mb-8">Start improving your ATS score today.</p>

          <Link to="/signup">
            <button className="bg-white text-primary-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-105 transform">
              Get Started Free
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
