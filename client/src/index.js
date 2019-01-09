import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.css";
import "./index.css";
import * as serviceWorker from './serviceWorker';
//
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//
import Login from "./components/login/Login"
import Admin from "./components/admin/Admin"
import Register from "./components/register/Register"
import Moderator from "./components/moderator/Moderator"
import Free from "./components/free/Free"

ReactDOM.render(
	<Router >
		<div>
			<Switch>
				<Route exact path="/" component={App} />
				<Route exact path="/login" component={Login} />
				<Route exact path="/admin" component={Admin} />
				<Route exact path="/register" component={Register} />
				<Route exact path="/moderador" component={Moderator} />
				<Route exact path="/free" component={Free} />
			</Switch>
		</div>
	</Router>, 
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
