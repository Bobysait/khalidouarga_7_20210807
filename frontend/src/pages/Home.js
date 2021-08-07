import React from 'react';
import Header from '../components/Body/Header';
import Main from '../components/Body/Main';
import Trendings from '../components/Main/Trendings';
import Topics from '../components/Main/Topics';
import Footer from '../components/Body/Footer';
import SignUpForm from '../components/Log/SignUpForm';
import { useState } from 'react';
import { useEffect } from 'react';

const Home = ({database}) => {
	const users = database.User;
	const user = users.current();
	const [refresh, setRefresh] = useState(false);

	useEffect(()=>{

	},[refresh])

	return (
		<div className="home">

			<Header database={database}/>
			<Main database={database}>
				{user.id>0 ? (
					<>
						<div className="cat-1">
							<Trendings database={database} refresh={setRefresh} />
						</div>

						<div className="cat-2">
							<Topics database={database} refresh={setRefresh} />
						</div>
					</>
				) : (
					<div className="container connection-form">
						<div className="form-container">
							<SignUpForm database={database}/>
						</div>
					</div>
				)}
			</Main>
			<Footer database={database}/>
			
		</div>
	)
}

export default Home;