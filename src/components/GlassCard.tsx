import React from 'react'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`
      bg-white/10 
      backdrop-blur-lg 
      border border-white/20 
      rounded-2xl 
      p-8 
      shadow-xl 
      shadow-black/5
      hover:bg-white/15 
      transition-all 
      duration-300
      ${className}
    `}>
      {children}
    </div>
  )
}

export default GlassCard
