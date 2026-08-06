import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'growth' | 'leadership' | 'progress' | 'achievement' | 'default'
  size?: 'sm' | 'md' | 'lg'
}

export default function Badge({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  const variantClasses = {
    growth: 'bg-growth-100 text-growth-700 border-growth-200',
    leadership: 'bg-leadership-100 text-leadership-700 border-leadership-200',
    progress: 'bg-progress-100 text-progress-700 border-progress-200',
    achievement: 'bg-achievement-100 text-achievement-700 border-achievement-200',
    default: 'bg-slate-100 text-slate-700 border-slate-200',
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full font-medium border',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
