import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'
import { useMediaQuery } from '@mui/material'

import { Box, IconButton, Typography } from '@mui/material'
import { useState } from 'react'

const monkeys = [
  {
    id: 1,
    name: 'Crypto Ape #1',
    price: '2.5 ETH',
    img: '/images/monkey1.jpg',
  },
  {
    id: 2,
    name: 'Golden Monkey',
    price: '3.2 ETH',
    img: '/images/monkey2.jpg',
  },
  { id: 3, name: 'Jungle NFT', price: '1.8 ETH', img: '/images/monkey3.jpg' },
  { id: 4, name: 'Cyber Ape', price: '4.0 ETH', img: '/images/monkey4.jpg' },
  { id: 5, name: 'Rare Ape', price: '5.1 ETH', img: '/images/monkey5.jpg' },
  { id: 6, name: 'Super Ape', price: '6.3 ETH', img: '/images/monkey6.jpg' },
  { id: 7, name: 'Jungle King', price: '2.9 ETH', img: '/images/monkey7.jpg' },
  {
    id: 8,
    name: 'Ancient Monkey',
    price: '4.4 ETH',
    img: '/images/monkey8.jpg',
  },
  { id: 9, name: 'Golden Fur', price: '3.7 ETH', img: '/images/monkey9.jpg' },
  { id: 10, name: 'Galaxy Ape', price: '5.5 ETH', img: '/images/monkey10.jpg' },
  { id: 11, name: 'Cosmic Ape', price: '6.7 ETH', img: '/images/monkey11.jpg' },
  { id: 12, name: 'Shadow Ape', price: '2.3 ETH', img: '/images/monkey12.jpg' },
  { id: 13, name: 'Solar Ape', price: '4.8 ETH', img: '/images/monkey13.jpg' },
  { id: 14, name: 'Nebula Ape', price: '5.9 ETH', img: '/images/monkey14.jpg' },
  { id: 15, name: 'Cyber King', price: '3.6 ETH', img: '/images/monkey15.jpg' },
  {
    id: 16,
    name: 'Digital Ape',
    price: '2.7 ETH',
    img: '/images/monkey16.jpg',
  },
  {
    id: 17,
    name: 'Steampunk Ape',
    price: '5.2 ETH',
    img: '/images/monkey17.jpg',
  },
  {
    id: 18,
    name: 'Electric Ape',
    price: '4.0 ETH',
    img: '/images/monkey18.jpg',
  },
  {
    id: 19,
    name: 'Ancient Warrior',
    price: '3.4 ETH',
    img: '/images/monkey19.jpg',
  },
  { id: 20, name: 'Alien Ape', price: '6.1 ETH', img: '/images/monkey20.jpg' },
]

const MonkeyList = () => {
  const isSmallScreen = useMediaQuery('(max-width: 600px)')
  const isMediumScreen = useMediaQuery('(max-width: 900px)')

  const monkeysPerPage = isSmallScreen ? 2 : isMediumScreen ? 3 : 5
  const totalPages = Math.ceil(monkeys.length / monkeysPerPage)
  const [page, setPage] = useState(0)

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
          .map((monkey) => (
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
                    fontSize: { xs: '0.5rem', sm: '0.57rem', md: '0.8rem' },
                  }}
                >
                  {monkey.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'right',
                    fontSize: { xs: '0.5rem', sm: '0.57rem', md: '0.7rem' },
                  }}
                >
                  {monkey.price}
                </Typography>
              </Box>
            </Box>
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
