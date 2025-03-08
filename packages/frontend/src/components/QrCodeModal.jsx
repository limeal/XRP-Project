/* eslint-disable react/prop-types */
import { Box, Button, Modal, Typography } from '@mui/material'

const QrCodeModal = ({
  open,
  handleClose,
  qrCodeUrl,
  title = 'Scan QR Code',
}) => {
  return (
    <Modal open={open} onClose={handleClose}>
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
        <Typography variant="h6" sx={{ mb: 2 }}>
          {title}
        </Typography>

        {qrCodeUrl ? (
          <Box sx={{ mb: 2 }}>
            <img
              src={qrCodeUrl}
              alt="Xumm QR Code"
              style={{ width: '100%', height: 'auto' }}
            />
          </Box>
        ) : (
          <Typography variant="body1" color="error" sx={{ mb: 2 }}>
            No QR code available
          </Typography>
        )}

        <Button
          variant="outlined"
          color="error"
          onClick={handleClose}
          fullWidth
        >
          Close
        </Button>
      </Box>
    </Modal>
  )
}

export default QrCodeModal
