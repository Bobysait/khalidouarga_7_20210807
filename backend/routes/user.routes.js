/*jshint esversion: 9 */

// ... well ... express ... bla bla bla
const express = require('express');

// the router object to redirects "commands" from the front
const router = express.Router();
const userCtrl = require('../controllers/user.controller');

// for avatar management, multer !
const multer = require("../middleware/multer-config");
const { uploadDir } = require('../middleware/user.middleware');

router.get('/', userCtrl.getUsers);							// users
router.get('/:id', userCtrl.getUser);						// user profil

router.get('/:id/posts', userCtrl.getUserPosts);			// list of all posts from the user@id (topics and comments)
router.get('/:id/topics', userCtrl.getUserTopics);			// list of topics only started by the user@id

router.put('/:id', uploadDir, multer, userCtrl.editUser);	// edit user

router.put('/react/:id', userCtrl.react);					// user react to a post (topic or comment)

router.post('/logout/:id', userCtrl.logout);				// disconnect
router.delete('/:id', userCtrl.deleteUser);					// delete

module.exports = router;