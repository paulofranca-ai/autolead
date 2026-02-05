import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => {
  return (
    <img 
      src="https://i.imgur.com/OlCZmc6.png" 
      alt="AutoLeads Logo" 
      className={`${className} object-contain`}
    />
  );
};