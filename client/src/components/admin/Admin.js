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
import "./admin.css";
import "./tabla.css";
import "./modal.css";
import "./panelBusqueda.css";
import "./mapa.css";
import "./popup.css";
import imgPopup from "./popup-header.jpg";

//---------------------------------------------------------------------------------
//Variables de configuración y uso global.

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

//---------------------------------------------------------------------------------
	
class TablaUser extends Component {
	constructor() {
		super();
		this.state = {
			modalEditIsOpen: false,
			modalDeleteIsOpen: false, 
			users: [],
			panel_rol: "all",
			panel_oficial: "all",
			panel_buscar: "",
			modal_edit_perm: "-",
			modal_edit_acceso: "-",
			idUser: ""
		}
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.filtrarTabla = this.filtrarTabla.bind(this);
		this.allUser = this.allUser.bind(this);
		this.updateUser = this.updateUser.bind(this);
	}

	componentWillMount() {
		this.allUser();
		console.log("Will mount: cuantas veces ingresa!");
	}

	allUser() {
		let url = Auth.domain + "/user";
		let options = {
			method: "GET"
		};
		Auth.fetch(url, options)
		.then(result => {
			this.setState({users: result.users});
		})
		.catch(err => console.log(err));
	}

	updateUser(e) {
		e.preventDefault();
		let url = Auth.domain + "/user/" + this.state.idUser;
		let args = []

		if (this.state.modal_edit_perm !== "-") {
			args.push({"propName": "evento_asociado", "value": this.state.modal_edit_perm});
		}
		if (this.state.modal_edit_acceso !== "-") {
			let v = this.state.modal_edit_acceso === "si" ? true : false;
			args.push({"propName": "acceso", "value": v});
		}

		let options = {
			method: "PATCH",
			body: JSON.stringify(args)
		};
		Auth.fetch(url, options)
		.then(result => console.log(result))
		.catch(err => console.log(err));
		
		this.setState({
			modal_edit_perm: "-",
			modal_edit_acceso: "-",
			modalEditIsOpen: false,
			modalDeleteIsOpen: false
		});

		this.filtrarTabla();
	}

	deleteUser(e) {
		e.preventDefault();
		let url = Auth.domain + "/user/" + this.state.idUser;
		fetch(url, { method: "DELETE"})
		.then(result => result.json())
		.catch(err => console.log(err));

		this.setState({
			modalEditIsOpen: false,
			modalDeleteIsOpen: false
		});
		this.filtrarTabla();
	}

	openModal(e) {
		let b = e.target.name;
		this.setState({idUser: e.target.value});
		if (b === "edit") {
			this.setState({modalEditIsOpen: true});	
		} else {
			this.setState({modalDeleteIsOpen: true});
		}
	}

	closeModal() {
		this.setState({
			modalEditIsOpen: false,
			modalDeleteIsOpen: false
		});
	}

	handleChange(e) {
		const { name, value } = e.target;
		this.setState({
			[name]: value
		});
	}

	filtrarTabla(e) {
		let a = this.state.panel_rol !== "all" ? this.state.panel_rol : "-";
		let b = this.state.panel_oficial !== "all" ? this.state.panel_oficial : "-";
		let c = this.state.panel_buscar !== "" ? this.state.panel_buscar : ".*";

		if (a !== "-") {
			let url = Auth.domain + "/tipouser/rol/" + a
			Auth.fetch(url, { method: "GET" })
			.then(result => result.idrol)
			.then(id => {
				let url = Auth.domain + "/user/permiso/" + b + "/rol/" + id + "/pattern/" + c;
				Auth.fetch(url, { method: "GET" })
				.then(result => this.setState({users: result.respuesta.users}))
				.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
		} else {
			let url = Auth.domain + "/user/permiso/" + b + "/rol/" + a + "/pattern/" + c;
			Auth.fetch(url, { method: "GET" })
			.then(result => this.setState({users: result.respuesta.users}))
			.catch(err => console.log(err));
		}
	} 

	render(e) {
		return(
			<div className="admin-tabla-body">
				<div className="wrapper admin-table-wrapper">
					<h1 className="name-gestion-admin">Gestión de usuarios</h1>
					<div className="table-user-main-form">
						<h3>Panel de Ayuda:</h3>
						<form>
							<div className="row">
								<div className="col">
									<div className="form-group">
										<label htmlFor="rol">Rol</label>
										<select name="panel_rol" id="rol" className="form-control" onChange={this.handleChange}>
											<option value="all">todos</option>
											<option value="register">register</option>
											<option value="moderador">moderador</option>
											<option value="admin">administrador</option>
										</select>
									</div>
								</div>
								<div className="col">
									<div className="form-group">
										<label htmlFor="rol">Permiso Evento</label>
										<select name="panel_oficial" id="rol" className="form-control" onChange={this.handleChange}>
											<option value="all">todos</option>
											<option value="oficial">oficial</option>
											<option value="no_oficial">no oficial</option>
										</select>
									</div>
								</div>
								<div className="col">
									<div className="form-group">
										<label htmlFor="rol">Buscar por</label>
										<input className="form-control" type="text" placeholder="Nombre/Email" 
	  										aria-label="Search" name="panel_buscar" onChange={this.handleChange}/>
									</div>
								</div>	
							</div>
							<div className="row">
								<div className="col text-rigth">
									<div className="form-group d-flex justify-content-end">
										<button type="button" className="table-btn-help btn 
											btn-outline-primary" onClick={this.filtrarTabla.bind(this)}>Filtrar</button>
										<button type="button" className="table-btn-help 
											btn btn-outline-dark" onClick={this.allUser.bind(this)}>
											<i className="fa fa-refresh" aria-hidden="true"></i>
										</button>					
									</div>
								</div>
							</div>
						</form>
					</div>
					<div className="table-responsive">
						<table className="table table-hover table-bordered ">
							<thead className="thead-dark">
								<tr>	
									<th>#</th>
									<th>Nombre</th>
									<th>Apellido</th>
									<th>Correo</th>
									<th>Rol</th>
									<th>Evento</th>
									<th>Acceso</th>
									<th>Acciones</th>
								</tr>
							</thead>
							<tbody>
								{
									this.state.users.map((user, i) => {
										return (
											<tr key={user._id}>
												<td>{i+1}</td>
												<td>{user.nombre}</td>
												<td>{user.apellido}</td>
												<td>{user.correo}</td>
												<td>{user.rol.nombre}</td>
												<td>{user.event_asociado === undefined ? "--" : user.event_asociado}</td>
												<td>{user.acceso? "si" : user.acceso !== undefined ? "no" : "--"}</td>
												<td>
													{
														user.rol.nombre !== "admin" ?
														<div>
														<button className="edit td-span" data-toggle="modal"
															onClick={this.openModal} name="edit" value={user._id}>
															<i className="material-icons" data-toggle="tooltip" title="Edit">
																&#xE254; </i>
														</button>
														<button className="delete td-span" data-toggle="modal"
															name="delete" onClick={this.openModal} value={user._id}>
															<i className="material-icons" data-toggle="tooltip" title="delete">
																&#xE872;</i>
														</button>
														</div>
														: ""
													}
												</td>
											</tr>
										)
									})
								}
							</tbody>
						</table>
					</div>
					<div className="clearfix">
						<div className="hint-text">
							Mostrando <b>2</b> de <b>2</b> entradas
						</div>
						<ul className="pagination">
							<li className="page-item disabled"><span className="page-link span-hint-text">Previo</span></li>
							<li className="page-item active"><span className="page-link span-hint-text">1</span></li>
							<li className="page-item disabled"><span className="page-link span-hint-text">Sgte</span></li>
						</ul>
					</div>
					<Modal isOpen={this.state.modalEditIsOpen}
						transparent={true}
						visible={false}
						animationType="fade"
						style={customStyles}
						>
						<div className="lanzador-modal">
							<div className="modal-dialog lanzador-modal-dialog">
								<div className="modal-content lanzador-modal-content">
										<form>
											<div className="modal-header lanzador-modal-header">
												<h4 className="modal-title lanzador-modal-title">Edición de Usuario</h4>
												<button type="button" className="close" data-dismiss="modal"
													aria-hidden="true" onClick={this.closeModal}>
												&times;
												</button>
											</div>
											<div className="modal-body lanzador-modal-body">
												<div className="form-group lanzador-form-control">
													<label>Permiso evento</label>
													<select name="modal_edit_perm" id="rol" className="form-control" onChange={this.handleChange}>
														<option value="-">-----</option>
														<option value="oficial">oficial</option>
														<option value="no_oficial">no oficial</option>
													</select>
												</div>
												<div className="form-group lanzador-form-control">
													<label>Acesso al sistema</label>
													<select name="modal_edit_acceso" id="rol" className="form-control" onChange={this.handleChange}>
														<option value="-">-----</option>
														<option value="si">Si</option>
														<option value="no">No</option>
													</select>
												</div>
											</div>
											<div className="modal-footer lanzador-modal-footer">
												<input type="button" className="btn btn-default" data-dismiss="modal" value="Cancel"
													onClick={this.closeModal}/>
												<input className="btn btn-info" value="Save"
													type="submit" onClick={this.updateUser.bind(this)} />
											</div>
										</form>
								</div>
							</div>
						</div>
					</Modal>
					<Modal isOpen={this.state.modalDeleteIsOpen}
						transparent={true}
						animationType="fade"
						style={customStyles}
						>
						<div className="lanzador-modal">
							<div className="modal-dialog lanzador-modal-dialog">
								<div className="modal-content lanzador-modal-content">
										<form>
											<div className="modal-header lanzador-modal-header">
												<h4 className="modal-title lanzador-modal-title">Eliminar Usuario</h4>
												<button type="button" className="close" data-dismiss="modal"
													aria-hidden="true" onClick={this.closeModal}>
												&times;
												</button>
											</div>
											<div className="modal-body lanzador-modal-body">
												<p>¿Estas seguro de querer eliminar este Usuario?</p>
												<p className="text-warning"><small>Esta acción no se puede deshacer</small></p>  
											</div>
											<div className="modal-footer lanzador-modal-footer">
												<input type="button" className="btn btn-default" data-dismiss="modal" value="Cancel"
													onClick={this.closeModal}/>
												<input type="submit" className="btn btn-danger" value="Delete"
													onClick={this.deleteUser.bind(this)} />
											</div>
										</form>
								</div>
							</div>
						</div>
					</Modal>
				</div>
			</div>
		);
	}
}
//---------------------------------------------------------------------------------
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
				modalEliminarMap: false,
				modalAsociar: false
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
			asociar: {
				activo: false,
				idUbicacion: "",
				dependencias: []
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
		this.onAsociarUbicacion = this.onAsociarUbicacion.bind(this);
		this.onAsociarDependencia = this.onAsociarDependencia.bind(this);
		this.onControlAsociar = this.onControlAsociar.bind(this);
		this.crearAsociaciones = this.crearAsociaciones.bind(this);
	}

	componentWillMount() {
		this.cargaSectores();
		this.cargaTipoUbicaciones();
		this.cargaOrderHigh();
		this.cargaOrderLow();
		console.log("Will mount: cuantas veces ingresa!");
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

	crearAsociaciones(e) {
		e.preventDefault();
		const id = this.state.asociar.idUbicacion;
		let url = Auth.domain + "/location/orderhigh/" + id;
		const body = {
			dependencias: this.state.asociar.dependencias
		};
		const options = {
			method: "PATCH",
			body: JSON.stringify(body)
		};
		Auth.fetch(url, options)
		.then(result => {
			const newLow = this.state.onMarkerLow;
			for(let i=0; i < newLow.length; i++) newLow[i] = false;
			this.setState({onMarkerLow: newLow});

			const newHigh = this.state.onMarkerHigh;
			for(let i=0; i < newHigh.length; i++) newHigh[i] = false;
			this.setState({onMarkerHigh: newHigh});

			this.setState({
				asociar: {
					activo: false,
					dependencias: [],
					idUbicacion: ""
				}
			})
		})
		.catch(err => console.log(err))

		this.setState({
			modals: {
				...this.state.modals,
				modalAsociar: false
			}
		});
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
					popupBtn: false
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

	onIconMouse(e) {
		if(!this.state.asociar.activo) {
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
	}

	outIconMouse(e) {
		if(!this.state.asociar.activo) {
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
	}

	onAsociarUbicacion(e) {
		const id = e.target.getAttribute("id");
		if (!this.state.asociar.activo || id !== this.state.asociar.idUbicacion) {
			const newHigh = this.state.onMarkerHigh;
			for(let i=0; i < newHigh.length; i++) newHigh[i] = false;
			this.setState({onMarkerHigh: newHigh});
			const num_sector = e.target.getAttribute("name");
			const newOnSector = this.state.onMarkerHigh;
			newOnSector[num_sector] = true;
			this.setState({
				asociar: {
					...this.state.asociar,
					activo: true,
					idUbicacion: id
				}
			});
		} else {
			const num_sector = e.target.getAttribute("name");
			const newOnSector = this.state.onMarkerHigh;
			newOnSector[num_sector] = false;
			const newLow = this.state.onMarkerLow;
			for(let i=0; i < newLow.length; i++) newLow[i] = false;
			this.setState({
				asociar: {
					dependencias: [],
					activo: false,
					idUbicacion: ""
				}
			});
			this.setState({onMarkerLow: newLow});
		}
	}

	onAsociarDependencia(e) {
		if (this.state.asociar.activo) {
			e.target.closePopup();
			const num_sector = e.target.options.name;
			const id = e.target.options.id;
			const newOnSector = this.state.onMarkerLow;
			const newDependencias = this.state.asociar.dependencias;
			if (newOnSector[num_sector]) {
				const index = newDependencias.indexOf(id);
				if (index > -1) newDependencias.splice(index, 1);
			} else {
				if (!newDependencias.includes(id)) newDependencias.push(id);
			}
			this.setState({
				asociar: {
					...this.state.asociar,
					dependencias: newDependencias,
					activo: this.state.asociar.activo
				}
			});
			newOnSector[num_sector] = !newOnSector[num_sector];
			this.setState({onMarkerLow: newOnSector});
		}
	}

	onControlAsociar() {
		if (this.state.asociar.activo) {
			this.setState({
				modals: {
					...this.state.modals,
					modalAsociar: true
				}
			})	
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
	        						name={i} value={"high"}
	        					>
	        					<Popup>
	        						<form>
	        							<div>
	        								<ul>
	        									
	        								</ul>
	        								<div>
	        									<p className="popup-map-admin-content">
			          								<span className="popup-map-admin-launcher" 
			          								  onClick={this.onAsociarUbicacion.bind(this)}
			          								  style={this.state.asociar.activo ? btnMapStyles : {}}
			          								  name={i} id={oh._id}
			          								>
			          					 			Asociar
			          								</span>
			          								<span className="popup-map-admin-launcher" >
			          					 			Modificar
			          								</span>
			          								<span className="popup-map-admin-launcher" >
			          					 			Eliminar
			          								</span>
			          							</p>
	        								</div>
	        							</div>
	        						</form>
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
	        						onClick={this.onAsociarDependencia.bind(this)}
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
	        			<p>
	        				<span>
	        					<small className="control-map-admin-nota">
	        					Filtro de ubicaciones
	        					</small>
	        				</span>
	        				<br/>
	        				<span className="control-map-admin-filter" name="high"
	        					onClick={this.controlOpcion.bind(this)}
	        					style={this.state.control.opcionHigh ? btnMapStyles : {} }
	        				  >
	        					High
	        				</span>
	        				<span className="control-map-admin-filter" name="low"
	        					onClick={this.controlOpcion.bind(this)}
	        					style={this.state.control.opcionLow ? btnMapStyles : {} }
	        				  >
	        					Low
	        				</span>
	        				<br/>
	        				<span className="control-map-admin-opt" name="crear"
	        					onClick={this.controlOpcion.bind(this)}
	        					style={this.state.control.opcionCrear ? btnMapStyles : {} }
	        					>
	        					Crear Ubicación
	        				</span>
	        				<br/>
	        				<span className="control-map-admin-opt" name="asociar"
	        					onClick={this.onControlAsociar.bind(this)}
	        					>
	        					Asociar Ubicaciones
	        				</span>
	        				<br/>
	        				<span><small className="control-map-admin-nota">Nota:</small></span>
	        				<br/>
	        				<span>&#8226; <small className="control-map-admin-msg">Click para activar o desactivar "Crear Ubicacion".</small></span>
	        				<br/>
	        				<span>&#8226; <small className="control-map-admin-msg">Activa una opción, interactúe con el mapa haciendo click
	        					en él.</small></span>
	        				<br/>
	        				<span>&#8226; <small className="control-map-admin-msg">Para ocupar "asociar ubicaciones" recuerde tener habilitado asociar.</small></span>
	        			</p>
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
										<h4 className="modal-title lanzador-modal-title">Asociando Ubicaciones</h4>
										<button type="button" className="close" data-dismiss="modal" name="asociar"
											aria-hidden="true" onClick={this.closeModalMap.bind(this)}>
										&times;
										</button>
									</div>
									<div className="modal-body lanzador-modal-body">
												<p>¿Estas seguro de querer asociar estas Ubicación?</p>
												<p className="text-warning"><small>Esta acción no se puede deshacer</small></p>  
									</div>
									<div className="modal-footer lanzador-modal-footer">
										<input type="button" className="btn btn-default" data-dismiss="modal" value="Cancel"
												onClick={this.closeModalMap.bind(this)} name="asociar" />
										<input type="submit" className="btn btn-danger" value="asociar"
												onClick={this.crearAsociaciones.bind(this)} />
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
//---------------------------------------------------------------------------------
class Admin extends Component {

	constructor() {
		super();
		this.ambito = "/admin";
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
  		if (this.state.mOpcion === "0") {
  			return sideBienvenida();
  		}
  		if (this.state.mOpcion  === "1") {
  			return <TablaUser />;
  		}
  		if (this.state.mOpcion  === "2") {
  			return <AdminMap />;
  		}
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
							<h3>Panel de Administración InfoUsach</h3>
						</div>
						<ul className="list-unstyled components">
							<button name="0" className="perfil menu-op admin-btn-options admin-button"
								onClick={this.changeOption.bind(this)}>
								<p className="admin-p">{this.state.userNombre}</p>
								<small className="admin-small">{this.state.userCorreo}</small>
							</button>
							<li>
								<button name="1" className="menu-op admin-btn-options admin-button"
									onClick={this.changeOption.bind(this)}>
								Gestión Usuarios
								</button>
							</li>
							<li>
								<button name="2" className="menu-op admin-btn-options admin-button"
									onClick={this.changeOption.bind(this)}>
								Gestión Ubicaciones
								</button>
							</li>
						</ul>
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
		                                	<span className="nav-link admin-span nav-text" onClick={this.handleLogout.bind(this)}>Cerrar Sesión</span>
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

export default withAuth(Admin);