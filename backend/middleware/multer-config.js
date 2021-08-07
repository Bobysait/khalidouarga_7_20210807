/*jshint esversion: 9 */

const multer = require('multer');
const { formatFileDateName } = require('../utils/file.utils');
const MIME_TYPES = {
	'image/jpg' : 'jpg',
	'image/jpeg' : 'jpg',
	'image/png' : 'png'
};

// middleware that stores image files on the server
const storage = multer.diskStorage(
	{
		destination : (req, file, callback) => {
			callback(null, req.specialDir ? req.specialDir : 'images');
		},
		
		filename : (req, file, callback) => {
			const name = file.originalname.split(" ").join('_');
			const extension = MIME_TYPES[file.mimetype];
			callback(null, formatFileDateName("", name, extension));
		}
	}
);

module.exports = multer({storage}).single('image');
