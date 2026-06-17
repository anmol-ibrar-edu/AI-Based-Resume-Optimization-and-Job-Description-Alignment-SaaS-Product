import { Link } from 'react-router-dom';
import { Mail, Github, Twitter, Linkedin, ExternalLink } from 'lucide-react';
import LogoImg from '../../assets/Logo-transparent.png';

const Footer = () => {
  return (
    <footer className="bg-[#FAFAF7] dark:bg-[#0D0B09] border-t border-[#EAE4DA] dark:border-slate-900 transition-colors duration-500 pt-20 pb-10 overflow-hidden relative">
      {/* Decorative Gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 bg-brand-500/5 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 lg:gap-20">

          {/* Brand & Manifesto */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-8 group w-fit">
              <img src={LogoImg} alt="ResumeAI" className="h-8 w-auto grayscale group-hover:grayscale-0 transition-all duration-500" />
              <span className="text-2xl font-[900] text-slate-900 dark:text-white tracking-tight font-heading">
                Resume<span className="text-brand-600">AI</span>
              </span>
            </Link>
            <p className="text-base text-[#6B6258] dark:text-[#A09890] leading-relaxed max-w-md font-medium mb-10">
              We're redefining the career optimization landscape with advanced semantic analysis and professional data modeling. Land your dream role with precision.
            </p>
            <div className="flex gap-4">
               {[Linkedin, Twitter, Github].map((Icon, i) => (
                 <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-[#EAE4DA] dark:border-slate-800 flex items-center justify-center text-[#6B6258] hover:text-brand-600 hover:border-brand-600 transition-all shadow-sm">
                    <Icon size={18} />
                 </a>
               ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-8">
              Platform
            </h4>
            <ul className="space-y-4">
              {[
                { to: '/', label: 'Home' },
                { to: '/upload', label: 'Analysis Engine' },
                { to: '/dashboard', label: 'Command Center' },
                { to: '/career', label: 'Career Roadmap' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm font-black text-[#6B6258] dark:text-[#A09890] uppercase tracking-widest hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-brand-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-8">
              Connection
            </h4>
            <div className="space-y-6">
               <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all">
                     <Mail size={18} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-[#A09890] uppercase tracking-widest mb-0.5">Contact Support</p>
                     <p className="text-sm font-black text-slate-900 dark:text-white">support@resumeai.com</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all">
                     <ExternalLink size={18} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-[#A09890] uppercase tracking-widest mb-0.5">Documentation</p>
                     <p className="text-sm font-black text-slate-900 dark:text-white">API Reference</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#EAE4DA] dark:border-slate-900 mt-20 pt-10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-xs text-[#6B6258] dark:text-[#A09890] font-black uppercase tracking-widest">
            © {new Date().getFullYear()} ResumeAI — High Performance Career Engine.
          </p>
          <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-900 border border-[#EAE4DA] dark:border-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest text-[#6B6258] dark:text-[#A09890] shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Neural Core Operational
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
