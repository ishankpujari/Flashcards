'use client'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { doc, collection, writeBatch, getDoc } from 'firebase/firestore'
import { AppBar, Toolbar, Box, Typography, Container, TextField, Button, Dialog, DialogContentText, DialogTitle, DialogContent, DialogActions, Card, CardContent } from '@mui/material'
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
    const router = useRouter()

    const handleSubmit = async () => {
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
    
    Return the flashcards as a JSON array of objects, each with 'front' and 'back' properties.`

            console.log('Sending prompt:', promptText)

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: promptText }),
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error('Response error:', errorText)
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
            }

            const data = await response.json()
            console.log('Received data:', data)
            setFlashcards(data)
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name for your flashcards set.')
            return
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)
        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name == name)) {
                alert('You already have a collection with this name.')
                return
            } else {
                collections.push({ name })
                batch.set(userDocRef, { flashcards: collections }, { merge: true })
            }
        } else {
            batch.set(userDocRef, { flashcards: [{ name }] })
        }

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
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Flashcard Generator
                    </Typography>
                    <Button color="inherit" component={Link} href="/">
                        Home
                    </Button>
                    <Button color="inherit" component={Link} href="/flashcards">
                        My Flashcards
                    </Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md">
                <Box sx={{ mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h4" gutterBottom>Generate Flashcards</Typography>
                    <TextField
                        label="Enter text to generate flashcards"
                        variant="outlined"
                        multiline
                        rows={4}
                        fullWidth
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                    <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
                        Generate
                    </Button>
                </Box>

                {flashcards.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {flashcards.map((flashcard, index) => (
                            <Card
                                key={index}
                                sx={{
                                    m: 2,
                                    width: 300,
                                    height: 200,
                                    cursor: 'pointer',
                                    perspective: '1000px',
                                }}
                                onClick={() => handleCardClick(index)}
                            >
                                <Box
                                    sx={{
                                        transition: 'transform 0.8s',
                                        transformStyle: 'preserve-3d',
                                        position: 'relative',
                                        width: '100%',
                                        height: '100%',
                                        transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            backfaceVisibility: 'hidden',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: 2,
                                            boxSizing: 'border-box',
                                            overflow: 'auto',
                                        }}
                                    >
                                        <Typography variant="subtitle1" gutterBottom>Flashcard {index + 1}</Typography>
                                        <Typography variant="body1">{flashcard.front}</Typography>
                                    </CardContent>
                                    <CardContent
                                        sx={{
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            backfaceVisibility: 'hidden',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: 2,
                                            boxSizing: 'border-box',
                                            overflow: 'auto',
                                            transform: 'rotateY(180deg)',
                                        }}
                                    >
                                        <Typography variant="subtitle1" gutterBottom>Flashcard {index + 1}</Typography>
                                        <Typography variant="body1">{flashcard.back}</Typography>
                                    </CardContent>
                                </Box>
                            </Card>
                        ))}
                    </Box>
                )}

                {flashcards.length > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Button variant="contained" color="secondary" onClick={handleOpen}>
                            Save Flashcards
                        </Button>
                    </Box>
                )}

                <Dialog open={open} onClose={handleClose}>
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
                        <Button onClick={saveFlashcards} variant="contained" color="primary"><Link href = "/">Save</Link></Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    )
}