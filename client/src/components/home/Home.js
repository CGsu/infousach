import React, { Component } from "react";
import { Route } from "react-router-dom";
import NavHome from "./NavHome";
import HeaderHome from "./HeaderHome";
// Importamos css del home
import "./estiloHome.css";
import "./formLogin.css";
// Importamos imagenes del home
import frontis from "./img/frontis.jpg";
import profile1 from "./img/rodolfo.jpg";
import profile2 from "./img/gonzalo.png";
import profile3 from "./img/ricardo.png";
import profile4 from "./img/elias.jpg";
import profile5 from "./img/bryan.png";
import profile6 from "./img/saji.png";

class Home extends Component {

	render() {
		return (
			<div>
				<Route component={NavHome}/>
				<Route component={HeaderHome}/>

				<button id="myBtn" title="Go to top">Volver al inicio</button>
				<div>
					{/*Para ir al top */}
			        <div className="container-fluid seccion1" id="features">
			          <div className="row">
			            <div className="col center-block m-5 md-6" id="platinum">
			              <h1 className="display-4 ubold">Características </h1>
			              <p className="lead">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse aliquam egestas commodo. Morbi quis semper quam, nec bibendum nibh. In hac habitasse platea dictumstdsfdsf. Mauris interdum mollis tincidunt. Suspendisse sagittis risus nibh, et tincidunt arcu sodales id. Nullam congue rhoncus eros, vel tristique nisi. Nullam fringilla tincidunt odio. Donec lacinia, ex nec iaculis molestie, mauris dolor molestie erat, eget egestas diam mi et ligula. .</p>
			            </div>
			            <div className="col-md-6">
			              <img src={frontis} className=" mask1" />
			            </div>
			          </div>
			        </div>

			        <section id="about" className="pb-5">
			        	<div className="profiles-container">
				         	<div className="container">
				         		<h5 className="section-title h1 display-1 text-center arial">Quienes somos</h5>
				         		<div className="row">
					            	{/* Team member */}
					            	<div className="col-xs-12 col-sm-6 col-md-4">
					            		<div className="image-flip">
					            			<div className="mainflip">
					            				<div className="frontside">
					            					<div className="card home-card">
					            						<div className="card-body text-center">
					                          				<p><img className="rounded-circle img-fluid" src={profile1} alt="card image" /></p>
										                    <h4 className="card-title">Rodolfo Zúñiga</h4>
										                    <p className="card-text">This is basic card with image on top, title, description and button.</p>
										                    <span><small>correo@usach.cl</small></span>
					                        			</div>
					            					</div>
					            				</div>
					            			</div>
					            		</div>
					            	</div>
					            	{/* Team member */}
					            	<div className="col-xs-12 col-sm-6 col-md-4">
					            		<div className="image-flip">
					            			<div className="mainflip">
					            				<div className="frontside">
					            					<div className="card home-card">
					            						<div className="card-body text-center">
					                          				<p><img className="rounded-circle img-fluid" src={profile2} alt="card image" /></p>
	                          								<h4 className="card-title">Gonzalo Flores</h4>
	                          								<p className="card-text">This is basic card with image on top, title, description and button.</p>
	                          								<span><small>correo@usach.cl</small></span>
					                        			</div>
					            					</div>
					            				</div>
					            			</div>
					            		</div>
					            	</div>
					            	{/* Team member */}
					            	<div className="col-xs-12 col-sm-6 col-md-4">
					            		<div className="image-flip">
					            			<div className="mainflip">
					            				<div className="frontside">
					            					<div className="card home-card">
					            						<div className="card-body text-center">
					                          				<p><img className="rounded-circle img-fluid" src={profile3} alt="card image" /></p>
	                          								<h4 className="card-title">Ricardo Aedo</h4>
	                          								<p className="card-text">This is basic card with image on top, title, description and button.</p>
	                          								<span><small>correo@usach.cl</small></span>
					                        			</div>
					            					</div>
					            				</div>
					            			</div>
					            		</div>
					            	</div>
					            	{/* Team member */}
					            	<div className="col-xs-12 col-sm-6 col-md-4">
					            		<div className="image-flip">
					            			<div className="mainflip">
					            				<div className="frontside">
					            					<div className="card home-card">
					            						<div className="card-body text-center">
					                          				<p><img className="rounded-circle img-fluid" src={profile4} alt="card image" /></p>
	                          								<h4 className="card-title">Elías Gárate</h4>
	                          								<p className="card-text">This is basic card with image on top, title, description and button.</p>
	                          								<span><small>correo@usach.cl</small></span>
					                        			</div>
					            					</div>
					            				</div>
					            			</div>
					            		</div>
					            	</div>
					            	{/* Team member */}
					            	<div className="col-xs-12 col-sm-6 col-md-4">
					            		<div className="image-flip" >
					            			<div className="mainflip">
					            				<div className="frontside">
					            					<div className="card home-card">
					            						<div className="card-body text-center">
					                          				<p><img className="rounded-circle img-fluid" src={profile5} alt="card image" /></p>
	                          								<h4 className="card-title">Bryan Núñez</h4>
	                          								<p className="card-text">This is basic card with image on top, title, description and button.</p>
	                          								<span><small>correo@usach.cl</small></span>
					                        			</div>
					            					</div>
					            				</div>
					            			</div>
					            		</div>
					            	</div>
					            	{/* Team member */}
					            	<div className="col-xs-12 col-sm-6 col-md-4">
					            		<div className="image-flip">
					            			<div className="mainflip">
					            				<div className="frontside">
					            					<div className="card home-card">
					            						<div className="card-body text-center">
					                          				<p><img className="rounded-circle img-fluid" src={profile6} alt="card image" /></p>
	                          								<h4 className="card-title">Claudio Saji</h4>
	                          								<p className="card-text">This is basic card with image on top, title, description and button.</p>
	                          								<span><small>correo@usach.cl</small></span>
					                        			</div>
					            					</div>
					            				</div>
					            			</div>
					            		</div>
					            	</div>
					            </div>
				         	</div>
			        	</div>
			        	<div className="container-fluid seccion1" style={{backgroundColor: 'black'}} id="contact">
			        		<h1 className="section-title h1 display-1 text-center arial">Contacto</h1>
            				<div className="container-fluid cont1">  
            					<form id="contact"  method="post">
            						<h3>Ingresa la información para contactarnos.</h3>
            						<fieldset>
                  						<input placeholder="Nombre" type="text" tabIndex={1} required autoFocus />
                					</fieldset>
                					<fieldset>
                  						<input placeholder="Correo" type="email" tabIndex={2} required />
                					</fieldset>
                					<fieldset>
                  						<input placeholder="Telefono (opcional)" type="tel" tabIndex={3} required />
                					</fieldset>
                					<fieldset>
                  						<input placeholder="Tu sitio web (opcional)" type="url" tabIndex={4} required />
                					</fieldset>
                					<fieldset>
                  						<textarea placeholder="Escribe tu comentario, sugerencia, duda, etc...." tabIndex={5} required defaultValue={""} />
                					</fieldset>
                					<fieldset>
                  						<button name="submit" type="submit" id="contact-submit" data-submit="...Enviando">Enviar</button>
                					</fieldset>
            					</form>
            				</div>
			        	</div>
			        </section>
			        <footer>

			        </footer>
			    </div>
			</div>
		);
	}
}

export default Home;