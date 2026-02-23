import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'none'
  onClick?: () => void
}

const paddingClasses = {
  none: '',
  sm:   'p-4',
  md:   'p-5 md:p-6',
  lg:   'p-6 md:p-8',
}

export default function Card({
  children,
  className = '',
  hover = false,
  padding = 'md',
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl shadow-sm border border-orange-50
        ${hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer' : ''}
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

// A simpler stat card for dashboards
export function StatCard({
  label,
  value,
  icon,
  color = 'text-red-600',
}: {
  label: string
  value: number | string | undefined
  icon?: React.ReactNode
  color?: string
}) {
  return (
    <Card padding="md">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        {icon && <div className="text-gray-300">{icon}</div>}
      </div>
      <p className={`text-3xl font-bold ${color}`}>
        {value !== undefined && value !== null ? value : '—'}
      </p>
    </Card>
  )
}