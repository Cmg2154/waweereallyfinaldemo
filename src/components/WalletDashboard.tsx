import React, { useState } from 'react'
import { Wallet, Send, History, ArrowLeftRight, Copy, ExternalLink } from 'lucide-react'
import GlassCard from './GlassCard'
import Button from './Button'
import TransactionForm from './TransactionForm'
import TransactionHistory from './TransactionHistory'
import { useTransactions } from '../hooks/useTransactions'

interface WalletDashboardProps {
  user: {
    address: string
    balance: string
    chainId: string
    name: string
  }
  getChainName: (chainId: string) => string
  formatAddress: (address: string) => string
}

const WalletDashboard: React.FC<WalletDashboardProps> = ({ 
  user, 
  getChainName, 
  formatAddress 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'send' | 'history'>('overview')
  const { transactions } = useTransactions()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const getEtherscanUrl = (address: string) => {
    return `https://etherscan.io/address/${address}`
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Wallet },
    { id: 'send', label: 'Send', icon: Send },
    { id: 'history', label: 'History', icon: History },
  ] as const

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Wallet Header */}
      <GlassCard>
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/20">
              <Wallet className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Wallet Dashboard</h1>
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm text-gray-600 font-mono">{user.address}</span>
              <button
                onClick={() => copyToClipboard(user.address)}
                className="p-1 rounded hover:bg-white/20 transition-colors"
                title="Copy address"
              >
                <Copy className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={() => window.open(getEtherscanUrl(user.address), '_blank')}
                className="p-1 rounded hover:bg-white/20 transition-colors"
                title="View on Etherscan"
              >
                <ExternalLink className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <p className="text-xs text-gray-500">{getChainName(user.chainId)}</p>
          </div>
        </div>
      </GlassCard>

      {/* Balance Card */}
      <GlassCard>
        <div className="text-center py-6">
          <p className="text-sm text-gray-600 mb-2">Total Balance</p>
          <p className="text-4xl font-bold text-gray-800 mb-4">
            {parseFloat(user.balance).toFixed(4)} <span className="text-2xl text-gray-600">ETH</span>
          </p>
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">Network</p>
              <p className="text-sm font-medium text-gray-700">{getChainName(user.chainId)}</p>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Address</p>
              <p className="text-sm font-medium text-gray-700">{formatAddress(user.address)}</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Navigation Tabs */}
      <GlassCard>
        <div className="flex space-x-1 p-1 bg-white/5 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg
                transition-all duration-200 text-sm font-medium
                ${activeTab === tab.id
                  ? 'bg-white/20 text-gray-800 shadow-sm'
                  : 'text-gray-600 hover:bg-white/10'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <GlassCard>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                onClick={() => setActiveTab('send')}
                icon={<Send className="w-4 h-4" />}
                className="w-full justify-start"
              >
                Send Transaction
              </Button>
              <Button
                onClick={() => setActiveTab('history')}
                icon={<History className="w-4 h-4" />}
                variant="secondary"
                className="w-full justify-start"
              >
                View History
              </Button>
              <Button
                onClick={() => window.open(getEtherscanUrl(user.address), '_blank')}
                icon={<ExternalLink className="w-4 h-4" />}
                variant="secondary"
                className="w-full justify-start"
              >
                View on Etherscan
              </Button>
            </div>
          </GlassCard>

          {/* Recent Transactions */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
              <button
                onClick={() => setActiveTab('history')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View All
              </button>
            </div>
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.slice(0, 3).map((tx, index) => (
                  <div key={tx.hash} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-blue-500/20 backdrop-blur-sm border border-white/20">
                        <ArrowLeftRight className="w-3 h-3 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{tx.value} ETH</p>
                        <p className="text-xs text-gray-600">{formatAddress(tx.to)}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      tx.status === 'confirmed' ? 'bg-green-500/20 text-green-800' :
                      tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-800' :
                      'bg-red-500/20 text-red-800'
                    }`}>
                      {tx.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 text-center py-4">No transactions yet</p>
            )}
          </GlassCard>
        </div>
      )}

      {activeTab === 'send' && (
        <TransactionForm
          userAddress={user.address}
          userBalance={user.balance}
          onTransactionSent={(txHash) => {
            console.log('Transaction sent:', txHash)
            // Optionally switch to history tab or show success message
          }}
        />
      )}

      {activeTab === 'history' && (
        <TransactionHistory
          transactions={transactions}
          userAddress={user.address}
        />
      )}
    </div>
  )
}

export default WalletDashboard
