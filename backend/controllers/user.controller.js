/*jshint esversion: 9 */

const db								=	require('../config/db');
const { revokeCookie, revokeUser }		=	require('../middleware/auth.middleware');
const { ERROR_400, ERROR_401, ERROR_404 }=	require('../utils/errors.utils');

const Checker							=	require('../utils/validator.utils');

const fs								=	require('fs');
const { ID_ACCOUNT_ANONYMUS }			=	require('../class/privileges.class');
const { validateFile } = require('../utils/file.utils');


const C_REQ_POST_PARAMS					=	[
												"gmm_posts.id",
												"gmm_posts.id_user AS userId", "gmm_users.name AS 'userName'",
												"gmm_posts.title", "gmm_posts.content",
												"gmm_posts.date_creation", "gmm_posts.date_update",
												"gmm_posts.nb_reactions","gmm_posts.reactions",
												"gmm_posts.is_topic",
												"gmm_posts.url_attachment"
											].join(",")+" ";

const formatMessageImageUrl = (req, url) => {
	return url ? `${req.protocol}://${req.get('host')}/images/users/${url}` : "";
}

exports.getUsers = (req, res, next) => {
	if (!Checker.isValid(req.query))			return res.status(400).send("Malformed ID");

	const l_params						=	req.query;
	const l_limit						=	parseInt(Checker.isValid(l_params.limit) ? l_params.limit : 20),
		l_offset						=	parseInt(Checker.isValid(l_params.offset) ? l_params.offset : 0),
		l_order							=	Checker.isValid(l_params.order) ? (l_params.order.toUpperCase()=="ASC"?"ASC":"DESC") : "DESC";

	const l_ranked_condition			=	(req._userPrivileges && req._userPrivileges.hasPrivileges) ? "" : `WHERE gmm_users.id>${ID_ACCOUNT_ANONYMUS} `;

	const l_request						=	{request : `get:user/ - get users list`};
	
	db.query(`SELECT id,name,email,location,service,url_avatar, date_naissance, date_creation, date_connexion, id_privilege FROM GMM_USERS ${l_ranked_condition}ORDER BY gmm_users.id ${l_order} LIMIT :l_limit OFFSET :l_offset`,
	{
		l_limit,
		l_offset
	},
	(err,users)=>{
		if (err){
			res.status(ERROR_400).json({
				...l_request,
				error : err,
				request : `get:user/ - get users`
			});
		}else{
			let l_users = JSON.parse(JSON.stringify(users));
			for (let u of l_users)
				if(u.url_avatar) u.url_avatar=`${req.protocol}://${req.get('host')}/images/users/${u.url_avatar}`;
			res.status(200).json({
				...l_request,
				request : `get:user/ - get users`,
				offset : l_offset,
				limit : l_limit,
				users : l_users
			});
		}
	});
};

exports.getUser = (req, res, next) => {
	if (!Checker.isValid(req.params.id))		return res.status(400).send("Malformed ID");

	const l_request						=	{request : `get:user/:id - get user@${req.params.id}`};
	
	let l_Max = 5;
	if (req.params.id<5){
		if (!(req._userPrivileges && req._userPrivileges.hasPrivileges)) {
			return res.status(ERROR_401).json({...l_request,error : "you don't have the privileges to see protected account."});
		}
		l_Max = 1;
	}
	const l_userId = parseInt(Math.max(req.params.id,l_Max));
	l_request.request = `get:user/:id - get user@${l_userId}`;

	db.query(`SELECT id,name,email,location,service,url_avatar, date_naissance, date_creation, date_connexion, id_privilege FROM GMM_USERS WHERE id=:l_userId LIMIT 1`, {l_userId:l_userId}, (err,user)=>{
		if (err || (!user) || user.length<1){
			res.status(404).json({
				...l_request,
				error : err,
				request : `get:user/:id/ - get user@${l_userId}`
			});
		}else{
			let l_user = JSON.parse(JSON.stringify(user[0]));
			if(l_user.url_avatar) l_user.url_avatar=`${req.protocol}://${req.get('host')}/images/users/${l_user.url_avatar}`;
			res.status(200).json({
				...l_request,
				request : `get:user/:id/ - get user@${l_userId}`,
				userId : l_userId,
				user : l_user
			});
		}
	});
};


exports.getUserPosts = (req, res, next) => {
	if (!Checker.isValid(req.params.id))	return res.status(200).send("Malformed ID");

	const l_userId						=	parseInt(req.params.id);
	const l_params						=	req.query;
	const l_limit						=	parseInt(Checker.isValid(l_params.limit) ? l_params.limit : 20),
		l_offset						=	parseInt(Checker.isValid(l_params.offset) ? l_params.offset : 0),
		l_order							=	Checker.isValid(l_params.order) ? (l_params.order.toUpperCase()=="ASC"?"ASC":"DESC") : "DESC";

	const l_request						=	{request : `get:user/:id/posts - get list of user@${l_userId}'s posts`};

	db.query(	"SELECT " + C_REQ_POST_PARAMS + " FROM gmm_posts "+
				"INNER JOIN gmm_users "+
					"ON gmm_posts.id_user=gmm_users.id "+
				"WHERE gmm_users.id=:l_userId "+
					`ORDER BY gmm_posts.date_creation ${l_order} LIMIT :l_limit OFFSET :l_offset`,
				{
					l_userId : l_userId,
					l_limit : l_limit,
					l_offset : l_offset
				},
				(err, posts) => {
		if(err){
			res.status(ERROR_400).json({
				...l_request,
				error : err,
				request : `get:user/:id/posts - get user@${l_userId} posts`
			});
		}else{
			let l_posts = JSON.parse(JSON.stringify(posts));
			for (let t of l_posts){
				t.reactions = JSON.parse(t.reactions);
				if(t.url_attachment) t.url_attachment=formatMessageImageUrl(req, t.url_attachment);
			}
			res.status(200).json({
				...l_request,
				request : `get:user/:id/posts - get user@${l_userId} posts`,
				userId : l_userId,
				offset : l_offset,
				limit : l_limit,
				posts : l_posts
			});
		}
	});

};

exports.getUserTopics = (req, res, next) => {
	if (!Checker.isValid(req.params.id))		return res.status(400).send("Malformed ID");
	if (!Checker.isValid(req.query))			return res.status(400).send("Malformed ID");

	const l_userId						=	parseInt(req.params.id);
	const l_params						=	req.query;
	const l_limit						=	parseInt(Checker.isValid(l_params.limit) ? l_params.limit : 20),
		l_offset						=	parseInt(Checker.isValid(l_params.offset) ? l_params.offset : 0),
		l_order							=	Checker.isValid(l_params.order) ? (l_params.order.toUpperCase()=="ASC"?"ASC":"DESC") : "DESC";

	const l_request						=	{request : `get:user/:id/topics - get list of user@${l_userId}'s topics`};

	db.query(	"SELECT " + C_REQ_POST_PARAMS + " FROM gmm_posts "+
				"INNER JOIN gmm_users "+
					"ON gmm_posts.id_user=gmm_users.id "+
				"WHERE gmm_users.id=:l_userId AND gmm_posts.is_topic=1 "+
					`ORDER BY gmm_posts.date_creation ${l_order} LIMIT :l_limit OFFSET :l_offset`,
				{
					l_userId : l_userId,
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
				if(t.url_attachment) t.url_attachment=formatMessageImageUrl(req, t.url_attachment);
			}
			res.status(200).json({
				...l_request,
				userId : l_userId,
				offset : l_offset,
				limit : l_limit,
				topics : l_topics
			});
		}
	});
};

// a function used as callback for fs.unlink to display potential errors or success
function removeFileCallback (err) { 
    if(err) console.log("unabled to remove file", err);
}

exports.editUser = (req, res, next) => {
	if (!Checker.isValid(req.params.id))		return res.status(400).send("Malformed ID");
	if (!Checker.isValid(req.body))				return res.status(400).send("Malformed user data");

	const l_userId						=	parseInt(req.params.id);

	const l_request						=	{request : `put:user/:id - edit user@${l_userId}`};

	// everything will happen in an enclosed query -> select from gmm_users
	// if the users does not exist, then ... we can't update it !
	db.query ("SELECT * FROM gmm_users WHERE id=:l_userid",
	{l_userid:l_userId},
	(err, rUser) => {
		if (err || !rUser) return res.status(404).json({...l_request,error:err});

		let l_user						=	JSON.parse(JSON.stringify(rUser[0]));
		
		let l_imageUrl					=	validateFile(req);
		
		// an image was filled with the request ?
		if (l_imageUrl) {
			console.log("new image : "+l_imageUrl);
			
			// image validated : check old image (if any) and remove it
			let l_oldImg				=	l_user.url_avatar ? l_user.url_avatar : "";
			if (l_oldImg!="" && l_oldImg!=req.file.filename){
				console.log("remove old : "+l_oldImg);
				fs.unlink(`images/users/${l_oldImg}`, removeFileCallback);
			}
		}

		// now we can update the user informations
		const l_updateUserSet			=	[];
		const l_updateUserParams		=	{};

		if (req.body.name) {
			l_updateUserParams.l_name	=	req.body.name;
			l_updateUserSet.push			("name=:l_name");
		}
		if (req.body.birthday) {
			l_updateUserParams.l_dob	=	req.body.birthday;
			l_updateUserSet.push			("date_naissance=:l_dob");
		}
		if (req.body.location) {
			l_updateUserParams.l_location=	req.body.location;
			l_updateUserSet.push			("location=:l_location");
		}
		if (req.body.service) {
			l_updateUserParams.l_service=	req.body.service;
			l_updateUserSet.push			("service=:l_service");
		}
		if (req.body.signature) {
			l_updateUserParams.l_signature=	req.body.signature;
			l_updateUserSet.push			("signature=:l_signature");
		}
		if (l_imageUrl.length>0){
			l_updateUserParams.l_imgurl	=	l_imageUrl;
			l_updateUserSet.push			("url_avatar=:l_imgurl");
		}

		// if data to edit
		if (l_updateUserSet.length<1)
			return res.status(200).json({...l_request, message:"no information to update for user", userId:l_userId});
		
		// update user last connection/edition
		l_updateUserSet.push				("date_connexion=:l_dateu");
		l_updateUserParams.l_dateu		=	new Date().toISOString().slice(0,19).replace("T"," ");

		// don't forget to pass the userId in the parameters !
		l_updateUserParams.l_userid	=	l_userId;
		db.query(`UPDATE gmm_users SET ${l_updateUserSet.join(', ')} WHERE id=:l_userid LIMIT 1`,
		l_updateUserParams,
		(err,result)=>{
			if (err) return res.status(ERROR_400).json({...l_request, error:err});
			return res.status(201).json(
				{
					...l_request, message:"user updated",
					userId:l_userId,
					url_avatar : formatMessageImageUrl(req, l_imageUrl)
				});
		});

	});
};


exports.react = (req, res, next) => {
	if (!Checker.isValid(req.params.id))	return res.status(ERROR_400).send({error:"Malformed ID ", id : "'"+req.params.id+"'"});

	const l_userId						=	parseInt(req._tokenUserId);
	const l_postId						=	parseInt(req.params.id);

	const l_request						=	`put:user/react/:postid - user@${l_userId} react to post@${l_postId}`;
	
	// format response
	let l_res = {
		request : l_request,
		userId : l_userId,
		postId : l_postId,
		reaction : ""
	};

	if (typeof(req.body.reaction)!=="string" || req.body.reaction.length>10) {
		return res.status(ERROR_400).json({error:"bad argument for reaction",...l_res, reaction:req.body.reaction});
	}

	// format reaction
	let l_reaction = "", l_oldreaction = "";
	switch (req.body.reaction.toLowerCase()){
		case "like": l_reaction = "like"; break;
		case "love": l_reaction = "love"; break;
		case "laugh": l_reaction = "laugh"; break;
		case "wow": l_reaction = "wow"; break;
		case "dislike": l_reaction = "dislike"; break;
		default : l_reaction = "null"; break;
	}
	
	l_res.reaction = l_reaction;

	// find previous reaction from the user on the selected post
	db.query("SELECT id,reaction FROM `gmm_user_reactions` WHERE id_user=:l_userid AND id_post=:l_postid LIMIT 1",
	{
		l_userid : l_userId,
		l_postid : l_postId
	},
	(err, obj_user_react) => {
		if (err) return res.status(ERROR_400).json({error : err, ...l_res});
		if (!obj_user_react || obj_user_react.length<1){

			// user did not send a reaction, nothing to do.
			if (l_reaction=="") return res.status(200).json({...l_res, message : "no reaction sent"});
			
			// user never reacted to this topic - we need to create a user_react entry
			db.query("INSERT INTO gmm_user_reactions "+
					"(`id`, `id_user`, `id_post`, `reaction`) VALUES "+
					"(NULL, :l_userid, :l_postid, :l_reaction)",
			{
				l_userid : l_userId,
				l_postid : l_postId,
				l_reaction : l_reaction
			},
			(err, obj_user_react) => {
				if (err) return res.status(ERROR_400).json({error : err, ...l_res});

				// then update the post reaction
				return _updatePostReaction(res, l_postId, l_reaction, "", l_res);
			});

		}else{

			// reaction exists : so the user changed his reaction
			let l_obj_reaction = JSON.parse(JSON.stringify(obj_user_react[0]));
			l_oldreaction = l_obj_reaction.reaction;
			
			// send the same reaction = remove the reaction
			if (l_oldreaction==l_reaction) {
				console.log("remove reaction");
				// update user reaction
				db.query("DELETE FROM gmm_user_reactions WHERE id=:l_reactionid LIMIT 1",
				{
					l_reaction:l_reaction,
					l_reactionid:l_obj_reaction.id
				},
				(err,r) => {
					if (err) return res.status(ERROR_400).json({error : err, message : "failed to remove reaction", ...l_res});

					// update the post reaction
					return _updatePostReaction(res, l_postId, l_reaction, l_oldreaction, l_res);
				});
			}else{

				// update user reaction
				db.query("UPDATE gmm_user_reactions SET reaction=:l_reaction WHERE id=:l_reactionid",
				{
					l_reaction:l_reaction,
					l_reactionid:l_obj_reaction.id
				},
				(err,r) => {
					if (err) return res.status(ERROR_400).json({error : err, ...l_res});

					// update the post reaction
					return _updatePostReaction(res, l_postId, l_reaction, l_oldreaction, l_res);
				});
			}

		}

	});
};

function _updatePostReaction(res, pPostId, pReaction, pOldReaction, pRes) {
	// get the post
	db.query("SELECT reactions, nb_reactions FROM gmm_posts WHERE id=:l_postid LIMIT 1",
	{l_postid:pPostId},
	(err, posts) => {
		if(err) return res.status(ERROR_400).json({ error : err, ...pRes });

		// parse the reaction string to a valid json object
		let l_post = JSON.parse(JSON.stringify(posts[0]));
		l_post.reactions = JSON.parse(l_post.reactions);

		// if old reaction exists : remove it from counts
		if (pOldReaction && pOldReaction!="null"){
			l_post.nb_reactions --;
			l_post.reactions[pOldReaction] --;
		}

		// update new reaction (if old reaction is the same as the new, it means that the user "removes" his reaction)
		if (pReaction!="null" && pReaction!=pOldReaction){
			l_post.nb_reactions ++;
			l_post.reactions[pReaction] ++;
		}

		const l_date = new Date().toISOString().slice(0,19).replace("T"," ");
		
		// update reaction in database
		db.query(`UPDATE gmm_posts SET date_update=:l_date, reactions=:l_reacts, nb_reactions=:l_nbreacts WHERE id=:l_postid LIMIT 1`,
		{
			l_date : l_date,
			l_reacts : JSON.stringify(l_post.reactions),
			l_nbreacts : l_post.nb_reactions,
			l_postid : pPostId},
		(err,result) => {
			if(err) return res.status(ERROR_400).json({error: err, ...pRes});
			return res.status(200).json({
				...pRes,
				reaction : l_post
			});
		});
	});
}


exports.logout = (req, res, next) => {
	if (!Checker.isValid(req.params.id))		return res.status(400).send("Malformed ID");
	
	const l_userId						=	parseInt(res.locals.user.id),
		l_userIdToLogout				=	parseInt(req.params.id),
		l_request						=	{request : `post:user/logout/:id - disconnect user@${l_userIdToLogout}`};

	// user attempt to disconnect another user ?
	if (l_userId != l_userIdToLogout) {
		// check user permission to revoke another user's cookie
		if (req._userPrivileges.disconnect>=2){
			revokeUser(l_userIdToLogout);
			return res.status(200).json(
				{
					...l_request,
					message : `User @${l_userIdToLogout} will be disconnected the next time he will require an authentification.`
				});
		}else{
			return res.status(ERROR_400).json({...l_request, error : "attempt to disconnect another user ? that's not fair ! ;)"});
		}
	}

	// user log out his own connection
	revokeCookie(res);
	return res.status(200).json({
		...l_request,
		message : `You (user@${l_userIdToLogout}) have been disconnected.`,
		userId : l_userIdToLogout
	});
};

exports.deleteUser = (req, res, next) => {
	if (!Checker.isValid(req.params.id))		return res.status(400).send("Malformed ID");
	
	const l_userId						=	parseInt(res.locals.user.id),
		l_userIdToDelete				=	parseInt(req.params.id),
		l_request						=	{request : `delete:user/:id - delete user@${l_userIdToDelete}`};

	// 3 first accounts are protected ! (admin/modo/anonyme)
	if (l_userIdToDelete<=ID_ACCOUNT_ANONYMUS) {
		return res.status(ERROR_400).json({...l_request, error : "you are not allowed to delete protected accounts"});
	}
	
	// user allowed to delete an account ?
	if (req._userPrivileges.delete_profil==0) {
		return res.status(ERROR_400).json({...l_request, error : "you are not allowed to delete user"});
	}

	// user attempt to delete another user ? -> check user permission to delete another user's account
	if ((l_userId != l_userIdToDelete) && (req._userPrivileges.delete_profil<2)) {
		return res.status(ERROR_400).json({...l_request, error : "you are not allowed to delete user"});
	}

	// At this point, permissions are supposed granted ...
	// so, let's assign all his messages to the anonyme account and remove this user account
	db.query(`UPDATE gmm_posts SET id_user=${ID_ACCOUNT_ANONYMUS} WHERE id_user=:l_userid;`+
			"DELETE FROM gmm_users WHERE id=:l_userid LIMIT 1;",
	{
		l_userid : l_userIdToDelete,
		l_userid2 : l_userIdToDelete
	},
	(err, r)=> {
		if (err) return res.status(ERROR_400).json({ ...l_request, message : "account can't be deleted", error : err });

		// disconnect user from next attempt
		revokeUser(l_userIdToDelete);
		
		return res.status(ERROR_400).json({
			...l_request,
			message : "user deleted - messages re-affected to anonymous"
		});
	});
};