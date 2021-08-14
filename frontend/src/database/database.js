import cookie from "js-cookie";
import axios from "axios";

const REQUEST_PROTOTYPES = {
	
	JWT : () => {
		return {
			method			:	"get",
			url				:	`${process.env.REACT_APP_API_URL}api/auth/jwtid`,
			withCredentials	:	true
		}
	},

	GETUSER : (id) => {
		return {
			method			:	"get",
			url				:	`${process.env.REACT_APP_API_URL}api/user/${id}`,
			withCredentials	:	true
		}
	},

	UPDATEUSER : (id, data) => {
		return {
			method			:	"put",
			url				:	`${process.env.REACT_APP_API_URL}api/user/${id}`,
			withCredentials	:	true,
			data			:	data,
		}
	},

	DISCONNECT : (id) => {
		return {
			method			:	"post",
			url				:	`${process.env.REACT_APP_API_URL}api/user/logout/${id}`,
			withCredentials	:	true
		}
	},

	DELETE_USER : (id) => {
		return {
			method			:	"delete",
			url				:	`${process.env.REACT_APP_API_URL}api/user/${id}`,
			withCredentials	:	true
		}
	},


	TRENDINGS : (count=3) => {
		return {
			method			:	"get",
			url				:	`${process.env.REACT_APP_API_URL}api/post/trendings/?limit=${count}`,
			withCredentials	:	true,
		}
	},


	TOPICS : () => {
		return {
			method			:	"get",
			url				:	`${process.env.REACT_APP_API_URL}api/post/?order=asc`,
			withCredentials	:	true,
		}
	},

	TOPIC : (id) => {
		return {
			method			:	"get",
			url				:	`${process.env.REACT_APP_API_URL}api/post/${id}`,
			withCredentials	:	true,
		}
	},

	COMMENTS : (postid, data) => {
		return {
			method			:	"get",
			url				:	`${process.env.REACT_APP_API_URL}api/post/${postid}/comments`,
			withCredentials	:	true,
			data			:	data,
		}
	},

	EMITREACTION : (reaction, postId, userId) => {
		return {
			method			:	'put',
			url				:	`${process.env.REACT_APP_API_URL}api/user/react/${postId}`,
			withCredentials	:	true,
			data			:	{
									reaction : reaction,
									userId : userId
								},
		}
	},

	POST : (title, content, file) => {
		let l_data = {
			title : title,
			content : content
		};
		if (file){
			l_data = new FormData();
			l_data.append("title",title);
			l_data.append("content",content);
			l_data.append("image",file);
		}
		return {
			method			:	'post',
			url				:	`${process.env.REACT_APP_API_URL}api/post/`,
			withCredentials	:	true,
			data			:	l_data,
		}
	},

	COMMENT : (postId, content, file) => {
		let l_data = { content : content };
		if (file){
			l_data = new FormData();
			l_data.append("content",content);
			l_data.append("image",file);
		}
		return {
			method			:	'post',
			url				:	`${process.env.REACT_APP_API_URL}api/post/${postId}`,
			withCredentials	:	true,
			data			:	l_data,
		}
	},

	DELETE_POST : (id) => {
		return {
			method			:	"delete",
			url				:	`${process.env.REACT_APP_API_URL}api/post/${id}`,
			withCredentials	:	true
		}
	}
}


const COOKIE_NAME = 'jwt';

const RANKNAMES = ["", "Propriétaire", "Administrateur", "Modérateur", "Membre", "Disparu"];

const EMPTYREACTION = () => {
	return	{
				like : 0,
				love : 0,
				laugh : 0,
				wow : 0,
				dislike : 0
			}
}
const _UserRequester = {
	
	// authentify user with the json web token in his cookie named "jwt"

	jwt : (validate) => {
		
		axios (REQUEST_PROTOTYPES.JWT())

		.then((res) => {
			if (!res.data.error){

				// register user in the local database
				DATABASE.User.setCurrent(DATABASE.User.convertFromAPI(res.data.user));

				// this will tell the application the function succeed
				validate(true);

				return;

			}else{
				console.log("NO TOKEN"+res.data.error);
			}
		})

		.catch((err) => {
			console.log({error : err});
		});

	},


	// get user by id (from local or API)

	getUser : (id, setUser) => {

		if (DATABASE.User.get(id)) {

			// set user
			setUser(DATABASE.User.get(id));

			return
		}

		axios (REQUEST_PROTOTYPES.GETUSER(id))

		.then (res => {

			if (res.data.error){
				console.log({error:res.data.error});
				return
			}

			// get a formated user
			let l_user = DATABASE.User.convertFromAPI(res.data.user);
			
			// store user in local database
			DATABASE.User.create(l_user);
			
			// set user
			setUser(l_user);
		})

		.catch(err => {
			console.log({error : err, message : "unabled to get user "+id});
		})
	},


	// update user by id
	updateUserImage : (id, user, file, callback) => {
		if (!file)  return;
		if (!DATABASE.User.get(id)) return

		// create a form data to send image ("image"!!! ... not "file")
		const data = new FormData();
		data.append("image", file);

		// send the request to modify the user image
		axios (REQUEST_PROTOTYPES.UPDATEUSER(id, data))
		
		.then((res)=>{
			if (res.data.error){
				console.log(res.data.error);
			}
			else if (res.data.request){
				DATABASE.User.get(id).url_avatar = res.data.url_avatar;
				callback(res.data.url_avatar);
			}
		})

		.catch((err) => {
			console.log(err);
		})
	},

	updateUser : (id, user, file) => {

		if (!DATABASE.User.get(id)) return

		const data = new FormData();
		data.append("name", user.name);
		data.append("service", user.service);
		data.append("location", user.location);
		if (file) data.append("file",file);

		axios (REQUEST_PROTOTYPES.UPDATEUSER(id, data))
		
		.then((res)=>{

		})

		.catch((err) => {

		})
	},

	// disconnection

	removeCookie : () => {

		if (window !== "undefined") cookie.remove(COOKIE_NAME, {expires:1});

	},


	// disconnect the user by removing his cookie and reloading the page

	disconnect : (user) => {

		if (!user) return;
		// send a logout request to server
		axios ( REQUEST_PROTOTYPES.DISCONNECT(user.id) )

		.then((res) => {
			
			// removes cookie and redirects to Home
			_UserRequester.removeCookie();

			// reload page - required to remove local user authentification
			window.location = "/";

		})

		.catch((err) => {
			console.log("failed to disconnect", err);
		})
	},

	deleteUser : (user) => {

		// send a logout request to server
		axios ( REQUEST_PROTOTYPES.DELETE_USER(user.id) )

		.then((res) => {
			console.log(res);
		})

		.catch((err) => {
			console.log("failed to disconnect", err);
		})

	},

	// User send a reaction
	EmitReaction : (user, reaction, postId, validate  ) => {

		axios (REQUEST_PROTOTYPES.EMITREACTION(reaction, postId, user.id))
		
		.then((res) => {
			
			if (res.data.error){
				console.log({message : "failed to react with error : ", error : res.data.error });
				return false;
			}

			if (res.data.reaction){
				let p = DATABASE.Post.get(postId);
				DATABASE.Post.setReaction(p, res.data.reaction);
				validate(true);
			}

		})

		.catch((err) => {
			console.log("db failed :",err);
		})
	},

	Post : async (userid, title, content, file, validate) => {
		
		if (!DATABASE.User.get(userid)) return "failed to comment - user not found";
		await axios (REQUEST_PROTOTYPES.POST(title, content, file))
		
		.then((res) => {
			
			if (res.data.error){
				console.log({error : res.data.error, message : "failed to create topic" });
				return false;
			}
			DATABASE.Post.create({
									id : res.data.postId,
									userId:res.data.userId,
									userName:DATABASE.User.get(res.data.userId).name,
									title:title,
									content:content,
									url_attachment:res.data.url_attachment,
									createdAt:new Date().toISOString(),
									updatedAt:new Date().toISOString(),
									reactions:EMPTYREACTION(),
									nb_reactions:0,
									is_topic:true,
									comments:[]
								})
			validate(true);
		})

		.catch((err) => {
			console.log("db failed :",err);
		})
	},

	Comment : (userid, postid, content, file, validate) => {
		
		if (!DATABASE.User.get(userid)) return "failed to comment - user not found";
		if (!DATABASE.Post.get(postid)) return "failed to comment - post not found";

		axios (REQUEST_PROTOTYPES.COMMENT(postid, content, file))
		
		.then((res) => {
			
			if (res.data.error){
				console.log({error : res.data.error, message : "failed to comment on topic "+postid });
				return false;
			}

			let l_post = DATABASE.Post.create({
									id : res.data.postId,
									userId:res.data.userId,
									userName:DATABASE.User.get(res.data.userId).name,
									title:null,
									content:content,
									url_attachment:res.data.url_attachment,
									createdAt:new Date().toISOString(),
									updatedAt:new Date().toISOString(),
									reactions:EMPTYREACTION(),
									nb_reactions:0,
									is_topic:false,
									comments:[]
								})
			DATABASE.Topic.data.get(postid).comments.push(l_post);
			validate(true);
		})

		.catch((err) => {
			console.log("db failed :",err);
		})
	},
};


const _PostRequester = {
	
	// get trending topics from API

	getTrendings : (validate) => {

		// get trending posts
		axios (REQUEST_PROTOTYPES.TRENDINGS())

		.then((res) => {
			if (res.data.error){
				console.log(res.data.error);
				return
			}
		
			// we got the posts data from API
			let pdata = res.data.trendings;
			
			// clear previous array
			DATABASE.Trendings = [];

			for (let p of pdata){
				// convert to a well formated post
				let l_p = DATABASE.Post.convertFromAPI(p);

				// store post in local database and in output array
				DATABASE.Post.create(l_p);
				DATABASE.Trendings.push(l_p);
				
			}
			
			// and, as usual, validate !
			validate(true);

		})
		.catch((err) => {
			console.log({error : "failed to get trendingss", err});
		})

	},


	// get topics from API

	getTopics : (validate) => {

		// get topics
		axios (REQUEST_PROTOTYPES.TOPICS())

		.then((res) => {
			if (res.data.error){
				console.log(res.data.error);
				return
			}
		
			// we got the posts data from API
			let pdata = res.data.topics;
			for (let p of pdata){
				// convert to a well formated post
				let l_p = DATABASE.Post.convertFromAPI(p,true);

				// store post in local database and in output array
				DATABASE.Post.create(l_p);
				DATABASE.Topic.create(l_p);
			}

			// and, as usual, validate !
			validate(true);

		})
		.catch((err) => {
			console.log({error : "failed to get trendings", err});
		})

	},

	// get topics from API

	getTopic : (id,validate) => {

		// get topics
		axios (REQUEST_PROTOTYPES.TOPIC(id))

		.then((res) => {
			if (res.data.error){
				console.log(res.data.error);
				return
			}
			
			// convert the received topic to a well formated post
			let l_p = DATABASE.Post.convertFromAPI(res.data.topic,true);

			// store post in local database and in output array
			DATABASE.Post.create(l_p);
			DATABASE.Topic.create(l_p);

			// and, as usual, validate !
			validate(true);

		})
		.catch((err) => {
			console.log({error : "failed to get trendings", err});
		})

	},

	// get comments from topic @postId
	getComments : (postId, validate) => {
		
		// get topics
		axios (REQUEST_PROTOTYPES.COMMENTS(postId))

		.then((res) => {
			if (res.data.error){
				console.log(res.data.error);
				return
			}
		
			// we got the posts data from API
			let pdata = res.data.comments;

			for (let p of pdata){
				// convert to a well formated post
				let l_p = DATABASE.Post.convertFromAPI(p);

				// create a post for the comment
				DATABASE.Post.create(l_p);

				// add it to the related topic
				DATABASE.Topic.addComment(postId, l_p.id);
			}

			// and, as usual, validate !
			validate(true);
		})
		.catch((err) => {
			console.log({error : "failed to get comments", err});
		})
	},

	deletePost : (post, validate)=> {
		if (!post) return;

		// get topics
		axios (REQUEST_PROTOTYPES.DELETE_POST(post.id))

		.then((res) => {
			if (res.data.error){
				console.log({message : res.data, error : res.data.error});
				return
			}
			DATABASE.Post.delete(post);
			validate(true);
		})
		.catch((err) => {
			console.log({message : "failed to remove post", error : err});
		})
	},
};

const DATABASE = {
	
	// User Database

	User : {
		
		_CURRENT : null,

		current : () => {
			return DATABASE.User._CURRENT;
		},

		setCurrent : (user) => {

			DATABASE.User._CURRENT = DATABASE.User.create(user);

		},

		// a map to store user data

		data : new Map(),


		// simple constructor

		create : (user)=>{
			// create a new user only if it's not already in the local database
			if (DATABASE.User.data.has(user.id)) return user;

			// assign a key to the user (actually, we use the user.id as key)
			DATABASE.User.data.set(user.id, user);

			return user;
		},


		// get a user by his id

		get : (id) => {

			// find the user by it's id as key
			return DATABASE.User.data.get(id);
		},


		// a mapper for axios requests

		request : _UserRequester,
		

		// convinient function to convert "API-side" Database user to a "client-side" Database user

		convertFromAPI : (user) => {

			// create a new user entry and grab all user infos
			return {
						id			: user.id,
						name		: user.name,
						email		: user.email,
						rank		: user.id_privilege,
						rankname	: RANKNAMES[user.id_privilege],
						url_avatar	: user.url_avatar,
						birthday	: user.date_naissance,
						createdAt	: user.date_creation,
						updatedAt	: user.date_connexion,
						location	: user.location,
						service		: user.service,
						signature	: user.signature
					}
		},
	},

	Post : {

		_CURRENT : null,

		current : () => {
			return DATABASE.Post._CURRENT;
		},

		setCurrent : (post) => {

			DATABASE.Post._CURRENT = DATABASE.Post.create(post);

		},

		data : new Map(),

		create : (post)=>{
			// create a new post only if it's not already in the local database
			if (DATABASE.Post.data.has(post.id)) return post;
			
			// assign a key to the post
			DATABASE.Post.data.set(post.id, post);

			// if post is a topic, add it to the topics
			if (post.is_topic) DATABASE.Topic.create(post);

			return post;
		},

		get : (id) => {
			return DATABASE.Post.data.get(id);
		},
		
		delete : (post) => {
			if (post.is_topic) return DATABASE.Topic.delete(post);
			DATABASE.Post.data.delete(post.id);
		},

		// a mapper for axios requests

		request : _PostRequester,
		

		// convinient function to convert "API-side" Database post to a "client-side" Database post

		convertFromAPI : (post, isTopic=false) => {

			// create a new post entry and grab all post infos
			return {
						id			: post.id,
						userId		: post.userId,
						userName	: post.userName,
						title		: post.title,
						content		: post.content,
						url_attachment: post.url_attachment,
						createdAt	: post.date_creation,
						updatedAt	: post.date_update,
						reactions	: post.reactions,
						nb_reactions: post.nb_reactions,
						is_topic	: post.is_topic,
						comments	: []
					}
		},

		setReaction : (post, reaction) => {
			post.nb_reactions		=	reaction.nb_reactions;
			post.reactions.like		=	reaction.reactions.like;
			post.reactions.love		=	reaction.reactions.love;
			post.reactions.laugh	=	reaction.reactions.laugh;
			post.reactions.wow		=	reaction.reactions.wow;
			post.reactions.dislike	=	reaction.reactions.dislike;
		},
	},

	Topic : {

		data : new Map(),

		create : (topic)=>{
			if (DATABASE.Topic.data.has(topic.id))
				return;
			DATABASE.Topic.data.set(topic.id, topic);
		},

		get : (id) => {
			return DATABASE.Topic.data.get(id);
		},

		delete : (topic) => {
			if (!topic) return;

			// remove topic comments
			for (let p of topic.comments){
				DATABASE.Post.data.delete(p.id);
			}
			topic.comments=[];

			let t = DATABASE.FindTopic(topic);
			if (t>=0) DATABASE.Trendings.splice(t,1);

			let id = topic.id;
			if (DATABASE.Topic.data.has(id)) DATABASE.Topic.data.delete(id);
		},

		addComment : (topicId, commentId) => {
			let l_comments = DATABASE.Topic.data.get(topicId).comments;
			let l_post = DATABASE.Post.get(commentId);
			if (l_comments.includes(l_post)) return;
			l_comments.push(l_post);
		},

		getComments : (id) => {
			return DATABASE.Topic.data.get(id).comments;
		},

		Array : () => {
			return [...DATABASE.Topic.data.values()].reverse();
		}
	},

	Trendings : [],

	FindTopic : (topic) => {
		for (let i in DATABASE.Trendings){
			if (DATABASE.Trendings[i].id === topic.id) return i;
		}
		return -1;
	}

}

export default DATABASE