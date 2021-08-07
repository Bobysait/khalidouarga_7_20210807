/*jshint esversion: 9 */

const webToken			=	require('jsonwebtoken');
const { privileges }	=	require('../class/privileges.class');
const db				=	require('../config/db');

// load user privileges
const { ERROR_400 }		=	require('../utils/errors.utils');

const USERS_TO_REVOKE	=	[];

// the middleware that authentify request using the token sent while user loged-in
module.exports.checkUser = (req, res, next) => {
	const token = req.cookies.jwt;
	if (token) {
		// decode the token to compare with the encoded token
		try{
			let decodedToken = webToken.verify(token, process.env.TOKEN_SECRET);
			const userId = parseInt(decodedToken.id);
			
			// check if user has not been marked for disconnection
			if (USERS_TO_REVOKE.includes(userId))
			{
				// remove user from the revoked
				USERS_TO_REVOKE.pop(userId);
				// revoke the cookie
				this.revokeCookie(res);
				// Alert user
				return res.status(ERROR_400).json({error : "You have been disconnected by GRANTED user. Your cookie has been revoked."});
			}
			
			// asserts user exists in the database
			db.query(`SELECT * FROM GMM_USERS WHERE id=:l_userid`, {l_userid:userId}, (err, user, fields) => {
				if (err || !(user && user.length)){
					this.revokeCookie(res);
					return res.status(ERROR_400).json({error : "unabled to authentify the user - cookie revoked."});
				}
				// so we found "YOU"
				let l_user = JSON.parse(JSON.stringify(user[0]));

				// We do not want to spread your password !
				delete l_user.password;
				if (l_user.url_avatar)
					l_user.url_avatar = `${req.protocol}://${req.get('host')}/images/users/${l_user.url_avatar}`;
					
				// add new attributes for later use
				req._tokenUserId = userId;
				req._userPrivileges = privileges[l_user.id_privilege];
				res.locals.user = l_user;
				
				next();
				return;

			});
		}
		catch(err){
			res.locals.user = null;
			res.cookie('jwt', '', {maxAge:1});
		}
	}
	else {
		res.locals.user = null;
		res.status(200).json({'error' : "no token found"});
	}
};

module.exports.requireAuth = (req, res, next) => {
	const token = req.cookies.jwt;
	if (token) {
		webToken.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
			if (err){
				this.revokeCookie(res);
				return res.status(200).json({error : 'your token is invalid or corrupted.'});
			}
			else{
				next();
			}
		});
	} else {
		// no token;
		return res.status(200).json({error : 'no token found'});
	}
};

module.exports.revokeUser = (id) => {
	if (!USERS_TO_REVOKE.includes(id)) USERS_TO_REVOKE.push(id);
};

module.exports.revokeCookie = (res) => {
	// cookie set for 1ms (will be destroyed as soon as user get the response)
	res.cookie('jwt', '', {maxAge:1});
	res.locals.user = null;
};
