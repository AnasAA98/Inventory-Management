'use client';

import { useEffect, useState } from 'react';
import { collection, deleteDoc, getDocs, query, getDoc, setDoc, doc } from 'firebase/firestore';
import { Box, Button, Modal, Stack, TextField, Typography, CircularProgress } from '@mui/material';
import { firestore } from '@/firebase';
import { useAuth } from '@/app/AuthContext';
import { useRouter } from 'next/navigation';
import LandingPage from '@/app/LandingPage';

export default function Page() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  useEffect(() => {
    if (user) {
      updateInventory();
    }
  }, [user]);

  const updateInventory = async () => {
    if (!user) return;

    const userInventoryRef = collection(firestore, 'users', user.uid, 'inventory');
    const snapshot = query(userInventoryRef);
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const removeItem = async (itemId) => {
    if (!user) return;

    const itemRef = doc(firestore, 'users', user.uid, 'inventory', itemId);
    const itemSnap = await getDoc(itemRef);

    if (itemSnap.exists()) {
      const { quantity } = itemSnap.data();
      if (quantity === 1) {
        await deleteDoc(itemRef);
      } else {
        await setDoc(itemRef, { quantity: quantity - 1 }, { merge: true });
      }
    }
    await updateInventory();
  };

  const addItem = async (itemName) => {
    if (!user) return;

    const userInventoryRef = collection(firestore, 'users', user.uid, 'inventory');
    const itemRef = doc(userInventoryRef, itemName);
    const itemSnap = await getDoc(itemRef);

    if (itemSnap.exists()) {
      const { quantity } = itemSnap.data();
      await setDoc(itemRef, { quantity: quantity + 1 }, { merge: true });
    } else {
      await setDoc(itemRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (loading) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #0000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="h6"> Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={() => {
          handleOpen();
        }}
      >
        Add New Item
      </Button>
      <Button variant="contained" onClick={logout}>
        Logout
      </Button>
      <Box border="1px solid #333">
        <Box
          width="800px"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" color="#333">
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {inventory.map(({ id, quantity }) => (
            <Box
              key={id}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={5}
            >
              <Typography variant="h3" color="#333" textAlign="center">
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </Typography>
              <Typography variant="h3" color="#333" textAlign="center">
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => {
                    addItem(id);
                  }}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    removeItem(id);
                  }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
