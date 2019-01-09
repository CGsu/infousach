import React from "react";

class HeaderHome extends React.Component {
	render() {
		return (
			<header className="text-success text-center home-header">
				<div className="container">
					<img className="image-responsive profile" src="img/logo_infousach.png" width="300" height="400" alt="" />
					<h1 className="text-uppercase mb-0">Eventos de la universidad en tiempo real</h1>
					<hr className="home-hr" />
					<h2 className="font-weight-light mb-0">
				Una aplicación desarrollada por el team ALPHA
					</h2>
				</div>
			</header>
		);
	}
}

export default HeaderHome;