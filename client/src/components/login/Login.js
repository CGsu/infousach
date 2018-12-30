import React, { Component } from "react";
import { Route } from "react-router-dom";
import NavLogin from "./NavLogin";
import FormLogin from "./FormLogin";
import "./formlogin.css";

class Login extends Component {
	render() {
		return (
			<div>
				<Route component={NavLogin}/>
				<Route component={FormLogin}/>
			</div>
		);
	}
}

export default Login;