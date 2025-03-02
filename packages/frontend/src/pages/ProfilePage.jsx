import MonkeyList from '@components/MonkeyList'
import monkeys from '@constants/monkeys'
import userTags from '@constants/tags'
import { Avatar, Box, Button, Chip, Container, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {
  const navigate = useNavigate()
  const [isOnline, setIsOnline] = useState(true)
  const username = 'Blemet'

  return (
    <Container
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 3,
      }}
    >
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 3,
        }}
      >
        <Avatar
          sx={{
            width: 60,
            height: 60,
            bgcolor: 'secondary.main',
          }}
        >
          {username.charAt(0).toUpperCase()}
        </Avatar>

        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {username}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: isOnline ? 'green' : 'red',
              }}
            />
            <Typography variant="body1">
              {isOnline ? 'Online' : 'Offline'}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flexWrap: 'wrap',
          mb: 3,
        }}
      >
        {userTags.map((tag) => (
          <Chip
            key={tag.label}
            label={tag.label}
            color={tag.color}
            sx={{ textTransform: 'none' }}
          />
        ))}
      </Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          mb: 2,
          fontSize: { xs: '1.2rem', md: '1.5rem' },
        }}
      >
        Owned Monkeys
      </Typography>
      <MonkeyList monkeys={monkeys.slice(0, 3)} />{' '}
      <Button
        variant="contained"
        color="secondary"
        sx={{ mt: 4, fontSize: '1rem', px: 4 }}
      >
        Logout
      </Button>
    </Container>
  )
}

export default ProfilePage
