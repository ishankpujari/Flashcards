'use client'

import { useUser, UserButton } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { collection, doc, getDoc, setDoc, updateDoc, arrayRemove } from 'firebase/firestore'
import { db } from '@/firebase'
import { useRouter } from 'next/navigation'
import { Container, Grid, Card, CardContent, Typography, AppBar, Toolbar, Button, Box, Avatar, Fab, Tooltip, IconButton, ThemeProvider, createTheme } from '@mui/material'
import Link from 'next/link'
import AddIcon from '@mui/icons-material/Add'
import SchoolIcon from '@mui/icons-material/School'
import DeleteIcon from '@mui/icons-material/Delete'
import { styled, useTheme } from '@mui/system'

const theme = createTheme({
    palette: {
        primary: {
            main: '#2C3E50',
            contrastText: '#ECF0F1',
        },
    },
})

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

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    useEffect(() => {
        const fetchFlashcards = async () => {
            if (!user || !isSignedIn) {
                return <Typography>"You are not signed in"</Typography>
            }

            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                setFlashcards(docSnap.data().flashcards || [])
            } else {
                await setDoc(docRef, { flashcards: [] })
            }
        }
        fetchFlashcards()
    }, [user])

    if (!isLoaded || !isSignedIn) {
        return null
    }

    const handleCardClick = (name) => {
        router.push(`/flashcard?name=${encodeURIComponent(name)}`)
    }

    const handleDelete = async (name) => {
        const updatedFlashcards = flashcards.filter(flashcard => flashcard.name !== name)
        setFlashcards(updatedFlashcards)

        const docRef = doc(collection(db, 'users'), user.id)
        await updateDoc(docRef, {
            flashcards: arrayRemove({ name: name })
        })
    }

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
                <AppBar position="fixed" elevation={4} sx={{ bgcolor: theme.palette.primary.main }}>
                    <Toolbar>
                        <SchoolIcon sx={{ mr: 2, color: theme.palette.primary.contrastText }} />
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: theme.palette.primary.contrastText }}>
                            My Flashcards
                        </Typography>
                        <StyledLink href="/generate">
                            <Button color="inherit" sx={{ mr: 2 }}>
                                Generate
                            </Button>
                        </StyledLink>
                        <UserButton />
                    </Toolbar>
                </AppBar>
                <br></br>
                <br></br>
                <br></br>
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Grid container spacing={3}>
                        {flashcards.map((flashcard) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={flashcard.name}>
                                <Card 
                                    sx={{ 
                                        height: '100%', 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4,
                                        }
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                                        <Avatar sx={{ width: 60, height: 60, mb: 2, bgcolor: theme.palette.primary.main }}>
                                            {flashcard.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Typography variant="h6" component="div" align="center">
                                            {flashcard.name}
                                        </Typography>
                                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                            <Button onClick={() => handleCardClick(flashcard.name)} variant="outlined" size="small">
                                                View
                                            </Button>
                                            <IconButton onClick={() => handleDelete(flashcard.name)} color="error" size="small">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </ThemeProvider>
    )
}
