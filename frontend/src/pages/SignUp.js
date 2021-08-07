import React from 'react';
import Footer from '../components/Body/Footer';
import Header from '../components/Body/Header';
import Main from '../components/Body/Main';
import SignUpForm from '../components/Log/SignUpForm';

const SignUp = ({database}) => {
	return (
		<div className="connection-page">
			<Header database={database} />
			<Main database={database} >
				<div className="container connection-form">
					<div className="form-container">
						<SignUpForm database={database} />
					</div>
				</div>
			</Main>
			<Footer database={database}/>
		</div>
	);
};

export default SignUp;