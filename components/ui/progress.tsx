import * as React from "react"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(({ value = 0, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`relative h-2 w-full overflow-hidden rounded-full bg-muted ${className ?? ""}`}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-emerald-500 transition-transform"
        style={{ transform: `translateX(-${100 - Math.min(100, Math.max(0, value))}%)` }}
      />
    </div>
  )
})
Progress.displayName = "Progress"
