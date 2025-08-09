import React from 'react'
import { Wallet, ExternalLink, AlertCircle } from 'lucide-react'
import { useMetaMask } from '../hooks/useMetaMask'
import Button from './Button'

interface MetaMaskButtonProps {
  onConnect: (user: { address: string; balance: string; chainId: string; name: string }) => void
  className?: string
}

const MetaMaskButton: React.FC<MetaMaskButtonProps> = ({ onConnect, className = '' }) => {
  const {
    isConnected,
    address,
    balance,
    chainId,
    isLoading,
    error,
    connectWallet,
    isMetaMaskInstalled,
    formatAddress,
    getChainName
  } = useMetaMask()

  const handleConnect = async () => {
    const user = await connectWallet()
    if (user) {
      onConnect(user)
    }
  }

  if (!isMetaMaskInstalled()) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center space-x-2 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          <span className="text-sm text-orange-700">MetaMask not detected</span>
        </div>
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-xl transition-all duration-200 space-x-2"
        >
          <span>Install MetaMask</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    )
  }

  if (isConnected && address) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-700">Connected</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-sm text-gray-700 font-mono">{formatAddress(address)}</p>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
            <span>{balance ? `${parseFloat(balance).toFixed(4)} ETH` : '0 ETH'}</span>
            <span>{chainId ? getChainName(chainId) : 'Unknown Chain'}</span>
          </div>
        </div>
        <Button
          onClick={() => onConnect({
            address,
            balance: balance || '0',
            chainId: chainId || '0x1',
            name: formatAddress(address)
          })}
          className="w-full"
          icon={<Wallet className="w-5 h-5" />}
        >
          Continue with Wallet
        </Button>
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {error && (
        <div className="flex items-center space-x-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}
      <Button
        onClick={handleConnect}
        isLoading={isLoading}
        className="w-full"
        icon={<Wallet className="w-5 h-5" />}
      >
        {isLoading ? 'Connecting...' : 'Connect MetaMask'}
      </Button>
    </div>
  )
}

export default MetaMaskButton
