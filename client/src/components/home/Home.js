import React, { Component } from "react";
import { Route } from "react-router-dom";
import NavHome from "./NavHome";
import HeaderHome from "./HeaderHome";
import "./estiloHome.css";

class Home extends Component {
	render() {
		return (
			<div>
				<Route component={NavHome}/>
				<Route component={HeaderHome}/>
			</div>
		);
	}
}

export default Home;