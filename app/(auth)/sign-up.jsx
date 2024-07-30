import { View, ScrollView, Text } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const SignUp = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const auth = FIREBASE_AUTH;

	const submit = async () => {
		if (!username || !email || !password) {
			alert('Wypełnij wszystkie pola!');
		} else {
			setIsLoading(true);
			try {
				const userCredential = await createUserWithEmailAndPassword(auth, email, password);

				const user = userCredential.user;

				await updateProfile(user, {
					displayName: username,
				});

				const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
				await setDoc(userDocRef, {
					username: username,
					email: email,
					dictionary: [],
					points: 0,
					avatarUrl: '',
					hasTakenTest: false,
				});

				router.replace('sign-in');
				alert('Pomyślna rejestracja!');
			} catch (error) {
				console.log(error);
				alert(error.message);
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<SafeAreaView className='bg-slate-900 h-full'>
			<ScrollView>
				<View className='w-full justify-center min-h-[85vh] px-4 '>
					<FormField title='Nazwa użytkownika' value={username} handleChangeText={(e) => setUsername(e)} otherStyles='mt-7' />

					<FormField title='Email' value={email} handleChangeText={(e) => setEmail(e)} otherStyles='mt-7' keyboardType='email-address' />

					<FormField title='Hasło' value={password} handleChangeText={(e) => setPassword(e)} otherStyles='mt-7' />

					<CustomButton disabled={isLoading} title='Zarejestruj się' handlePress={submit} containerStyles='mt-7' isLoading={isLoading} />

					<View className='justify-center pt-5 flex-row gap-2'>
						<Text className='text-lg text-gray-100'>Masz już konto?</Text>
						<Link href='/sign-in' className='text-lg text-orange-700'>
							Zaloguj się
						</Link>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default SignUp;
