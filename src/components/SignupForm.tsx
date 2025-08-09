import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Waves, Wallet } from 'lucide-react'
import GlassCard from './GlassCard'
import Button from './Button'
import Input from './Input'
import GoogleLoginButton from './GoogleLoginButton'

interface SignupFormProps {
  onSignup: (userData: { email?: string; name: string; address?: string; balance?: string; chainId?: string }) => void
  onSwitchToLogin: () => void
  onSwitchToWeb3: () => void
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignup, onSwitchToLogin, onSwitchToWeb3 }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    onSignup({ email, name })
    setIsLoading(false)
  }

  const handleGoogleSignup = (googleUser: { id: string; name: string; email: string; picture: string }) => {
    onSignup({
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
        <p className="text-gray-600">Join Wawee today</p>
      </div>

      {/* Google Signup Button */}
      <div className="mb-6">
        <GoogleLoginButton 
          onGoogleLogin={handleGoogleSignup}
          className="w-full"
        />
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200/50"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white/50 text-gray-500">Or create with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<User className="w-5 h-5 text-gray-400" />}
          required
        />

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
            placeholder="Create a password"
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

        <div className="relative">
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<Lock className="w-5 h-5 text-gray-400" />}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex items-start space-x-2 text-sm">
          <input
            type="checkbox"
            required
            className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
          />
          <span className="text-gray-600">
            I agree to the{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Privacy Policy
            </a>
          </span>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          icon={<UserPlus className="w-5 h-5" />}
          className="w-full"
        >
          Create Account
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Sign in
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

export default SignupForm
