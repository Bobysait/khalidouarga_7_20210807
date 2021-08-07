/*jshint esversion: 9 */

const mysql		=	require('mysql');

const db		=	mysql.createConnection	({
												host     : process.env.DB_HOST,
												user     : process.env.DB_USER,
												password : process.env.DB_PASS,
												multipleStatements: true
											});
if (db) {
	db.config.queryFormat = function (query, values) {
		if (!values) return query;
		return query.replace(/\:(\w+)/g, function (txt, key) {
			if (values.hasOwnProperty(key)) return this.escape(values[key]);
			return txt;
		}.bind(this));
	};

	db.parseSqlResult = function (obj) { return JSON.parse(JSON.stringify(obj[0])); };
	db.removeSqlColumn = function (o,c){ delete o[0][c]; return o; };
	
	db.connect((err)=>{
		if (err) throw err;
		console.log("CONNECTION ESTABLISHED");
	});

	db.query(`USE ${process.env.DB_NAME}`);

	module.exports = db;

}else{
	throw "/!\\ UNABLED TO ESTABLISH CONNECTION TO DATABASE !";
}