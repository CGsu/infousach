import React, { Component } from 'react';
import AuthService from './AuthService';

export default function withAuth(AuthComponent) {
    // Code here now
    const Auth = new AuthService('http://localhost:4000');
    return class AuthWrapped extends Component {
        // Code here now
        constructor() {
    		super();
    		this.state = {
        		user: null
    		}
		}

		componentWillMount() {
    		if (!Auth.loggedIn()) {
        		this.props.history.replace('/login')
    		}
    		else {
        		try {
            		const profile = Auth.getProfile();
                    let ambito = "/";
                    if (profile.rol.nombre) {
                        ambito += profile.rol.nombre;
                        this.props.history.replace(ambito);
                    } else {
                        Auth.logout();
                    }
            		this.setState({
                		user: profile
            		})
        		}
        		catch(err){
            		Auth.logout()
            		this.props.history.replace('/login')
        		}
    		}
		}

		 render() {
    		if (this.state.user) {
        		return (
            		<AuthComponent history={this.props.history} user={this.state.user} />
        		)
    		}
    		else {
        		return null
    		}
    	}
    }
}