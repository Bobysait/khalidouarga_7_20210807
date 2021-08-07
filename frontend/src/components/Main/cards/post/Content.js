import React from 'react';

const Content = (props) => {
	const {post} = props;
	
	return (
		<p className="content">{post.content}</p>
	);
};

export default Content;