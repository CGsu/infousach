import React, { Component } from "react";
import AuthService from './../authorization/AuthService';
import withAuth from './../authorization/withAuth';
const Auth = new AuthService();


class Moderador extends Component {

	constructor() {
		super();
		this.ambito = "/moderador";
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

export default withAuth(Moderador);