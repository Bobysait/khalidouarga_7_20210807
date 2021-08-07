import React from 'react';
import Header from '../components/Body/Header';
import Footer from '../components/Body/Footer';

const Logout = ({database}) => {
	const users = database.User;
	const user = users.current();

	// no user connected ...
	if (!user || user.id ===0)
		window.location = "/";

	// else, disconnect it.
	users.request.disconnect(user);
	
	return (
		<div>
			<Header database={database} />
			<Footer database={database} />
		</div>
	);
};

export default Logout;