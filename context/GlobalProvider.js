import { createContext, useContext, useState, useEffect } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { router } from "expo-router";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasTakenTest, setHasTakenTest] = useState(false);
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged(async (user) => {

      if (user) {
        setIsLoggedIn(true);
        setUser(user);

        const userDoc = await getDocs(query(collection(FIRESTORE_DB, 'users'), where('uid', '==', user.uid)));
        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data();
          setHasTakenTest(userData.hasTakenTest);
        }
        setIsLoading(false);
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setHasTakenTest(false);
        setIsLoading(false);

      }
    });

    return () => unsubscribe();
  }, []);

  const updateUserTestStatus = async (status) => {
    if (user) {
      const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
      console.log('Updating user status to:', status);
      await updateDoc(userDocRef, { hasTakenTest: status });
      setHasTakenTest(status);
    }
  };

  const handleTestComplete = async (finalDifficultyLevel) => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
      await updateDoc(userDocRef, {
        hasTakenTest: true,
        difficultyLevel: finalDifficultyLevel,
      });
      setHasTakenTest(true);
    }
    router.replace('/home');
  };

  useEffect(() => {
    console.log('GlobalProvider state:', { isLoggedIn, hasTakenTest });
  }, [isLoggedIn, user, hasTakenTest]);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
        setIsLoading,
        setHasTakenTest,
        hasTakenTest,
        updateUserTestStatus,
        handleTestComplete
      }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;