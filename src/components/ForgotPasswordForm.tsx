import React, { useState } from 'react'
import { Mail, ArrowLeft, Send, Waves } from 'lucide-react'
import GlassCard from './GlassCard'
import Button from './Button'
import Input from './Input'

interface ForgotPasswordFormProps {
  onResetPassword: (email: string) => void
  onSwitchToLogin: () => void
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onResetPassword, onSwitchToLogin }) => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsEmailSent(true)
    setIsLoading(false)
    
    setTimeout(() => {
      onResetPassword(email)
    }, 2000)
  }

  if (isEmailSent) {
    return (
      <GlassCard>
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-white/20">
              <Mail className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Check Your Email</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            We've sent a password reset link to <strong>{email}</strong>. 
            Please check your inbox and follow the instructions to reset your password.
          </p>
          <Button
            onClick={onSwitchToLogin}
            icon={<ArrowLeft className="w-5 h-5" />}
            variant="secondary"
            className="w-full"
          >
            Back to Sign In
          </Button>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-white/20">
            <Waves className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
        <p className="text-gray-600">Enter your email to reset your password</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-5 h-5 text-gray-400" />}
          required
        />

        <Button
          type="submit"
          isLoading={isLoading}
          icon={<Send className="w-5 h-5" />}
          className="w-full"
        >
          Send Reset Link
        </Button>
      </form>

      <div className="mt-8 text-center">
        <button
          onClick={onSwitchToLogin}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </button>
      </div>
    </GlassCard>
  )
}

export default ForgotPasswordForm
