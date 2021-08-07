import React, { useEffect, useState } from 'react';
import Header from '../components/Body/Header';
import Main from '../components/Body/Main';
import Footer from '../components/Body/Footer';
import { useParams } from 'react-router-dom';
import Post from '../components/Main/cards/Post';

const ViewTopic = ({database}) => {

	// parse url parameter to integer id
	let {id} = useParams();
	id = parseInt(id);
	
	// database
	const posts = database.Post;

	// validate the request
	const [validation, setValidation] = useState(false);

	// request topic
	useEffect( () => {
		
		const fetchData = async () => {
			await posts.request.getTopic(id,setValidation)
		};

		fetchData()

	},[validation, posts, database, id]);

	// find topic from database
	const post =  database.Post.get(id);
	

	return (
		<div className="topic">
			<Header database={database} />
			<Main database={database} >

				<section className="container topics">
					
					<div className="cat-body">
						<div className="cards">

							{post ? ( <Post key={id} database={database} post={post} expand="always" /> ) : ( <></> )}

						</div>
					</div>

				</section>
				
			</Main>
			<Footer database={database}/>
		</div>
	);
};

export default ViewTopic;