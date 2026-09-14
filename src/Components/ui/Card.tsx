import React from 'react';

const PADDING = {
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
  xl: 'p-8',
} as const;

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: keyof typeof PADDING;
}

// Shared card surface used across the trader and customs dashboards so
// spacing/border/shadow stay consistent instead of each section inventing
// its own variant. Pass extra layout classes (grid spans, min-w-0, etc.)
// via `className`; use `padding` rather than a padding utility in
// `className` to avoid Tailwind class-order conflicts.
export default function Card({ children, className = '', padding = 'lg' }: CardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 ${PADDING[padding]} ${className}`}>
      {children}
    </div>
  );
}
