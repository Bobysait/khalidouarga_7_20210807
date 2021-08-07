import React from 'react';
import Header from '../components/Body/Header';
import Footer from '../components/Body/Footer';
import Main from '../components/Body/Main';

const NotFound = ({database}) => {
	return (
		<div>
			<Header database={database} />
			<Main database={database} >
				<div className="container">
					<h1>404</h1>
				</div>
			</Main>
			<Footer database={database}/>
		</div>
	);
};

export default NotFound;