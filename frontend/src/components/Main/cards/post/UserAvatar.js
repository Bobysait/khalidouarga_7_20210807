import React from 'react';

const UserAvatar = (props) => {
	
	const {userdata} = props;

	return (
		<>
			{userdata ? (
				userdata.url_avatar ? (
					<img src={userdata.url_avatar} alt={"avatar de l'utilisateur "+userdata.name} className="card-avatar" onClick={()=>{
					}}/>
				) : (
					<img src={process.env.PUBLIC_URL+"/img/avatars/avatar_1.png"} alt={"avatar par défaut pour l'utilisateur "+userdata.name} className="card-avatar"/>
				)
			) : (
				<></>
			)}
		</>
	);
};

export default UserAvatar;