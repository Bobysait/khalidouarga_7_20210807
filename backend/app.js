/*jshint esversion: 9 */

// - IMPORTS ENVIRONMENT -

	// CORS
	const cors				=	require('cors');

	// express library makes node server easier to build
	const express			=	require('express');

	// enables to read cookies
	const cookieParser		=	require('cookie-parser');

	// security toolkit
	const helmet			=	require("helmet");

	// manage configuration "constants"
	const dotenv			=	require('dotenv');
	
	// files and directories utilities
	const path				=	require('path');

	// "load" configuration files
	dotenv.config				( {path:'./config/.env'} );
	
	
// - CREATES APP AND STACK REQUEST LAYERS -

	const app				=	express();

	// apply security layer
	app.use						( helmet() );

	// Enables cross-origin
	const corsOptions		=	{
									origin: process.env.CLIENT_URL,
									credentials: true,
									'allowedHeaders': ['sessionId', 'Content-Type'],
									'exposedHeaders': ['sessionId'],
									'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
									'preflightContinue': false
								};
	app.use						( cors(corsOptions) );
	//app.use						( cors() );
	

// - MANAGES ROUTES -
	
	// import routes for collections
	const authRoutes		=	require('./routes/auth.routes');
	const adminRoutes		=	require('./routes/admin.routes');
	const userRoutes		=	require('./routes/user.routes');
	const postRoutes		=	require('./routes/post.routes');
	
	const {checkUser}		=	require('./middleware/auth.middleware');
	
	// for url parameters
	app.use						( express.urlencoded({extended:true}) );

	// for POST/PUT request -> used to decode req.body content
	app.use						( express.json() );
	
	// read cookie
	app.use						( cookieParser() );

	// manage attachments
	app.use						( '/images', express.static(path.join(__dirname,'images')) );

	// Routes
	app.use						( '/api/auth', authRoutes );
	app.use						( '/api/admin', checkUser, adminRoutes );
	app.use						( '/api/user', checkUser, userRoutes );
	app.use						( '/api/post', checkUser, postRoutes );
	

module.exports = app;