import React from "react";
import { Link } from "react-router";

export class NavLogin extends React.Component {
	render() {
		return(
			<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
				<Link to={"/"} className="navbar-brand">
				InfoUsach
				</Link>
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarText">
					<ul className="navbar-nav ml-auto">
						<li className="nav-item">
	        				<Link to={"/"} className="nav-link">Home</Link>
	      				</li>
	      				<li className="nav-item">
	        				<Link to={"/"} className="nav-link">Ver Mapa</Link>
	      				</li>
					</ul>
				</div>
			</nav>
		);
	}
}