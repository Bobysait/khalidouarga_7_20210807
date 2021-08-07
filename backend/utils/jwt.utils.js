const jwt		=	require('jsonwebtoken');

module.exports = {
	generateUserToken : function (userData){
		return jwt.sign(
			{ userId: userData.id,
			userRank : userData.id_rank },
			process.env.TOKEN_SECRET,
			{ expiresIn : '9h' }
		)
	},
	createToken : function (id) {
		return jwt.sign(
					{id},
					process.env.TOKEN_SECRET,
					{expiresIn: 9 * 60 * 60 * 1000}
				)
	}
}
