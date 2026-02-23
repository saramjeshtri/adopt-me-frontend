import React from 'react'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white shadow-lg shadow-red-200/50',
  secondary: 'bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white',
  outline:   'border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white disabled:border-gray-300 disabled:text-gray-300',
  ghost:     'text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:text-gray-300',
  danger:    'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs rounded-xl gap-1.5',
  md: 'px-6 py-3 text-sm rounded-xl gap-2',
  lg: 'px-8 py-4 text-base rounded-2xl gap-2.5',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-semibold transition-all duration-200
        cursor-pointer disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon}
      {children}
    </button>
  )
}