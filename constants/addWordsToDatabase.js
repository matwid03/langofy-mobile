import { doc, updateDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { Easy } from "./constants";

export const addWordsToDatabase = () => {
  try {
    Easy.map(async (word, index) => {
      await updateDoc(doc(FIRESTORE_DB, 'words', 'easy'), {
        [index]: { ...word },
      });
    });
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};