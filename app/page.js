import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Box, AppBar, Toolbar, Typography, Button, Grid } from "@mui/material";
import Link from 'next/link';
import Head from "next/head";

export default function Home() {
  return (
    <Box sx={{ width: '100vw' }}> {/* Full width */}
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcards from your text" />
      </Head>

      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2', boxShadow: 'none' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>Flashcard SaaS</Typography>
          <SignedOut>
            <Button color="inherit" component={Link} href="/sign-in">Sign in</Button>
            <Button color="inherit" component={Link} href="/sign-up" sx={{ ml: 2, bgcolor: 'white', color: '#1976d2', borderRadius: '20px', px: 3 }}>
              Sign up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', my: 8, py: 8, backgroundColor: '#f5f5f5', borderRadius: '12px', mx: 'auto', width: '90%' }}>
        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>Welcome to Flashcard SaaS</Typography>
        <Typography variant="h5" sx={{ color: 'gray', mb: 4 }}>The easiest way to make flashcards from your text</Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ px: 5, py: 2, fontSize: '1.2rem', borderRadius: '50px', textTransform: 'none' }}
          component={Link} href="/sign-up"
        >
          Get Started
        </Button>
      </Box>

      {/* Features Section */}
      <Box sx={{ my: 8, width: '90%', mx: 'auto' }}>
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 4 }}>Features</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Easy Text Input</Typography>
              <Typography color="textSecondary">
                Simply input your text and let our software do the rest. Creating flashcards has never been easier.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Smart Flashcards</Typography>
              <Typography color="textSecondary">
                Our AI intelligently breaks down your text into concise flashcards, perfect for studying.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Accessible Anywhere</Typography>
              <Typography color="textSecondary">
                Access your flashcards from any device, at any time. Study on the go with ease.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ my: 8, width: '90%', mx: 'auto' }}>
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 4 }}>Pricing</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{
              p: 4,
              textAlign: 'center',
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: '12px',
              bgcolor: 'white',
              boxShadow: 2,
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Basic Plan</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>$0/month</Typography>
              <Typography color="textSecondary">
                Simply input your text and let our software do the rest. Creating flashcards has never been easier.
              </Typography>
              <Button variant='contained' color='primary' sx={{ mt: 4, borderRadius: '50px', px: 4 }} component={Link} href="/generate">
                Choose this plan
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{
              p: 4,
              textAlign: 'center',
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: '12px',
              bgcolor: 'white',
              boxShadow: 2,
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Pro Plan</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>$5/month</Typography>
              <Typography color="textSecondary">
                Our AI intelligently breaks down your text into concise flashcards, perfect for studying.
              </Typography>
              <Button variant='contained' color='primary' sx={{ mt: 4, borderRadius: '50px', px: 4 }}>
                Choose this plan
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{
              p: 4,
              textAlign: 'center',
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: '12px',
              bgcolor: 'white',
              boxShadow: 2,
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Premium Plan</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>$10/month</Typography>
              <Typography color="textSecondary">
                Access your flashcards from any device, at any time. Study on the go with ease.
              </Typography>
              <br></br>
              <Button variant='contained' color='primary' sx={{ mt: 4, borderRadius: '50px', px: 4 }}>
                Choose this plan
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
