import React, { Component } from "react";
import L from "leaflet";
import { 
	Map, 
	Marker, 
	Popup, 
	TileLayer, 
	Polygon } from 'react-leaflet'
import Modal from "react-modal";

import "./Register.css";
import AuthService from './../authorization/AuthService';
import withAuth from './../authorization/withAuth';
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
  
  const sideBienvenida = () => <div>Bienvenido</div>

  class AdminMap extends Component {
	constructor() {
		super();
		this.state = {
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
				modalEliminarMap: false
      		},
			control: {
				opcionCrear: false,
				opcionActualizar: false,
				opcionEliminar: false,
				opcionHigh: true,
				opcionLow: true,
				popupBtn: false
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
			onMarkerLow: []
		};
		this.controlOpcion = this.controlOpcion.bind(this);
		this.closeModalMap = this.closeModalMap.bind(this);
		this.onMapClick = this.onMapClick.bind(this);
		this.onPopupClick = this.onPopupClick.bind(this);
		this.cargaSectores = this.cargaSectores.bind(this);
		this.cargaTipoUbicaciones = this.cargaTipoUbicaciones.bind(this);
		this.getTipoUbicaciones = this.getTipoUbicaciones.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.crearUbicacion = this.crearUbicacion.bind(this);
		this.cargaOrderHigh = this.cargaOrderHigh.bind(this);
		this.cargaOrderLow = this.cargaOrderLow.bind(this);
		this.getIcon = this.getIcon.bind(this);
		this.onIconMouse = this.onIconMouse.bind(this);
		this.outIconMouse = this.outIconMouse.bind(this);
	}

	componentWillMount() {
		this.cargaSectores();
		this.cargaTipoUbicaciones();
		this.cargaOrderHigh();
		this.cargaOrderLow();
		console.log("Will mount: cuantas veces ingresa!");
	}

	handleChange(e) {
		const { name, value } = e.target;
		this.setState({
			[name]: value
		});
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

	crearUbicacion(e) {
		e.preventDefault();
		const t = this.state.crearmap_select.split(",");
		const idSector = this.state.infoSector.id;
		const body = {
			"nombre": this.state.crearmap_nombre,
			"descripcion": this.state.crearmap_descripcion,
			"tipo": t[1],
			"geometria": this.state.lastCoordinates
		};	

		if (t[0] > 1) {
			let url = Auth.domain + "/location/orderhigh";
			let options = {
				method: "POST",
				body: JSON.stringify(body),
			};
			Auth.fetch(url, options)
			.then(result => {
				let idUbicacion = {
					idLocation: result.orderHighCreado._id
				};
				let url = Auth.domain + "/location/sector/" + idSector;
				options = {
					method: "PATCH",
					body: JSON.stringify(idUbicacion)
				}
				Auth.fetch(url, options)
				.then(result => {
					this.setState({
						modals: {
							...this.state.modals,
							modalCrearMap: false
						}
					});
				})
				.catch(err => console.log(err));
			})
			.catch(err => console.log(err));

		} else {
			let url = Auth.domain + "/location/orderlow";
			let options = {
				method: "POST",
				body: JSON.stringify(body),
			};
			Auth.fetch(url, options)
			.then(result => {
				this.setState({
						modals: {
							...this.state.modals,
							modalCrearMap: false
						}
					});
			})
			.catch(err => console.log(err))
		}
	}

	onMapClick(e) {
		if (this.state.control.opcionCrear) {
			this.setState({
				modals: {
					...this.state.modals,
					modalCrearMap: true
				},
				lastCoordinates: [e.latlng.lat, e.latlng.lng]
			});	
		}
	}

	controlOpcion(e) {
		const  op = e.target.getAttribute("name");
		if (op === "crear") {
			this.setState({
				control: {
					...this.state.control,
					opcionCrear: !this.state.control.opcionCrear,
					opcionActualizar: false,
					opcionEliminar: false,
					popupBtn: false
				}
			})
		} else if (op === "update") {
			this.setState({
				control: {
					...this.state.control,
					opcionCrear: false,
					opcionActualizar: !this.state.control.opcionActualizar,
					opcionEliminar: false,
					popupBtn: true
				}
			})
		} else if (op === "borrar") {
			this.setState({
				control: {
					...this.state.control,
					opcionCrear: false,
					opcionActualizar: false,
					opcionEliminar: !this.state.control.opcionEliminar,
					popupBtn: true
				}
			})
		} else if (op === "high") {
			this.setState({
				control: {
					...this.state.control,
					opcionHigh: !this.state.control.opcionHigh,
					popupBtn: true
				}
			})
		} else if (op === "low") {
			this.setState({
				control: {
					...this.state.control,
					opcionLow: !this.state.control.opcionLow,
					popupBtn: true
				}
			})
		}
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

	onIconMouse(e) {
		e.target.openPopup();
		const num_sector = e.target.options.name;
		const value = e.target.options.value;
		if (value === "high") {
			const newOnSector = this.state.onMarkerHigh;
			newOnSector[num_sector] = true;
			this.setState({onMarkerHigh: newOnSector});
		} else  {
			const newOnSector = this.state.onMarkerLow;
			newOnSector[num_sector] = true;
			this.setState({onMarkerLow: newOnSector});
		}
	}

	outIconMouse(e) {
		e.target.closePopup();
		const num_sector = e.target.options.name;
		const value = e.target.options.value;
		if (value === "high") {
			const newOnSector = this.state.onMarkerHigh;
			newOnSector[num_sector] = false;
			this.setState({onMarkerHigh: newOnSector});
		} else  {
			const newOnSector = this.state.onMarkerLow;
			newOnSector[num_sector] = false;
			this.setState({onMarkerLow: newOnSector});
		}
	}



	render() {
		const position = [this.state.location.lat, this.state.location.lng];
		return (
			<div className="admin-map">
				<Map className="admin-map-charge" center={position} zoom={this.state.config.zoom}
				 onClick={this.onMapClick.bind(this)} >
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
	        			this.state.control.opcionHigh ? 
	        			(
	        			this.state.ordershigh.map((oh, i) => {
	        				return (
	        					<Marker key={oh._id} position={oh.geometria}
	        						icon={this.getIcon(oh.tipo, this.state.onMarkerHigh[i])} 
	        						onMouseOver={this.onIconMouse.bind(this)} 
	        						onMouseOut={this.outIconMouse.bind(this)} 
	        						name={i} value={"high"}
	        					>
	        					<Popup>
	        						<h1>{oh.nombre}</h1> <br/>
	        						<p>{oh.descripcion}</p>
	        						<br />
	          						{
	          							this.state.control.popupBtn ?
	          							(
			          						<p className="popup-map-admin-content">
			          							<span className="popup-map-admin-launcher"
			          					 		onClick={this.onPopupClick.bind(this)}>
			          					 		ok
			          							</span>
			          						</p>	
	          							)
	          							: ""
	          						}
	        					</Popup>
	        					</Marker>
	        				)
	        			})
	        			) : ""
	        		}
	        		{
	        			this.state.control.opcionLow ?
	        			(
	        			this.state.orderslow.map((ol, i) => {
	        				return (
	        					<Marker key={ol._id} position={ol.geometria} 
	        						icon={this.getIcon(ol.tipo, this.state.onMarkerLow[i])} 
	        						onMouseOver={this.onIconMouse.bind(this)} 
	        						onMouseOut={this.outIconMouse.bind(this)} 
	        						name={i} value={"low"}
	        					>
	        					<Popup>
	        						<h1>{ol.nombre}</h1> <br/>
	        						<p>{ol.descripcion}</p>
	        					</Popup>
	        					</Marker>
	        				)
	        			})
	        			) : ""
	        		}
	        		
	      		</Map>

	      		<div className="control-sector-admin">
	      			<h4>Sectores USACH</h4>
	      			{
	      				this.state.infoSector.state ? 
	      					<b>{this.state.infoSector.name}</b> : 
	      					"Posicionese sobre un sector"
	      			}
	      		</div>

          		<div className="controls-map-admin">
	        		<div className="wrapper wrapper-map">
	        			<h2 className="controls-map-admin-title">OPCIONES</h2>
	        		</div>
	        	</div>
				<Modal isOpen={this.state.modals.modalCrearMap}
						transparent={true}
						visible={false}
						overlay={true}
						animationType="fade"
						style={customStyles}
						>
					<div className="lanzador-modal">
						<div className="modal-dialog lanzador-modal-dialog">
							<div className="modal-content lanzador-modal-content">
								<form>
									<div className="modal-header lanzador-modal-header">
										<h4 className="modal-title lanzador-modal-title">Crear Ubicación</h4>
										<button type="button" className="close" data-dismiss="modal"
											aria-hidden="true" onClick={this.closeModalMap.bind(this)} name="crear">
											&times; 
										</button>
									</div>
									<div className="modal-body lanzador-modal-body">
										<div className="form-group lanzador-form-control">
											<label>Tipo Ubicacion</label>
											<select multiple size="3" name="crearmap_select" id="tipoubicacion" 
												className="form-control" onChange={this.handleChange}>
												{this.getTipoUbicaciones()}
											</select>
										</div>
										<div className="form-group lanzador-form-control">
											<label>Nombre</label>
											<input className="form-control" type="text" placeholder="Nombre..." 
	  											name="crearmap_nombre" onChange={this.handleChange}/>
										</div>
										<div className="form-group lanzador-form-control">
											<label>Descripcion</label>
											<input className="form-control" type="text" placeholder="Descripcion..." 
	  											name="crearmap_descripcion" onChange={this.handleChange}/>
										</div>
									</div>
									<div className="modal-footer lanzador-modal-footer">
										<input type="button" className="btn btn-default" data-dismiss="modal" value="Cancel"
											onClick={this.closeModalMap.bind(this)} name="crear" />
										<input className="btn btn-info" value="Save"
											type="submit" onClick={this.crearUbicacion.bind(this)}/>
									</div>
								</form>
							</div>
						</div>
					</div>
				</Modal>
				<Modal isOpen={this.state.modals.modalModificarMap}
						transparent={true}
						visible={false}
						overlay={true}
						animationType="fade"
						style={customStyles}
					>
					<div className="lanzador-modal">
						<div className="modal-dialog lanzador-modal-dialog">
							<div className="modal-content lanzador-modal-content">
								<form>
									<div className="modal-header lanzador-modal-header">
										<h4 className="modal-title lanzador-modal-title">Modificar Ubicación</h4>
										<button type="button" className="close" data-dismiss="modal"
											aria-hidden="true" onClick={this.closeModalMap.bind(this)} name="update">
											&times; 
										</button>
									</div>
									<div className="modal-body lanzador-modal-body">
									</div>
									<div className="modal-footer lanzador-modal-footer">
										<input type="button" className="btn btn-default" data-dismiss="modal" value="Cancel"
											onClick={this.closeModalMap.bind(this)} name="update" />
										<input className="btn btn-info" value="Save"
											type="submit" />
									</div>
								</form>
							</div>
						</div>
					</div>
				</Modal>
				<Modal isOpen={this.state.modals.modalEliminarMap}
					transparent={true}
					animationType="fade"
					style={customStyles}
					>
					<div className="lanzador-modal">
						<div className="modal-dialog lanzador-modal-dialog">
							<div className="modal-content lanzador-modal-content">
								<form>
									<div className="modal-header lanzador-modal-header">
										<h4 className="modal-title lanzador-modal-title">Eliminar Ubicación</h4>
										<button type="button" className="close" data-dismiss="modal" name="borrar"
											aria-hidden="true" onClick={this.closeModalMap.bind(this)}>
										&times;
										</button>
									</div>
									<div className="modal-body lanzador-modal-body">
												<p>¿Estas seguro de querer eliminar esta Ubicación?</p>
												<p className="text-warning"><small>Esta acción no se puede deshacer</small></p>  
									</div>
									<div className="modal-footer lanzador-modal-footer">
										<input type="button" className="btn btn-default" data-dismiss="modal" value="Cancel"
												onClick={this.closeModalMap.bind(this)} name="borrar" />
										<input type="submit" className="btn btn-danger" value="Delete"
											 />
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





class Register extends Component {

	constructor() {
		super();
		this.ambito = "/register";
		this.state = {
			userNombre: "",
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
			userCorreo: profile.correo
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
  		}
  		this.setState({
  			sideNavBar: arg,
  			menuActivo: msgBtn
  		});
  	}

  	renderOption() {
  		return <AdminMap />;
  	}

  	changeOption(e) {
  		this.setState({
  			mOpcion: e.target.name
  		});
  	}

	render() {
		return (
			<div className="admin-body">
				<div className="wraper admin-wrapper">
					<nav id="admin-sidebar" className={this.state.sideNavBar} >
						<div className="sidebar-header admin-sidebar-header">
							<h3>Panel de Eventos InfoUsach</h3>
						</div>
						<div id="accordion">
  							<div class="card">
    							<div class="card-header" id="headingOne">
      								<h5 class="mb-0">
        								<button class="perfil menu-op admin-btn-options admin-button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
          									Filtros
        								</button>
      								</h5>
    							</div>

							    <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
      								<div class="card-body">
        								Aqui pondriamos filtros
      								</div>
    							</div>
  							</div>

  							<div class="card">
    							<div class="card-header" id="headingTwo">
      								<h5 class="mb-0">
        								<button class="perfil menu-op admin-btn-options admin-button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
          									IM BIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIG
        								</button>
      								</h5>
    							</div>

    							<div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
      								<div class="card-body">
        								Aqui iria una lista de eventos proximos
      								</div>
    							</div>
  							</div>

  							<div class="card">
    							<div class="card-header" id="headingThree">
      								<h5 class="mb-0">
        								<button class="perfil menu-op admin-btn-options admin-button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
          									Registrados
        								</button>
      								</h5>
    							</div>

    							<div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordion">
      								<div class="card-body">
       									Aqui vendria una lista de eventos registrados?
      								</div>
    							</div>
  							</div>

							<div class="card">
    							<div class="card-header" id="headingFour">
      								<h5 class="mb-0">
        								<button class="perfil menu-op admin-btn-options admin-button" data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseThree">
          									Registrados
        								</button>
      								</h5>
    							</div>

    							<div id="collapseFour" class="collapse" aria-labelledby="headingFour" data-parent="#accordion">
      								<div class="card-body">
       									Aqui vendria una lista de eventos Creados
      								</div>
    							</div>
  							</div>  

						</div>
						

					</nav>

					<div id="admin-content">
						<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
							<div className="container-fluid">
								<button type="button" onClick={this.changeSideNavBar.bind(this)} className="btn btn-info">
									<i className="fas fa-align-left"></i>
		                			<span>{this.state.menuActivo}</span>
								</button>
								<div className="collapse navbar-collapse">
									<ul className="nav navbar-nav ml-auto">
										<li className="nav-item">
		                                	<span className="nav-link admin-span" onClick={this.handleLogout.bind(this)}>Cerrar Sesión</span>
		                            	</li>
									</ul>
								</div>
							</div>
						</nav>

						<div id="admin-content-option" className="container-fluid container-options d-flex justify-content-center
							align-items-start wraper board-work">
							{this.renderOption()}	
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withAuth(Register);