import React from 'react'
import { Waves, ArrowLeft } from 'lucide-react'
import GlassCard from './GlassCard'
import MetaMaskButton from './MetaMaskButton'
import Button from './Button'

interface Web3LoginFormProps {
  onWeb3Login: (user: { address: string; balance: string; chainId: string; name: string }) => void
  onSwitchToTraditional: () => void
}

const Web3LoginForm: React.FC<Web3LoginFormProps> = ({ onWeb3Login, onSwitchToTraditional }) => {
  return (
    <GlassCard>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/20">
            <Waves className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Web3 Login</h1>
        <p className="text-gray-600">Connect your wallet to access Wawee</p>
      </div>

      <div className="space-y-6">
        <MetaMaskButton onConnect={onWeb3Login} />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200/50"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/50 text-gray-500">Or use traditional login</span>
          </div>
        </div>

        <Button
          onClick={onSwitchToTraditional}
          variant="secondary"
          icon={<ArrowLeft className="w-5 h-5" />}
          className="w-full"
        >
          Email & Password
        </Button>
      </div>

      <div className="mt-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Why connect your wallet?</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Secure authentication without passwords</li>
          <li>• Access to Web3 features and DeFi integrations</li>
          <li>• Own your identity and data</li>
          <li>• Seamless cross-platform experience</li>
        </ul>
      </div>
    </GlassCard>
  )
}

export default Web3LoginForm
