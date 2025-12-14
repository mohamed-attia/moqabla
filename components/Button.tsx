import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'white';
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '' 
}) => {
  const baseStyles = "px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-accent text-white hover:bg-accentHover shadow-lg hover:shadow-accent/50 focus:ring-accent",
    outline: "border-2 border-accent text-accent hover:bg-accent hover:text-white focus:ring-accent",
    white: "bg-white text-primary hover:bg-gray-100 shadow-lg focus:ring-white"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;