import { useQuery } from '@apollo/client'
import SellButton from '@components/SellButton'
import SellModal from '@components/SellModal'
import { AuthContext } from '@context/AuthContext'
import { GET_MONKEY_QUERY } from '@graphql/item'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material'
import { useContext, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const MonkeyPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isModalOpen, setModalOpen] = useState(false)
  const { user: loggedInUser } = useContext(AuthContext)

  const { loading, error, data } = useQuery(GET_MONKEY_QUERY, {
    variables: { id },
  })

  if (loading)
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )

  if (error)
    return (
      <Container sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h4" color="error">
          {error.message}
        </Typography>
      </Container>
    )

  if (!data?.item)
    return (
      <Container sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h4">Monkey Not Found</Typography>
      </Container>
    )

  const isOwner = data?.item && loggedInUser?.id === data.item.owner.id

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
          src={data.item.image_url}
          alt={data.item.name}
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
          {data.item.name}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            mb: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: 'green',
              fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
            }}
          >
            {data.item.prices?.length > 0
              ? `${data.item.prices[0].price} XRP`
              : 'Not for Sale'}
          </Typography>

          {isOwner && <SellButton onClick={() => setModalOpen(true)} />}
        </Box>

        <Typography
          variant="body1"
          sx={{
            maxWidth: '600px',
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' },
            mb: 2,
          }}
        >
          {data.item.description}
        </Typography>

        {data.item.owner && (
          <Box sx={{ m: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6">
              Owned by{' '}
              <Button
                component={Link}
                to={`/profile/${data.item.owner.id}`}
                sx={{
                  color: '#1E3A8A',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {data.item.owner.username}
              </Button>
            </Typography>
          </Box>
        )}

        <SellModal
          open={isModalOpen}
          handleClose={() => setModalOpen(false)}
          itemId={id}
        />
      </Container>
    </Box>
  )
}

export default MonkeyPage
