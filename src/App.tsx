import React, { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import ForgotPasswordForm from './components/ForgotPasswordForm'
import Web3LoginForm from './components/Web3LoginForm'
import Dashboard from './components/Dashboard'
import { useMetaMask } from './hooks/useMetaMask'

type AuthMode = 'login' | 'signup' | 'forgot' | 'web3'
type User = { email?: string; name: string; address?: string; balance?: string; chainId?: string }

function App() {
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [user, setUser] = useState<User | null>(null)
  const { formatAddress, getChainName } = useMetaMask()

  // Check for existing session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('wawee_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('wawee_user')
      }
    }
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    localStorage.setItem('wawee_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('wawee_user')
    setAuthMode('login')
  }

  const handleWeb3Login = (web3User: { address: string; balance: string; chainId: string; name: string }) => {
    const userData: User = {
      name: web3User.name,
      address: web3User.address,
      balance: web3User.balance,
      chainId: web3User.chainId
    }
    handleLogin(userData)
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <Dashboard 
            user={user} 
            onLogout={handleLogout}
            formatAddress={formatAddress}
            getChainName={getChainName}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {authMode === 'login' && (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToSignup={() => setAuthMode('signup')}
            onSwitchToForgot={() => setAuthMode('forgot')}
            onSwitchToWeb3={() => setAuthMode('web3')}
          />
        )}
        {authMode === 'signup' && (
          <SignupForm
            onSignup={handleLogin}
            onSwitchToLogin={() => setAuthMode('login')}
            onSwitchToWeb3={() => setAuthMode('web3')}
          />
        )}
        {authMode === 'forgot' && (
          <ForgotPasswordForm
            onBackToLogin={() => setAuthMode('login')}
          />
        )}
        {authMode === 'web3' && (
          <Web3LoginForm
            onWeb3Login={handleWeb3Login}
            onSwitchToTraditional={() => setAuthMode('login')}
          />
        )}
      </div>
    </div>
  )
}

export default App
