/*jshint esversion: 9 */

module.exports.uploadDir = (req, res, next) => {
	req.specialDir = 'images/posts';
	next();
};