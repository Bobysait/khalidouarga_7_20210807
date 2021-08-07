import React from 'react';
import Navigation from './Navigation';
import Logo from './Logo';

const Header = ({database}) => {
	
	return (
		<header className="header">
			<Logo/>
			<Navigation database={database}/>
		</header>
	);
};

export default Header;