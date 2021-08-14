/*jshint esversion: 9 */

const db								=	require('../config/db');
const Checker							=	require('../utils/validator.utils');
const { ERROR_400, ERROR_401, ERROR_402, ERROR_403, ERROR_404 } = require('../utils/errors.utils');
const { validateFile }					=	require('../utils/file.utils');
const fs								=	require('fs');

exports.addTopic = (req, res, next) => {
	if (!Checker.isValid(res.locals.user))	return res.status(400).send("Malformed ID");
	if (!Checker.isValid(res.locals.user.id))return res.status(400).send("Malformed ID");

	const l_userId						=	parseInt(res.locals.user.id);

	const l_request						=	{request : `post:post/ - add post`};
	const l_file						=	validateFile(req);
	
	db.query("INSERT INTO gmm_posts (`id`, `title`, `content`, `url_attachment`, `is_topic`, `id_user`) VALUES (NULL, :l_title, :l_content, :l_attachment, 1, :l_userid)",
	{
		l_title : Checker.validateDBText(req.body.title),
		l_content : Checker.validateDBText(req.body.content),
		l_userid : l_userId,
		l_attachment : l_file
	}, (err, posts) => {
		if(err || ((!posts) || posts.length<1)){
			return res.status(ERROR_400).json({
				...l_request,
				error : err,
				message : "fail to post topic on database",
				userId : l_userId
			});

		}else{
			const l_postId = JSON.parse(JSON.stringify(posts)).insertId;
			return res.status(201).json({
				...l_request,
				postId : l_postId,
				userId : l_userId,
				url_attachment : l_file ? `${req.protocol}://${req.get('host')}/images/posts/${l_file}` : ""
			});
		}
	});
};

exports.addComment = (req, res, next) => {
	if (!Checker.isValid(res.locals.user))	return res.status(400).send("Malformed ID");
	if (!Checker.isValid(res.locals.user.id))return res.status(400).send("Malformed ID");
	if (!Checker.isValid(req.params.id))		return res.status(400).send("Malformed ID");

	const l_userId						=	parseInt(res.locals.user.id);
	const l_topicId						=	parseInt(req.params.id);

	const l_request						=	{request : `post:comment/ - add comment on topic@${l_topicId}`};
	
	const l_file						=	validateFile(req);

	// insert the comment into database and generate a link for the topic <-> post using the "LAST_INSERT_ID"
	db.query("INSERT INTO gmm_posts (`id`, `content`, `is_topic`, `id_user`, `url_attachment`) VALUES (NULL, :l_content, 0, :l_userId, :l_attachment);" + 
			"INSERT INTO gmm_topic_posts (`id_topic`, `id_post`) VALUES(:l_topicid, LAST_INSERT_ID());",
	{
		l_content : Checker.validateDBText(req.body.content),
		l_userId : l_userId,
		l_topicid : l_topicId,
		l_attachment : l_file
	},
	(err, results) => {
		// something's wrong ?
		if(err || ((!results) || results.length<1)){
			return res.status(ERROR_400).json({
				...l_request,
				error : err,
				message : "fail to post comment on database",
				user : l_userId,
				results : results
			});
		}
		// ok, the comment is created, let's attach the comment to its parent topic
		const l_postId = JSON.parse(JSON.stringify(results[0])).insertId;
		return res.status(201).json({
			...l_request,
			userId : l_userId,
			postId : l_postId,
			url_attachment : l_file ? `${req.protocol}://${req.get('host')}/images/posts/${l_file}` : ""
		});
	});
};

const C_REQ_POST_PARAMS					=	[
												"gmm_posts.id",
												"gmm_posts.id_user AS userId", "gmm_users.name AS 'userName'",
												"gmm_posts.title", "gmm_posts.content",
												"gmm_posts.date_creation","gmm_posts.date_update",
												"gmm_posts.nb_reactions","gmm_posts.reactions",
												"gmm_posts.is_topic",
												"gmm_posts.url_attachment"
											].join(",")+" ";

exports.getTopics = (req, res, next) => {
	if (!Checker.isValid(req.query))			return res.status(400).send("Malformed ID");

	const l_params						=	req.query;
	const l_limit						=	parseInt(Checker.isValid(l_params.limit) ? l_params.limit : 20),
		l_offset						=	parseInt(Checker.isValid(l_params.offset) ? l_params.offset : 0),
		l_order							=	Checker.isValid(l_params.order) ? (l_params.order.toUpperCase()=="ASC"?"ASC":"DESC") : "DESC";

	const l_request						=	{request : `get:post/ - get topics`};
	
	db.query(	"SELECT "+C_REQ_POST_PARAMS+
				"FROM gmm_posts "+
					"INNER JOIN gmm_users "+
						"ON gmm_posts.id_user=gmm_users.id "+
				"WHERE gmm_posts.is_topic=1 "+
					`ORDER BY gmm_posts.date_creation ${l_order} LIMIT :l_limit OFFSET :l_offset`,
	{
		l_limit : l_limit,
		l_offset : l_offset
	},
	(err, topics) => {
		if(err){
			res.status(ERROR_400).json({
				...l_request,
				error : err
			});
		}else{
			let l_topics = JSON.parse(JSON.stringify(topics));
			for (let t of l_topics){
				t.reactions = JSON.parse(t.reactions);
				if(t.url_attachment) t.url_attachment=`${req.protocol}://${req.get('host')}/images/posts/${t.url_attachment}`;
			}
			res.status(200).json({
				...l_request,
				offset : l_offset,
				limit : l_limit,
				topics : l_topics
			});
		}
	});
};

exports.getTopic = (req, res, next) => {
	if (!Checker.isValid(req.params.id))		return res.status(400).send("Malformed ID");

	const l_topicId						=	parseInt(req.params.id);

	const l_request						=	{request : `get:post/:id - get topic@${l_topicId}`};
	
	if (isNaN(l_topicId)) return res.status(ERROR_400).json({...l_request, error:"bad request - topic id = NaN"});

	db.query(	"SELECT "+C_REQ_POST_PARAMS+
				"FROM gmm_posts INNER JOIN gmm_users "+
					"ON gmm_posts.id_user=gmm_users.id "+
				"WHERE gmm_posts.id=:l_topicid AND gmm_posts.is_topic=1 LIMIT 1",
	{
		l_topicid : l_topicId
	},
	(err, topic) => {
		if(err){
			return res.status(ERROR_400).json({
				...l_request,
				error : err
			});
		}
		let l_topic = JSON.parse(JSON.stringify(topic[0]));
		l_topic.reactions = JSON.parse(l_topic.reactions);
		if(l_topic.url_attachment) l_topic.url_attachment=`${req.protocol}://${req.get('host')}/images/posts/${l_topic.url_attachment}`;
		return res.status(200).json({
			...l_request,
			topicId : l_topicId,
			topic : l_topic
		});
	});
};

exports.getComments = (req, res, next) => {
	if (!Checker.isValid(req.params.id))		return res.status(400).send("Malformed ID");

	const l_topicId						=	parseInt(req.params.id);
	const l_params						=	req.query;
	const l_limit						=	parseInt(Checker.isValid(l_params.limit) ? l_params.limit : 20),
		l_offset						=	parseInt(Checker.isValid(l_params.offset) ? l_params.offset : 0),
		l_order							=	Checker.isValid(l_params.order) ? (l_params.order.toUpperCase()=="ASC"?"ASC":"DESC") : "DESC";

	const l_request						=	{request : `get:post/:id/comments - get comments for topic@${l_topicId}`};

	db.query(	"SELECT "+C_REQ_POST_PARAMS+ "FROM gmm_posts "+
					"INNER JOIN gmm_topic_posts "+
						"ON gmm_topic_posts.id_post=gmm_posts.id "+
					"INNER JOIN gmm_users "+
						"ON gmm_posts.id_user=gmm_users.id "+
				"WHERE gmm_topic_posts.id_topic=:l_topicid "+
					`ORDER BY gmm_posts.date_creation ${l_order} LIMIT :l_limit OFFSET :l_offset`,
	{
		l_topicid : l_topicId,
		l_limit : l_limit,
		l_offset : l_offset
	},
	(err, posts) => {
		if(err){
			return res.status(ERROR_400).json({
				...l_request,
				error : err
			});
		}
		let l_posts = JSON.parse(JSON.stringify(posts));
		for (let t of l_posts){
			t.reactions = JSON.parse(t.reactions);
			if(t.url_attachment) t.url_attachment=`${req.protocol}://${req.get('host')}/images/posts/${t.url_attachment}`;
		}
		res.status(200).json({
			...l_request,
			topicId : l_topicId,
			offset : l_offset,
			limit : l_limit,
			comments : l_posts
		});
	});
};

exports.getComment = (req, res, next) => {
	if (!Checker.isValid(req.params.id))		return res.status(400).send("Malformed ID");
	if (!Checker.isValid(req.params.commentid))return res.status(400).send("Malformed ID");

	const l_topicId						=	parseInt(req.params.id);
	const l_commentId					=	parseInt(req.params.commentid);

	const l_request						=	{request:`get:post/:id/:idcomment - get comment@${l_commentId} from topic@${l_topicId}`};

	db.query(	"SELECT " + C_REQ_POST_PARAMS + "FROM gmm_posts "+
				"INNER JOIN gmm_topic_posts "+
					"ON gmm_posts.id=gmm_topic_posts.id_post "+
				"INNER JOIN gmm_users "+
					"ON gmm_posts.id_user=gmm_users.id "+
				"WHERE gmm_topic_posts.id_topic=:l_topicid AND gmm_topic_posts.id_post=:l_commentid LIMIT 1",
	{
		l_topicid : l_topicId,
		l_commentid : l_commentId
	},
	(err, post) => {
		if(err){
			return res.status(ERROR_400).json({
				...l_request,
				error : err
			});
		}
		let l_post = JSON.parse(JSON.stringify(post[0]));
		l_post.reactions = JSON.parse(l_post.reactions);
		if(l_post.url_attachment) l_post.url_attachment=`${req.protocol}://${req.get('host')}/images/posts/${l_post.url_attachment}`;
		return res.status(200).json({
			...l_request,
			topicId : l_topicId,
			commentId : l_commentId,
			offset : l_offset,
			limit : l_limit,
			topic : l_post
		});
	});
};


function removeFileCallback (err) { 
    if(err) console.log("unabled to remove file", err);
}

exports.editPost = (req, res, next) => {
	if (!Checker.isValid(req.params.id))		return res.status(400).send("Malformed ID");

	const l_postId						=	parseInt(req.params.id);

	const l_request						=	{request:`put:post/:id - edit post@${l_postId}`};

	db.query ("SELECT * FROM gmm_posts WHERE id=:l_postid",
	{l_postid:l_postId},
	(err, rPost) => {
		if (err || !rPost) return res.status(404).json({...l_request,error:err});

		let l_post						=	JSON.parse(JSON.stringify(rPost[0]));
		
		// an image was filled with the request ?
		let l_imageUrl					=	validateFile(req);
		if (l_imageUrl){
			console.log("req.file :"+req.file);
			
			// image validated : check old image (if any) and remove it
			let l_oldImg				=	l_post.url_attachment ? l_post.url_attachment : "";
			if (l_oldImg!="" && l_oldImg!=req.file.filename){
				console.log("remove old : "+l_oldImg);
				fs.unlink(`images/users/${l_oldImg}`, removeFileCallback);
			}
		}
	

		// now we can update the user informations
		const l_updatePostSet			=	[];
		const l_updatePostParams		=	{};

		if (req.body.title) {
			l_updatePostParams.l_title	=	req.body.title;
			l_updatePostSet.push			("title=:l_title");
		}
		if (req.body.content) {
			l_updatePostParams.l_content=	req.body.content;
			l_updatePostSet.push			("content=:l_content");
		}
		if (l_imageUrl.length>0){
			l_updatePostParams.l_imgurl	=	l_imageUrl;
			l_updatePostSet.push			("url_avatar=:l_imgurl");
		}

		// if data to edit
		if (l_updatePostSet.length<1)
			return res.status(200).json({...l_request, message:"no information to update for user", postId:l_postId});

		// update user last connection/edition
		l_updatePostSet.push				("date_update=:l_dateu");
		l_updatePostParams.l_dateu		=	new Date().toISOString().slice(0,19).replace("T"," ");

		// don't forget to pass the postId in the parameters !
		l_updatePostParams.l_postid		=	l_postId;
		db.query(`UPDATE gmm_posts SET ${l_updatePostSet.join(', ')} WHERE id=:l_postid LIMIT 1`,
		l_updatePostParams,
		(err,result)=>{
			if (err) return res.status(ERROR_400).json({...l_request, error:err});
			return res.status(201).json({...l_request, message:"post updated", postId:l_userId});
		});
	});
};

exports.deletePost = (req, res, next) => {
	if (!Checker.isValid(req.params.id))		return res.status(400).send("Malformed ID");

	
	if (req._userPrivileges.delete_message<1){
		return res.status(ERROR_403).json({error : "user has not privilege to delete post"});
	}
	const l_userId						=	req._tokenUserId;
	const l_postId						=	parseInt(req.params.id);

	const l_request						=	{request:`delete:post/:id - delete post@${l_postId}`};

	db.query("SELECT id, id_user, is_topic, url_attachment FROM gmm_posts WHERE id=:l_postid LIMIT 1",
	{l_postid:l_postId},
	(err, post) => {
		if(err) return res.status(ERROR_400).json({error : err});

		if (!post || post.length<1) return res.status(ERROR_404).json({...l_request, error : "post not found"});

		let l_post = JSON.parse(JSON.stringify(post[0]));
		if ((l_post.id_user != l_userId) && (req._userPrivileges.delete_message<2))
			return res.status(ERROR_403).json({...l_request, error : "user has not privilege to delete post"});

		// removes attached image
		if (l_post.url_attachment){
			fs.unlink(`images/posts/${l_post.url_attachment}`, removeFileCallback);
		}

		// before removing post, remove comments (if any)
		if (l_post.is_topic){
			db.query("DELETE w.* FROM `gmm_posts` w INNER JOIN `gmm_topic_posts` e ON e.id_post=w.id WHERE e.id_topic=:l_postid;",
			{l_postid:l_postId},
			(err, result) => {
				if (err) return res.status(ERROR_400).json({...l_request, message:"failed to remove comments from post", error:err});

				db.query("DELETE FROM gmm_posts WHERE id=:l_postid LIMIT 1",{l_postid:l_postId}, (err, result) => {
					if (err) return res.status(ERROR_400).json({...l_request, message:"failed to remove post", error : err});
					return res.status(200).json({...l_request, message: "post deleted."});
				});
			});
		}else {
			db.query("DELETE FROM gmm_posts WHERE id=:l_postid LIMIT 1;",{l_postid:l_postId}, (err, result) => {
				if (err) return res.status(ERROR_400).json({...l_request, message:"failed to remove post", error : err});
				return res.status(200).json({...l_request, message: "post deleted."});
			});
		}
	});
};

exports.getTrendings = (req, res, next) => {
	if (!Checker.isValid(req.query))			return res.status(400).send("Malformed ID");

	const l_params						=	req.query;

	const l_limit						=	parseInt(Checker.isValid(l_params.limit) ? l_params.limit : 20),
		l_offset						=	parseInt(Checker.isValid(l_params.offset) ? l_params.offset : 0),
		l_order							=	Checker.isValid(l_params.order) ? (l_params.order.toUpperCase()=="ASC"?"ASC":"DESC") : "DESC",
		l_topicOnly						=	Checker.isValid(l_params.all) ? (l_params.all.toLowerCase()=="true" ? false : true) : true;
			
	const l_request						=	{request:`get:post/trendings/ - get most liked topics`};

	db.query(	"SELECT " + C_REQ_POST_PARAMS + "FROM gmm_posts "+
					"INNER JOIN gmm_users "+
						"ON gmm_posts.id_user=gmm_users.id "+
				(l_topicOnly ? "WHERE gmm_posts.is_topic=1 " : "")+
					`ORDER BY gmm_posts.nb_reactions ${l_order} LIMIT :l_limit OFFSET :l_offset`,
	{
		l_limit : l_limit,
		l_offset : l_offset
	},
	(err, trandings) => {
		if(err){
			res.status(ERROR_400).json({
				...l_request,
				error : err,
			});
		}else{
			let l_trendings = JSON.parse(JSON.stringify(trandings));
			for (let t of l_trendings){
				t.reactions = JSON.parse(t.reactions);
				if(t.url_attachment) t.url_attachment=`${req.protocol}://${req.get('host')}/images/posts/${t.url_attachment}`;
			}
			res.status(200).json({
				...l_request,
				offset : l_offset,
				limit : l_limit,
				trendings : l_trendings
			});
		}
	});
};