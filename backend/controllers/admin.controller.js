/*jshint esversion: 9 */

const db								=	require('../config/db');
const validator							=	require('../utils/validator.utils');
const privileges						=	require('../class/privileges.class');
const { ERROR_400, ERROR_401, ERROR_404 } =	require('../utils/errors.utils');
const fs								=	require('fs');
const spawn								=	require('child_process').spawn;
const { formatFileDateName }			=	require('../utils/file.utils');
const Checker							=	require('../utils/validator.utils');

exports.dumpDB = (req, res, next) => {
	if (!Checker.isValid(req._userPrivileges))return res.status(400).send("Malformed ID");

	// function only available to administrator !
	if (req._userPrivileges.isAdmin == false) {
		console.log({
			user_privileges : req._userPrivileges,
			admin_privileges : privileges.RANK_ADMIN
		});
		return res.status(400).json({error:"This is an administrator function only !"});
	}

	console.log("Dump Database");

	const dumpFileName					=	`./sql.dump/${formatFileDateName(process.env.DB_NAME,"","dump.sql")}`;
	const writeStream					=	fs.createWriteStream(dumpFileName);
	const dump							=	spawn('mysqldump', [ '-u', process.env.DB_USER, '-p'+process.env.DB_PASS, process.env.DB_NAME, ]);

	dump.stdout.pipe(writeStream)
	// on dump success
	.on('finish', function () {
		console.log('Dump Completed');
		return res.status(200).json({message : "Dump Complete !"});
	})
	// on dump failed
	.on('error', function (err) {
		console.log({message : "Dump Error", err});
		return res.status(400).json({message : "Dump Failed !", err});
	});


};