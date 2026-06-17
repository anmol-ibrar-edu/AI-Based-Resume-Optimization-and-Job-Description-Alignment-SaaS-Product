import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, User, Mail, Phone, MapPin } from 'lucide-react';

const ResumeTypingPreview = ({ name = "John Doe", role = "Software Engineer" }) => {
  const summaryText = "Software engineer with 5+ years of experience building scalable cloud solutions and microservices architecture for modern enterprises. Passionate about clean code and performance optimization.";
  
  const skills = [
    "Python", "SQL", "React", "AWS", "Docker", "K8s",
    "Redis", "GraphQL", "TypeScript", "Node.js", "CI/CD", "Terraform"
  ];

  const experience = {
    title: "Senior Developer @ Tech Solutions",
    date: "2021 — Present",
    bullets: [
      "Architected microservices that handled 1M+ req/day",
      "Reduced API latency by 40% through Redis caching",
      "Led a team of 5 engineers for the core product launch"
    ]
  };

  const [typedSummary, setTypedSummary] = useState("");
  const [visibleSkills, setVisibleSkills] = useState([]);
  const [showExp, setShowExp] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedSummary(summaryText.slice(0, i));
      i++;
      if (i > summaryText.length) {
        clearInterval(interval);
        setTimeout(() => setShowExp(true), 500);
      }
    }, 15);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeouts = skills.map((skill, index) => {
      return setTimeout(() => {
        setVisibleSkills(prev => [...prev, skill]);
      }, (summaryText.length * 15) + (index * 300));
    });
    return () => timeouts.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-white rounded-[32px] p-6 shadow-2xl w-full max-w-[420px] font-sans text-left overflow-hidden relative"
    >
      {/* Resume Header */}
      <div className="border-b-2 border-slate-100 dark:border-slate-800 pb-4 mb-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white font-heading tracking-tight">{name}</h2>
        <p className="text-brand-600 font-black text-[10px] uppercase tracking-widest mt-1">{role}</p>
        
        <div className="flex flex-wrap gap-3 mt-3 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
          <div className="flex items-center gap-1"><Mail size={10} /> john@ai.com</div>
          <div className="flex items-center gap-1"><MapPin size={10} /> New York, USA</div>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-4">
        <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Professional Summary</h3>
        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed min-h-[50px]">
          {typedSummary}
          <motion.span 
            animate={{ opacity: [0, 1, 0] }} 
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-1 h-3 bg-brand-600 ml-0.5"
          />
        </p>
      </div>

      {/* Experience */}
      {showExp && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4"
        >
          <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Experience</h3>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-black text-slate-900 dark:text-white">{experience.title}</p>
              <span className="text-[8px] font-bold text-slate-400">{experience.date}</span>
            </div>
            <ul className="space-y-1">
              {experience.bullets.map((b, bi) => (
                <li key={bi} className="text-[9px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                  <span className="text-brand-600 mt-1">•</span> {b}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* Skills */}
      <div>
        <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Key Competencies</h3>
        <div className="flex flex-wrap gap-1.5">
          {visibleSkills.map((skill, idx) => (
            <motion.span 
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-[8px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Watermark */}
      <div className="absolute -bottom-4 -right-4 opacity-5 rotate-12 pointer-events-none">
        <FileText size={120} />
      </div>
    </motion.div>
  );
};

export default ResumeTypingPreview;
