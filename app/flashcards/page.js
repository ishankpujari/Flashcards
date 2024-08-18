'use client'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useRouter } from 'next/navigation'
import { Container, Grid, Card, CardContent, Typography, AppBar, Toolbar, Button } from '@mui/material'
import Link from 'next/link'

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    useEffect(() => {
        const fetchFlashcards = async () => {
            if (!user) return

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

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        My Flashcards
                    </Typography>
                    <Button color="inherit" component={Link} href="/">
                        Home
                    </Button>
                    <Button color="inherit" component={Link} href="/generate">
                        Generate
                    </Button>
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>
                <Grid container spacing={2}>
                    {flashcards.map((flashcard) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={flashcard.name}>
                            <Card onClick={() => handleCardClick(flashcard.name)}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {flashcard.name}
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