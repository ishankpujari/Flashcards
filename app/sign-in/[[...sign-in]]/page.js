import { AppBar, Container, Button, Typography, Toolbar } from "@mui/material";
import { Box } from "@mui/system";
import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignInPage() {
    return (
        <Container maxWidth="lg">
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Sign In
                    </Typography>
                   
                    <Button color="inherit" component={Link} href="/">
                        Home
                    </Button>
                </Toolbar>
            </AppBar>
            <br />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '80vh',
                }}
            >
                <SignIn redirectUrl="/flashcards" />
            </Box>
        </Container>
    );
}
