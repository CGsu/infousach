import React, { Component } from "react";
import AuthService from './../authorization/AuthService';
const Auth = new AuthService();

class Register extends Component {

	constructor() {
		super();
	}

	handleLogout(){
    	Auth.logout()
    	this.props.history.replace('/login');
  	}

	render() {
		return (
			<div>
				ESTAS EN LA ZONA DEL Register!
				<button type="button" className="form-submit" onClick={this.handleLogout.bind(this)}>Logout</button>
			</div>
		);
	}
}

export default Register;