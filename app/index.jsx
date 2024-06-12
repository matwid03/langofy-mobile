import React from 'react';
import { Redirect } from 'expo-router';
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
