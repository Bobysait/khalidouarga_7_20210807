import React, { useEffect, useState } from 'react';
import Header from '../components/Body/Header';
import Footer from '../components/Body/Footer';
import Main from '../components/Body/Main';
import { useParams } from 'react-router-dom';
import ViewProfil from '../components/Profil/ViewProfil';

const Profil = ({database}) => {
	const users = database.User;
	let {id} = useParams();
	let user_id = id===undefined ? users.current().id : id;

	const [userid, setUserid] = useState(user_id);
	const [viewuser, setViewuser] = useState(users.get(user_id));
	const [validation, setValidation] = useState(false);
	
	useEffect( () => {
		
		const fetchData = async () => {
			await users.request.getUser(user_id, setViewuser, setUserid, setValidation);
		};

		fetchData();

	},[user_id, userid, validation, users.request]);
	
	const editable = (users.current().id === user_id) || (users.current().rank<4);

	return (
		<>
			{viewuser ? (
				<div className="home-wrapper">
					<Header database={database}/>
					<Main database={database}>
						<div className="container">
							<ViewProfil user={viewuser} editable={editable} database={database}/>
						</div>
					</Main>
					<Footer database={database}/>
				</div>
			):(
				<></>
			)}
		</>
	);
};

export default Profil;