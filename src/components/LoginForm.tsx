import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, LogIn, Waves, Wallet } from 'lucide-react'
import GlassCard from './GlassCard'
import Button from './Button'
import Input from './Input'
import GoogleLoginButton from './GoogleLoginButton'

interface LoginFormProps {
  onLogin: (userData: { email?: string; name: string; address?: string; balance?: string; chainId?: string }) => void
  onSwitchToSignup: () => void
  onSwitchToForgot: () => void
  onSwitchToWeb3: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToSignup, onSwitchToForgot, onSwitchToWeb3 }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    onLogin({ email, name: email.split('@')[0] })
    setIsLoading(false)
  }

  const handleGoogleLogin = (googleUser: { id: string; name: string; email: string; picture: string }) => {
    onLogin({
      email: googleUser.email,
      name: googleUser.name
    })
  }

  return (
    <GlassCard>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20">
            <Waves className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
        <p className="text-gray-600">Sign in to your Wawee account</p>
      </div>

      {/* Google Login Button */}
      <div className="mb-6">
        <GoogleLoginButton 
          onGoogleLogin={handleGoogleLogin}
          className="w-full"
        />
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200/50"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white/50 text-gray-500">Or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-5 h-5 text-gray-400" />}
          required
        />

        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-5 h-5 text-gray-400" />}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-gray-600">Remember me</span>
          </label>
          <button
            type="button"
            onClick={onSwitchToForgot}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          icon={<LogIn className="w-5 h-5" />}
          className="w-full"
        >
          Sign In
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Sign up
          </button>
        </p>
      </div>

      <div className="mt-6 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200/50"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white/50 text-gray-500">Or try Web3</span>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={onSwitchToWeb3}
          className="w-full flex items-center justify-center px-4 py-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 group space-x-2"
        >
          <Wallet className="w-5 h-5 text-purple-600" />
          <span className="text-gray-700 font-medium">Connect Wallet</span>
        </button>
      </div>
    </GlassCard>
  )
}

export default LoginForm
