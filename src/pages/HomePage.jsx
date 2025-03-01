import MonkeyList from '@components/MonkeyList'
import { Box, Button, Container, TextField, Typography } from '@mui/material'

const HomePage = () => {
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
      >
        Login
      </Button>
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

        <MonkeyList />
      </Box>
    </Box>
  )
}

export default HomePage
