// src/components/shared/section.tsx
import { cn } from '@/lib/utils'

interface SectionProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  id?: string
  background?: 'default' | 'muted' | 'dark' | 'gradient'
}

const backgroundClasses = {
  default: 'bg-background',
  muted: 'bg-muted/50',
  dark: 'bg-brand-charcoal-900',
  gradient: 'bg-gradient-to-b from-background to-muted/50',
}

export function Section({
  children,
  className,
  containerClassName,
  id,
  background = 'default',
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn('section-padding', backgroundClasses[background], className)}
    >
      <div className={cn('container mx-auto px-4', containerClassName)}>
        {children}
      </div>
    </section>
  )
}

// Section Header Component
interface SectionHeaderProps {
  title: string
  subtitle?: string
  description?: string
  centered?: boolean
  className?: string
}

export function SectionHeader({
  title,
  subtitle,
  description,
  centered = true,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'max-w-3xl mb-12',
        centered && 'mx-auto text-center',
        className
      )}
    >
      {subtitle && (
        <span className="inline-block text-sm font-semibold text-brand-lime-500 uppercase tracking-wider mb-2">
          {subtitle}
        </span>
      )}
      <h2 className="heading-2 mb-4">{title}</h2>
      {description && (
        <p className="text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  )
}