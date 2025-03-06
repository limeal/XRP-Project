import { useMutation } from '@apollo/client'
import { GET_MONKEY_QUERY, PUT_ITEM_FOR_SALE_MUTATION } from '@graphql/item'
import { Box, Button, Modal, TextField, Typography } from '@mui/material'
import { useState } from 'react'

// eslint-disable-next-line react/prop-types
const SellModal = ({ open, handleClose, itemId }) => {
  const [price, setPrice] = useState('')
  const [putItemForSale, { loading, error }] = useMutation(
    PUT_ITEM_FOR_SALE_MUTATION
  )

  const handleSubmit = async () => {
    if (!price) return

    try {
      await putItemForSale({
        variables: {
          itemId,
          price: price.toString(),
        },
        update: (cache, { data }) => {
          const newPrice = data?.putItemForSale?.price
          if (!newPrice) return

          const cachedData = cache.readQuery({
            query: GET_MONKEY_QUERY,
            variables: { id: itemId },
          })

          if (cachedData?.item) {
            cache.writeQuery({
              query: GET_MONKEY_QUERY,
              variables: { id: itemId },
              data: {
                item: {
                  ...cachedData.item,
                  prices: [{ price: newPrice }],
                },
              },
            })
          }
        },
      })
      handleClose()
    } catch (error) {
      console.error('Error selling monkey:', error)
    }
  }

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="sell-modal-title">
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
        {error && <Typography color="error">{error.message}</Typography>}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
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
            onClick={handleClose}
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
