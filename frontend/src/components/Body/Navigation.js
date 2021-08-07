import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = ({database}) => {
	if (!database){ window.location = '/'; }
	const users = database.User;
	const user = users.current();

	return (
		<div className="navigation">

			<NavLink exact to="/" activeClassName="nav-active">
				<span className="fas fa-home"></span> Accueil
			</NavLink>

			<NavLink exact to="/about" activeClassName="nav-active">
				À Propos
			</NavLink>

			{user.id>0 ?
			(
				<>
					<NavLink exact to="/user/" activeClassName="nav-active" editable="true">
						<span className="far fa-user"></span> {user.name}
					</NavLink>
					<NavLink exact to="/logout/" activeClassName="nav-active" id="nav-signout">
						<span className="fas fa-power-off"><span className="navlink-hidden">signout</span></span>
					</NavLink>
				</>
			) : (
				<>
					<NavLink exact to="/signup" activeClassName="nav-active" id="nav-signup">
						<span className="fa fa-user-plus"><span className="navlink-hidden">signup</span></span>
					</NavLink>

					<NavLink exact to="/signin" activeClassName="nav-active" id="nav-signin">
						<span className="fa fa-user-lock"><span className="navlink-hidden">signin</span></span>
					</NavLink>
				</>
			)}
		</div>
	);
};

export default Navigation;