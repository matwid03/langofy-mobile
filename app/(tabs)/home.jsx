import { View, Text } from 'react-native';
import React from 'react';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

const Home = () => {
	return (
		<View className='flex-1 items-center justify-center'>
			<Text>Witaj: {FIREBASE_AUTH.currentUser?.displayName}!</Text>
		</View>
	);
};

export default Home;
