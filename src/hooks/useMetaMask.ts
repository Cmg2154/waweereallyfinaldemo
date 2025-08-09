import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { WalletState, MetaMaskError, Web3User } from '../types/web3'

export const useMetaMask = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: null,
    chainId: null,
    isLoading: false,
    error: null
  })

  const isMetaMaskInstalled = useCallback(() => {
    return typeof window !== 'undefined' && Boolean(window.ethereum?.isMetaMask)
  }, [])

  const formatAddress = useCallback((address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }, [])

  const formatBalance = useCallback((balance: string) => {
    const balanceInEth = parseFloat(balance)
    return balanceInEth.toFixed(4)
  }, [])

  const getChainName = useCallback((chainId: string) => {
    const chains: { [key: string]: string } = {
      '0x1': 'Ethereum Mainnet',
      '0x5': 'Goerli Testnet',
      '0x89': 'Polygon Mainnet',
      '0x13881': 'Polygon Mumbai',
      '0xa': 'Optimism',
      '0xa4b1': 'Arbitrum One'
    }
    return chains[chainId] || `Chain ${chainId}`
  }, [])

  const connectWallet = useCallback(async (): Promise<Web3User | null> => {
    if (!isMetaMaskInstalled()) {
      setWalletState(prev => ({
        ...prev,
        error: 'MetaMask is not installed. Please install MetaMask to continue.'
      }))
      return null
    }

    setWalletState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Request account access
      const accounts = await window.ethereum!.request({
        method: 'eth_requestAccounts'
      })

      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const address = accounts[0]

      // Get balance
      const balance = await window.ethereum!.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      })

      // Get chain ID
      const chainId = await window.ethereum!.request({
        method: 'eth_chainId'
      })

      const balanceInEth = ethers.formatEther(balance)

      const user: Web3User = {
        address,
        balance: balanceInEth,
        chainId,
        name: formatAddress(address)
      }

      setWalletState({
        isConnected: true,
        address,
        balance: balanceInEth,
        chainId,
        isLoading: false,
        error: null
      })

      return user
    } catch (error) {
      const metamaskError = error as MetaMaskError
      let errorMessage = 'Failed to connect wallet'

      if (metamaskError.code === 4001) {
        errorMessage = 'Connection rejected by user'
      } else if (metamaskError.code === -32002) {
        errorMessage = 'Connection request already pending'
      } else if (metamaskError.message) {
        errorMessage = metamaskError.message
      }

      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))

      return null
    }
  }, [isMetaMaskInstalled, formatAddress])

  const disconnectWallet = useCallback(() => {
    setWalletState({
      isConnected: false,
      address: null,
      balance: null,
      chainId: null,
      isLoading: false,
      error: null
    })
  }, [])

  const checkConnection = useCallback(async () => {
    if (!isMetaMaskInstalled()) return

    try {
      const accounts = await window.ethereum!.request({
        method: 'eth_accounts'
      })

      if (accounts.length > 0) {
        const address = accounts[0]
        const balance = await window.ethereum!.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        })
        const chainId = await window.ethereum!.request({
          method: 'eth_chainId'
        })

        const balanceInEth = ethers.formatEther(balance)

        setWalletState({
          isConnected: true,
          address,
          balance: balanceInEth,
          chainId,
          isLoading: false,
          error: null
        })
      }
    } catch (error) {
      console.error('Error checking connection:', error)
    }
  }, [isMetaMaskInstalled])

  useEffect(() => {
    checkConnection()

    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          checkConnection()
        }
      }

      const handleChainChanged = () => {
        checkConnection()
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum?.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [checkConnection, disconnectWallet])

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    isMetaMaskInstalled,
    formatAddress,
    formatBalance,
    getChainName
  }
}
