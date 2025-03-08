import { useMutation } from '@apollo/client'
import { CREATE_ITEM_PRICE_MUTATION, GET_MONKEY_QUERY } from '@graphql/item'
import { Box, Button, Modal, TextField, Typography } from '@mui/material'
import { useState } from 'react'

// eslint-disable-next-line react/prop-types
const SellModal = ({ open, handleClose, itemId }) => {
  const [price, setPrice] = useState('')
  const [putItemForSale, { loading, error }] = useMutation(
    CREATE_ITEM_PRICE_MUTATION,
    {
      refetchQueries: [{ query: GET_MONKEY_QUERY, variables: { id: itemId } }],
    }
  )

  const handleSubmit = async () => {
    if (!price) return

    try {
      await putItemForSale({
        variables: {
          itemId,
          price: price.toString(),
        },
      })
      handleClose()
    } catch (error) {
      console.error('Error selling monkey:', error)
    }
  }

  const handleCancel = () => {
    setPrice('')
    handleClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      aria-labelledby="sell-modal-title"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
          textAlign: 'center',
        }}
      >
        <Typography id="sell-modal-title" variant="h6" sx={{ mb: 2 }}>
          Set Selling Price (XRP)
        </Typography>
        <TextField
          fullWidth
          label="Price in XRP"
          variant="outlined"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          sx={{ mb: 2 }}
        />
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error.message}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
            disabled={loading}
          >
            {loading ? 'Selling...' : 'Sell'}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleCancel}
            fullWidth
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default SellModal
