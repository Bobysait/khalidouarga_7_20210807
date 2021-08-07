import axios from 'axios';
import React, { useState } from 'react';

const SignInForm = () => {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = (e) => {
		e.preventDefault();
		
		const emailError = document.querySelector('.email.error');
		const passwordError = document.querySelector('.password.error');

		axios ({
			method : "post",
			url : `${process.env.REACT_APP_API_URL}api/auth/signin`,
			withCredentials : true,
			data: {
				email,
				password,
			}
		})

		.then((res) => {
			console.log("connection established",res.data);
			emailError.innerHTML = res.data.errType ==="email" ? res.data.error : "";
			passwordError.innerHTML = res.data.errType ==="password" ? res.data.error : "";
			if(!res.data.error) {
			}
			window.location = '/';
		})

		.catch((err) => {
			console.log("That's pretty bad actually ...");
			console.log("err : ", err);
		});
	}

	return (
		<form action="" onSubmit={handleLogin} id="sign-in-form">
			<label htmlFor="email">Email</label>
			<input type="text" name="email" id="email" onChange={(e)=>setEmail(e.target.value)} value={email} />
			<div className="email error"></div>
			<br/>
			<label htmlFor="password">Mot de passe</label>
			<input type="password" name="password" id="password" onChange={(e)=>setPassword(e.target.value)} value={password} />
			<div className="password error"></div>
			<br/>
			
			<input className="btn btn-disabled" type="submit" value="Se Connecter" />
		</form>
	);
};

export default SignInForm;