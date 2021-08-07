import React from 'react';
import { useState } from 'react';
import axios from 'axios';

const SignUpForm = () => {

	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [ctrlPassword, setCtrlPassword] = useState('');

	const handleSignUp = async (e) => {
		e.preventDefault();
		const terms = document.getElementById("terms");
		const nameErr = document.querySelector(".error.username");
		const mailErr = document.querySelector(".error.email");
		const passErr = document.querySelector(".error.password");
		const pas2Err = document.querySelector(".error.ctrl-password");
		const termErr = document.querySelector(".error.terms");
		
		nameErr.innerHTML = "";
		mailErr.innerHTML = "";
		passErr.innerHTML = "";
		pas2Err.innerHTML = "";
		termErr.innerHTML = "";

		if(password!==ctrlPassword || !terms.checked){
			if(password!==ctrlPassword)
				pas2Err.innerHTML = "Les mots de passe sont différents";
			if (!terms.checked)
				termErr.innerHTML = "Vous devez valider les conditions générales ... ou abdiquer.";
		}else{
			console.log(`Try to register to url : ${process.env.REACT_APP_API_URL}api/auth/signup`);

			await axios ({
				method:"post",
				url:`${process.env.REACT_APP_API_URL}api/auth/signup`,
				data : {
					name:username,
					email:email,
					password:password
				},
			})
			.then((res)=>{
				
				if (res.data.error){
					console.log(res.data.error);
				}else{
					console.log("seems good ...");
				}
			})
			.catch((err) => {
				console.log({error:err});
			})
		}
	}

	return (
		<form action="" onSubmit={handleSignUp} id="signup-form">
			<label htmlFor		=	"username">Nom</label>
			<input	type		=	"text"
					name		=	"name"
					id			=	"username"
					onChange	=	{(e)=> setUsername(e.target.value)}>
			</input>
			<div className		=	"error username"></div>
			
			<label htmlFor		=	"email">Email</label>
			<input	type		=	"text"
					name		=	"email"
					id			=	"email"
					onChange	=	{(e)=> setEmail(e.target.value)}>
			</input>
			<div className		=	"error email"></div>
			<br/>
			
			<label htmlFor		=	"password">Mot de passe</label>
			<input	type		=	"password"
					name		=	"password"
					id			=	"password"
					onChange	=	{(e)=> setPassword(e.target.value)}>
			</input>
			<div className		=	"error password"></div>
			
			<label htmlFor		=	"ctrl-password">Confirmer Mot de passe</label>
			<input	type		=	"password"
					name		=	"password"
					id			=	"ctrl-password"
					onChange	=	{(e)=> setCtrlPassword(e.target.value)}>
			</input>
			<div className		=	"error ctrl-password"></div>
			<br/>

			<input type			=	"checkbox" id="terms" />
			<label htmlFor		=	"terms">
				J'accepte les <a href="/" target="_blank" rel="noopener noreferrer">conditions générales d'utilisation</a>
			</label>
			<div className		=	"terms error"></div>
			<br/>

			<input type="submit" value="Valider"/>
			<br/>

		</form>
	);
};

export default SignUpForm;