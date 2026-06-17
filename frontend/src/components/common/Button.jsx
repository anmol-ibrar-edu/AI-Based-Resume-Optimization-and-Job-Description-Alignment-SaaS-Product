const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-black uppercase tracking-widest rounded-2xl transition-all duration-500 flex items-center justify-center text-[10px]';

  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand hover:shadow-brand-lg hover:-translate-y-0.5 border border-transparent',
    secondary: 'bg-[#FAFAF7] dark:bg-slate-900 text-brand-600 dark:text-brand-400 border border-[#EAE4DA] dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:border-brand-600',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-xl border border-transparent',
    ghost: 'bg-transparent text-slate-600 dark:text-[#A09890] hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/10'
  };

  const sizes = {
    sm: 'px-5 py-2.5',
    md: 'px-8 py-4',
    lg: 'px-10 py-5 text-xs',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4 mr-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Processing...
        </>
      ) : children}
    </button>
  );
};

export default Button;
