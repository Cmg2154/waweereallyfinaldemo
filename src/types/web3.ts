export interface MetaMaskError extends Error {
  code: number
  message: string
}

export interface WalletState {
  isConnected: boolean
  address: string | null
  balance: string | null
  chainId: string | null
  isLoading: boolean
  error: string | null
}

export interface Web3User {
  address: string
  balance: string
  chainId: string
  name: string
}

export interface TransactionRequest {
  to: string
  value: string
  gasLimit?: string
  gasPrice?: string
  data?: string
}

export interface TransactionResult {
  hash: string
  from: string
  to: string
  value: string
  gasUsed?: string
  status: 'pending' | 'confirmed' | 'failed'
  timestamp: number
}

export interface GasEstimate {
  gasLimit: string
  gasPrice: string
  estimatedFee: string
}

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (data: any) => void) => void
      removeListener: (event: string, callback: (data: any) => void) => void
    }
  }
}
