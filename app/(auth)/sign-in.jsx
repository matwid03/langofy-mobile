import { View, ScrollView, Text } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const SignIn = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const auth = FIREBASE_AUTH;

	const submit = async () => {
		if (!email || !password) {
			alert('Wypełnij wszystkie pola!');
		} else {
			setIsLoading(true);
			try {
				await signInWithEmailAndPassword(auth, email, password);
				router.replace('/home');
			} catch (error) {
				alert(e, 'Nieprawidłowy login lub hasło!');
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<SafeAreaView className='bg-slate-900 h-full'>
			<ScrollView>
				<View className='w-full justify-center min-h-[85vh] px-4'>
					<FormField title='Email' value={email} handleChangeText={(e) => setEmail(e)} otherStyles='mt-7' keyboardType='email-address' />

					<FormField title='Hasło' value={password} handleChangeText={(e) => setPassword(e)} otherStyles='mt-7' />

					<CustomButton disabled={isLoading} title='Zaloguj się' handlePress={submit} containerStyles='mt-7' isLoading={isLoading} />

					<View className='justify-center pt-5 flex-row gap-2'>
						<Text className='text-lg text-gray-100'>Nie masz jeszcze konta?</Text>
						<Link href='/sign-up' className='text-lg text-orange-700'>
							Zarejestruj się
						</Link>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default SignIn;
