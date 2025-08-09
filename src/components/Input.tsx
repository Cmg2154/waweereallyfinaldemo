import React from 'react'

interface InputProps {
  type: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  icon?: React.ReactNode
  required?: boolean
  className?: string
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  icon,
  required = false,
  className = ''
}) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          w-full
          ${icon ? 'pl-10' : 'pl-4'}
          pr-4 py-3
          bg-white/10
          backdrop-blur-sm
          border border-white/20
          rounded-xl
          text-gray-800
          placeholder-gray-500
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500/50
          focus:border-blue-500/50
          transition-all
          duration-200
          hover:bg-white/15
          ${className}
        `}
      />
    </div>
  )
}

export default Input
