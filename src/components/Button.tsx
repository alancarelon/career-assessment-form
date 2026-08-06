import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-gradient-to-r from-growth-600 to-growth-700 text-white hover:from-growth-700 hover:to-growth-800 shadow-lg hover:shadow-xl focus:ring-growth-500':
              variant === 'primary',
            'bg-white text-slate-900 hover:bg-slate-50 shadow-md hover:shadow-lg border border-slate-200 focus:ring-slate-300':
              variant === 'secondary',
            'border-2 border-growth-600 text-growth-700 hover:bg-growth-50 focus:ring-growth-500':
              variant === 'outline',
            'text-slate-700 hover:bg-slate-100 focus:ring-slate-300': variant === 'ghost',
          },
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
