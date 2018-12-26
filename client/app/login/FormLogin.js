import React from "react";

export class FormLogin extends React.Component {
	render() {
		return (	
			<div className="modal-dialog text-center">
				<div className="col-sm-9 main-section">
					<div className="modal-content">
						<div className="col-12 user-img">
							<img src="img/logo_user.png" alt="user_logo"/>
						</div>
						<div className="col-12 form-input">
							<form>
								<div className="form-group">
									<i className="fas fa-at ico-a"></i>
									<input type="email" className="form-control" placeholder="ingresa email" required/>
									<div className="invalid-feedback">Campo requerido.</div>
								</div>
								<div className="form-group">
									<i className="fas fa-lock ico-a"></i>
									<input type="password" className="form-control" placeholder="ingresa password" required/>
									<div className="invalid-feedback">Campo requerido.</div>
								</div>
								<button type="submit" className="btn btn-success">Login</button>
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