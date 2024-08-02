'use client';

import { useEffect, useState } from 'react';
import { collection, deleteDoc, getDocs, query, getDoc, setDoc, doc } from 'firebase/firestore';
import { Box, Button, Modal, Stack, TextField, Typography, CircularProgress, MenuItem, Select } from '@mui/material';
import { firestore } from '@/firebase';
import { useAuth } from '@/app/AuthContext';
import { useRouter } from 'next/navigation';
import LandingPage from '@/app/LandingPage';

export default function Page() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCriteria, setSortCriteria] = useState('name');

  useEffect(() => {
    if (user) {
      updateInventory();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortInventory();
  }, [searchQuery, sortCriteria, inventory]);

  const updateInventory = async () => {
    if (!user) return;

    const userInventoryRef = collection(firestore, 'users', user.uid, 'inventory');
    const snapshot = await getDocs(userInventoryRef);
    const inventoryList = [];
    snapshot.forEach((doc) => {
      inventoryList.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList); // Set the initial filtered inventory
  };

  const filterAndSortInventory = () => {
    let filtered = inventory.filter(item =>
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (sortCriteria) {
      case 'quantity':
        filtered.sort((a, b) => b.quantity - a.quantity); // Descending order
        break;
      case 'dateAdded':
        filtered.sort((a, b) => a.dateAdded ? a.dateAdded.toMillis() - b.dateAdded.toMillis() : 0); // Assumes dateAdded is a Firestore timestamp
        break;
      default:
        filtered.sort((a, b) => a.id.localeCompare(b.id));
    }

    setFilteredInventory(filtered);
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
      await setDoc(itemRef, { quantity: 1, dateAdded: new Date() }); // Add dateAdded field
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
      p={3}
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
            borderRadius: 2,
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
              variant="contained"
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
        sx={{ borderRadius: 2, boxShadow: 2 }}
      >
        Add New Item
      </Button>
      <Button variant="contained" onClick={logout} sx={{ borderRadius: 2, boxShadow: 2 }}>
        Logout
      </Button>
      <Box width="800px" display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: '60%', borderRadius: 2 }}
        />
        <Select
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
          displayEmpty
          sx={{ width: '30%', borderRadius: 2 }}
        >
          <MenuItem value="name">Sort by Name</MenuItem>
          <MenuItem value="quantity">Sort by Quantity</MenuItem>
          <MenuItem value="dateAdded">Sort by Date Added</MenuItem>
        </Select>
      </Box>
      <Box border="1px solid #333" borderRadius={2} boxShadow={2}>
        <Box
          width="800px"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="8px 8px 0 0"
        >
          <Typography variant="h2" color="#333">
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto" padding={2}>
          {filteredInventory.map(({ id, quantity }) => (
            <Box
              key={id}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={3}
              borderRadius={2}
              boxShadow={1}
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
                  sx={{ borderRadius: 2, boxShadow: 1 }}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    removeItem(id);
                  }}
                  sx={{ borderRadius: 2, boxShadow: 1 }}
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
