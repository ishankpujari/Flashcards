import { AppBar, Container, Button, Typography, Toolbar } from "@mui/material";
import { Box } from "@mui/system";
import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignUpPage() {
    return (
        <Container maxWidth="lg">
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Sign Up
                    </Typography>
                   
                    <Button color="inherit" component={Link} href="/">
                        Home
                    </Button>
                </Toolbar>
            </AppBar>
            <br />
            {/* Main Content */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '80vh',
                }}
            >
                <SignUp />
                <Typography variant="body2" sx={{ marginTop: 2 }}>
                    Already have an account?{' '}
                    <Link href="/sign-in" passHref>
                        <Button variant="text">Sign In</Button>
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
}
