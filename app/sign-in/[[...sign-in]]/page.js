'use client'
import { AppBar, Container, Button, Typography, Toolbar, Paper, useTheme, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignInPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
                        sx={{ 
                            '&:hover': { bgcolor: 'primary.dark' }
                        }}
                    >
                        Home
                    </Button>
                </Toolbar>
            </AppBar>
            <Typography variant="body2" sx={{ marginTop: 2 }} align="center" alignItems={'center'}>
                    Don't have an account?{' '}
                    <Link href="/sign-up" passHref>
                        <Button variant="text">Sign Up</Button>
                    </Link>
                </Typography>
            <Container maxWidth="sm" sx={{ mt: isMobile ? 4 : 8, display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                <Paper 
                    elevation={3} 
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        width: '100%'
                    }}
                >
                    <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'text.primary' }}>
                        Sign In
                    </Typography>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <SignIn redirectUrl="/flashcards" />
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}