/*jshint esversion: 9 */

// - IMPORT ENVIRONMENT -

	// http server
	const http = require('http');

	// manage configuration "constants"
	const dotenv		=	require('dotenv');

	// "load" configuration files
	dotenv.config({path:'./config/.env'});
	
	// application to run
	const app = require('./app');
	

// - CREATE MYSQL CLIENT -

	// connect database
	const db = require('./config/db');

	// use the groupomania database
//	db.query(`USE ${process.env.DB_NAME}`);

	
// - CREATE HTTP SERVER -

	// select a valid port
	const normalizePort = val => {
		const port = parseInt(val, 10);
		if (isNaN(port)) return val;
		if (port>=0) return port;
		return false;
	};

	const port = normalizePort(process.env.PORT || '3000');
	app.set('port', port);


	// manage server errors
	const errorHandler = error => {
		if (error.syscall !== 'listen') throw error;

		// "my" address
		const address = server.address();
		const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;

		switch (error.code){

			case 'EACCES':
				console.error(bind+' requires elevated privileges.');
				process.exit(1);
				break;

			case 'EADDRINUSE' :
				console.error(bind+' is already in use.');
				process.exit(1);
				break;

			default :
				throw error;
		}
	};

	// server listening
	const listenHandler = () => {
		const address = server.address();
			const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
			console.log('listening on '+bind);
	};


	const server = http.createServer(app);

	// set server "error-handler"
		server.on('error', errorHandler);

	// sets the server callback
		server.on('listening', listenHandler);


// - HTTP SERVER LISTEN -

	// start listening on server
	server.listen(port);