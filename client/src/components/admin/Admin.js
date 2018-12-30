import React, { Component } from "react";
import AuthService from './../authorization/AuthService';
import withAuth from './../authorization/withAuth';
const Auth = new AuthService();


class Admin extends Component {

	constructor() {
		super();
		this.ambito = "/admin";
	}

	handleLogout(){
    	Auth.logout()
    	this.props.history.replace('/login');
  	}

	render() {
		return (
			<div>
				ESTAS EN LA ZONA DEL ADMINISTRADOR!
				<button type="button" className="form-submit" onClick={this.handleLogout.bind(this)}>Logout</button>
			</div>
		);
	}
}

export default withAuth(Admin);