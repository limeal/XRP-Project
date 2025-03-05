import monkeys from '@constants/monkeys'
import { Avatar, Box, Button, Container, Typography } from '@mui/material'
import { Link, useNavigate, useParams } from 'react-router-dom'

const MonkeyPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const monkey = monkeys.find((m) => m.id === parseInt(id))

  // const { loading, error, data } = useQuery(GET_MONKEY_QUERY, {
  //   variables: { id },
  // })

  // if (loading) return <CircularProgress />
  // if (error) return <Typography color="error">{error.message}</Typography>
  // if (!data?.item) return <Typography>Monkey not found</Typography>

  if (!monkey) {
    return (
      <Container sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h4">Monkey Not Found</Typography>
      </Container>
    )
  }

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', position: 'relative' }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate('/')}
        sx={{
          position: 'absolute',
          top: 30,
          left: 30,
          fontSize: { xs: '0.8rem', md: '1rem' },
          padding: { xs: '6px 12px', md: '8px 16px' },
          zIndex: 10,
        }}
      >
        Home
      </Button>
      <Container
        disableGutters
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: 5,
          position: 'relative',
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
            mb: 2,
          }}
        >
          {monkey.description}
        </Typography>

        {/* Owner Information */}
        {monkey.owner && (
          <Box sx={{ m: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              {monkey.owner.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h6">
              Owned by{' '}
              <Button
                component={Link}
                to={`/profile/${monkey.owner.id}`}
                sx={{
                  color: '#1E3A8A',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {monkey.owner.name}
              </Button>
            </Typography>
          </Box>
        )}

        <Button
          variant="contained"
          color="primary"
          sx={{ fontSize: '1rem', px: 4 }}
        >
          Buy Now
        </Button>
      </Container>
    </Box>
  )
}

export default MonkeyPage
