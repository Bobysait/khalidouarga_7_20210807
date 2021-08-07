/*jshint esversion: 9 */

// ... well ... express ... bla bla bla
const express = require('express');

// the router object to redirects "commands" from the front
const router = express.Router();
const postCtrl = require('../controllers/post.controller');

const multer = require("../middleware/multer-config");
const { uploadDir } = require('../middleware/post.middleware');

//Posts
router.post('/', uploadDir, multer, postCtrl.addTopic);			// start a new topic
router.post('/:id', uploadDir, multer, postCtrl.addComment);	// comment on topic@id


router.get('/trendings', postCtrl.getTrendings);				// list of trending topics
router.get('/', postCtrl.getTopics);							// list of topics (url.params send {limit,offset})
router.get('/:id', postCtrl.getTopic);							// returns the specific topic

router.get('/:id/comments', postCtrl.getComments);				// list of comments for the topic
router.get('/:id/:commentid', postCtrl.getComment);				// returns a specific comment from a topic

router.put('/:id', uploadDir, multer, postCtrl.editPost);		// edit the post (topic or comment)


router.delete('/:id', postCtrl.deletePost);						// remove post @id

module.exports = router;