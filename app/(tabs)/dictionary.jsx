import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import DictionaryList from '../../components/DictionaryList';
import AddWordToDictionary from '../../components/AddWordToDictionary';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';

const Dictionary = () => {
	const addWordToDictionary = async (word, translation) => {
		const user = FIREBASE_AUTH.currentUser;
		if (!user) {
			alert('Użytkownik nie jest zalogowany');
			return;
		}

		const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);

		try {
			await updateDoc(userDocRef, {
				dictionary: arrayUnion({ word, translation }),
			});
			console.log('Słowo dodane');
		} catch (error) {
			console.error('Błąd:', error);
		}
	};

	return (
		<SafeAreaView className='bg-slate-900 h-full'>
			<View className='flex-1 items-center justify-center min-h-[30vh]'>
				<Text className='text-white text-2xl mb-4'>Słownik</Text>
				<AddWordToDictionary addWord={addWordToDictionary} />
				<DictionaryList />
			</View>
		</SafeAreaView>
	);
};

export default Dictionary;
