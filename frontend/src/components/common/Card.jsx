const Card = ({ children, title, className = '', hover = true }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 transition-all duration-300 ${hover ? 'hover:shadow-xl hover:-translate-y-1' : ''} ${className}`}>
      {title && (
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
};

export default Card;

