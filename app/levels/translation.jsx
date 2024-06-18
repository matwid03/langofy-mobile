import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { FlatList } from 'react-native-gesture-handler';

const Translation = () => {
	const [words, setWords] = useState([]);

	useEffect(() => {
		const user = FIREBASE_AUTH.currentUser;
		if (!user) {
			console.log('aaaa');
			return;
		}

		const fetchWords = async () => {
			try {
				const wordSnapshot = await getDocs(collection(FIRESTORE_DB, 'words'));
				const wordsList = wordSnapshot.docs.map((doc) => doc.data());
				setWords(wordsList);
			} catch (error) {
				console.error('Błąd podczas pobierania słów:', error);
			}
		};

		fetchWords();
	}, []);

	return (
		<SafeAreaView className='bg-slate-900 h-full'>
			<FlatList
				data={words}
				renderItem={({ item }) => (
					<View className='p-4'>
						<Text className='text-white text-2xl'>{item.word}</Text>
						<Text className='text-white text-xl'>{item.translation}</Text>
					</View>
				)}
				keyExtractor={(item, index) => index.toString()}
			/>
		</SafeAreaView>
	);
};

export default Translation;
