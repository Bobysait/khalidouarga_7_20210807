/*jshint esversion: 9 */

const bcrypt							=	require('bcrypt');
const jwtUtils							=	require('../utils/jwt.utils');
const validator							=	require('../utils/validator.utils');
const handleErr							=	require('../utils/errors.utils');
const { ERROR_400, ERROR_401, ERROR_404 }=	require('../utils/errors.utils');
const jwt								=	require('jsonwebtoken');
const db								=	require('../config/db');
const { ID_PRIVILEGE_USER }				=	require('../class/privileges.class');
const Checker							=	require('../utils/validator.utils');

const MAX_AGE							=	9 * 60 * 60 * 1000; // 9 hours


exports.signUp = (req, res, next) => {
	console.log("post:auth/signup - user SignUp");

	if (!Checker.isValid(req.body))			return res.status(400).send("Malformed body");
	
	const l_ReqFailed					=	{request : `post:auth/signup - user signs up (FAILED)`};

	// the request should contain data in the body
	if (!req.body){
		return res.status(ERROR_400).json({...l_ReqFailed, error : 'body does not contain any data'});
	}

	// let's check user data
	let l_userdata						=	req.body,
		l_username						=	validator.validateDBText(l_userdata.name),
		l_usermail						=	validator.validateDBText(l_userdata.email),
		l_userpass						=	validator.validateDBText(l_userdata.password);
	
	// asserts data are valid
	if (l_username==null || l_usermail==null || l_userpass==null){
		return res.status(ERROR_400).json({...l_ReqFailed, error : 'some required fields are invalid'});
	}
	
	// asserts fields are well formatted
	if ((typeof (l_username) != "string") ||
		(typeof (l_usermail) != "string") ||
		(typeof (l_userpass) != "string") ) {
		return res.status(ERROR_400).json({...l_ReqFailed, error : 'invalid type for fields'});
	}
	
	// username should be at least 4 chars and not more than 32
	if (! validator.testName(l_username, 4, 32) )return res.status(ERROR_400).json({...l_ReqFailed, error : 'invalid user.name'});
	
	// validate the email (or not)
	if (! validator.testEmail(l_usermail) )	return res.status(ERROR_400).json({...l_ReqFailed, error : 'invalid user.email'});

	// password test must be "2" (1 is medium and 0 is really not strong enough or invalid, -1 and below are invalid passwords)
	switch(validator.testPassword(l_userpass)){
		case -3							:	return res.status(ERROR_400).json({...l_ReqFailed, error : 'no password'});
		case -2							:	return res.status(ERROR_400).json({...l_ReqFailed, error : 'invalid type for user.password'});
		case -1							:	return res.status(ERROR_400).json({...l_ReqFailed, error : 'user.password too short or too long'});
		case 0							:	return res.status(ERROR_400).json(
			{...l_ReqFailed, 
				error					:	'invalid user.password',
				about					:	'password must contain at least 8 characters with lower and uppercase, numerics and special characters.',
				level					:	'low'
			});
		case 1							:	return res.status(ERROR_400).json(
			{...l_ReqFailed, 
				error					:	'user.password not strong enough',
				about					:	'password must contain at least 8 characters with lower and uppercase, numerics and special characters.',
				level					:	'medium' });
		default : break;
	}

	// removes spaces before and after, and convert email to lowercase.
	l_username							=	l_username.trim();
	l_usermail							=	l_usermail.trim().toLocaleLowerCase();
	l_userpass							=	l_userpass.trim();

	// encrypts password
	bcrypt.hash(l_userpass, 10)

	// on hash success -> generates the user
	.then(hash => {
		console.log("ID_PRIVILEGE_USER : "+ID_PRIVILEGE_USER);
		db.query( "INSERT INTO `gmm_users` ( `id`, `name`, `email`, `password`, `id_privilege` ) "+
					"values (NULL, :l_name, :l_mail, :l_pass, :l_privilege )",
		{
			l_name : l_username,	// username
			l_mail : l_usermail,	// email
			l_pass : hash,			// encrypted password
			l_privilege : ID_PRIVILEGE_USER // user's rank
		},
		(err,newUser)=>{
			if (err){
				return res.status(ERROR_400).json({
					...l_ReqFailed,
					error : err
				});
			}else{
				return res.status(200).json({
					request : `post:auth/signup - user signs up : new id=${newUser.insertId}`,
					userId : newUser.insertId
				});
			}
		});
	})
	.catch((err) => {
		return res.status(ERROR_400).json({
			...l_ReqFailed,
			error : "Failed for some reason"
		});
	});
};

exports.signIn = (req, res, next) => {
	if (!Checker.isValid(req.body))			return res.status(400).send("Malformed ID");
	
	let l_userdata						=	req.body,
		l_usermail						=	validator.validateDBText(l_userdata.email),
		l_userpass						=	validator.validateDBText(l_userdata.password);

	const l_ReqFailed					=	{request : `post:auth/signin - user signs in (FAILED)`};

	// so, just like for registration, we check validity of the input fields
	if (l_usermail==null)					return res.status(ERROR_400).json( {...l_ReqFailed,...handleErr.TypedError('email', 'email null')} );

	if ((typeof (l_usermail) != "string") ) return res.status(ERROR_400).json({...l_ReqFailed, ...handleErr.TypedError('email', 'invalid email type') });
	if(!( validator.testEmail(l_usermail) ) ) return res.status(ERROR_400).json({...l_ReqFailed, ...handleErr.TypedError('email', 'invalid email')});

	if (l_userpass==null)					return res.status(ERROR_400).json({...l_ReqFailed, ...handleErr.TypedError('password', 'password null') });
	if ((typeof (l_userpass) != "string") ) return res.status(ERROR_400).json({...l_ReqFailed, ...handleErr.TypedError('password', 'invalid password type') });
	if(!( validator.testPassword(l_userpass) ) ) return res.status(ERROR_400).json({...l_ReqFailed, ...handleErr.TypedError('password', 'invalid password') });

	l_usermail							=	l_usermail.trim().toLocaleLowerCase();
	l_userpass							=	l_userpass.trim();
	

	// find the "requested" user in the DB using his "unique" email
	// we actually only the user id, password and privileges fields
	db.query(`SELECT id,password,id_privilege FROM gmm_users WHERE gmm_users.email=:l_email`,{l_email:l_usermail}, (err, user) => {

		// user not found ?
		if(err || (!user) || (user.length<1)) return res.status(ERROR_404).json({...l_ReqFailed, ...handleErr.TypedError("user", "user not found") });
		
		// here we are ! let's get the first entry of our response
		let l_user						=	JSON.parse(JSON.stringify(user[0]));
		
		// to authentify the user, we have to compare crypted version of the passwords (the one of the request with the one on the DB)
		bcrypt.compare(l_userpass, l_user.password)

			// great, we found a match !
			.then(valid => {

				// or not ...
				if (!valid)					return res.status(ERROR_400).json({...l_ReqFailed, ...handleErr.TypedError("password","password does not match") });

				// generates a token for the user, so he can authentify his messages on future requests
				const token				=	jwtUtils.createToken(l_user.id);
				res.cookie('jwt', token, {httpOnly:true, maxAge:MAX_AGE});
				
				return res.status(200).json({ user :
				{
					request : `post:auth/signin - user signs in : your id=${l_user.id}`,
					id	: l_user.id,
					rank: l_user.id_privilege
				}});
			})

			// well, probably a wrong password ... or something else ... anyway, it's a fail !
			.catch(err => {
				return res.status(500).json({...l_ReqFailed, ...handleErr.TypedError("password", err) });
			});
	});
};

exports.jwtid = (req,res,next) => {
	if (!Checker.isValid(res.locals.user))	return res.status(400).send("Malformed ID");
	if (!Checker.isValid(res.locals.user.id))return res.status(400).send("Malformed ID");

	// actually, if we are here, the application already passed the jwt verification, so ...
	return res.status(200).json({
		request : 'get:/jwtid - validate your token',
		userId : res.locals.user.id,
		user : res.locals.user
	});
};