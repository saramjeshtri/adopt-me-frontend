type BadgeVariant = 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'orange'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  green:  'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  red:    'bg-red-100 text-red-700',
  blue:   'bg-blue-100 text-blue-700',
  gray:   'bg-gray-100 text-gray-600',
  orange: 'bg-orange-100 text-orange-700',
}

export default function Badge({ variant = 'gray', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}

// Helper to get adoption status badge variant
export function adoptionStatusVariant(status: string): BadgeVariant {
  if (status === 'Disponueshme')       return 'green'
  if (status === 'Takim i planifikuar') return 'yellow'
  if (status === 'Adoptuar')           return 'blue'
  return 'gray'
}

// Helper to get report status badge variant
export function reportStatusVariant(status: string): BadgeVariant {
  if (status === 'Hapur')    return 'red'
  if (status === 'Në proces') return 'yellow'
  if (status.startsWith('Zgjidhur')) return 'green'
  return 'gray'
}

// Helper to get meeting status badge variant
export function meetingStatusVariant(status: string): BadgeVariant {
  if (status === 'Konfirmuar')  return 'green'
  if (status === 'Në pritje')   return 'yellow'
  if (status === 'Përfunduar')  return 'blue'
  if (status === 'Anulluar')    return 'gray'
  return 'gray'
}