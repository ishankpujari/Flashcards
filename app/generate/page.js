'use client'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { doc, collection, writeBatch, getDoc } from 'firebase/firestore'
import { 
    AppBar, Toolbar, Box, Typography, Container, TextField, 
    Button, Dialog, DialogContentText, DialogTitle, DialogContent, 
    DialogActions, Card, CardContent, Grid, CircularProgress,
    useTheme, useMediaQuery
} from '@mui/material'
import React, { useState } from 'react'
import { db } from '@/firebase'
import Link from 'next/link'

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const promptText = `Generate 10 concise and effective flashcards about the following topic: ${text}. For each flashcard:
    1. Create a clear, concise question for the front.
    2. Provide an accurate, informative answer for the back.
    3. Focus on a single concept or piece of information.
    4. Use simple, accessible language.
    5. Include various question types (e.g., definitions, examples, comparisons).
    6. Avoid complex or ambiguous phrasing.
    7. Use mnemonics or memory aids when appropriate.
    8. Tailor the difficulty to intermediate level.
    9. Extract key information if given a body of text.
    10. Aim for a balanced set covering the topic comprehensively.
    
    Return the flashcards as a JSON array of objects, each with 'front' and 'back' properties.`;
            
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: promptText }),
            })
            
            const data = await response.json()
            setFlashcards(data)
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name for your flashcards set.')
            return
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)

        const collections = docSnap.exists() ? docSnap.data().flashcards || [] : []
        if (collections.find((f) => f.name === name)) {
            alert('You already have a collection with this name.')
            return
        }

        collections.push({ name })
        batch.set(userDocRef, { flashcards: collections }, { merge: true })

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        })
        
        await batch.commit()
        handleClose()
        router.push('/flashcards')
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar position="static" elevation={4} sx={{ bgcolor: 'primary.main' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        Flashcard SaaS
                    </Typography>
                    <Button 
                        color="inherit" 
                        component={Link} 
                        href="/" 
                        sx={{ mx: 1, '&:hover': { bgcolor: 'primary.dark' } }}
                    >
                        Home
                    </Button>
                    <Button 
                        color="inherit" 
                        component={Link} 
                        href="/flashcards" 
                        sx={{ mx: 1, '&:hover': { bgcolor: 'primary.dark' } }}
                    >
                        My Flashcards
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
                <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    Generate Flashcards
                </Typography>

                <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <TextField
                        label="Enter text to generate flashcards"
                        variant="outlined"
                        multiline
                        rows={4}
                        fullWidth
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        sx={{ mb: 4, maxWidth: 600, width: '100%' }}
                    />

                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleSubmit} 
                        disabled={loading}
                        sx={{ 
                            mt: 2, 
                            py: 1, 
                            px: 4, 
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '1.1rem'
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate'}
                    </Button>
                </Box>

                {flashcards.length > 0 && (
    <Box sx={{ mt: 8 }}>
        <Grid container spacing={3} justifyContent="center">
            {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box
                        onClick={() => handleCardClick(index)}
                        sx={{
                            height: 220,
                            perspective: '1000px',
                            cursor: 'pointer',
                        }}
                    >
                        <Box
                            sx={{
                                height: '100%',
                                position: 'relative',
                                transition: 'transform 0.6s',
                                transformStyle: 'preserve-3d',
                                transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                            }}
                        >
                            <Card
                                sx={{
                                    height: '100%',
                                    position: 'absolute',
                                    width: '100%',
                                    backfaceVisibility: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: 3,
                                    '&:hover': {
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                <CardContent>
                                    <Typography variant="body1" sx={{ fontSize: '1.1rem', textAlign: 'center' }}>
                                        {flashcard.front}
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card
                                sx={{
                                    height: '100%',
                                    position: 'absolute',
                                    width: '100%',
                                    backfaceVisibility: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transform: 'rotateY(180deg)',
                                    boxShadow: 3,
                                    '&:hover': {
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                <CardContent>
                                    <Typography variant="body1" sx={{ fontSize: '1.1rem', textAlign: 'center' }}>
                                        {flashcard.back}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                </Grid>
            ))}
        </Grid>
    </Box>
)}

                {flashcards.length > 0 && (
                    <Box sx={{ mt: 6, textAlign: 'center' }}>
                        <Button 
                            variant="contained" 
                            color="secondary" 
                            onClick={handleOpen}
                            sx={{ 
                                py: 1, 
                                px: 4, 
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1.1rem'
                            }}
                        >
                            Save Flashcards
                        </Button>
                    </Box>
                )}

                <Dialog open={open} onClose={handleClose} fullScreen={isMobile}>
                    <DialogTitle>Save Flashcards</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter a name for your flashcards set:
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Collection Name"
                            type="text"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            variant="outlined"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button 
                            onClick={saveFlashcards} 
                            variant="contained" 
                            color="primary"
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    )
}