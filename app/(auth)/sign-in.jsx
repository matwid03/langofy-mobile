import { View, ScrollView, Text, Alert, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useGlobalContext } from '../../context/GlobalProvider';
import { collection, getDocs, query, where } from 'firebase/firestore';
import logo from '../../assets/icons/logo.png';

const SignIn = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { setHasTakenTest, setUser } = useGlobalContext();
	const auth = FIREBASE_AUTH;

	const submit = async () => {
		if (!email || !password) {
			Alert.alert('Nieudane logowanie', 'Wypełnij wszystkie pola!');
		} else {
			setIsLoading(true);
			try {
				const userCredential = await signInWithEmailAndPassword(auth, email, password);
				const user = userCredential.user;
				setUser(user);

				const userDoc = await getDocs(query(collection(FIRESTORE_DB, 'users'), where('email', '==', email)));
				if (!userDoc.empty) {
					const userData = userDoc.docs[0].data();
					setHasTakenTest(userData.hasTakenTest);

					if (userData.hasTakenTest) {
						router.replace('/home');
					} else {
						router.replace('/levels/testLevel');
					}
				}
			} catch (error) {
				Alert.alert('Nieudane logowanie', 'Nieprawidłowy login lub hasło!');
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<SafeAreaView className='h-full bg-slate-200'>
			<ScrollView>
				<View className='w-full px-4'>
					<View className='items-center'>
						<Image className='w-72 h-72' source={logo}></Image>
					</View>
					<FormField title='Email' value={email} handleChangeText={(e) => setEmail(e)} keyboardType='email-address' />

					<FormField title='Hasło' value={password} handleChangeText={(e) => setPassword(e)} otherStyles='mt-7' />

					<CustomButton disabled={isLoading} title='Zaloguj się' handlePress={submit} containerStyles='mt-20 mb-4' isLoading={isLoading} />

					<View className='justify-center pt-5 flex-row gap-2'>
						<Text className='text-xl text-gray-950'>Nie masz jeszcze konta?</Text>
						<Link href='/sign-up' className='text-xl text-blue-800'>
							Zarejestruj się
						</Link>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default SignIn;
