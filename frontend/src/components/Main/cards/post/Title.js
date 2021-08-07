import React from 'react';

const Title = (props) => {
	const {post} = props;
	
	return (
		<>{post ?(
			<h3 className="card-post-title">{post.title}</h3>
			):(<></>)
		}</>
	);
};

export default Title;