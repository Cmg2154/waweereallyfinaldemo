import React, { useEffect, useRef } from 'react'
import { useGoogleAuth } from '../hooks/useGoogleAuth'

interface GoogleLoginButtonProps {
  onGoogleLogin: (user: { id: string; name: string; email: string; picture: string }) => void
  className?: string
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onGoogleLogin, className = '' }) => {
  const buttonRef = useRef<HTMLDivElement>(null)
  const { renderGoogleButton, isLoading, error } = useGoogleAuth()

  useEffect(() => {
    // Listen for Google auth success
    const handleGoogleAuthSuccess = (event: CustomEvent) => {
      onGoogleLogin(event.detail)
    }

    window.addEventListener('googleAuthSuccess', handleGoogleAuthSuccess as EventListener)
    
    // Render Google button when component mounts
    if (buttonRef.current) {
      renderGoogleButton(buttonRef.current)
    }

    return () => {
      window.removeEventListener('googleAuthSuccess', handleGoogleAuthSuccess as EventListener)
    }
  }, [onGoogleLogin, renderGoogleButton])

  if (error) {
    return (
      <div className={`text-red-500 text-sm text-center ${className}`}>
        {error}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={buttonRef}
        className={`google-signin-button ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        style={{
          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}

export default GoogleLoginButton
