import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Redirect, router } from 'expo-router';
import { FIREBASE_AUTH } from '../FirebaseConfig';

const App = () => {
	const [user, setUser] = useState(null);
	const auth = FIREBASE_AUTH;

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			console.log('User: ', user);
			if (user) {
				setUser(user);
			} else {
				setUser(null);
			}
		});

		return () => unsubscribe();
	}, [auth]);

	if (user) {
		return <Redirect href={'/home'} />;
	} else {
		return <Redirect href={'/sign-in'} />;
	}
};

export default App;
