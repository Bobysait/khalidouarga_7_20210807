/*jshint esversion: 9 */

// at least : lowercase, uppercase, numeric and special characters (without reserved characters) and should be at least 8 characters long
const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');

module.exports = {

	// asserts value is an integer
	testInt : function (pValue){
		pV = parseInt(pValue);
		return !isNaN(pV);
	},

	// asserts valid password (pMinSize must be at least 8 characters !)
	testPassword : function (pPass, pMinSize=8, pMaxSize=32) {
		if (!pPass) return -3;
		if (typeof(pPass)!="string") return -2;
		// remove spaces before and after characters
		let l_Pass = pPass.trim();
		if (l_Pass.length<pMinSize || l_Pass.length>pMaxSize) return -1;
		if (strongRegex.test(l_Pass)) return 2;
		return mediumRegex.test(l_Pass) ? 1 : 0;
	},

	// asserts name is a valid name
	testName : function (pName, pMinSize=3, pMaxSize=-1){
		// empty name : invalid
		if (!pName) return false;
		// remove spaces before and after characters
		let l_Name = pName.trim();
		// name too small ?
		if (l_Name.length<pMinSize) return false;
		// too long (if asked for limited name)
		if (pMaxSize>pMinSize && l_Name.length>pMaxSize) return false;
		// validate the characters using a regex
		return l_Name.match(/^(([a-zA-ZÀ-ÿ]+[\s\-]{1}[a-zA-ZÀ-ÿ]+)|([a-zA-ZÀ-ÿ]+))$/);
	},

	// asserts the email is valid
	testEmail : function (pMail){
		if (!pMail) return false;
		let l_Email = pMail.trim();
		if (l_Email.length<1) return false;
		const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(pMail);
	},
	
	// asserts the adress is valid
	testAddress : function (pAddress){
		if (!pAddress) return false;
		let l_Address = pAddress.trim();
		if (l_Address.length<1) return false;
		return l_Address.match(/^[#.0-9a-zA-Z\s,-]+$/);
	},

	// asserts the postal code is valid
	testCodePostal : function (pCP){
		return pCP.length>3 && pCP.length<6 && pCP.match(/^(0[1-9]{0,1}|[1-9][0-9]{0,1})[0-9]{0,3}$/);
	},

	validateDBText: function (t) {
		return t;//(t.replace("\\", "\\\\")).replace( "'", "\'" );
	},
	
	// objectid.isValid from bson library
	isValid: function(id) {
		if (typeof id === 'undefined') return false;
		if (id === null) {console.log("NULL"); return false;}
		if (typeof id === 'object') return true;
		if (typeof id === 'number') return true;
		if (!isNaN(parseInt(id))) return true;
		if (typeof id === 'string') return true;
		console.log("fail for type : "+(typeof id));
		return false;
	}
};