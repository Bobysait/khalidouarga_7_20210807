/*jshint esversion: 9 */

// ... well ... express ... bla bla bla
const express = require('express');
const multer = require('multer');

// the router object to redirects "commands" from the front
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');
const { checkUser, requireAuth } = require('../middleware/auth.middleware');
const { uploadDir } = require('../middleware/user.middleware');

router.post('/signup', authCtrl.signUp);		// create
router.post('/signin', authCtrl.signIn);		// connect
router.get('/jwtid', checkUser, requireAuth, authCtrl.jwtid);	// get jwt id

module.exports = router;