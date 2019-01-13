import React, { Component } from "react";
import L from "leaflet";
import { 
	Map, 
	Marker, 
	Popup, 
	TileLayer, 
	Polygon } from 'react-leaflet';
import Modal from "react-modal";
import AuthService from './../authorization/AuthService';
import withAuth from './../authorization/withAuth';
import "./register-map.css";
import "./register.css";
const Auth = new AuthService();

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    border: "none",
    background: "none"
  },
  overlay: {zIndex: 1000}
};

const btnMapStyles = {
		backgroundColor: "#128a12",
		color: "white",
		fontWeight: "none",
		boxShadow: "none",
		textShadow: "none",
		border: "1px solid black"
};

const iconToiletOn = L.icon({
	iconUrl: "img/icon/toilet_on.svg",
	iconSize: [25, 35],
	iconAnchor: [15, 35],
	popupAnchor: [0, -35],
	name: "baño"
});
const iconToiletOff = L.icon({
	iconUrl: "img/icon/toilet_off.svg",
	iconSize: [35, 40],
	iconAnchor: [17.5, 35],
	popupAnchor: [0, -35],
	name: "baño"
});

const iconApartmentOn = L.icon({
	iconUrl: "img/icon/apartment_on.svg",
	iconSize: [25, 35],
	iconAnchor: [15, 35],
	popupAnchor: [0, -35]
});
const iconApartmentOff = L.icon({
	iconUrl: "img/icon/apartment_off.svg",
	iconSize: [35, 40],
	iconAnchor: [17.5, 35],
	popupAnchor: [0, -35]
});

const iconClassroomOn = L.icon({
	iconUrl: "img/icon/classroom_on.svg",
	iconSize: [25, 35],
	iconAnchor: [15, 35],
	popupAnchor: [0, -35]
});
const iconClassroomOff = L.icon({
	iconUrl: "img/icon/classroom_off.svg",
	iconSize: [35, 40],
	iconAnchor: [17.5, 35],
	popupAnchor: [0, -35]
});

const iconEdificioOn = L.icon({
	iconUrl: "img/icon/edificio_on.svg",
	iconSize: [25, 35],
	iconAnchor: [15, 35],
	popupAnchor: [0, -35]
});
const iconEdificioOff = L.icon({
	iconUrl: "img/icon/edificio_off.svg",
	iconSize: [35, 40],
	iconAnchor: [17.5, 35],
	popupAnchor: [0, -35]
});

const iconDefaultOn = L.icon({
	iconUrl: "img/icon/default_on.svg",
	iconSize: [25, 35],
	iconAnchor: [15, 35],
	popupAnchor: [0, -35]
});
const iconDefaultOff = L.icon({
	iconUrl: "img/icon/default_off.svg",
	iconSize: [35, 40],
	iconAnchor: [17.5, 35],
	popupAnchor: [0, -35]
});

const colores = ["#1fa22e", "#ee7f00", "#fdc300", "#e2001a", 
				 "#b1c800", "#009ee0", "#a64d94", "#00978f" ];

Modal.setAppElement("#lanzador-modal");

class RegisterMap extends Component {
	constructor(props) {
		super();
		this.state = {
			usuario: props.usuario,
			location: {
				lat: -33.4482,
	      		lng: -70.6845	
			},
			config: {
				tiles: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
				zoom: 16
			},
      		modals: {
				modalCrearMap: false,
				modalModificarMap: false,
				modalEliminarMap: false,
				modalAsociar: false
      		},
      		filter: {
      			high: false,
      			low: false
      		},
			sectores: [],
			onSector: [true, true, true, true, true, true, true, true],
			infoSector: {
				id: "",
				state: false,
				name: ""
			},
			tipolocation: [],
			lastCoordinates: [],
			ordershigh: [],
			onMarkerHigh: [],
			orderslow: [],
			onMarkerLow: [],
			categorias: []
		};
		this.cargaSectores = this.cargaSectores.bind(this);
		this.cargaTipoUbicaciones = this.cargaTipoUbicaciones.bind(this);
		this.getTipoUbicaciones = this.getTipoUbicaciones.bind(this);
		this.cargaOrderHigh = this.cargaOrderHigh.bind(this);
		this.cargaOrderLow = this.cargaOrderLow.bind(this);
		this.cargaCategorias = this.cargaCategorias.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.getIcon = this.getIcon.bind(this);
		this.closeModalMap = this.closeModalMap.bind(this);
		this.onMapClick = this.onMapClick.bind(this);
		this.onPopupClick = this.onPopupClick.bind(this);
		this.onFilter = this.onFilter.bind(this);
	}

	componentWillMount() {
		this.cargaSectores();
		this.cargaTipoUbicaciones();
		this.cargaOrderHigh();
		this.cargaOrderLow();
		this.cargaCategorias();
	}

	handleLangChange () { 
		let value = {};
		value["op"] = 1;
		value["categorias"] = this.state.categorias;
		console.log(value); 
    } 

	cargaSectores() {
		let url = Auth.domain + "/location/sector";
		let options = {
			method: "GET"
		};	
		Auth.fetch(url, options)
		.then(result => {
			this.setState({sectores: result.sectores});
		})
		.catch(err => console.log(err));
	}

	cargaOrderHigh() {
		let url = Auth.domain + "/location/orderhigh";
		let options = {
			method: "GET"
		};

		Auth.fetch(url, options)
		.then(result => {
			let a = [];
			for(let i = 0; i < result.count; i++) {
				a.push(false);
			}
			this.setState({ordershigh: result.ordershigh, onMarkerHigh: a});
		})
		.catch(err => console.log(err));
	}

	cargaOrderLow() {
		let url = Auth.domain + "/location/orderlow";
		let options = {
			method: "GET"
		};
		
		Auth.fetch(url, options)
		.then(result => {
			let a = [];
			for(let i = 0; i < result.count; i++) {
				a.push(false);
			}
			this.setState({orderslow: result.orderslow, onMarkerLow: a});
		})
		.catch(err => console.log(err));
	}

	cargaTipoUbicaciones() {
		let url = Auth.domain + "/tipolocation";
		let options = {
			method: "GET"
		}; 
		Auth.fetch(url, options)
		.then(result => {
			this.setState({tipolocation: result.Ubicaciones});
		})
		.catch(err => console.log(err));
	}

	cargaCategorias() {
		let url = Auth.domain + "/categorias"
		let options = { method: "GET"};
		Auth.fetch(url, options)
		.then(result => {
			this.props.onGetCategorias(result);
			this.setState({
				categorias: result.Categorias
			});
		})
		.catch(err => console.log(err));
	}

	handleChange(e) {
		const { name, value } = e.target;
		this.setState({
			[name]: value
		});
	}

	onMapClick(e) {

	}

	closeModalMap(e) {
		const nameModal = e.target.getAttribute("name");
		if (nameModal === "crear") {
			this.setState({
				modals: {
					...this.state.modals,
					modalCrearMap: false
				}
			});
		} else if (nameModal === "update") {
			this.setState({
				modals: {
					...this.state.modals
				}
			});
		} else if (nameModal === "borrar") {
			this.setState({
				modals: {
					...this.state.modals
				}
			});
		}

		else if (nameModal === "asociar") {
			this.setState({
				modals: {
					...this.state.modals,
					modalAsociar: false
				}
			});
		}
	}

	onPopupClick(e) {
		if (this.state.control.opcionActualizar) {
			this.setState({
				modals: {
					...this.state.modals,
					modalModificarMap: true
				}
			});
		} else if (this.state.control.opcionEliminar) {
			this.setState({
				modals: {
					...this.state.modals,
					modalEliminarMap: true
				}
			});
		}
	}

	onSector(e) {
		const descripcion = e.target.options.descriptyon;
		const num_sector = e.target.options.name;
		const key_sector = e.target.options.value;
		const newOnSector = this.state.onSector;
		newOnSector[num_sector] = false;
		this.setState({
			onSector: newOnSector, 
			infoSector: {
				state: true, name: descripcion, id: key_sector
			}
		});
	}

	onSectorOut(e) {
		const num_sector = e.target.options.name;
		const newOnSector = this.state.onSector;
		newOnSector[num_sector] = true;
		this.setState({
			onSector: newOnSector, 
			infoSector: {
				...this.state.infoSector,
				state: false, name: ""
			}
		});
	}

	getTipoUbicaciones() {
		return (
			this.state.tipolocation.map((tipo, i) => {
				return (
					<option key={i} value={[tipo.orden, tipo._id]}> {tipo.nombre}</option>
				)
			}));
	}

	getIcon(tipo, op) {
		if (tipo === "baño") return !op? iconToiletOn: iconToiletOff;
		if (tipo === "departamento") return !op? iconApartmentOn : iconApartmentOff;
		if (tipo === "edificio") return !op? iconEdificioOn : iconEdificioOff;
		if (tipo === "sala") return !op? iconClassroomOn : iconClassroomOff;
		return !op? iconDefaultOn : iconDefaultOff;
	}

	onFilter(e) {
		const tipo = e.target.getAttribute("name");
		if (tipo === "high") {
			this.setState({ filter: {...this.state.filter, high: !this.state.filter.high } })
		} else {
			this.setState({ filter: {...this.state.filter, low: !this.state.filter.low } })
		}
	}

	render() {
		const position = [this.state.location.lat, this.state.location.lng];
		return (
			<div className="admin-map">
				<Map className="admin-map-charge" center={position} zoom={this.state.config.zoom}
				 onClick={this.onMapClick.bind(this)}>
	        		<TileLayer
	          			url={this.state.config.tiles}
	          			attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
	        		/>
	        		{
	        			this.state.sectores.map((sector, i) => {
	        				return (
	        					<Polygon positions={sector.geometria} fillColor={colores[i]} opacity={1}
	        						weight={this.state.onSector[i] ? 2 : 5} 
	        						color={this.state.onSector[i] ? "white" : "#666"} 
	        						dashArray={this.state.onSector[i] ? 3 : ""}
	        						fillOpacity={this.state.onSector[i] ? 0.7 : 0.4} 
	        						onMouseOver={this.onSector.bind(this)} 
	        						onMouseOut={this.onSectorOut.bind(this)}
	        						name={i} value={sector._id}
	        						descriptyon={sector.descripcion} key={sector._id}
	        					/>
	        				);
	        			})
	        		}
	        		{
	        			!this.state.filter.high ?
	        			(
	        			this.state.ordershigh.map((oh, i) => {
	        				return (
	        					<Marker key={oh._id} position={oh.geometria}
	        						icon={this.getIcon(oh.tipo, this.state.onMarkerHigh[i])}	
	        						name={i} value={"high"}
	        					>
	        					<Popup>
	        						colocar contenido
	        					</Popup>
	        					</Marker>
	        				)
	        			})
	        			) : ""
	        		}
	        		{
	        			!this.state.filter.low ? 
	        			(
	        			this.state.orderslow.map((ol, i) => {
	        				return (
	        					<Marker key={ol._id} position={ol.geometria} 
	        						icon={this.getIcon(ol.tipo, this.state.onMarkerLow[i])}
	        						name={i} value={"low"} id={ol._id}
	        					>
	        					<Popup>
	        						<h1>{ol.nombre}</h1> <br/>
	        						<p>{ol.descripcion}</p>
	        						<p>{ol.tipo}</p>
	        					</Popup>
	        					</Marker>
	        				)
	        			})
	        			) : ""
	        		}
	      		</Map>

	      		<div className="control-sector-register">
	      			<h4>Sectores USACH</h4>
	      			{
	      				this.state.infoSector.state ? 
	      					<b>{this.state.infoSector.name}</b> : 
	      					"Posicionese sobre un sector"
	      			}
	      		</div>	

	      		<div className="control-ubicacion-register">
	      			<h4>Filtro Ubicaciones</h4>
	      			<hr/>
	      			<span className="control-map-admin-opt" name="high"
	        			style={this.state.filter.high ? btnMapStyles : {} }
	        			onClick={this.onFilter.bind(this)}
	        		>
	        			Quitar tipo 1
	        		</span>
	        		<br/>
	        		<span className="control-map-admin-opt" name="low"
	        			style={this.state.filter.low ? btnMapStyles : {} }
	        			onClick={this.onFilter.bind(this)}
	        		>
	        			Quitar tipo 2
	        		</span>
	      		</div>
        	</div>
		);
	}

}

class Register extends Component {
	constructor() {
		super();
		this.ambito = "/register";
		this.state = {
			usuario: {
				id: "",
				nombre: "",
				apellido: "",
				correo: "",
				evt_asociado: ""
			},
			controlSidebar: {
				content: "active",
				sideNavBar: "active",
				menuActivo: "Mostrar Menú"
			},
			modals: {
				modalAsociar: false
			},
			categorias: []

		};
		this.closeModalMap = this.closeModalMap.bind(this);
		this.onDetalle = this.onDetalle.bind(this);
		this.cargaCategorias = this.cargaCategorias.bind(this);
	}

	componentWillMount() {
		const profile = Auth.getProfile();
		this.setState({
			usuario: {
				id: profile._id,
				nombre: profile.nombre,
				apellido: profile.apellido,
				correo: profile.correo,
				evt_asociado: profile.evento_asociado
			}
		});
	}

	handleLogout() {
    	Auth.logout();
    	this.props.history.replace('/login');
  	}

  	cargaCategorias(data) {
  		console.log(data);
  		this.setState({categorias: data.Categorias});
  	}

  	closeModalMap(e) {
		const nameModal = e.target.getAttribute("name");
		if (nameModal === "asociar") {
			this.setState({
				modals: {
					...this.state.modals,
					modalAsociar: false
				}
			});
		}
	}

	onDetalle() {
		this.setState({
			modals: {
				modalAsociar: true
			}
		});
	}

  	changeSideNavBar() {
  		let arg = "active";
  		let msgBtn = "Mostrar Menú";
  		if (this.state.controlSidebar.sideNavBar === "active") {
  			arg = "";
  			msgBtn = "Ocultar Menú";
  			this.setState({
  				controlSidebar: {
  					...this.controlSidebar,
  					sideNavBar: ""
  				}
  			})
  		}
  		this.setState({
  			controlSidebar: {
  				content: arg,
  				sideNavBar: arg,
  				menuActivo: msgBtn
  			}
  		});
  	}

  	handleRegisterMap(value) {
  		const op = value.opcion;
  		if (op === 1) {
  			this.setState({categorias: value.categorias});
  		}
  	}

	render() {
		return (
			<div className="register-body">
				<div className="wraper register-wrapper">
					<nav id="register-sidebar" className={this.state.controlSidebar.sideNavBar} >
						<div className="sidebar-header register-sidebar-header">
							<h3>Bienvenid@ {this.state.usuario.nombre + " " + this.state.usuario.apellido}</h3>
						</div>
						<div id="accordion">
  							<div className="card">
    							<div className="card-header" id="headingOne">
      								<h5 className="mb-0">
        								<button className="perfil menu-op register-btn-options register-button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
          									Filtros
        								</button>
      								</h5>
    							</div>

							    <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
      								<div className="card-body">
	      								{
	      									this.state.categorias.map((categoria, i) => {
	      										return (
													<div key={i} className="custom-control custom-checkbox">
														<input defaultChecked type="checkbox" className="custom-control-input" id={categoria.name}></input>
														<label className="custom-control-label" htmlFor={categoria.name}>{categoria.name}</label>
													</div>
	      										);
	      									})
	      								}
						      		</div>
    							</div>
  							</div>

  							<div className="card">
    							<div className="card-header" id="headingTwo">
      								<h5 className="mb-0">
        								<button className="perfil menu-op register-btn-options admin-button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
										Proximos Eventos
        								</button>
      								</h5>
    							</div>

    							<div id="collapseTwo" className="collapse card headingTwo" aria-labelledby="headingTwo" data-parent="#accordion">
      								<div className="card-body" id="eventos">
											<div className="eventcard">
												<div className="eventcard-header">
												<h3>Nombre del evento</h3>
												</div>
												<div className="eventcard-body">
													<li>Creador: EsteMen</li>
													<li>Fecha: 14/01/2019</li>
													<li>Ubicacion: Cite Camp</li>
													<div className="btn-evento-register">
														<span className="popup-map-admin-launcher"
														 onClick={this.onDetalle.bind(this)}>
															Ver mas
														</span>
													</div>
												</div>
												<div className="eventcard-footer">
													Aqui irian categorias y si es oficial o no
												</div>
											</div>
      								</div>
    							</div>
  							</div>

  							<div className="card">
    							<div className="card-header" id="headingThree">
      								<h5 className="mb-0">
        								<button className="perfil menu-op register-btn-options register-button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
          									Registrados
        								</button>
      								</h5>
    							</div>

    							<div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordion">
      								<div className="card-body">
       									Aqui vendria una lista de eventos registrados?
      								</div>
    							</div>
  							</div>

							<div className="card">
    							<div className="card-header" id="headingFour">
      								<h5 className="mb-0">
        								<button className="perfil menu-op register-btn-options register-button" data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseThree">
          									Registrados
        								</button>
      								</h5>
    							</div>

    							<div id="collapseFour" className="collapse" aria-labelledby="headingFour" data-parent="#accordion">
      								<div className="card-body">
       									Aqui vendria una lista de eventos Creados
      								</div>
    							</div>
  							</div>  

						</div>
						

					</nav>

					<div id="register-content" className={this.state.controlSidebar.content} >
						<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
							<div className="container-fluid">
								<button type="button" onClick={this.changeSideNavBar.bind(this)} className="btn btn-info">
									<i className="fas fa-align-left"></i>
		                			<span>{this.state.controlSidebar.menuActivo}</span>
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

						<div id="register-content-option" className="container-fluid container-options d-flex justify-content-center
							align-items-start wraper board-work">
							<RegisterMap usuario={this.state.usuario}
							 onGetCategorias={this.cargaCategorias.bind(this)} />	
						</div>
					</div>
				</div>
				<Modal isOpen={this.state.modals.modalAsociar}
					transparent={true}
					animationType="fade"
					style={customStyles}
					>
					<div className="lanzador-modal">
						<div className="modal-dialog lanzador-modal-dialog">
							<div className="modal-content lanzador-modal-content">
								<form>
									<div className="modal-header lanzador-modal-header">
										<h4 className="modal-title lanzador-modal-title">Evento : Nombre</h4>
										<button type="button" className="close" data-dismiss="modal" name="asociar"
											aria-hidden="true" onClick={this.closeModalMap.bind(this)}>
										&times;
										</button>
									</div>
									<div className="modal-body lanzador-modal-body">
											<div className = "row">
												<div className = "col-sm-3">
													Descripción:
												</div>
												<div className ="col"> 
													Charla dada por estemen para aprender sobre diseño
												</div>
											</div>

											<hr></hr>

											<div className = "row">
												<div className = "col-sm-3">
													Ubicación:
												</div>
												<div className ="col"> 
													Cite Camp
												</div>
											</div>

											<hr></hr>

											<div className = "row">
												<div className = "col-sm-3">
													Fecha:
												</div>
												<div className ="col"> 
													13/01/2019
												</div>
											</div>

											<hr></hr>

											<div className = "row">
												<div className = "col-sm-3">
													Creador:
												</div>
												<div className ="col"> 
													EsteMen
												</div>
											</div>

											<hr></hr>

											<div className = "row">
												<div className = "col-sm-3">
													Tipo:
												</div>
												<div className ="col"> 
													Oficial
												</div>
											</div>

											<hr></hr>

											<div className = "row">
												<div className = "col-sm-3">
													Categorias:
												</div>
												<div className ="col"> 
													Charla
												</div>
											</div>
									</div>
									<div className="modal-footer lanzador-modal-footer">
										<input type="button" className="btn btn-default" data-dismiss="modal" value="Cancel"
												onClick={this.closeModalMap.bind(this)} name="asociar" />
										<input type="submit" className="btn btn-danger" value="asociar"
												onClick={this.closeModalMap.bind(this)} />
									</div>
								</form>
							</div>
						</div>
					</div>
				</Modal>
			</div>
		);
	}
}

export default withAuth(Register);