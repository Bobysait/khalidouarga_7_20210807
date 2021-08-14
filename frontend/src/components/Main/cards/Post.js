/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/

import React, { useEffect, useState } from 'react';
import Attachment from './post/Attachment';
import Comments from './post/Comments';
import Content from './post/Content';
import Date from './post/Date';
import Reactions from './post/Reactions';
import Title from './post/Title';
import UserAvatar from './post/UserAvatar';
import UserName from './post/UserName';

// manage rediction to see "this" topic
const handleRoute = (e, pPost) =>{
	if (e){
		e.stopPropagation();
		e.preventDefault();
	}
	window.location = `/topic/${pPost.id}`;
}

const Post = (props) => {

	// data for the post (post and current-user)
		const {refresh, post,database,expand,trending} = props;
		const currentUser = database.User.current();
		
	// "refresh required state" sent by children
		const [refreshFromChildrenIgnored, setRefreshFromChildren] = useState(false);

	// variable to request user
		const [userdata,setUserdata] = useState(null);

	// variable for "this" post
		// variable for show-comments
		const [validationComments,setValidationComments] = useState(expand==="always");
		const [commentsLoaded,setCommentsLoaded] = useState(false);

	// variable for post comment
		// post text
		const [enableTextEditor, setEnableTextEditor] = useState(false);
		const [textEditorValue, setTextEditorValue] = useState("");
		// post attachment
		const [comAttachment, setComAttachment] = useState(null);
		const [commentPosted, setCommentPosted] = useState(false);


	// show comments on click
	const switchComments = (e, pPost) => {
		if (e){
			e.preventDefault();
			e.stopPropagation();
		}
		if (pPost.is_topic)
			setValidationComments(!validationComments);
	}

	// edit post
	const enableTextEdit = (e, pPost) => {
		e.preventDefault();
		e.stopPropagation();
		if (enableTextEditor){
			if (textEditorValue.trim().length>3){
				database.User.request.Comment(currentUser.id, pPost.id, textEditorValue, comAttachment, setCommentPosted);
			}else{
				document.getElementById("textEditorError").innerHTML = "message trop court";
			}
		}else{
			setEnableTextEditor(true);
		}
	};
	const setAnswerText = (e, pValue) => {
		e.preventDefault();
		e.stopPropagation();
		setTextEditorValue(pValue);
		document.getElementById("textEditorError").innerHTML = "";
	}

	// trending topics from home redirect to the topic view
	const onClickCallback = (trending==="true") ? handleRoute : switchComments;
	

	
	const postClass =	"card "+(
									trending						? "trending" :				// call from trendings
									post.is_topic					? "topic" :					// else it's a topic ?
									(currentUser.id===post.userId	? "self" : "") + " comment"	// surely it's a comment ... "our-self" comment ?
								);

	// for moderators or "self"-post
	const [postRemoved,setPostRemoved] = useState(false);
	const editable = post.userId === database.User.current().id || (database.User.current().rank<4);
	const removePost = (e, post) => {
		e.preventDefault();
		e.stopPropagation();
		if (window.confirm('Confirmez la suppression')) {
			database.Post.request.deletePost(post, (v) => {setPostRemoved(v); refresh(true)});
		}
	}

	// requests on refresh
	useEffect( () => {
		
		const fetchData = async () => {
			if (postRemoved) {
				if (refresh) refresh(true);
			}else{

				// info for "poster"
				await database.User.request.getUser(post.userId, setUserdata);

				// get comments if required
				if (post.is_topic && (commentPosted || ((!commentsLoaded) && validationComments)))
					await database.Post.request.getComments(post.id, setCommentsLoaded);

			}
		};
		fetchData();

	},[refresh, database, post, userdata, commentPosted, commentsLoaded, validationComments, postRemoved])

	return (
		<>
		{(!postRemoved) ? (
		<>
			{/* POST - CARD */}
			<div className={postClass} onClick={(e) => {onClickCallback(e,post)}}>

				{/* CARD HEADER */}
				<ul className="card-header">

					{/* POSTER AVATAR */}
					<li><UserAvatar userdata={userdata} /></li>

					<li>{/* POST-DESCRIPTION */}

						<ul className="post-description">

							{/* TITLE */}
							<li className="post-title"><Title database={database} post={post} /></li>

							{/* POSTER */}
							<li className="post-username"> <span>par </span><UserName database={database} user={userdata} /> </li>
							
							{/* POST DATE */}
							<li className="card-date"> <Date database={database} post={post} /> </li>

						</ul>

					</li>

					<li className="remove-post">
						{editable ? (
							<i className="fas fa-trash-alt"onClick={(e)=>{ removePost(e,post); }}> </i>
						) : (<></>)}
					</li>
				</ul>
				
				{/* CARD BODY */}
				<div className="card-body">
					{/* ATTACHMENT */}
					<Attachment database={database} post={post} />
					
					{/* CONTENT */}
					<Content database={database} post={post} />
				</div>

				{/* CARD FOOTER */}
				<div className="card-footer">
					{/* REACTIONS */}
					<div className="reactions">
						<Reactions database={database} postid={post.id} refresh={setRefreshFromChildren} />
					</div>
				</div>
			</div>
			

			{/* SHOW COMMENTS (if any) */}
			<div className="card-comments">
				{ expand==="always" || (validationComments && commentsLoaded) ? ( <Comments database={database} post={post} /> ):(<></>)}
			</div>
			

			{/* CREATE MESSAGE (comment this topic) */}
			{enableTextEditor && ((expand==="always" || validationComments) && commentsLoaded) ? (

				<div className="card self comment text-editor">

					<textarea type="text"
						id="text-editor"
						className="text"
						defaultValue=""
						placeholder="Entrer votre réponse ..."
						onChange={(e) => {
											setAnswerText(e, e.target.value)
										}}
						onClick={(e) => {e.stopPropagation();}}
					></textarea>

					<div className="import-file">
						<input
							className="input-file"
							type="file"
							id="file"
							name="Changer d'Avatar"
							accept=".jpg, .jpeg, .png"
							onChange = {(e) => setComAttachment(e.target.files[0])}
						/>

						<p>Insérer une image</p>
					</div>
					<div id="textEditorError" className="error"></div>
				</div>
			):(<></>)}

			{ post.is_topic && (expand==="always" || (validationComments && commentsLoaded)) ? (
				<input className="btn" type="submit" value="Répondre" onClick={(e) => {enableTextEdit(e,post)}}/>
			):(<></>)}

		</>
		) : (
			<></>
		)}
	</>
	);
};

export default Post;