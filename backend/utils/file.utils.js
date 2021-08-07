exports.formatFileDateName = (prefix, suffix, ext) => {
	return `${prefix ? prefix+"_" : ""}${(new Date().toJSON().replace(/\D+/g, ''))}${suffix ? "_"+suffix : ""}.${ext}`;
};

const MIME_TYPES = ["image/jpg","image/jpeg","image/png"];
const MAX_FILE_SIZE = 2048000;
exports.validateFile = (req) => {
	let f=req.file; if (!f) return "";
	return (f && MIME_TYPES.includes(f.mimetype) && (f.size<MAX_FILE_SIZE)) ?
		f.filename.length>20 ? f.filename : "": ""; // length of filename : date + "." + ext + filename
}