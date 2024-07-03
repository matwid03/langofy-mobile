import { doc, updateDoc, increment } from 'firebase/firestore';
import { FIRESTORE_DB } from '../FirebaseConfig';

const addPoints = async (userId, pointsToAdd) => {
  const userDocRef = doc(FIRESTORE_DB, 'users', userId);
  await updateDoc(userDocRef, {
    points: increment(pointsToAdd)
  });
};