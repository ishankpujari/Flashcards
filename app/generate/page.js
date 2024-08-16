'use client'
import {useUser} from '@clerk/nextjs'
import {useRouter} from 'next/navigation'
import { doc } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { Box, Typography, Container, TextField, Button, CardActionArea, Dialog, DialogContentText, DialogTitle, DialogContent } from '@mui/material';
import React, {useState} from 'react';
import { writeBatch, getDoc } from 'firebase/firestore'; 
import { CardContent } from '@mui/material';




export default function Generate() {
    const {isLoaded, isSignedIn, user} = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const router = useRouter()

    const handleSubmit = async () => {
        fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        })
            .then((res) => res.json())
            .then((data) => setFlashcards(data))
            .catch((error) => console.error('Error:', error));
        
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id] : !prev[id],
        }))
    }

    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }

    const saveFlashcards = async() => {
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
                collections.push({name})
                batch.set(userDocRef, {flashcards: collections}, {merge: true})
            }
        } else {
            batch.set(userDocRef, {flashcards: [{name}]})
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
    return <Container maxWidth = "md">
        <Box sx = {{mt: 4, mb:6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant = "h4">Generate Flashcards</Typography>
            {<TextField
                label = "Enter text to generate flashcards"
                variant = "outlined"
                multiline
                rows = {4}
                fullWidth
                value = {text}
                onChange = {(e) => setText(e.target.value)}
                sx = {{mt: 2}}
            />}
            <Button variant = "contained" color = "primary" onClick = {handleSubmit} sx = {{mt: 2}}>
                Generate
            </Button>
        </Box>

        {flashcards.length > 0 && (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {flashcards.map((flashcard, index) => (
            <Box
                key={index}
                sx={{
                    m: 2,
                    p: 2,
                    border: '1px solid',
                    borderColor: 'grey.300',
                    borderRadius: 2,
                    cursor: 'pointer',
                    backgroundColor: flipped[index] ? 'lightgray' : 'white',
                }}
                onClick={() => handleCardClick(index)}
            >
                <Typography variant="h6"> Flashcard Preview:
                </Typography>
                <Grid container spacing = {3}>
                    {flashcards.map((flashcards, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <CardActionArea onClick={() => handleCardClick(index)}>
                                <CardContent>
                                <Box
                                    sx={{
                                        perspective: '1000px',
                                        '& > div': {
                                        transition: 'transform 0.8s',
                                        transformStyle: 'preserve-3d',
                                        position: 'relative',
                                        width: '100%',
                                        height: '200px', 
                                        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                        transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                        },
                                        '& > div > div': {
                                        transition: 'absolute',
                                        width: '100%',
                                        height: '100%', 
                                        backfaceVisibility : 'hidden',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 2,
                                        boxSizing: 'border-box',
                                        },
                                    }}
                                    >
                                        <div>
                                            <div>
                                                <Typography variant="h5" component = "div">{flashcard.front}</Typography>
                                            </div>
                                            <div>
                                                <Typography variant="h5" component = "div">{flashcard.back}</Typography>
                                            </div>
                                        </div>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Grid>
                    ))}
                </Grid>
                <Box sx = {{mt: 4, display: 'flex', justifyContent: 'center'}}>
                    <Button variant="contained" color="secondary" onClick={handleOpen}>
                        Save Flashcards
                    </Button>
                </Box>
            </Box>
        ))}
    </Box>
)}


        <Dialog open = {open} onClose = {handleClose}>
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
        </Dialog>
    </Container>
}