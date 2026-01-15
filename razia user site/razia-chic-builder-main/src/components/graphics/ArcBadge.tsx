import React from 'react';
import { motion } from 'framer-motion';

interface ArcBadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'teal' | 'coral' | 'sand';
  className?: string;
}

const ArcBadge: React.FC<ArcBadgeProps> = ({ 
  children, 
  variant = 'gold',
  className = '' 
}) => {
  const colorMap = {
    gold: {
      bg: 'bg-gold/10',
      border: 'border-gold/30',
      text: 'text-gold',
      arc: 'hsl(var(--gold))'
    },
    teal: {
      bg: 'bg-teal/10',
      border: 'border-teal/30',
      text: 'text-teal',
      arc: 'hsl(var(--teal))'
    },
    coral: {
      bg: 'bg-coral/10',
      border: 'border-coral/30',
      text: 'text-coral',
      arc: 'hsl(var(--coral))'
    },
    sand: {
      bg: 'bg-sand/20',
      border: 'border-sand/40',
      text: 'text-foreground',
      arc: 'hsl(var(--sand))'
    }
  };

  const colors = colorMap[variant];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-full ${colors.bg} border ${colors.border} ${className}`}
    >
      {/* Small decorative arc */}
      <svg className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-6" viewBox="0 0 12 24">
        <path
          d="M10,2 A10,10 0 0,0 10,22"
          fill="none"
          stroke={colors.arc}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className={`font-medium text-sm ${colors.text} pl-2`}>
        {children}
      </span>
      {/* Small decorative arc on right */}
      <svg className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-6" viewBox="0 0 12 24">
        <path
          d="M2,2 A10,10 0 0,1 2,22"
          fill="none"
          stroke={colors.arc}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
};

export default ArcBadge;
