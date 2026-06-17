import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

const AnimatedCounter = ({ value, duration = 2000, suffix = '', prefix = '', decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    const startValue = 0;
    const endValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) || 0 : value;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function: easeOutQuart
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = (startValue + (endValue - startValue) * easeOutQuart);

      setCount(currentValue.toFixed(decimals));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue.toFixed(decimals));
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, isInView, decimals]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
};

export default AnimatedCounter;