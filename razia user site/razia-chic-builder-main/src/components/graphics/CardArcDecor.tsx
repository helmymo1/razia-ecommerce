import React from 'react';

interface CardArcDecorProps {
  position?: 'top-right' | 'bottom-left' | 'both';
  variant?: 'gold' | 'teal' | 'coral';
  className?: string;
}

const CardArcDecor: React.FC<CardArcDecorProps> = ({ 
  position = 'top-right',
  variant = 'gold',
  className = '' 
}) => {
  const colorMap = {
    gold: 'hsl(var(--gold))',
    teal: 'hsl(var(--teal))',
    coral: 'hsl(var(--coral))'
  };

  const color = colorMap[variant];

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] ${className}`}>
      {(position === 'top-right' || position === 'both') && (
        <div className="absolute -top-6 -right-6 w-20 h-20 opacity-20">
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <path
              d="M40,8 A32,32 0 0,1 72,40"
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M40,18 A22,22 0 0,1 62,40"
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>
        </div>
      )}
      
      {(position === 'bottom-left' || position === 'both') && (
        <div className="absolute -bottom-6 -left-6 w-16 h-16 opacity-15">
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <path
              d="M8,40 A32,32 0 0,1 40,72"
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default CardArcDecor;
