import { useState, useEffect } from 'react'

interface GoogleUser {
  id: string
  name: string
  email: string
  picture: string
}

interface GoogleAuthResponse {
  credential: string
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void
          renderButton: (element: HTMLElement, config: any) => void
          prompt: () => void
          disableAutoSelect: () => void
        }
      }
    }
  }
}

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initializeGoogleAuth = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      })
    }
  }

  const handleCredentialResponse = (response: GoogleAuthResponse) => {
    try {
      // Decode JWT token to get user info
      const payload = JSON.parse(atob(response.credential.split('.')[1]))
      
      const googleUser: GoogleUser = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture
      }

      // Trigger custom event with user data
      window.dispatchEvent(new CustomEvent('googleAuthSuccess', { 
        detail: googleUser 
      }))
    } catch (error) {
      console.error('Error processing Google auth response:', error)
      setError('Failed to process Google authentication')
    }
  }

  const signInWithGoogle = () => {
    setIsLoading(true)
    setError(null)
    
    if (window.google) {
      window.google.accounts.id.prompt()
    } else {
      setError('Google authentication not available')
      setIsLoading(false)
    }
  }

  const renderGoogleButton = (element: HTMLElement) => {
    if (window.google && element) {
      window.google.accounts.id.renderButton(element, {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left'
      })
    }
  }

  useEffect(() => {
    // Initialize when Google script loads
    const checkGoogleLoaded = () => {
      if (window.google) {
        initializeGoogleAuth()
      } else {
        setTimeout(checkGoogleLoaded, 100)
      }
    }
    checkGoogleLoaded()

    // Listen for auth success
    const handleAuthSuccess = () => {
      setIsLoading(false)
    }

    window.addEventListener('googleAuthSuccess', handleAuthSuccess)
    return () => window.removeEventListener('googleAuthSuccess', handleAuthSuccess)
  }, [])

  return {
    signInWithGoogle,
    renderGoogleButton,
    isLoading,
    error,
    initializeGoogleAuth
  }
}
