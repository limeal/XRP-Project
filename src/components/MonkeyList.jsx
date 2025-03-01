/* eslint-disable react/prop-types */
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'
import { Box, IconButton, Typography, useMediaQuery } from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const MonkeyList = ({ monkeys }) => {
  const isSmallScreen = useMediaQuery('(max-width: 600px)')
  const isMediumScreen = useMediaQuery('(max-width: 900px)')
  const [page, setPage] = useState(0)

  if (!monkeys || monkeys.length === 0) {
    return (
      <Typography
        sx={{
          textAlign: 'center',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          color: 'gray',
        }}
      >
        No monkeys found
      </Typography>
    )
  }

  const monkeysPerPage = isSmallScreen ? 2 : isMediumScreen ? 3 : 5
  const totalPages = Math.ceil(monkeys.length / monkeysPerPage)

  if (!monkeys || monkeys.length === 0) {
    return (
      <Typography
        sx={{
          textAlign: 'center',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          color: 'gray',
        }}
      >
        No monkeys found
      </Typography>
    )
  }
  const handleNext = () => {
    setPage((prev) => (prev + 1) % totalPages)
  }

  const handlePrev = () => {
    setPage((prev) => (prev - 1 + totalPages) % totalPages)
  }
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        px: 2,
      }}
    >
      <IconButton
        onClick={handlePrev}
        sx={{
          color: 'white',
          position: 'absolute',
          left: 10,
          zIndex: 2,
        }}
      >
        <ArrowBackIos />
      </IconButton>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: { xs: 2, md: 6 },
          width: '80%',
          maxWidth: '800px',
        }}
      >
        {monkeys
          .slice(page * monkeysPerPage, (page + 1) * monkeysPerPage)
          .map((monkey, index) => (
            <Link
              to={`/monkey/${monkey.id}`}
              key={monkey.id || index}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Box
                key={monkey.id}
                sx={{
                  width: { xs: '15vw', md: '12vw' },
                  height: { xs: '11vw', md: '9vw' },
                  minWidth: '120px',
                  maxWidth: '190px',
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative',
                  flexShrink: 0,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <img
                  src={monkey.img}
                  alt={monkey.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                    color: 'white',
                    textAlign: 'center',
                    py: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      flexGrow: 1,
                      textAlign: 'left',
                      fontSize: {
                        xs: '0.5rem',
                        sm: '0.57rem',
                        md: '0.8rem',
                      },
                    }}
                  >
                    {monkey.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 'bold',
                      textAlign: 'right',
                      fontSize: {
                        xs: '0.5rem',
                        sm: '0.57rem',
                        md: '0.7rem',
                      },
                    }}
                  >
                    {monkey.price}
                  </Typography>
                </Box>
              </Box>
            </Link>
          ))}
      </Box>

      <IconButton
        onClick={handleNext}
        sx={{
          color: 'white',
          position: 'absolute',
          right: 10,
          zIndex: 2,
        }}
      >
        <ArrowForwardIos />
      </IconButton>
    </Box>
  )
}

export default MonkeyList
