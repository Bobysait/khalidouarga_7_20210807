/*jshint esversion: 9 */

exports.ERROR_400				=	200;
exports.ERROR_401				=	200;
exports.ERROR_402				=	200;
exports.ERROR_403				=	200;
exports.ERROR_404				=	200;

module.exports.TypedError = (errType, errName) => {
	return {errType : errType, error:errName};
};

