import React from 'react'
import { Clock, CheckCircle, XCircle, ExternalLink, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import GlassCard from './GlassCard'
import { TransactionResult } from '../types/web3'

interface TransactionHistoryProps {
  transactions: TransactionResult[]
  userAddress: string
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, userAddress }) => {
  const getStatusIcon = (status: TransactionResult['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600 animate-pulse" />
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />
    }
  }

  const getStatusColor = (status: TransactionResult['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-800 bg-yellow-500/10 border-yellow-500/20'
      case 'confirmed':
        return 'text-green-800 bg-green-500/10 border-green-500/20'
      case 'failed':
        return 'text-red-800 bg-red-500/10 border-red-500/20'
    }
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const getTransactionType = (tx: TransactionResult) => {
    return tx.from.toLowerCase() === userAddress.toLowerCase() ? 'sent' : 'received'
  }

  const getEtherscanUrl = (txHash: string) => {
    return `https://etherscan.io/tx/${txHash}`
  }

  if (transactions.length === 0) {
    return (
      <GlassCard>
        <div className="text-center py-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-gray-500/20 to-blue-500/20 backdrop-blur-sm border border-white/20">
              <Clock className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Transactions Yet</h3>
          <p className="text-gray-600">Your transaction history will appear here</p>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Transaction History</h2>
        <span className="text-sm text-gray-500">{transactions.length} transaction{transactions.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="space-y-4">
        {transactions.map((tx, index) => {
          const type = getTransactionType(tx)
          const isOutgoing = type === 'sent'

          return (
            <div
              key={tx.hash}
              className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${isOutgoing ? 'bg-red-500/20' : 'bg-green-500/20'} backdrop-blur-sm border border-white/20`}>
                    {isOutgoing ? (
                      <ArrowUpRight className="w-4 h-4 text-red-600" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-800 capitalize">
                        {type} {tx.value} ETH
                      </p>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(tx.status)}`}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(tx.status)}
                          <span className="capitalize">{tx.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-xs text-gray-600 font-mono">
                        {isOutgoing ? 'To: ' : 'From: '}
                        {isOutgoing 
                          ? `${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`
                          : `${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`
                        }
                      </p>
                      <p className="text-xs text-gray-500">{formatTime(tx.timestamp)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.open(getEtherscanUrl(tx.hash), '_blank')}
                    className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200"
                    title="View on Etherscan"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Transaction Hash */}
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Transaction Hash:</span>
                  <span className="text-xs font-mono text-gray-600">
                    {tx.hash.slice(0, 10)}...{tx.hash.slice(-10)}
                  </span>
                </div>
                {tx.gasUsed && (
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">Gas Used:</span>
                    <span className="text-xs text-gray-600">
                      {parseInt(tx.gasUsed, 16).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}

export default TransactionHistory
