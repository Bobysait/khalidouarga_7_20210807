import React, { useState } from 'react';
import { useEffect } from 'react';

const convertDate = (dt, withTime=true) => {
	if (!(dt && dt.length>=19)) return "";
	let l_year = dt.slice(0,4);
	let l_mth = ["Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Decembre"][dt.slice(5,7)-1];
	let l_day = dt.slice(8,10);
	return l_day+" "+l_mth+" "+l_year + (withTime ? " à "+dt.slice(11,19).replace(":", "h") : "");
}

const ViewProfil = (props) => {

	const {user, editable, database} = props;
	
	const [file,setFile] = useState();
	const [avatarUrl,setAvatarUrl] = useState( user && user.id>0 ? user.url_avatar : "");

	const [updated, setUpdated] = useState(false);

	const handleAvatar = (e) => {
		e.preventDefault();
		database.User.request.updateUserImage(user.id, user, file, setAvatarUrl);
		setUpdated(true);
	};
	const removeUser = (e) => {
		e.preventDefault();

		// delete user account
		database.User.request.deleteUser(user);
		
		// tell API to disconnect him at his next authentification
		database.User.request.disconnect(user);

		// account probably deleted - get out from profil view
		window.location = '/';
	}

	useEffect(() => {
		const fetchData = async () => {
			await database.User.request.getUser(user.id, ()=>{});
			setAvatarUrl(user.url_avatar);
		}
		fetchData();
	},[updated,database,user])

	// - USER PROFIL -
	return (
		<> {user && user.id>0 ? (
			<div className="user-card">

				{/* - BLOC NAME - */}
				<div className="bloc titlename">
					<h1>{user.name}
						{editable ? (
							<i className="remove-user fas fa-trash-alt"onClick={(e)=>{ removeUser(e); }}> </i>
						) : (<></>)}
					</h1>
				</div>

				{/* - BLOC AVATAR - */}
				<div className="bloc avatar">
					{avatarUrl ? (
						<img src={avatarUrl} alt="avatar" className="avatar" onClick={()=>{

						}}/>
					) : (
						<img src={process.env.PUBLIC_URL+"/img/avatars/avatar_1.png"} alt="avatar" className="avatar"/>
					)}
					<div className="avatar-desc">
						{editable ? (
							<form action="" onSubmit={handleAvatar} className="selector">
								<input
									className="input-file"
									type="file"
									id="file"
									name="Changer d'Avatar"
									accept=".jpg, .jpeg, .png"
									onChange = {(e) => setFile(e.target.files[0])}
								/>
								<input type="submit" className="btn" value="Envoyer" />
							</form>
						):(
							<h2>Avatar</h2>
						)}
					</div>
				</div>
				
				{/* - BLOC DESCRIPTION - */}
				<div className="bloc description">
					<h2>PROFIL</h2>
					<ul>
						<li><span className="desc-title">email</span><span className="desc-value">{user.email}</span></li>
						<li><span className="desc-title">Lieu</span><span className="desc-value">{user.location}</span></li>
						<li><span className="desc-title">né le</span><span className="desc-value">{convertDate(user.birthday)}</span></li>
						<li><span className="desc-title">créé le</span><span className="desc-value">{convertDate(user.createdAt)}</span></li>
						<li><span className="desc-title">connecté à</span><span className="desc-value">{convertDate(user.updatedAt)}</span></li>
						<li><span className="desc-title">Rang</span><span className="desc-value">{user.rankname}</span></li>
					</ul>
				</div>

			</div>
		):("")} </>
	);
};

export default ViewProfil;