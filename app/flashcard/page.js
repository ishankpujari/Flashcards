'use client'

import { useUser, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { doc, collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '@/firebase'
import { Container, Grid, Card, CardContent, Typography, Box, AppBar, Toolbar, Button, ThemeProvider, createTheme } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { styled } from '@mui/system'
import SchoolIcon from '@mui/icons-material/School'
import Head from 'next/head'

const theme = createTheme({
  palette: {
    primary: {
      main: '#2C3E50',
      contrastText: '#ECF0F1',
    },
  },
});

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  textDecoration: 'none',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '0',
    height: '2px',
    bottom: '-4px',
    left: '50%',
    background: theme.palette.primary.contrastText,
    transition: 'all 0.3s ease-out',
  },
  '&:hover::after': {
    width: '100%',
    left: '0',
  },
}))

const StyledCard = styled(Card)(({ theme }) => ({
  height: 200,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  cursor: 'pointer',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
}))

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})
  const searchParams = useSearchParams()
  const name = searchParams.get('name')

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!name || !user) return
      
      const colRef = collection(doc(collection(db, 'users'), user.id), name)
      const querySnapshot = await getDocs(colRef)
      const fetchedFlashcards = []
      
      querySnapshot.forEach(doc => {
        fetchedFlashcards.push({
          id: doc.id,
          ...doc.data()
        })
      });
      setFlashcards(fetchedFlashcards)
    }
    fetchFlashcards()
  }, [user, name])

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (!isLoaded || !isSignedIn) {
    return null
  }

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>
      <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
        <AppBar position="fixed" elevation={4} sx={{ bgcolor: '#2C3E50' }}>
          <Toolbar>
            <SchoolIcon sx={{ mr: 2, color: '#ECF0F1' }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#ECF0F1' }}>
              My Flashcards
            </Typography>
            <StyledLink href="/generate">
              <Button color="inherit" sx={{ mr: 2 }}>
                Generate
              </Button>
            </StyledLink>
            <StyledLink href="/flashcards">
              <Button color="inherit" sx={{ mr: 2 }}>
                My Flashcards
              </Button>
            </StyledLink>
            <UserButton />
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Container sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {flashcards.map((flashcard) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={flashcard.id}>
                <StyledCard
                  onClick={() => handleCardClick(flashcard.id)}
                >
                  <CardContent sx={{ position: 'relative', height: '100%' }}>
                    <Typography 
                      variant="h6" 
                      component="div" 
                      align="center"
                      sx={{ 
                        fontFamily: "'Roboto Slab', serif",
                        fontWeight: 500,
                        fontSize: '1.2rem',
                        lineHeight: 1.4,
                        transition: 'opacity 0.3s ease-in-out',
                        opacity: flipped[flashcard.id] ? 0 : 1,
                      }}
                    >
                      {flashcard.front}
                    </Typography>
                    <Typography 
                        variant="h6" 
                        component="div" 
                        align="center"
                        sx={{ 
                            fontFamily: "'Roboto Slab', serif",
                            fontWeight: 500,
                            fontSize: '1.2rem',
                            lineHeight: 1.4,
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: '100%',
                            transform: 'translate(-50%, -50%)',
                            transition: 'opacity 0.3s ease-in-out',
                            opacity: flipped[flashcard.id] ? 1 : 0,
                        }}
                        >
                        {flashcard.back}
                        </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  )
}