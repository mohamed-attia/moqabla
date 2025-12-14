import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'white';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '',
  disabled = false,
  type = "button"
}) => {
  const baseStyles = "px-6 py-3 rounded-lg font-bold transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  
  const variants = {
    primary: "bg-accent text-white hover:bg-accentHover shadow-lg hover:shadow-accent/50 focus:ring-accent",
    outline: "border-2 border-accent text-accent hover:bg-accent hover:text-white focus:ring-accent",
    white: "bg-white text-primary hover:bg-gray-100 shadow-lg focus:ring-white"
  };

  // If disabled, remove hover effects by not relying on the class string alone or handled by disabled pseudo-class
  const variantStyles = variants[variant];

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;