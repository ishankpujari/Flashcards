'use client'

import { AppBar, Container, Button, Typography, Toolbar, Paper, useTheme, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { styled } from '@mui/system';
import SchoolIcon from '@mui/icons-material/School';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
}));

export default function SignUpPage() {
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
                <AppBar position="fixed" elevation={4} sx={{ bgcolor: theme.palette.primary.main }}>
                    <Toolbar>
                        <SchoolIcon sx={{ mr: 2, color: theme.palette.primary.contrastText }} />
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: theme.palette.primary.contrastText }}>
                            Flashcards AI
                        </Typography>
                        <StyledLink href="/">
                            <Button color="inherit" sx={{ mr: 2 }}>
                                Home
                            </Button>
                        </StyledLink>
                    </Toolbar>
                </AppBar>
                <br></br>
                <Box sx={{ mt: 8 }}>
                    <Typography variant="body2" sx={{ marginTop: 2 }} align="center">
                        Already have an account?{' '}
                        <Link href="/sign-in" passHref>
                            <Button variant="text">Sign In</Button>
                        </Link>
                    </Typography>
                </Box>
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
                            Sign Up
                        </Typography>
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <SignUp />
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    );
}
