'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase';
import { Box, Button, TextField, Typography } from '@mui/material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/'); // Navigate to the main page
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleRegisterRedirect = () => {
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
      bgcolor="#f5f5f5"
    >
      <Typography variant="h4">Login</Typography>
      <TextField
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ width: '300px' }}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ width: '300px' }}
      />
      <Button variant="contained" onClick={handleLogin} sx={{ borderRadius: 2, boxShadow: 2 }}>
        Login
      </Button>
      <Button variant="text" onClick={handleRegisterRedirect} sx={{ borderRadius: 2, boxShadow: 2 }}>
        Don't have an account? Register here
      </Button>
    </Box>
  );
}
