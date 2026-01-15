import React from 'react';
import { motion } from 'framer-motion';

interface WaveDividerProps {
  variant?: 'sand' | 'gold' | 'teal' | 'coral' | 'primary';
  flip?: boolean;
  className?: string;
}

const WaveDivider: React.FC<WaveDividerProps> = ({ 
  variant = 'sand', 
  flip = false,
  className = ''
}) => {
  const colorMap = {
    sand: 'fill-sand',
    gold: 'fill-gold',
    teal: 'fill-teal',
    coral: 'fill-coral',
    primary: 'fill-primary',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={`w-full overflow-hidden ${flip ? 'rotate-180' : ''} ${className}`}
    >
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={`w-full h-16 md:h-24 ${colorMap[variant]}`}
      >
        <path d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z" />
      </svg>
    </motion.div>
  );
};

export default WaveDivider;
