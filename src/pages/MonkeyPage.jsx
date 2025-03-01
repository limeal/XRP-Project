import monkeys from '@constants/monkeys'
import { Box, Button, Container, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

const MonkeyPage = () => {
  const { id } = useParams()
  const monkey = monkeys.find((m) => m.id === parseInt(id))

  if (!monkey) {
    return (
      <Container sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h4">Monkey Not Found</Typography>
      </Container>
    )
  }

  return (
    <Container
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 5,
      }}
    >
      <Box
        component="img"
        src={monkey.img}
        alt={monkey.name}
        sx={{
          width: { xs: '35%', md: '38%' },
          borderRadius: 2,
          mb: 3,
        }}
      />

      <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          mb: 2,
          fontSize: { xs: '1.8rem', sm: '2rem', md: '3rem' },
        }}
      >
        {monkey.name}
      </Typography>

      <Typography
        variant="h5"
        sx={{
          color: 'green',
          mb: 2,
          fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
        }}
      >
        {monkey.price}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          maxWidth: '600px',
          fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' },
          mb: 3,
        }}
      >
        {monkey.description}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ fontSize: '1rem', px: 4 }}
      >
        Buy Now
      </Button>
    </Container>
  )
}

export default MonkeyPage
