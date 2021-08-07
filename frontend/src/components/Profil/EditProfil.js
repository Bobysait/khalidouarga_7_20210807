import React from 'react';
//import ImgLoader from './ImgLoader';

const REMOVE_EditProfil = ({user}) => {
	
	console.log(user.id);
	const convertDate = (dt, withTime=true) => {
		let l_year = dt.slice(0,4);
		let l_mth = ["Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Decembre"][dt.slice(5,7)-1];
		let l_day = dt.slice(8,10);
		return l_day+" "+l_mth+" "+l_year + (withTime ? " à "+dt.slice(11,19).replace(":", "h") : "");
	}

	// - USER PROFIL -
	return (
		<> {user && user.id>0 ? (
			<div className="user-card">

				{/* - BLOC NAME - */}
				<div className="bloc titlename">
					<h1>{user.name}</h1>
				</div>

				{/* - BLOC AVATAR - */}
				<div className="bloc avatar">
					{user.url_avatar ? (
						<img src={user.url_avatar} alt="avatar" className="avatar"/>
					) : (
						<img src={process.env.PUBLIC_URL+"/img/avatars/avatar_10.png"} alt="avatar" className="avatar"/>
					)}
					<div className="avatar-desc">
						<h2>Avatar</h2>
						<p>Rang : {user.rankname}</p>
					</div>
				</div>
				
				{/* - BLOC DESCRIPTION - */}
				<div className="bloc description">
					<h2>PROFIL</h2>
					<ul>
						<li><span className="desc-title">email : </span><span className="desc-value">{user.email}</span></li>
						<li><span className="desc-title">Lieu : </span><span className="desc-value">{user.location}</span></li>
						<li><span className="desc-title">né le : </span><span className="desc-value">{convertDate(user.birthday)}</span></li>
						<li><span className="desc-title">créé le : </span><span className="desc-value">{convertDate(user.createdAt)}</span></li>
						<li><span className="desc-title">connecté à : </span><span className="desc-value">{convertDate(user.updatedAt)}</span></li>
					</ul>
				</div>

			</div>
		):("")} </>
	);
};

export default REMOVE_EditProfil;