import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../context/GlobalProvider';

const App = () => {
	const { user, isLoading, isLoggedIn, hasTakenTest } = useGlobalContext();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading) {
			if (isLoggedIn) {
				if (hasTakenTest) {
					router.replace('/home');
				} else {
					router.replace('/levels/testLevel');
				}
			} else {
				router.replace('/sign-in');
			}
		}
	}, [isLoading, isLoggedIn, hasTakenTest, user]);

	return null;
};

export default App;
