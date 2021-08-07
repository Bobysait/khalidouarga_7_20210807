import React from 'react';
import { Link } from 'react-router-dom';

const UserName = (props) => {

	const {user} = props;

	return (
		<>
			{user ? (
				<Link to={{pathname:`/user/${user.id}`}}>
					{user.name}
				</Link>
			) : (<></>)}
		</>
	);
};

export default UserName;