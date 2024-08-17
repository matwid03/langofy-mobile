import { View, ScrollView, Text, Alert, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import logo from '../../assets/icons/logo.png';

const SignUp = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const auth = FIREBASE_AUTH;

	const submit = async () => {
		if (!username || !email || !password) {
			Alert.alert('Nieudana rejestracja', 'Wypełnij wszystkie pola!');
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
				Alert.alert('Sukces', 'Pomyślna rejestracja!');
			} catch (error) {
				console.log(error);
				Alert.alert('Nieudana rejestracja', 'Wprowadź poprawne dane!');
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<SafeAreaView className='h-full bg-slate-200'>
			<ScrollView>
				<View className='justify-center px-4 '>
					<View className='items-center'>
						<Image className='w-72 h-72' source={logo}></Image>
					</View>
					<FormField title='Nazwa użytkownika' value={username} handleChangeText={(e) => setUsername(e)} />

					<FormField title='Email' value={email} handleChangeText={(e) => setEmail(e)} otherStyles='mt-4' keyboardType='email-address' />

					<FormField title='Hasło' value={password} handleChangeText={(e) => setPassword(e)} otherStyles='mt-4' />

					<CustomButton disabled={isLoading} title='Zarejestruj się' handlePress={submit} containerStyles='mt-16 mb-2' isLoading={isLoading} />

					<View className='justify-center pt-5 flex-row gap-2'>
						<Text className='text-xl text-gray-950'>Masz już konto?</Text>
						<Link href='/sign-in' className='text-xl text-blue-800'>
							Zaloguj się
						</Link>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default SignUp;
