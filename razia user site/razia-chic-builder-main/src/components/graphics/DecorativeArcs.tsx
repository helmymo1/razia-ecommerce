import React from 'react';
import { motion } from 'framer-motion';

interface DecorativeArcsProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  position?: 'left' | 'right' | 'center';
}

const DecorativeArcs: React.FC<DecorativeArcsProps> = ({ 
  className = '',
  size = 'md',
  position = 'right'
}) => {
  const sizeMap = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
  };

  const positionMap = {
    left: '-left-8 top-1/2 -translate-y-1/2',
    right: '-right-8 top-1/2 -translate-y-1/2',
    center: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`absolute ${positionMap[position]} ${sizeMap[size]} ${className}`}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Outer arc - Coral */}
        <motion.path
          d="M100,20 A80,80 0 0,1 180,100"
          fill="none"
          stroke="hsl(var(--coral))"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        {/* Middle arc - Gold */}
        <motion.path
          d="M100,40 A60,60 0 0,1 160,100"
          fill="none"
          stroke="hsl(var(--gold))"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
        />
        {/* Inner arc - Teal */}
        <motion.path
          d="M100,60 A40,40 0 0,1 140,100"
          fill="none"
          stroke="hsl(var(--teal))"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
        />
        {/* Center dot - Sand */}
        <motion.circle
          cx="100"
          cy="100"
          r="6"
          fill="hsl(var(--sand))"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.8 }}
        />
      </svg>
    </motion.div>
  );
};

export default DecorativeArcs;
