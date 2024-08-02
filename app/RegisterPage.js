'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, firestore } from '@/firebase'; // Import firestore
import { Box, Button, TextField, Typography } from '@mui/material';
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore methods

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore with the user ID as the document ID
      await setDoc(doc(firestore, 'users', user.uid), {
        email: user.email
      });

      router.push('/'); // Navigate to the main page
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  const handleLoginRedirect = () => {
    router.push('/login');
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
      <Typography variant="h4">Register</Typography>
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
      <Button variant="contained" onClick={handleRegister} sx={{ borderRadius: 2, boxShadow: 2 }}>
        Register
      </Button>
      <Button variant="text" onClick={handleLoginRedirect} sx={{ borderRadius: 2, boxShadow: 2 }}>
        Already have an account? Login here
      </Button>
    </Box>
  );
}
