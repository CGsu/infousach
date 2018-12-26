import React from "react";

{/*Importamos componentes*/}
import { NavLogin } from "./NavLogin";
import { FormLogin } from "./FormLogin";

export class Login extends React.Component {
	render() {
		return (
			<div>
				<NavLogin />
				<FormLogin />
			</div>
		);
	}
}