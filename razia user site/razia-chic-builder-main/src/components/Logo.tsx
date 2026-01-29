import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Logo = ({ className, size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'w-20',
    md: 'w-32',
    lg: 'w-48',
    xl: 'w-64',
  };

  return (
    <img
      src="/logo.png"
      alt="Razia"
      className={cn(sizeClasses[size], 'h-auto object-contain', className)}
    />
  );
};

export default Logo;
