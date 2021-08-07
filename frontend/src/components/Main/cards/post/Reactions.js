import React, { useState } from 'react';
import { useEffect } from 'react';

const Reactions = (props) => {
	const {refresh, database, postid} = props;
	const post =  database.Post.get(postid);

	// reaction states to show (and update)
	const [nbReactions, setNbReactions] = useState(post.nb_reactions);
	const [like, setLike] = useState(post.reactions.like);
	const [love, setLove] = useState(post.reactions.love);
	const [laugh, setLaugh] = useState(post.reactions.laugh);
	const [wow, setWow] = useState(post.reactions.wow);
	const [dislike, setDislike] = useState(post.reactions.dislike);

	const [updatedReaction, setUpdatedReaction] = useState(true);

	// popup to react to the post
	const emitReaction = (e, reaction, pPost) => {
		if (e){
			e.preventDefault();
			e.stopPropagation();
		}
		setUpdatedReaction(false);
		database.User.request.EmitReaction(database.User.current(), reaction, pPost.id, (state) => {setUpdatedReaction(state); refresh(state);} )
		
	};

	// update values if user "reacted"
	useEffect(() => {
		
		const fetchData = async () => {
			let pr = post.reactions;
			setNbReactions(post.nb_reactions);
			setLike(pr.like);
			setLove(pr.love);
			setLaugh(pr.laugh);
			setWow(pr.wow);
			setDislike(pr.dislike);
		}
		
		fetchData();

	},[updatedReaction,post])

	return (
		<>
			{nbReactions===0 ? (<span className="show-reactions">Partager votre enthousiasme</span>) : (
			<div className="show-reactions">
				<span><i className="fas reaction-like fa-thumbs-up light-outline"></i> {like}</span>
				<span><i className="fas reaction-love fa-heart heart-outline"></i> {love}</span>
				<span><i className="fas reaction-laugh smiley fa-laugh-squint"></i> {laugh}</span>
				<span><i className="fas reaction-wow smiley fa-surprise"></i> {wow}</span>
				<span><i className="fas reaction-dislike fa-thumbs-down dark-outline"></i> {dislike}</span>
			</div>
			)}

			{true ? (
				<div className="popup-reaction">
					<span className="reaction-icon" onClick={(e)=>{emitReaction(e, "like"   , post)}}><i className="fas reaction-like fa-thumbs-up light-outline"></i> {like}</span>
					<span className="reaction-icon" onClick={(e)=>{emitReaction(e, "love"   , post)}}><i className="fas reaction-love fa-heart heart-outline"></i> {love}</span>
					<span className="reaction-icon" onClick={(e)=>{emitReaction(e, "laugh"  , post)}}><i className="fas reaction-laugh smiley fa-laugh-squint"></i> {laugh}</span>
					<span className="reaction-icon" onClick={(e)=>{emitReaction(e, "wow"    , post)}}><i className="fas reaction-wow smiley fa-surprise"></i> {wow}</span>
					<span className="reaction-icon" onClick={(e)=>{emitReaction(e, "dislike", post)}}><i className="fas reaction-dislike fa-thumbs-down dark-outline"></i> {dislike}</span>
				</div>
			):(
				<></>
			)}
		</>

	);
};

export default Reactions;