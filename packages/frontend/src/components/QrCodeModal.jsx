import { Box, Modal, Typography } from '@mui/material'

// eslint-disable-next-line react/prop-types
const QrCodeModal = ({ open, onClose, qrCodeUrl, title = 'Scan QR Code' }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'white',
          p: 3,
          borderRadius: 1,
          boxShadow: 24,
          minWidth: 300,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          {title}
        </Typography>

        {qrCodeUrl ? (
          <img
            src={qrCodeUrl}
            alt="QR Code"
            style={{ width: '100%', height: 'auto' }}
          />
        ) : (
          <Typography variant="body1" color="error">
            No QR code available
          </Typography>
        )}
      </Box>
    </Modal>
  )
}

export default QrCodeModal
