import React from 'react';
import Post from '../Post';

const Comments = (props) => {
	const {post, database} = props;
	
	const sortOnKey = (key, string=false, desc=false) => {
		const caseInsensitive = string && string === "CI";
		return (a, b) => {
			a = caseInsensitive ? a[key].toLowerCase() : a[key];
			b = caseInsensitive ? b[key].toLowerCase() : b[key];
			if (string) {
				return desc ? b.localeCompare(a) : a.localeCompare(b);
			}
			return desc ? b - a : a - b;
		}
	};

	return (
		<>
			{post && post.is_topic && post.comments && (post.comments.length>0) ? (
				post.comments.sort(sortOnKey("id")).map( comment => ( <Post key={comment.id} post={comment} database={database} /> ) )
			):(<></>)}
		</>
	);
};

export default Comments;