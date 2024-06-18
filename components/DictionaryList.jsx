import React, { useState, useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { arrayRemove, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';

const DictionaryList = () => {
	const [dictionary, setDictionary] = useState([]);

	useEffect(() => {
		const user = FIREBASE_AUTH.currentUser;
		if (!user) {
			return;
		}

		const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);

		const unsubscribe = onSnapshot(userDocRef, (doc) => {
			if (doc.exists()) {
				setDictionary(doc.data().dictionary || []);
			}
		});

		return () => unsubscribe();
	}, []);

	const handleRemoveWord = async (wordToRemove) => {
		const user = FIREBASE_AUTH.currentUser;
		if (!user) {
			return;
		}

		const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);

		try {
			await updateDoc(userDocRef, {
				dictionary: arrayRemove(wordToRemove),
			});
		} catch (error) {
			console.log('Błąd', error);
		}
	};

	const renderItem = ({ item }) => (
		<View className='p-2 border-b border-gray-300 flex-row justify-between items-center gap-2 mt-2 w-80'>
			<Text className='text-white text-2xl'>
				{item.word} - {item.translation}
			</Text>
			<TouchableOpacity onPress={() => handleRemoveWord(item)}>
				<Text className='text-red-700 text-2xl'>X</Text>
			</TouchableOpacity>
		</View>
	);

	return <FlatList data={dictionary} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} />;
};

export default DictionaryList;
