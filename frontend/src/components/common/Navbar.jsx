import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, Sun, Moon, ShieldCheck, ArrowUpRight, Zap } from 'lucide-react';
import LogoImg from '../../assets/Logo-transparent.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const navLink = (to, label) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${
          active
            ? 'text-brand-600 bg-brand-50/50 dark:bg-brand-900/10'
            : 'text-[#6B6258] dark:text-[#A09890] hover:text-brand-600 dark:hover:text-brand-400'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-white/80 dark:bg-[#0D0B09]/80 backdrop-blur-xl border-b border-[#EAE4DA] dark:border-slate-900 py-3'
        : 'bg-transparent border-b border-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-3 group">
              <img src={LogoImg} alt="ResumeAI" className="h-7 w-auto grayscale group-hover:grayscale-0 transition-all duration-500" />
              <span className="text-2xl font-[900] text-slate-900 dark:text-white tracking-tighter font-heading">
                Resume<span className="text-brand-600">AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-2">
            {navLink('/', 'Home')}

            {user ? (
              <>
                {navLink('/upload', 'Analyze Resume')}
                {navLink('/dashboard', 'Dashboard')}
                {navLink('/career', 'Career Path')}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                  >
                    <ShieldCheck size={14} /> Admin
                  </Link>
                )}

                <div className="w-px h-6 bg-[#EAE4DA] dark:bg-slate-800 mx-4" />

                <label className="theme-switch mx-4">
                  <input 
                    type="checkbox" 
                    checked={theme === 'dark'}
                    onChange={toggleTheme}
                  />
                  <span className="theme-slider" />
                </label>

                {/* User dropdown */}
                <div className="relative group ml-3">
                  <button className="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-white dark:bg-slate-900 border border-[#EAE4DA] dark:border-slate-800 rounded-full hover:border-brand-600 transition-all shadow-sm">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${
                      user.role === 'admin'
                        ? 'bg-rose-600 text-white'
                        : 'bg-brand-600 text-white shadow-brand'
                    }`}>
                      {user.role === 'admin' ? <ShieldCheck size={14} /> : user.full_name?.charAt(0) || <User size={14} />}
                    </div>
                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">
                      {user.full_name?.split(' ')[0]}
                    </span>
                  </button>

                  <div className="absolute right-0 mt-4 w-60 bg-white dark:bg-[#161310] rounded-3xl shadow-card-hover border border-[#EAE4DA] dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-3 z-50">
                    <div className="px-5 py-3 border-b border-[#F1F1EF] dark:border-slate-800/50 mb-2">
                       <p className="text-[10px] font-black text-[#A09890] uppercase tracking-widest mb-1">Authenticated As</p>
                       <p className="text-xs font-black text-slate-900 dark:text-white truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-700 dark:text-[#A09890] hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors w-full text-left"
                    >
                      <Zap size={14} className="text-brand-600" /> Settings & API Keys
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-5 py-3 text-xs font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut size={14} /> Sign out System
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <label className="theme-switch mx-2">
                  <input 
                    type="checkbox" 
                    checked={theme === 'dark'}
                    onChange={toggleTheme}
                  />
                  <span className="theme-slider" />
                </label>
                <Link to="/login" className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-[#6B6258] hover:text-brand-600 transition-colors">
                  Log in
                </Link>
                <Link to="/signup">
                  <button className="btn-premium !h-[3em] !pl-6 !pr-[3.5em] !text-[10px]">
                    Initialize <div className="btn-icon"><ArrowUpRight /></div>
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            <label className="theme-switch">
              <input 
                type="checkbox" 
                checked={theme === 'dark'}
                onChange={toggleTheme}
              />
              <span className="theme-slider" />
            </label>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-slate-900 dark:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0D0B09] border-t border-[#EAE4DA] dark:border-slate-800 px-8 py-10 flex flex-col gap-6 shadow-2xl overflow-y-auto max-h-[calc(100vh-80px)]">
          <Link to="/" className="text-2xl font-[900] text-slate-900 dark:text-white font-heading">Home</Link>
          {user ? (
            <>
              <Link to="/upload" className="text-2xl font-[900] text-slate-900 dark:text-white font-heading">Analyze Resume</Link>
              <Link to="/dashboard" className="text-2xl font-[900] text-slate-900 dark:text-white font-heading">Dashboard</Link>
              <Link to="/career" className="text-2xl font-[900] text-slate-900 dark:text-white font-heading">Career Path</Link>
              <Link to="/settings" className="text-2xl font-[900] text-slate-900 dark:text-white font-heading">Settings</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-2xl font-[900] text-rose-600 font-heading flex items-center gap-3">
                  <ShieldCheck size={22} /> Admin
                </Link>
              )}
              <button onClick={handleLogout} className="text-2xl font-[900] text-rose-600 font-heading text-left flex items-center gap-4">
                <LogOut size={24} /> Sign Out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-6">
              <Link to="/login" className="text-2xl font-[900] text-slate-900 dark:text-white font-heading">Log In</Link>
              <Link to="/signup" className="w-full bg-brand-600 text-white py-6 rounded-3xl text-center text-xl font-black uppercase tracking-widest shadow-brand">
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
