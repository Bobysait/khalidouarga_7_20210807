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
		const {refresh, post,database,expand,trending}		=	props;
		const currentUser									=	database.User.current();
		
	// enables features for moderators or "self"-post
		const editable										=	post.userId === database.User.current().id || (database.User.current().rank<4);


	// "refresh required state" sent by children
		const [refreshFromChildrenIgnored, setRefreshFromChildren] = useState(false);

	// variable to request user
		const [userdata,setUserdata]						=	useState(null);

	// variable for "this" post
		// variable for show-comments
		const [validationComments,setValidationComments]	=	useState(expand==="always");
		const [commentsLoaded,setCommentsLoaded]			=	useState(false);

	// variable for post removing
		const [postRemoved,setPostRemoved]					=	useState(false);
		
	// variable for post comment
		// post comment
		const [enableComment, setEnableComment]				=	useState(false);
		const [commentPosted, setCommentPosted]				=	useState(false);
		// post content and attachment
		const [commentValue, setCommentValue]				=	useState("");
		const [commentAttachment, setCommentAttachment]		=	useState(null);

	// variables for post edition
		// enable post edition
		const [enablePostEdit, setEnablePostEdit]			=	useState(false);
		const [postEdited, setPostEdited]					=	useState(false);
		// post content and attachment
		const [postEditValue, setPostEditValue]				=	useState("");
		const [postEditAttachment, setPostEditAttachment]	=	useState(null);
		
	// --------------------------------------------------------------------- //

	// post comment or enable comments
		const postComment = (e, pPost) => {
			e.preventDefault();
			e.stopPropagation();
			if (enableComment){
				if (commentValue.trim().length>3){
					database.User.request.comment(currentUser.id, pPost.id, commentValue, commentAttachment, setCommentPosted);
				}else{
					document.getElementById("commentError").innerHTML = "message trop court";
				}
			}else{
				setEnableComment(true);
			}
		};

		// set comment text
		const setCommentText = (e, pValue) => {
			e.preventDefault();
			e.stopPropagation();
			setCommentValue(pValue);
			document.getElementById("commentError").innerHTML = "";
		}
		
		// show comments on click
		const switchComments = (e, pPost) => {
			if (e){
				e.preventDefault();
				e.stopPropagation();
			}
			if (pPost.is_topic)
				setValidationComments(!validationComments);
		}


	// edit post or enable edition
		const editPost = async (e, pPost) => {
			e.preventDefault();
			e.stopPropagation();
			if (enablePostEdit){
				if (postEditValue.trim().length>3){
					await database.Post.request.updatePost(pPost.id, postEditValue, postEditAttachment, setPostEdited);
					setEnablePostEdit(false);
					setPostEdited(true);
				}else{
					document.getElementById("postEditError").innerHTML = "message trop court";
				}
			}else{
				setEnablePostEdit(true);
				setPostEditValue(pPost.content);
			}
		};

		const setPostEditText = (e, pValue) => {
			e.preventDefault();
			e.stopPropagation();
			setPostEditValue(pValue);
		}


	// remove a post
		const removePost = (e, post) => {
			e.preventDefault();
			e.stopPropagation();
			if (window.confirm('Confirmez la suppression')) {
				database.Post.request.deletePost(post, (v) => {setPostRemoved(v); refresh(true)});
			}
		}
	


	// trending topics from home redirect to the topic view
	const onClickCallback = (trending==="true") ? handleRoute : switchComments;
	

	
	const postClass =	"card "+ ( currentUser.id===post.userId	? "self " : "") +
								(
									trending						? "trending" :				// call from trendings
									post.is_topic					? "topic" :					// else it's a topic ?
									"comment"	// surely it's a comment ... "our-self" comment ?
								);

	
	// requests on refresh
	useEffect( () => {
		
		const fetchData = async () => {
			if (postRemoved || postEdited) {
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

	},[refresh, database, post, userdata, commentPosted, commentsLoaded, validationComments, postEdited, postRemoved])

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

					{/* EDIT-DELETE ICONS */}
					<li className="manage-post">
						{editable ? (
						<>
							<span className="icon edit-post">
								<i className="fas fa-edit"onClick={(e)=>{ editPost(e,post); }}> </i>
							</span>

							<span className="icon remove-post">
								<i className="fas fa-trash-alt"onClick={(e)=>{ removePost(e,post); }}> </i>
							</span>
						</>) : (<></>)}
					</li>
				</ul>
				
				{/* CARD BODY */}
				<div className="card-body">
					{enablePostEdit ? (<>

						{/* EDIT POST CONTENT */}
						<div className="post-editor">
							<textarea	type="text"
										className="text"
										defaultValue={post.content}
										onChange={(e) => {
															setPostEditText(e, e.target.value)
														}}
										onClick={(e) => {e.stopPropagation();e.preventDefault();}}
							></textarea>

							<div className="import-file">
								<input
									className="input-file"
									type="file"
									id="file"
									name="Modifier l'image jointe"
									accept=".jpg, .jpeg, .png"
									onChange = {(e) => setPostEditAttachment(e.target.files[0])}
									onClick={(e) => {e.stopPropagation();}}
								/>
								<p>Modifier l'image</p>
							</div>
							<div id="postEditError" className="error"></div>
							<input className="btn" type="submit" value="Éditer" onClick={(e) => {editPost(e,post)}} />
						</div>

					</>):(<>
						{/* VIEW POST CONTENT */}

							{/* ATTACHMENT */}
							<Attachment database={database} post={post} />
							
							{/* CONTENT */}
							<Content database={database} post={post} />

					</>)}
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
			{enableComment && ((expand==="always" || validationComments) && commentsLoaded) ? (

				<div className="card self comment post-editor">

					<textarea type="text"
						id="text-editor"
						className="text"
						defaultValue=""
						placeholder="Entrer votre réponse ..."
						onChange={(e) => {
											setCommentText(e, e.target.value)
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
							onChange = {(e) => setCommentAttachment(e.target.files[0])}
						/>

						<p>Insérer une image</p>
					</div>
					<div id="commentError" className="error"></div>
				</div>
			):(<></>)}

			{ post.is_topic && (expand==="always" || (validationComments && commentsLoaded)) ? (
				<input className="btn" type="submit" value="Répondre" onClick={(e) => {postComment(e,post)}}/>
			):(<></>)}

		</>
		) : (
			<></>
		)}
	</>
	);
};

export default Post;