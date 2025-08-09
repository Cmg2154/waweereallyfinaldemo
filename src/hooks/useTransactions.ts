import { useState, useCallback } from 'react'
import { ethers } from 'ethers'
import { TransactionRequest, TransactionResult, GasEstimate, MetaMaskError } from '../types/web3'

export const useTransactions = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<TransactionResult[]>([])

  const validateAddress = useCallback((address: string): boolean => {
    try {
      ethers.getAddress(address)
      return true
    } catch {
      return false
    }
  }, [])

  const estimateGas = useCallback(async (transaction: TransactionRequest): Promise<GasEstimate | null> => {
    if (!window.ethereum) {
      setError('MetaMask not found')
      return null
    }

    try {
      setError(null)

      // Estimate gas limit
      const gasLimit = await window.ethereum.request({
        method: 'eth_estimateGas',
        params: [{
          to: transaction.to,
          value: ethers.parseEther(transaction.value).toString(16),
          data: transaction.data || '0x'
        }]
      })

      // Get current gas price
      const gasPrice = await window.ethereum.request({
        method: 'eth_gasPrice'
      })

      const gasPriceBigInt = BigInt(gasPrice)
      const gasLimitBigInt = BigInt(gasLimit)
      const estimatedFee = ethers.formatEther((gasPriceBigInt * gasLimitBigInt).toString())

      return {
        gasLimit: gasLimitBigInt.toString(),
        gasPrice: gasPriceBigInt.toString(),
        estimatedFee
      }
    } catch (error) {
      const metamaskError = error as MetaMaskError
      setError(metamaskError.message || 'Failed to estimate gas')
      return null
    }
  }, [])

  const sendTransaction = useCallback(async (transaction: TransactionRequest): Promise<TransactionResult | null> => {
    if (!window.ethereum) {
      setError('MetaMask not found')
      return null
    }

    if (!validateAddress(transaction.to)) {
      setError('Invalid recipient address')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      // Get current account
      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      })

      if (accounts.length === 0) {
        throw new Error('No connected accounts')
      }

      const from = accounts[0]

      // Prepare transaction parameters
      const txParams: any = {
        from,
        to: transaction.to,
        value: '0x' + ethers.parseEther(transaction.value).toString(16),
      }

      // Add gas parameters if provided
      if (transaction.gasLimit) {
        txParams.gas = '0x' + BigInt(transaction.gasLimit).toString(16)
      }
      if (transaction.gasPrice) {
        txParams.gasPrice = '0x' + BigInt(transaction.gasPrice).toString(16)
      }
      if (transaction.data) {
        txParams.data = transaction.data
      }

      // Send transaction
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams]
      })

      const result: TransactionResult = {
        hash: txHash,
        from,
        to: transaction.to,
        value: transaction.value,
        status: 'pending',
        timestamp: Date.now()
      }

      // Add to transactions list
      setTransactions(prev => [result, ...prev])

      // Monitor transaction status
      monitorTransaction(txHash)

      return result
    } catch (error) {
      const metamaskError = error as MetaMaskError
      let errorMessage = 'Transaction failed'

      if (metamaskError.code === 4001) {
        errorMessage = 'Transaction rejected by user'
      } else if (metamaskError.code === -32603) {
        errorMessage = 'Internal error'
      } else if (metamaskError.message) {
        errorMessage = metamaskError.message
      }

      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [validateAddress])

  const monitorTransaction = useCallback(async (txHash: string) => {
    if (!window.ethereum) return

    const checkStatus = async () => {
      try {
        const receipt = await window.ethereum!.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        })

        if (receipt) {
          const status = receipt.status === '0x1' ? 'confirmed' : 'failed'
          
          setTransactions(prev => 
            prev.map(tx => 
              tx.hash === txHash 
                ? { ...tx, status, gasUsed: receipt.gasUsed }
                : tx
            )
          )
        } else {
          // Transaction still pending, check again in 5 seconds
          setTimeout(checkStatus, 5000)
        }
      } catch (error) {
        console.error('Error checking transaction status:', error)
      }
    }

    // Start monitoring after a short delay
    setTimeout(checkStatus, 2000)
  }, [])

  const getTransactionHistory = useCallback(() => {
    return transactions.sort((a, b) => b.timestamp - a.timestamp)
  }, [transactions])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    transactions: getTransactionHistory(),
    sendTransaction,
    estimateGas,
    validateAddress,
    clearError
  }
}
