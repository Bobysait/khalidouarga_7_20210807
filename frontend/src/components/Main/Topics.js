import React, { useEffect, useState } from 'react';
import Post from './cards/Post';
import PostTopic from './cards/post/PostTopic';

const Topics = (props) => {

	const {refresh} = props; // send "refresh required state" to parent
	const [refreshFromChildren, setRefreshFromChildren] = useState(false); // "refresh required state" sent by children

	const {database} = props;
	const [validation, setValidation] = useState(false);

	const [viewCreate, setViewCreate] = useState(false);

	const addTopic = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setViewCreate(!viewCreate);
	};


	useEffect( () => {
		
		const fetchData = async () => {
			await database.Post.request.getTopics(setValidation)
		};

		fetchData()

		if (refreshFromChildren) {
			refresh(true);
			fetchData();
			setRefreshFromChildren(false);
		}

	},[validation, database, refreshFromChildren, refresh]);
	

	return (
		<section className="container topics">
			
			{/* TOPIC HEADER */}
			<div className="cat-title-bar">
				<h2 className="cat-title">Topics
					<span className="add-topic" onClick={(e)=>{ addTopic(e); }}>
						<i className="fas fa-plus" ></i>
					</span>
				</h2>
			</div>

			{/* CREATE TOPIC */}
			{viewCreate ? (
				<PostTopic database={database} refresh={setRefreshFromChildren} />
			) : (<></>)}

			{/* TOPICS */}
			<div className="cat-body">
				
				<div className="cards">
				
					{database.Topic.data ? (
						database.Topic.Array().map(post => ( <Post key={post.id} database={database} post={post} refresh={setRefreshFromChildren} />))
					):(
						<></>
					)}

				</div>

			</div>

		</section>
	);
};

export default Topics;