# Inventory Management App

This Inventory Management App helps you track your inventory better by allowing you to add, remove, and manage your items efficiently.

## Technologies Used

- **Next.js**: Framework for building the React application.
- **Firebase**: Backend as a Service (BaaS) providing authentication and Firestore database.
- **AWS Rekognition**: Service for image processing and identification.
- **Material-UI**: React components for faster and easier web development.

## Features

- User Authentication
- Inventory Management
- Image Upload and Processing
- Responsive Design

## Hosted App

You can access the hosted application at: [Inventory Management App](your-hosted-app-link)

## Key Code Snippets and Explanations

### Firebase Configuration

Firebase is configured in the `firebase.js` file. This setup initializes Firebase and exports the Firestore and Auth instances for use throughout the application.

```javascript
// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { firestore, auth, storage };
```

# User Authentication
 
User authentication is handled using Firebase Auth. The AuthProvider component manages the authentication state and provides user information and actions to the rest of the application.
```javascript

// app/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 
```
# Adding Items to Inventory

The addItem function checks if the item already exists in the user's inventory and updates the quantity accordingly. If the item does not exist, it adds a new entry.
```javascript
// Add item to the user's inventory
const addItem = async (itemName) => {
  if (!user) return;

  const userInventoryRef = collection(firestore, 'users', user.uid, 'inventory');
  const itemRef = doc(userInventoryRef, itemName);
  const itemSnap = await getDoc(itemRef);

  if (itemSnap.exists()) {
    const { quantity } = itemSnap.data();
    await setDoc(itemRef, { quantity: quantity + 1 }, { merge: true });
  } else {
    await setDoc(itemRef, { quantity: 1, dateAdded: new Date() }, { merge: true });
  }
  await updateInventory();
};
```

# Handling Image Upload and Processing

The handleImageUpload function uploads the image to Firebase Storage and processes it using AWS Rekognition. This involves storing the image and then sending it to an API endpoint for analysis.

```javascript
// Handle image upload and processing
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (file) {
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setImage(url);
    processImage(url);
  }
};
```

# API Endpoint for Image Processing

The /api/process-image endpoint uses AWS Rekognition to detect labels in the uploaded image. It then sends back the most accurate label to be added to the user's inventory.

```javascript
// app/api/process-image.js
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const rekognition = new AWS.Rekognition();

export default async function handler(req, res) {
  const { imageUrl, userId } = req.body;

  try {
    const imageBuffer = await (await fetch(imageUrl)).buffer();

    const params = {
      Image: {
        Bytes: imageBuffer,
      },
    };

    const rekognitionResponse = await rekognition.detectLabels(params).promise();
    const label = rekognitionResponse.Labels[0].Name; // Assuming the first label is the most accurate

    res.status(200).json({ label });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Error processing image' });
  }
}
```

# Responsive Design

The UI is designed to be responsive, ensuring usability across different screen sizes. The inventory items are displayed in a scrollable container.

```javascript
// Inventory Items Container
<Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
  <Grid container spacing={2}>
    {filteredInventory.map(({ id, quantity }) => (
      <Grid key={id} item xs={12}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          bgcolor="#f0f0f0"
          padding={2}
          borderRadius={2}
          boxShadow={1}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <Typography variant="h6" color="#333" textAlign="center">
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6" color="#333" textAlign="center">
                {quantity}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Stack direction="row" spacing={1} justifyContent="center">
                <Button
                  variant="contained"
                  onClick={() => addItem(id)}
                  sx={{ borderRadius: 2, boxShadow: 1 }}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  onClick={() => removeItem(id)}
                  sx={{ borderRadius: 2, boxShadow: 1 }}
                >
                  Remove
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    ))}
  </Grid>
</Box>
```
## Usage

1. **Register a new user or log in:**
   * Navigate to the register or login page and enter your credentials.

2. **Add items to your inventory:**
   * Click the "Add New Item" button to manually add an item.
   * Upload an image using the camera icon to automatically identify and add an item to user's database.

3. **Manage your inventory:**
   * Use the search bar to find items.
   * Sort items by name, quantity, or date added.
   * Click the "Add" or "Remove" buttons to update item quantities.

# Contributing
Feel free to contribute to this project by submitting issues or pull requests.

## License
```
Copyright 2024 Mohamed Anas Aaffoute

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```