import React from 'react';
import { motion } from 'framer-motion';

interface BrandPatternProps {
  className?: string;
  opacity?: number;
}

const BrandPattern: React.FC<BrandPatternProps> = ({ 
  className = '',
  opacity = 0.1
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        style={{ opacity }}
      >
        <defs>
          <pattern id="brandPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            {/* Arc pattern inspired by your graphic elements */}
            <path
              d="M50,10 A40,40 0 0,1 90,50"
              fill="none"
              stroke="hsl(var(--gold))"
              strokeWidth="1.5"
            />
            <path
              d="M10,50 A40,40 0 0,1 50,90"
              fill="none"
              stroke="hsl(var(--teal))"
              strokeWidth="1.5"
            />
            <circle cx="50" cy="50" r="3" fill="hsl(var(--coral))" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#brandPattern)" />
      </svg>
    </motion.div>
  );
};

export default BrandPattern;
