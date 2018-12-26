import React from "react";
import { render } from "react-dom";
import { Router, Route, browserHistory, IndexRoute } from "react-router";

{/*Componentes*/}
import { App } from "./app/home/Home";
import { Login } from "./app/login/Login";

render (
	(
		<div>
			<Router history={browserHistory}>
				<Route path={"/"} component={App} />
				<Route path={"/login"} component={Login} />
			</Router>
		</div>
	),
	window.document.getElementById("app")
);