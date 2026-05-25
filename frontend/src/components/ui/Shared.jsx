import React from 'react';

export function Card({ children, className = "", hover = true }) {
  return (
    <div className={`card p-6 rounded-md ${hover ? 'hover:shadow-md hover:border-surfaceBorderHover transition-all' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function Badge({ children, variant = "primary", className = "" }) {
  const variants = {
    primary: "bg-primary/10 text-primary border-primary/20",
    accent: "bg-accent/10 text-accent border-accent/20",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    danger: "bg-danger/10 text-danger border-danger/20",
    muted: "bg-surfaceHover text-textMuted border-surfaceBorder"
  };

  return (
    <span className={`px-2.5 py-1 rounded text-xs font-semibold border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
