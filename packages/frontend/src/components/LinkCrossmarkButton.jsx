import sdk from '@crossmarkio/sdk'
import { Button, CircularProgress } from '@mui/material'
import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useCrossmark } from '../context/CrossmarkContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const LinkCrossmarkButton = () => {
  const { walletAddress, linkWallet, unlinkWallet } = useCrossmark()
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const checkCrossmarkExtension = async () => {
    try {
      const isReady = sdk.methods.isInstalled()
      if (!isReady) {
        throw new Error(
          'Crossmark extension is not installed or not initialized.'
        )
      }
    } catch (err) {
      setError(err.message)
      console.error('Crossmark check failed:', err)
      return false
    }
    return true
  }

  const handleLinkCrossmark = async () => {
    setLoading(true)
    setError(null)

    const isExtensionReady = await checkCrossmarkExtension()
    if (!isExtensionReady) {
      alert(
        'Crossmark extension is not installed or set up properly. Please install and configure it before linking.'
      )
      setLoading(false)
      return
    }

    console.log('Attempting to sign in with Crossmark...')

    try {
      const { response } = await sdk.methods.signInAndWait()
      if (!response || !response.data) {
        throw new Error(
          'Invalid Crossmark response. Make sure the extension is correctly set up.'
        )
      }

      console.log('Crossmark Response:', response)
      const { address, publicKey, signature } = response.data

      if (!address || !publicKey) {
        throw new Error('Missing required Crossmark data. Please retry.')
      }

      console.log('Received Address:', address)
      console.log('Received PublicKey:', publicKey)
      console.log('Received Signature:', signature || 'No signature provided')

      linkWallet(address, publicKey, signature || '')

      const res = await fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation LinkCrossmark($userId: String!, $xrpAddress: String!, $publicKey: String!) {
              linkCrossmark(userId: $userId, xrpAddress: $xrpAddress, publicKey: $publicKey) {
                success
                walletAddress
                publicKey
                error
              }
            }
          `,
          variables: {
            userId: user.id,
            xrpAddress: address,
            publicKey,
          },
        }),
      })

      const result = await res.json()

      console.log('GraphQL Response:', result)
      if (!result || !result.data || !result.data.linkCrossmark) {
        throw new Error(
          `Invalid response from server: ${JSON.stringify(result)}`
        )
      }

      if (!result.data.linkCrossmark.success) {
        throw new Error(`Error: ${result.data.linkCrossmark.error}`)
      }

      alert('Crossmark linked successfully!')
    } catch (error) {
      console.error('Failed to link Crossmark:', error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUnlinkCrossmark = async () => {
    unlinkWallet()
    alert('Crossmark account unlinked successfully!')
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}

      <Button
        variant="contained"
        color={walletAddress ? 'error' : 'primary'}
        onClick={walletAddress ? handleUnlinkCrossmark : handleLinkCrossmark}
        sx={{ mt: 2, fontSize: '0.9rem', px: 3 }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : walletAddress ? (
          'Unlink Crossmark'
        ) : (
          'Link Crossmark'
        )}
      </Button>
    </div>
  )
}

export default LinkCrossmarkButton
