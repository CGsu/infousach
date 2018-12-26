import React from "react";

{/*Importamos componentes*/}
import { NavHome } from "./NavHome";
import { HeaderHome } from "./HeaderHome";

export class App extends React.Component {
	render() {
		return( 
			<div>
				<NavHome />
				<HeaderHome /> 
			</div>
		);
	}
}