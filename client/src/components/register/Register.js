import React, { Component } from "react";
import AuthService from './../authorization/AuthService';
import withAuth from './../authorization/withAuth';
import "./register.css";
const Auth = new AuthService();

class Register extends Component {
	constructor() {
		super();
		this.ambito = "/register";
		this.state = {
			userNombre: "",
			userApellido: "",
			userCorreo: "",
			sideNavBar: "active",
			mOpcion: "0", 
			menuActivo: "Mostrar Menú"
		};
		this.changeOption = this.changeOption.bind(this);
	}

	componentWillMount() {
		const profile = Auth.getProfile();
		this.setState({
			userNombre: profile.nombre,
			userCorreo: profile.correo,
			userApellido: profile.apellido
		});
		console.log(profile);
	}

	handleLogout(){
    	Auth.logout()
    	this.props.history.replace('/login');
  	}

  	changeSideNavBar() {
  		let arg = "active";
  		let msgBtn = "Mostrar Menú";
  		if (this.state.sideNavBar === "active") {
  			arg = "";
  			msgBtn = "Ocultar Menú";
  			this.state.sideNavBar = "";
  		}
  		this.setState({
  			sideNavBar: arg,
  			menuActivo: msgBtn
  		});
  	}

  	renderOption() {
  		if (this.state.mOpcion === "0") {
  			return (<h1>Bienvenido</h1>);
  		}
  	}

  	changeOption(e) {
  		this.setState({
  			mOpcion: e.target.name
  		});
  	}

	render() {
		return (
			<div className="register-body">
				<div className="wrapper register-wrapper">
					<nav id="register-sidebar" className={this.state.sideNavBar}>
						<div className="sidebar-header register-sidebar-header">
							<h3>Panel del Register InfoUsach</h3>
						</div>
						<ul className="list-unstyled components">
							<li>
								<button name="0" className="perfil menu-op register-btn-options register-button"
									onClick={this.changeOption.bind(this)}
								>
									Acordeon
								</button>
							</li>
						</ul>
					</nav>

					<div id="register-content">
						<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
							<div className="container-fluid">
								<button type="button" onClick={this.changeSideNavBar.bind(this)} className="btn btn-info">
									<i className="fas fa-align-left"></i>
									<span>{this.state.menuActivo}</span>
								</button>
								<div className="collapse navbar-collapse">
									<ul className="nav navbar-nav ml-auto">
										<li className="nav-item">
		                                	<span className="nav-link register-span" onClick={this.handleLogout.bind(this)}>Cerrar Sesión</span>
		                            	</li>
									</ul>
								</div>
							</div>
						</nav>

						<div id="register-content-option" className="container-fluid container-options d-flex justify-content-center align-items-start wraper board-work">
							{this.renderOption()}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withAuth(Register);