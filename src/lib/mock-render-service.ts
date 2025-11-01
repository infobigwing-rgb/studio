// In a real application, this would run on a server or in a Cloud Function.
// For demonstration purposes, we'll run this on the client.

import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  doc,
  limit,
  Timestamp,
} from 'firebase/firestore';

let intervalId: NodeJS.Timeout | null = null;

const PROCESSING_CHANCE = 0.5; // 50% chance to move from 'queued' to 'processing'
const FAILURE_CHANCE = 0.05; // 5% chance to fail during processing

async function processRenderQueue(firestore: Firestore) {
  try {
    const q = query(
      collection(firestore, 'renders'),
      where('status', 'in', ['queued', 'processing']),
      limit(10) // Process up to 10 at a time
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      // console.log('No active renders to process.');
      return;
    }

    const batch = writeBatch(firestore);

    querySnapshot.forEach(renderDoc => {
      const render = renderDoc.data();
      const renderRef = doc(firestore, 'renders', renderDoc.id);

      if (render.status === 'queued') {
        // Move from 'queued' to 'processing'
        if (Math.random() < PROCESSING_CHANCE) {
          batch.update(renderRef, { status: 'processing', progress: 1 });
        }
      } else if (render.status === 'processing') {
        // Update progress
        const newProgress = Math.min(render.progress + Math.floor(Math.random() * 15) + 5, 100);

        if (newProgress >= 100) {
          // Mark as completed
          batch.update(renderRef, {
            status: 'completed',
            progress: 100,
            // In a real app, this would be a URL to the actual video file in Cloud Storage
            outputUrl: `https://picsum.photos/seed/${renderDoc.id}/1280/720`,
          });
        } else {
            // Check for random failure
            if (Math.random() < FAILURE_CHANCE) {
                 batch.update(renderRef, { status: 'failed', progress: newProgress });
            } else {
                 batch.update(renderRef, { progress: newProgress });
            }
        }
      }
    });

    await batch.commit();
    // console.log(`Processed ${querySnapshot.size} renders.`);
  } catch (error) {
    console.error('Error processing render queue:', error);
  }
}

export function startMockRenderService(firestore: Firestore): () => void {
  if (intervalId) {
    console.warn('Mock render service is already running.');
    return () => {};
  }

  // console.log('Starting mock render service...');
  // Process immediately on start
  processRenderQueue(firestore);

  // Then process every 3 seconds
  intervalId = setInterval(() => processRenderQueue(firestore), 3000);

  // Return a function to stop the service
  return () => {
    if (intervalId) {
      // console.log('Stopping mock render service.');
      clearInterval(intervalId);
      intervalId = null;
    }
  };
}
