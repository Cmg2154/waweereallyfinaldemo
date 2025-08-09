import React from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  className?: string
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon,
  className = ''
}) => {
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-xl
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    backdrop-blur-sm border
  `

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-blue-600 to-purple-600
      hover:from-blue-700 hover:to-purple-700
      text-white border-transparent
      focus:ring-blue-500
      shadow-lg shadow-blue-500/25
    `,
    secondary: `
      bg-white/10 hover:bg-white/20
      text-gray-700 border-white/20
      focus:ring-gray-500
    `
  }

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm space-x-1',
    md: 'px-4 py-3 text-base space-x-2',
    lg: 'px-6 py-4 text-lg space-x-3'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        icon && <span>{icon}</span>
      )}
      <span>{children}</span>
    </button>
  )
}

export default Button
