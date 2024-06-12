import React from 'react';
import { Redirect } from 'expo-router';
import { useGlobalContext } from '../context/GlobalProvider';

const App = () => {
	const { user, isLoading, isLoggedIn } = useGlobalContext();

	if (!isLoading && isLoggedIn) {
		return <Redirect href='/home' />;
	} else {
		return <Redirect href='/sign-in' />;
	}
};

export default App;
