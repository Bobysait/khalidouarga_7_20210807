import React from 'react';
import Header from '../components/Body/Header';
import Main from '../components/Body/Main';
import Footer from '../components/Body/Footer';
import Trendings from '../components/Main/Trendings';

const Trending = ({database}) => {

	return (
		<div className="trending">
			<Header database={database} />
			<Main database={database} >
				<Trendings database={database} />
			</Main>
			<Footer database={database}/>
		</div>
	);
};

export default Trending;