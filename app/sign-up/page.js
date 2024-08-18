'use client'

import { AppBar, Container, Button, Typography, Toolbar, Paper, useTheme, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignUpPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Flashcard SaaS
                    </Typography>
                    <Button color="inherit" component={Link} href="/">
                        Home
                    </Button>
                </Toolbar>

            </AppBar>
            <br></br>
            <Typography variant="body2" align="center">
                                Already have an account?{' '}
                                <Link href="/sign-in">
                                    Sign In
                                </Link>
                            </Typography>
                     
            <Container maxWidth="sm">
                <Box sx={{ mt: 8, mb: 4 }}>
                    <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography component="h1" variant="h5" gutterBottom>
                            Sign Up
                        </Typography>
                        <SignUp />
                        
                            
                    </Paper>
                </Box>
            </Container>
        </>
    );
}