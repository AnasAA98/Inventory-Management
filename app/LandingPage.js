'use client';

import { useRouter } from 'next/navigation';
import { Box, Button, Typography } from '@mui/material';

export default function LandingPage() {
  const router = useRouter();

  const navigateToLogin = () => {
    router.push('/login');
  };

  const navigateToRegister = () => {
    router.push('/register');
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      p={3}
    >
      <Typography variant="h2" gutterBottom>
        Welcome to Inventory Management App
      </Typography>
      <Typography variant="h5" textAlign="center" maxWidth="600px" mb={4}>
        This app helps you track your inventory better by allowing you to add, remove, and manage your items efficiently. Get started by creating an account or logging in.
      </Typography>
      <Box display="flex" gap={2}>
        <Button variant="contained" onClick={navigateToLogin}>
          Login
        </Button>
        <Button variant="contained" onClick={navigateToRegister}>
          Register
        </Button>
      </Box>
    </Box>
  );
}
