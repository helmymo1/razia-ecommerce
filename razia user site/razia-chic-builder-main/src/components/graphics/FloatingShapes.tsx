import React from 'react';
import { motion } from 'framer-motion';

interface FloatingShapesProps {
  className?: string;
}

const FloatingShapes: React.FC<FloatingShapesProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Top right coral arc */}
      <motion.div
        className="absolute -top-10 -right-10 w-40 h-40 md:w-60 md:h-60"
        initial={{ opacity: 0, rotate: -20 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M80,20 A60,60 0 0,1 80,80"
            fill="none"
            stroke="hsl(var(--coral))"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M70,30 A40,40 0 0,1 70,70"
            fill="none"
            stroke="hsl(var(--gold))"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>
      </motion.div>

      {/* Bottom left teal arc */}
      <motion.div
        className="absolute -bottom-10 -left-10 w-32 h-32 md:w-48 md:h-48"
        initial={{ opacity: 0, rotate: 20 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M20,80 A60,60 0 0,1 80,80"
            fill="none"
            stroke="hsl(var(--teal))"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M30,70 A40,40 0 0,1 70,70"
            fill="none"
            stroke="hsl(var(--sand))"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>
      </motion.div>

      {/* Center floating dots */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-4 h-4"
        animate={{ 
          y: [0, -10, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-full h-full rounded-full bg-gold" />
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-1/3 w-3 h-3"
        animate={{ 
          y: [0, -8, 0],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <div className="w-full h-full rounded-full bg-coral" />
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 right-1/4 w-2 h-2"
        animate={{ 
          y: [0, -6, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <div className="w-full h-full rounded-full bg-teal" />
      </motion.div>
    </div>
  );
};

export default FloatingShapes;
