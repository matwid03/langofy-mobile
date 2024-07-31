import { doc, updateDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { Easy, Medium, Hard } from "./constants";

export const addWordsToDatabase = () => {
  try {
    Medium.map(async (word, index) => {
      await updateDoc(doc(FIRESTORE_DB, 'words', 'medium'), {
        [index]: { ...word },
      });
    });
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};