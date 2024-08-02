'use client';

import { useRouter } from 'next/navigation';
import { Box, Button, Typography, Container, Paper } from '@mui/material';

export default function LandingPage() {
  const router = useRouter();

  const navigateToLogin = () => {
    router.push('/login');
  };

  const navigateToRegister = () => {
    router.push('/register');
  };

  return (
    <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom>
          Welcome to Inventory Management App
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          This app helps you track your inventory better by allowing you to add, remove, and manage your items efficiently. Get started by creating an account or logging in.
        </Typography>
        <Box display="flex" gap={2} justifyContent="center">
          <Button variant="contained" onClick={navigateToLogin} sx={{ borderRadius: 2, boxShadow: 2 }}>
            Login
          </Button>
          <Button variant="contained" onClick={navigateToRegister} sx={{ borderRadius: 2, boxShadow: 2 }}>
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
