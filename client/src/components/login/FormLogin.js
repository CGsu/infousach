import React from "react";
import AuthService from "./../authorization/AuthService";

class FormLogin extends React.Component {
	constructor() {
		super();
		this.handleChange = this.handleChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.Auth = new AuthService();
		this.ambito = "/";
	}

	componentWillMount() {
		if (this.Auth.loggedIn()) {
			this.props.history.replace(this.ambito);
		}
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	handleFormSubmit(e) {
		e.preventDefault();

		this.Auth.login(this.state.correo, this.state.password)
			.then(res => {
				const profile = this.Auth.getProfile();
				if (profile.rol.nombre) {
					this.ambito = "/" + profile.rol.nombre;
				}
				else{
					this.Auth.logout();
				}
				this.props.history.replace(this.ambito);
			})
			.catch(err => {
				alert(err);
			})
	}

	render() {
		return (	
			<div className="modal-dialog text-center">
				<div className="col-sm-9 main-section">
					<div className="modal-content">
						<div className="col-12 user-img">
							<img src="img/logo_user.png" alt="user_logo"/>
						</div>
						<div id="alert" className="alert alert-danger" role="alert" style={{display: "none"}}>
  							Contraseña o password incorrectas. Vuelve a intentarlo.
						</div>
						<div className="col-12 form-input">
							<form onSubmit={this.handleFormSubmit}>
								<div className="form-group">
									<i className="fas fa-at ico-a"></i>
									<input name="correo" type="email" className="form-control" 
										onChange={this.handleChange} placeholder="ingresa email" required/>
								</div>
								<div className="form-group">
									<i className="fas fa-lock ico-a"></i>
									<input name="password" type="password" className="form-control" 
										onChange={this.handleChange} placeholder="ingresa password" required/>
								</div>
								<input type="submit" className="btn btn-success"
								 	value="Log in" />
							</form>
						</div>
						<div className="col-12 forgot">
							<small>InfoUsach - Desarrollado por Team Alpha</small>
						</div>
					</div>
				</div>	
			</div>
		);
	}
}

export default FormLogin;