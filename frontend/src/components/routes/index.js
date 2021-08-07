import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import Home from "../../pages/Home";
import About from "../../pages/About";
import Profil from "../../pages/Profil";
import Trending from "../../pages/Trending";
import NotFound from "../../pages/NotFound";
import SignIn from "../../pages/SignIn";
import SignUp from "../../pages/SignUp";
import Logout from "../../pages/Logout";
import ViewTopic from "../../pages/ViewTopic";

const index = ({database}) => {
	
	return (
		<Router>
			<Switch>
				<Route path="/" exact render={(props) => <Home {...props} database={database} />} />
				<Route path="/about" exact render={(props) => <About {...props} database={database} />} />
				<Route path="/user" exact render={(props) => <Profil {...props} database={database} editable="true" />} />
				<Route path="/user/:id" exact render={(props) => <Profil {...props} database={database} />} />
				<Route path="/signin" exact render={(props) => <SignIn {...props} database={database} />} />
				<Route path="/signup" exact render={(props) => <SignUp {...props} database={database} />} />
				<Route path="/logout" exact render={(props) => <Logout {...props} database={database} />} />
				<Route path="/topic/:id" exact render={(props) => <ViewTopic {...props} database={database} />} />
				<Route path="/trending" exact render={(props) => <Trending {...props} database={database} />} />
				<Route component={NotFound} />
				<Redirect to="/" />
			</Switch>
		</Router>
	);
};

export default index;