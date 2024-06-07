import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Redirect, router } from 'expo-router';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { useGlobalContext } from '../context/GlobalProvider';

const App = () => {
	const { user, isLoading, isLoggedIn } = useGlobalContext();

	if (!isLoading && isLoggedIn) {
		console.log(user);
		return <Redirect href='/home' />;
	} else {
		console.log(user);
		return <Redirect href='/sign-in' />;
	}
};

export default App;
