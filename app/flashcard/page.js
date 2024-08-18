'use client'
import { useUser, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { doc, collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '@/firebase'
import { Container, Grid, Card, CardContent, Typography, Box, AppBar, Toolbar, Button } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { styled } from '@mui/system'

// Styled Link to remove default styling and set color to white
const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: 'white', // Inherit color from parent (which is white in this case)
}));

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
        <>
            <AppBar position="static" sx={{ bgcolor: '#333', color: '#fff' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {name} Flashcards
                    </Typography>
                    <StyledLink href="/flashcards">
                        <Button color="inherit">
                            My Flashcards
                        </Button>
                    </StyledLink>
                    <StyledLink href="/">
                        <Button color="inherit">
                            Home
                        </Button>
                    </StyledLink>
                    <UserButton />
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>
                <Grid container spacing={2}>
                    {flashcards.map((flashcard) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={flashcard.id}>
                            <Card 
                                onClick={() => handleCardClick(flashcard.id)}
                                sx={{
                                    height: 200,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6" component="div" align="center">
                                        {flipped[flashcard.id] ? flashcard.back : flashcard.front}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    )
}
