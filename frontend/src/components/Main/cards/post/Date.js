import React from 'react';

// format dates
const convertDate = (dt, withTime=true) => {
	if (!(dt && dt.length>=(withTime?19:10))) return "";
	let l_year = dt.slice(0,4);
	let l_mth = ["Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Decembre"][dt.slice(5,7)-1];
	let l_day = dt.slice(8,10);
	return l_day+" "+l_mth+" "+l_year + (withTime ? " à "+dt.slice(11,19).replace(":", "h") : "");
}

const Date = (props) => {
	
	const {post} = props;

	return (
		<span className="card-date">posté le {convertDate(post.createdAt,true)} </span>
	);
};

export default Date;