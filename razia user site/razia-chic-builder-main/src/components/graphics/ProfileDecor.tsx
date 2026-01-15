import React from 'react';
import { motion } from 'framer-motion';

interface ProfileDecorProps {
  className?: string;
}

const ProfileDecor: React.FC<ProfileDecorProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Top right decorative arcs */}
      <motion.div
        className="absolute -top-20 -right-20 w-64 h-64 opacity-10"
        initial={{ opacity: 0, rotate: -20 }}
        animate={{ opacity: 0.1, rotate: 0 }}
        transition={{ duration: 1 }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Layered arcs inspired by the brand SVG */}
          <path
            d="M100,20 A80,80 0 0,1 180,100"
            fill="none"
            stroke="hsl(var(--coral))"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M100,40 A60,60 0 0,1 160,100"
            fill="none"
            stroke="hsl(var(--gold))"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M100,60 A40,40 0 0,1 140,100"
            fill="none"
            stroke="hsl(var(--teal))"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Bottom left decorative arcs */}
      <motion.div
        className="absolute -bottom-16 -left-16 w-48 h-48 opacity-10"
        initial={{ opacity: 0, rotate: 20 }}
        animate={{ opacity: 0.1, rotate: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path
            d="M20,100 A80,80 0 0,1 100,180"
            fill="none"
            stroke="hsl(var(--teal))"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M40,100 A60,60 0 0,1 100,160"
            fill="none"
            stroke="hsl(var(--sand))"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Floating accent dots */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-3 h-3 rounded-full bg-gold/30"
        animate={{ 
          y: [0, -8, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-coral/30"
        animate={{ 
          y: [0, -6, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
    </div>
  );
};

export default ProfileDecor;
