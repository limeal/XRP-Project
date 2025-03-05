import MonkeyList from '@components/MonkeyList'
import monkeys from '@constants/monkeys'
import { Box, Button, Container, TextField, Typography } from '@mui/material'
import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const HomePage = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        position: 'relative',
      }}
    >
      {user ? (
        <Button
          component={Link}
          to={`/profile/${user.id}`}
          variant="contained"
          color="success"
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            fontSize: { xs: '0.9rem', md: '1rem' },
            fontWeight: 'bold',
            padding: { xs: '6px 14px', md: '10px 18px' },
            borderRadius: '20px',
          }}
        >
          {user.username}
        </Button>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            fontSize: { xs: '0.8rem', md: '1rem' },
            padding: { xs: '6px 12px', md: '8px 16px' },
          }}
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
      )}

      {/* TOP SECTION (70% of the screen) */}
      <Container
        sx={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            fontSize: { xs: '2.5rem', md: '4rem' },
          }}
        >
          MYMONKEYS
        </Typography>

        <Typography
          variant="h6"
          sx={{
            maxWidth: '600px',
            fontSize: { xs: '1rem', md: '1.2rem' },
            mb: 3,
          }}
        >
          Find the best monkeys around the world.
          <br />
          Search now and explore!
        </Typography>

        <TextField
          placeholder="Search for monkeys..."
          variant="outlined"
          sx={{
            width: { xs: '90%', md: '50%' },
            backgroundColor: 'white',
            borderRadius: 1,
          }}
        />
      </Container>
      {/* BOTTOM SECTION (30% of the screen) */}
      <Box
        sx={{
          minHeight: '30vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          bgcolor: 'secondary.main',
          py: 2,
          px: 4,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            mb: 3,
            fontWeight: 'thin',
            fontSize: { xs: '1rem', md: '1.3rem', lg: '1.7rem' },
          }}
        >
          Trendy Monkeys
        </Typography>

        <MonkeyList monkeys={monkeys} />
      </Box>
    </Box>
  )
}

export default HomePage
