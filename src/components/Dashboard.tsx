import React, { useState } from 'react'
import { LogOut, User, Wallet, Globe, Copy, Check, Send, History, Settings, Shield } from 'lucide-react'
import GlassCard from './GlassCard'
import Button from './Button'

interface DashboardProps {
  user: {
    email?: string
    name: string
    address?: string
    balance?: string
    chainId?: string
  }
  onLogout: () => void
  formatAddress?: (address: string) => string
  getChainName?: (chainId: string) => string
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  onLogout, 
  formatAddress = (addr) => addr,
  getChainName = (id) => `Chain ${id}`
}) => {
  const [copiedAddress, setCopiedAddress] = useState(false)

  const handleCopyAddress = async () => {
    if (user.address) {
      await navigator.clipboard.writeText(user.address)
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    }
  }

  const isWeb3User = !!user.address
  const isGoogleUser = user.email && !user.address

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            {isWeb3User && 'Web3 Account'}
            {isGoogleUser && 'Google Account'}
            {!isWeb3User && !isGoogleUser && 'Traditional Account'}
          </p>
        </div>
        <Button
          onClick={onLogout}
          variant="secondary"
          icon={<LogOut className="w-4 h-4" />}
        >
          Logout
        </Button>
      </div>

      {/* Account Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <GlassCard>
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Profile</h3>
              <p className="text-sm text-gray-600">{user.name}</p>
              {user.email && (
                <p className="text-sm text-gray-500">{user.email}</p>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Wallet Card (Web3 users only) */}
        {isWeb3User && (
          <GlassCard>
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">Wallet</h3>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-600">
                    {user.address ? formatAddress(user.address) : 'Not connected'}
                  </p>
                  {user.address && (
                    <button
                      onClick={handleCopyAddress}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {copiedAddress ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
                {user.balance && (
                  <p className="text-sm font-medium text-gray-700">
                    {parseFloat(user.balance).toFixed(4)} ETH
                  </p>
                )}
              </div>
            </div>
          </GlassCard>
        )}

        {/* Network Card (Web3 users only) */}
        {isWeb3User && user.chainId && (
          <GlassCard>
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Network</h3>
                <p className="text-sm text-gray-600">{getChainName(user.chainId)}</p>
                <p className="text-xs text-gray-500">Chain ID: {user.chainId}</p>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Account Type Card (Non-Web3 users) */}
        {!isWeb3User && (
          <GlassCard>
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Account Type</h3>
                <p className="text-sm text-gray-600">
                  {isGoogleUser ? 'Google OAuth' : 'Email & Password'}
                </p>
                <p className="text-xs text-gray-500">Secure authentication</p>
              </div>
            </div>
          </GlassCard>
        )}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Send Transaction (Web3 users only) */}
        {isWeb3User && (
          <GlassCard className="cursor-pointer hover:scale-105 transition-transform">
            <div className="text-center space-y-4">
              <div className="p-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 mx-auto w-fit">
                <Send className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Send Transaction</h3>
                <p className="text-sm text-gray-600">Transfer ETH or tokens</p>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Transaction History (Web3 users only) */}
        {isWeb3User && (
          <GlassCard className="cursor-pointer hover:scale-105 transition-transform">
            <div className="text-center space-y-4">
              <div className="p-4 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 mx-auto w-fit">
                <History className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Transaction History</h3>
                <p className="text-sm text-gray-600">View past transactions</p>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Settings */}
        <GlassCard className="cursor-pointer hover:scale-105 transition-transform">
          <div className="text-center space-y-4">
            <div className="p-4 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 mx-auto w-fit">
              <Settings className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Settings</h3>
              <p className="text-sm text-gray-600">Manage your account</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Quick Stats */}
      <GlassCard>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {isWeb3User ? '1' : '0'}
            </p>
            <p className="text-sm text-gray-600">Wallets Connected</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {user.balance ? parseFloat(user.balance).toFixed(2) : '0.00'}
            </p>
            <p className="text-sm text-gray-600">ETH Balance</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">0</p>
            <p className="text-sm text-gray-600">Transactions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {isGoogleUser ? 'Google' : isWeb3User ? 'Web3' : 'Email'}
            </p>
            <p className="text-sm text-gray-600">Auth Method</p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

export default Dashboard
