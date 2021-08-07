import React, { useEffect } from "react";
import Routes from "./components/routes";
import { useState } from "react";
import DATABASE from './database/database';

const App = () => {
	
	const database = DATABASE;
	const users = DATABASE.User;
	
	if (!users.current()) users.setCurrent(users.create({ id:0 }));

	const [validation, setValidation] = useState(false);

	useEffect( () => {
		
		const fetchData = async () => {
			await users.request.jwt(setValidation);
		};

		fetchData();

	},[validation, users]);
	
	return (

		<Routes database={database}/>
		
	);
};

export default App;