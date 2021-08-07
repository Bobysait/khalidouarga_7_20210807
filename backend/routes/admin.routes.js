/*jshint esversion: 9 */

// ... well ... express ... bla bla bla
const express = require('express');

// the router object to redirects "commands" from the front
const router = express.Router();
const adminCtrl = require('../controllers/admin.controller');
const { checkUser, requireAuth } = require('../middleware/auth.middleware');

router.post('/dump', adminCtrl.dumpDB);			// dump database

module.exports = router;