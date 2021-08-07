/*jshint esversion: 9 */

class UserPrivileges {

	constructor (pPrivileges) {
		this.isOwner		=	pPrivileges.isOwner;
		this.isAdmin		=	pPrivileges.isAdmin;
		this.hasPrivileges	=	pPrivileges.hasPrivileges;
		this.create_message	=	pPrivileges.create_message;
		this.edit_message	=	pPrivileges.edit_message;
		this.view_message	=	pPrivileges.view_message;
		this.delete_message	=	pPrivileges.delete_message;
		this.edit_profil	=	pPrivileges.edit_profil;
		this.view_profil	=	pPrivileges.view_profil;
		this.delete_profil	=	pPrivileges.delete_profil;
		this.disconnect		=	pPrivileges.disconnect;
	}

}

const RANK_OWNER = new UserPrivileges({
	isOwner : true,
	isAdmin : true,
	hasPrivileges : true,
	create_message : 1,
	edit_message : 2,
	view_message : 2,
	delete_message : 2,
	edit_profil : 2,
	view_profil : 2,
	delete_profil : 2,
	disconnect : 2
});

const RANK_ADMIN = new UserPrivileges({
	isOwner : false,
	isAdmin : true,
	hasPrivileges : true,
	create_message : 1,
	edit_message : 2,
	view_message : 2,
	delete_message : 2,
	edit_profil : 2,
	view_profil : 2,
	delete_profil : 2,
	disconnect : 2
});

const RANK_MODERATOR = new UserPrivileges({
	isOwner : false,
	isAdmin : false,
	hasPrivileges : true,
	create_message : 1,
	edit_message : 2,
	view_message : 2,
	delete_message : 2,
	edit_profil : 2,
	view_profil : 2,
	delete_profil : 2,
	disconnect : 2
});

const RANK_USER = new UserPrivileges({
	isOwner : false,
	isAdmin : false,
	hasPrivileges : false,
	create_message : 1,
	edit_message : 1,
	view_message : 2,
	delete_message : 1,
	edit_profil : 1,
	view_profil : 2,
	delete_profil : 1,
	disconnect : 1
});

const RANK_VISITOR = new UserPrivileges({
	isOwner : false,
	isAdmin : false,
	hasPrivileges : false,
	create_message : 0,
	edit_message : 0,
	view_message : 2,
	delete_message : 0,
	edit_profil : 0,
	view_profil : 0,
	delete_profil : 0,
	disconnect : 0
});


exports.ID_PRIVILEGE_OWNER		=	1;
exports.ID_PRIVILEGE_ADMIN		=	2;
exports.ID_PRIVILEGE_MODERATOR	=	3;
exports.ID_PRIVILEGE_USER		=	4;
exports.ID_PRIVILEGE_VISITOR	=	5;

exports.ID_ACCOUNT_ANONYMUS		=	4;

module.exports.privileges = [null, RANK_OWNER, RANK_ADMIN, RANK_MODERATOR, RANK_USER, RANK_VISITOR, null];