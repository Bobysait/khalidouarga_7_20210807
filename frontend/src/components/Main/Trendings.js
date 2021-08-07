import React, { useEffect, useState } from 'react';
import Post from './cards/Post';

const Trendings = (props) => {

	const {refresh} = props; // send "refresh required state" to parent
	const [refreshFromChildren, setRefreshFromChildren] = useState(false); // "refresh required state" sent by children

	const {database} = props;

	const [validation, setValidation] = useState(false);

	// request/refresh trending topics
	useEffect( () => {
		
		if (refreshFromChildren) refresh(true);

		const fetchData = async () => {
			await database.Post.request.getTrendings(setValidation)
		};

		fetchData()

	},[validation, database, refreshFromChildren, refresh]);

	return (
		<section className="container trendings">
			
			<h2 className="cat-title">Trending Topics</h2>

			<div className="cat-body">

				<div className="cards">
					
					{database.Trendings ? (
						database.Trendings.map(post => ( <Post key={post.id} post={post} database={database} trending="true" refresh={setRefreshFromChildren} />))
					):(
						<></>
					)}

				</div>

			</div>

		</section>
	);
};

export default Trendings;