import { View, Text, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { Easy } from '../../constants';

const addTodo = () => {
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

const FillGaps = () => {
	useEffect(() => {
		addTodo();
	}, []);

	return (
		<SafeAreaView className='bg-slate-900 h-full'>
			<ScrollView>
				<View className='w-full items-center justify-center min-h-[85vh]'>
					<Text className='text-white'>FillGaps</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default FillGaps;
