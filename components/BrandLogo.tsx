
import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm rounded-lg',
    md: 'w-12 h-12 text-xl rounded-xl',
    lg: 'w-16 h-16 text-2xl rounded-2xl'
  };

  return (
    <div className={`flex items-center justify-center bg-emerald-500 text-white font-black shadow-lg shadow-emerald-500/20 rotate-3 select-none ${sizes[size]} ${className}`}>
      <span className="tracking-tighter">NS</span>
    </div>
  );
};

export default BrandLogo;
