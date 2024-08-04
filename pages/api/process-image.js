import { RekognitionClient, DetectLabelsCommand } from '@aws-sdk/client-rekognition';
import { firestore } from '@/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import fetch from 'node-fetch';

const rekognitionClient = new RekognitionClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { imageUrl, userId } = req.body;

    try {
      const response = await fetch(imageUrl);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const params = {
        Image: {
          Bytes: buffer,
        },
        MaxLabels: 10,
        MinConfidence: 70,
      };

      const command = new DetectLabelsCommand(params);
      const rekognitionData = await rekognitionClient.send(command);

      if (rekognitionData.Labels.length === 0) {
        res.status(200).json({ message: 'No labels detected' });
        return;
      }

      // Get the most accurate label
      const mostAccurateLabel = rekognitionData.Labels.reduce((prev, current) => 
        (prev.Confidence > current.Confidence) ? prev : current
      );

      const userInventoryRef = collection(firestore, 'users', userId, 'inventory');
      const itemRef = doc(userInventoryRef, mostAccurateLabel.Name); // Use the most accurate label as the document ID

      await setDoc(itemRef, {
        name: mostAccurateLabel.Name,
        quantity: 1,
        dateAdded: new Date(),
      }, { merge: true });

      res.status(200).json({ label: mostAccurateLabel.Name });
    } catch (error) {
      console.error('Error processing image:', error);
      res.status(500).json({ error: 'Failed to process image' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
