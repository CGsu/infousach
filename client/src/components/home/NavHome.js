import React from "react";
import { Link } from "react-router-dom";

class NavHome extends React.Component {
	render() {
		return (
			<nav className="navbar navbar-expand-lg navbar-dark bg-dark home-nav nav-home">
				<Link to={"/"} className="navbar-brand">
				InfoUsach
				</Link>

				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarText">
					<ul className="navbar-nav ml-auto">
						<li className="nav-item">
	        				<Link to={"/"} className="nav-link"><span className="nav-text">Home</span></Link>
	      				</li>
	      				<li className="nav-item">
	        				<a href="#features" className="nav-link"><span className="nav-text">Características</span></a>
	      				</li>
	      				<li className="nav-item">
	        				<a href="#about" className="nav-link"><span className="nav-text">Sobre nosotros</span></a>
	      				</li>
	      				<li className="nav-item">
	        				<a href="#contact" className="nav-link"><span className="nav-text">Contacto</span></a>
	      				</li>
	      				<li className="nav-item">
	        				<a href="#" className="nav-link"><span className="nav-text">Ver Mapa</span></a>
	      				</li>
	      				<li className="nav-item">
	        				<Link to={"/login"} className="nav-link"><span className="nav-text">Log In</span></Link>
	      				</li>
					</ul>
				</div>
			</nav>
		);
	}
}

export default NavHome;