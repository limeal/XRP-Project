import { useEffect, useState } from 'react'
import { CrossmarkContext } from './CrossmarkContext'

// eslint-disable-next-line react/prop-types
export const CrossmarkProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null)
  const [publicKey, setPublicKey] = useState(null)
  const [signature, setSignature] = useState(null)

  const linkWallet = (address, pubKey, sig) => {
    setWalletAddress(address)
    setPublicKey(pubKey)
    setSignature(sig)

    localStorage.setItem('walletAddress', address)
    localStorage.setItem('publicKey', pubKey)
    localStorage.setItem('signature', sig)
  }

  const unlinkWallet = () => {
    setWalletAddress(null)
    setPublicKey(null)
    setSignature(null)

    localStorage.removeItem('walletAddress')
    localStorage.removeItem('publicKey')
    localStorage.removeItem('signature')
  }

  useEffect(() => {
    const storedAddress = localStorage.getItem('walletAddress')
    const storedKey = localStorage.getItem('publicKey')
    const storedSig = localStorage.getItem('signature')

    if (storedAddress) setWalletAddress(storedAddress)
    if (storedKey) setPublicKey(storedKey)
    if (storedSig) setSignature(storedSig)
  }, [])

  return (
    <CrossmarkContext.Provider
      value={{
        walletAddress,
        publicKey,
        signature,
        linkWallet,
        unlinkWallet,
      }}
    >
      {children}
    </CrossmarkContext.Provider>
  )
}

export default CrossmarkProvider
