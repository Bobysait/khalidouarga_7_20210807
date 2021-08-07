import React from 'react';

const Attachment = (props) => {
	const {post} = props;

	return (
		<>
			{post ? (
				post.url_attachment ? (
					<img className="card-img" src={post.url_attachment} alt={"photo jointe au topic intitulé "+post.title}/>
				):(<></>)
			):(<></>)}
		</>
	);
};

export default Attachment;