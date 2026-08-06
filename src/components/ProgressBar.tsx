import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  color?: 'growth' | 'leadership' | 'progress' | 'achievement'
}

export default function ProgressBar({
  value,
  max = 100,
  className,
  showLabel = true,
  color = 'growth',
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  const colorClasses = {
    growth: 'bg-growth-500',
    leadership: 'bg-leadership-500',
    progress: 'bg-progress-500',
    achievement: 'bg-achievement-500',
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-2">
        {showLabel && (
          <span className="text-sm font-medium text-slate-700">{Math.round(percentage)}%</span>
        )}
      </div>
      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            colorClasses[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
