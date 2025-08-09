import React, { useState, useEffect } from 'react'
import { Send, AlertCircle, Loader2, Calculator, CheckCircle } from 'lucide-react'
import GlassCard from './GlassCard'
import Button from './Button'
import { useTransactions } from '../hooks/useTransactions'
import { GasEstimate } from '../types/web3'

interface TransactionFormProps {
  userAddress: string
  userBalance: string
  onTransactionSent?: (txHash: string) => void
}

const TransactionForm: React.FC<TransactionFormProps> = ({ 
  userAddress, 
  userBalance, 
  onTransactionSent 
}) => {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [gasEstimate, setGasEstimate] = useState<GasEstimate | null>(null)
  const [isEstimating, setIsEstimating] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const { 
    isLoading, 
    error, 
    sendTransaction, 
    estimateGas, 
    validateAddress, 
    clearError 
  } = useTransactions()

  const isValidForm = recipient && amount && validateAddress(recipient) && parseFloat(amount) > 0

  const handleEstimateGas = async () => {
    if (!isValidForm) return

    setIsEstimating(true)
    const estimate = await estimateGas({
      to: recipient,
      value: amount
    })
    setGasEstimate(estimate)
    setIsEstimating(false)
  }

  const handleSendTransaction = async () => {
    if (!isValidForm) return

    const result = await sendTransaction({
      to: recipient,
      value: amount,
      gasLimit: gasEstimate?.gasLimit,
      gasPrice: gasEstimate?.gasPrice
    })

    if (result) {
      setShowConfirmation(true)
      onTransactionSent?.(result.hash)
      
      // Reset form after successful transaction
      setTimeout(() => {
        setRecipient('')
        setAmount('')
        setGasEstimate(null)
        setShowConfirmation(false)
      }, 3000)
    }
  }

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  useEffect(() => {
    if (isValidForm) {
      const debounceTimer = setTimeout(handleEstimateGas, 500)
      return () => clearTimeout(debounceTimer)
    } else {
      setGasEstimate(null)
    }
  }, [recipient, amount])

  if (showConfirmation) {
    return (
      <GlassCard>
        <div className="text-center py-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-white/20">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Transaction Sent!</h3>
          <p className="text-gray-600 mb-4">Your transaction has been submitted to the network</p>
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm text-green-800">
              Transaction is being processed. You can monitor its status in the transaction history.
            </p>
          </div>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20">
            <Send className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Send Transaction</h2>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Available Balance</p>
          <p className="text-sm font-medium text-gray-800">{parseFloat(userBalance).toFixed(4)} ETH</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Recipient Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className={`
              w-full px-4 py-3 rounded-lg 
              bg-white/10 backdrop-blur-sm 
              border transition-all duration-200
              text-gray-800 placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500/50
              ${recipient && !validateAddress(recipient) 
                ? 'border-red-500/50 focus:border-red-500' 
                : 'border-white/20 focus:border-blue-500/50'
              }
            `}
          />
          {recipient && !validateAddress(recipient) && (
            <p className="mt-1 text-xs text-red-600">Invalid Ethereum address</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (ETH)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              step="0.0001"
              min="0"
              max={userBalance}
              className={`
                w-full px-4 py-3 rounded-lg 
                bg-white/10 backdrop-blur-sm 
                border border-white/20 
                text-gray-800 placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                transition-all duration-200
                ${parseFloat(amount) > parseFloat(userBalance) ? 'border-red-500/50' : ''}
              `}
            />
            <button
              onClick={() => setAmount(userBalance)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              MAX
            </button>
          </div>
          {parseFloat(amount) > parseFloat(userBalance) && (
            <p className="mt-1 text-xs text-red-600">Insufficient balance</p>
          )}
        </div>

        {/* Gas Estimation */}
        {isValidForm && (
          <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Gas Estimation</span>
              {isEstimating && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
            </div>
            {gasEstimate ? (
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Estimated Fee:</span>
                  <span className="font-medium">{parseFloat(gasEstimate.estimatedFee).toFixed(6)} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Cost:</span>
                  <span className="font-medium text-gray-800">
                    {(parseFloat(amount) + parseFloat(gasEstimate.estimatedFee)).toFixed(6)} ETH
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500">Calculating gas fees...</p>
            )}
          </div>
        )}

        {/* Send Button */}
        <Button
          onClick={handleSendTransaction}
          disabled={!isValidForm || isLoading || parseFloat(amount) > parseFloat(userBalance)}
          icon={isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          className="w-full"
        >
          {isLoading ? 'Sending Transaction...' : 'Send Transaction'}
        </Button>

        {/* Transaction Info */}
        <div className="p-4 rounded-lg bg-gray-500/5 border border-gray-500/20">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Transaction Details</h4>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>From:</span>
              <span className="font-mono">{userAddress.slice(0, 10)}...{userAddress.slice(-8)}</span>
            </div>
            {recipient && validateAddress(recipient) && (
              <div className="flex justify-between">
                <span>To:</span>
                <span className="font-mono">{recipient.slice(0, 10)}...{recipient.slice(-8)}</span>
              </div>
            )}
            {amount && (
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-medium">{amount} ETH</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  )
}

export default TransactionForm
