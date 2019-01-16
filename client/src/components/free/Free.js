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
import { Link } from "react-router-dom";
const Auth = new AuthService();

const customStyles = {
	content : {
	  top                   : '48%',
	  left                  : '50%',
	  right                 : 'auto',
	  bottom                : 'auto',
	  marginRight           : '-50%',
	  transform             : 'translate(-50%, -50%)',
	  height                :  '98vh',
	  overflow              :  'scroll',
	  overflowX: "hidden",
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
  
  class FreeMap extends Component {
	  constructor(props) {
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
			  newEvento: {
				  categorias: [], 
				  idUbicacion: "",
				  ordenUbicacion: "",
				  nombreUbicacion: ""
			  },
			  tipolocation: [],
			  lastCoordinates: [],
			  ordershigh: [],
			  onMarkerHigh: [],
			  orderslow: [],
			  onMarkerLow: [],
			  categorias: [],
			  eventos: []
		  };
		  this.cargaSectores = this.cargaSectores.bind(this);
		  this.cargaTipoUbicaciones = this.cargaTipoUbicaciones.bind(this);
		  this.getTipoUbicaciones = this.getTipoUbicaciones.bind(this);
		  this.cargaOrderHigh = this.cargaOrderHigh.bind(this);
		  this.cargaOrderLow = this.cargaOrderLow.bind(this);
		  this.cargaCategorias = this.cargaCategorias.bind(this);
		  this.cargarEventos = this.cargarEventos.bind(this);
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
		  this.cargarEventos();
	  }
  
	  handleLangChange () { 
		  let value = {};
		  value["op"] = 1;
		  value["categorias"] = this.state.categorias;
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
		  let url = Auth.domain + "/categorias";
		  let options = { method: "GET"};
		  Auth.fetch(url, options)
		  .then(result => {
			  this.setState({
				  categorias: result.Categorias
			  });
			  this.props.onGetCategorias(result);
		  })
		  .catch(err => console.log(err));
	  }
  
	  cargarEventos() {
		  let url = Auth.domain + "/evento";
		  let options = { method: "GET" };
		  Auth.fetch(url, options)
		  .then(result => {
			  this.props.onGetEventos(result);
			  this.setState({
				  eventos: result.Eventos
			  });
		  })
		  .catch(err => console.log(err));
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
		  const idUbicacion = e.target.options.id;
		  const ordenUbicacion = e.target.options.value;
		  const nombreUbicacion = e.target.options.nombre;
		  this.setState({
			  newEvento: {
				  ...this.state.newEvento,
				  idUbicacion: idUbicacion,
				  ordenUbicacion: ordenUbicacion,
				  nombreUbicacion: nombreUbicacion
			  }
		  })
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
  
	  onCrear() {
		  this.setState({
			  modals: {
				  ...this.state.modals,
				  modalCrearEvent: true
			  }
		  });
	  }
  
	  closeModalMap(e) {
		  const nameModal = e.target.getAttribute("name");
		  if (nameModal === "CrearEvent") {
			  this.setState({
				  modals: {
					  ...this.state.modals,
					  modalCrearEvent: false
				  }
			  });
		  }
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
									  onClick={this.onPopupClick.bind(this)}
									  id={oh._id} nombre={oh.nombre}
								  >
  
								  <Popup>
  
								  <div className = "row">
										  <div className ="col">
											  <div className ="text-center">
												  <h5>{oh.nombre}</h5> <br/>
											  </div>
										  </div>
  
									  </div>
  
									  <hr></hr>
  
									  <div className = "row">
										  <div className = "col-sm-3">
											  <p>Descripción:</p>
										  </div>
										  <div className ="col"> 
											  <p>{oh.descripcion}</p>
										  </div>
									  </div>
  
									  <hr></hr>
  
									  <div className = "row">
										  <div className = "col-sm-3">
											  <p>Tipo:</p>
										  </div>
										  <div className ="col"> 
											  <p>{oh.tipo}</p>
										  </div>
									  </div>
  
									  <hr></hr>
  
									  <span className="popup-map-admin-launcher"
									   onClick={this.props.onActiveSidebarRight}
									   id={oh._id} nameubicacion={oh.nombre}
									   >
										  Ver Eventos
									  </span>
  
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
									  onClick={this.onPopupClick.bind(this)}
									  name={i} value={"low"} id={ol._id} nombre={ol.nombre}
								  >
								  <Popup>
  
									  <div className = "row">
										  <div className ="col">
											  <div className ="text-center">
												  <h5>{ol.nombre}</h5> <br/>
											  </div>
										  </div>
  
									  </div>
  
									  <hr></hr>
  
									  <div className = "row">
										  <div className = "col-sm-3">
											  <p>Descripción:</p>
										  </div>
										  <div className ="col"> 
											  <p>{ol.descripcion}</p>
										  </div>
									  </div>
  
									  <hr></hr>
  
									  <div className = "row">
										  <div className = "col-sm-3">
											  <p>Tipo:</p>
										  </div>
										  <div className ="col"> 
											  <p>{ol.tipo}</p>
										  </div>
									  </div>
									  
									  <hr></hr>
  
									  <span className="popup-map-admin-launcher"
									   onClick={this.props.onActiveSidebarRight}
									   id={ol._id} nameubicacion={ol.nombre}
									   >
										  Ver Eventos
									  </span>
  
  
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
  
  class FREE extends Component {
	  constructor() {
		  super();
		  this.ambito = "/free";
		  this.state = {
			  controlSidebar: {
				  content: "active",
				  sideNavBar: "active",
				  menuActivo: "Mostrar Menú"
			  },
			  controlSidebarRight:{
				  sideNavBar: "active",
				  overlay: "",
				  menuActivo: "Cerrar Menú"
			  },
			  modals: {
				  modalAsociar: false
			  },
			  modalDetalle: {
				  eventoModal: "",
				  creador: "",
				  categoria: []
			  },
			  proxEventos: {
				  eventos: [],
				  band: true
			  },
			  buscadorRight: {
				  busc: ""
			  },
			  categorias: [],
			  filtros: [],
			  whichFilter: [],
			  eventos: [],
			  eventBarRight: [],
		  };
		  this.buscadorRight = this.buscadorRight.bind(this);
		  this.closeModalMap = this.closeModalMap.bind(this);
		  this.onDetalle = this.onDetalle.bind(this);
		  this.cargaCategorias = this.cargaCategorias.bind(this);
		  this.onActiveSidebarRight = this.onActiveSidebarRight.bind(this);
		  this.proxEventos = this.proxEventos.bind(this);
		  this.managerFilter = this.managerFilter.bind(this);
		  this.controlFilter = this.controlFilter.bind(this);
		  this.buscEventos = this.buscEventos.bind(this);
	  }
  
  
	  handleLogout() {
		  Auth.logout();
		  this.props.history.replace('/login');
		}
  
		cargaCategorias(data) {
			const temp = data.Categorias.slice(0);
			temp.push({"name": "evento oficial"});
			temp.push({"name": "evento no oficial"});
			this.setState({categorias: data.Categorias});
			this.setState({filtros: temp});
			let filtros = [];
			temp.forEach((filtro) => {
				filtros.push(filtro.name);
			});
			this.setState({whichFilter: filtros});
		}
  
		cargarEventos(data) {
			this.setState({eventos: data.Eventos});
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
  
	  onDetalle(e) {
		  const id = e.target.id;
		  const name = e.target.getAttribute("name");
		  if(name === "right") {
			  this.state.eventBarRight.forEach(event => {
				  const creador = event.creador.nombre;
				  const categoria = event.categoria;
				  if(event.id === id) {
					  this.setState({
						  modalDetalle: {
							  eventoModal: event,
							  creador: creador,
							  categoria: categoria
						  }
					  });
				  }
			  });
		  } else {
			  this.state.eventos.forEach(event => {
				  if(event.id === id) {
					  const creador = event.creador.nombre;
					  const categoria = event.categoria;
					  this.setState({
						  modalDetalle: {
							  eventoModal: event,
							  creador: event.creador.nombre,
							  categoria: event.categoria
						  }
					  });
				  }
			  });
		  }
		  this.setState({
			  modals: {
				  modalAsociar: true,
				  event_id: e.target.id
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
  
	  onActiveSidebarRight(e) {
		  let onSideNavBar = "active";
		  let onShadowBar = "";
		  const idUbicacion = e.target.id;
		  const nameubicacion = e.target.getAttribute("nameubicacion"); 
		  if (this.state.controlSidebarRight.sideNavBar === "active") {
			  onSideNavBar = "";
			  onShadowBar = "active";
			  let url = Auth.domain + "/evento/all/" + idUbicacion;
			  Auth.fetch(url, {method: "GET"})
			  .then(result => {
				  this.setState({
					  eventBarRight: result.Eventos,
					  nombreUbicacion: nameubicacion
				  });
			  })
			  .catch(err => console.log(err));
		  }
		  this.setState({
			  controlSidebarRight: {
				  ...this.state.controlSidebarRight,
				  sideNavBar: onSideNavBar,
				  overlay: onShadowBar
			  }
		  });
	  }
  
  
	  proxEventos() {
		  const open = this.state.proxEventos.band;
		  if (open) {
			  let url = Auth.domain + "/evento/proximo";
			  Auth.fetch(url, {method: "GET"})
			  .then(result => {
				  this.setState({
					  proxEventos: {
						  eventos: result.Eventos,
						  band: !open
					  }
				  });
			  })
			  .catch(err => console.log(err));
		  } else {
			  this.setState({
				  misEventos: {
					  ...this.state.proxEventos,
					  band: !open
				  }
			  });
		  }
	  }
  
		handleRegisterMap(value) {
			const op = value.opcion;
			if (op === 1) {
				this.setState({categorias: value.categorias});
			}
	  }
  
	  managerFilter(e) {
		  const filtro = e.target.id;
		  const temp = this.state.whichFilter;
		  const index = temp.indexOf(filtro);
		  if (index === -1) {
			  temp.push(filtro);
		  } else {
			  temp.splice(index, 1);
		  }
		  this.setState({ whichFilter: temp });
	  }
	  
	  controlFilter(evento) {
		  let cond1 = false, cond2 = false;
		  const temp = this.state.whichFilter;
		  // Primero verificamos las categorias
		  evento.categoria.forEach((categoria) => {
			  if (temp.indexOf(categoria.nombre) > -1) {
				  cond1 = true;
			  }
		  });
		  // Verificamos tipo de evento
		  evento.tipo === "oficial" ? (temp.indexOf("evento oficial") > -1 ? cond2 = true : cond2 = false)
									: (temp.indexOf("evento no oficial") > -1 ? cond2 = true : cond2 = false); 
  
		  return cond1 && cond2;
	  }
	  
	  buscEventos(evento){
		  let cond1 = true;
		  const busc = this.state.buscadorRight.busc.toLowerCase();
		  if (busc===""){
			  return cond1;
		  }else{
			  evento.nombre.toLowerCase().includes(busc)? cond1 = true 
			  : evento.nombre.toLowerCase().includes(busc)?cond1 = true :cond1 = false;
		  }
		  return cond1;
	  }
  
	  buscadorRight(e){
		  const { name, value } = e.target;
		  this.setState({
			  buscadorRight: {
				  ...this.state.buscadorRight,
				  busc: value
			  }
		  });
	  }
  
	  render() {
		  return (
			  <div className="register-body">
  
				  <div className="wraper register-wrapper">
					  <nav id="register-sidebar" className={this.state.controlSidebar.sideNavBar} >
						  <div className="sidebar-header register-sidebar-header">
							  <h3>Bienvenid@ Usuario</h3>
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
												this.state.filtros.map((filtro, i) => {
													return (
													  <div key={i} className="custom-control custom-checkbox">
														  <input defaultChecked type="checkbox" className="custom-control-input" id={filtro.name}
														   onClick={this.managerFilter.bind(this)}></input>
														  <label className="custom-control-label" htmlFor={filtro.name}>{filtro.name}</label>
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
										  <button className="perfil menu-op register-btn-options admin-button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"
											onClick={this.proxEventos.bind(this)}>
										  Proximos Eventos
										  </button>
										</h5>
								  </div>
  
								  <div id="collapseTwo" className="collapse card headingTwo" aria-labelledby="headingTwo" data-parent="#accordion">
										{
											this.state.proxEventos.eventos.map((event, i) => {
												if (this.controlFilter(event)) {
												return(
												  <div className="card-body" id="eventos" key={i}>
													  <div className="eventcard" key={i}>
														  <div className="eventcard-header">
															  <h5>Evento : {event.nombre}</h5>
														  </div>
														  <div className="eventcard-body">
															  <div className="row">
																  <div className="col-sm-5">
																  Creador:
																  </div>
																  <div className="col">
																	  {event.creador.nombre + " " + event.creador.apellido}
																  </div>
															  </div>
															  <hr></hr>
															  <div className="row">
																  <div className="col-sm-5">
																  Fecha:
																  </div>
																  <div className="col">
																	  {event.fecha}
																  </div>
															  </div>
															  <hr></hr>
															  <div className="row">
																  <div className="col-sm-5">
																  Tipo:
																  </div>
																  <div className="col">
																  {event.tipo.replace("_"," ")}
																  </div>
															  </div>
															  <div className="btn-evento-register">
																  <span className="popup-map-admin-launcher"
																  onClick={this.onDetalle.bind(this)}
																  id={event.id} name={"left"} >
																	  Ver mas
																  </span>
															  </div>
														  </div>
													  </div>
													  <hr></hr>
												  </div>
												);
												}
											})
										}
								  </div>
								</div>
  
								<div className="card">
								  <div className="card-header" id="headingFive">
										<h5 className="mb-0">
										  <button className="perfil menu-op register-btn-options register-button" data-toggle="collapse" data-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
												Todos
										  </button>
										</h5>
								  </div>
  
								  <div id="collapseFive" className="collapse" aria-labelledby="headingFive" data-parent="#accordion">
										{
											this.state.eventos.map((event, i) => {
											  if (this.controlFilter(event)) {  
												  return(
													  <div className="card-body" id="eventos" key={i}>
														  <div className="eventcard" key={i}>
															  <div className="eventcard-header">
																  <h5>Evento : {event.nombre}</h5>
															  </div>
															  <div className="eventcard-body">
																  <div className="row">
																	  <div className="col-sm-5">
																	  Creador:
																	  </div>
																	  <div className="col">
																		  {event.creador.nombre + " " + event.creador.apellido}
																	  </div>
																  </div>
																  <hr></hr>
																  <div className="row">
																	  <div className="col-sm-5">
																	  Fecha:
																	  </div>
																	  <div className="col">
																		  {event.fecha}
																	  </div>
																  </div>
																  <hr></hr>
																  <div className="row">
																	  <div className="col-sm-5">
																	  Tipo:
																	  </div>
																	  <div className="col">
																	  {event.tipo.replace("_"," ")}
																	  </div>
																  </div>
																  <div className="btn-evento-register">
																	  <span className="popup-map-admin-launcher"
																	  onClick={this.onDetalle.bind(this)}
																	  id={event.id} name={"left"} >
																		  Ver mas
																	  </span>
																  </div>
															  </div>
														  </div>
														  <hr></hr>
													  </div>
												  );
											  }	
											})
										}
								  </div>
								</div>   
  
						  </div>
						  
  
					  </nav>
						
  
					  <nav id="register-sidebar-right" className={this.state.controlSidebarRight.sideNavBar} >
					  
						  <div className="sidebar-header register-sidebar-right-header">
							  <div className="row">
								  <div className = "col-sm-3">
								  
									  <button type="button" onClick={this.onActiveSidebarRight.bind(this)} className="btn btn-info">
										  <i className="fas fa-arrow-left"></i>
										  <span>{this.state.controlSidebarRight.menuActivo}</span>
									  </button>
								  </div>
							  </div>
							  <hr></hr>
							  <div className ="row">
								  <div className = "col">
									  <h5>Eventos en {this.state.nombreUbicacion} </h5>
								  </div>	
							  </div>
							  <hr></hr>
							  <div className="card">
								  <div className="basiccard-header" id="ubieventos">
										  <input type="text" className="form-control" id="b_evento" placeholder="Buscador(Nombre,Descripción)" 
										  onChange={this.buscadorRight} name="buscador"></input>
									  <hr></hr>
								  </div>
  
								  
									<div className="card-body" id="eventos">
									  {this.state.eventBarRight.length === 0? 
										  <div className="alert alert-light">
												La Ubicación no tiene eventos
										  </div>
									  : this.state.eventBarRight.map((event, i) => {
										  var cont = 0;
										  if (this.buscEventos(event)) {
											  cont = 1;  
											  return(
												  <div className="eventcard" key={i}>
													  <div className="eventcard-header">
														  <h5>Evento : {event.nombre}</h5>
													  </div>
													  <div className="eventcard-body">
														  <div className="row">
															  <div className="col-sm-5">
															  Creador:
															  </div>
															  <div className="col">
																  {event.creador.nombre + " " + event.creador.apellido}
															  </div>
														  </div>
														  <hr></hr>
														  <div className="row">
															  <div className="col-sm-5">
															  Fecha:
															  </div>
															  <div className="col">
																  {event.fecha}
															  </div>
														  </div>
														  <hr></hr>
														  <div className="row">
															  <div className="col-sm-5">
															  Tipo:
															  </div>
															  <div className="col">
															  {event.tipo.replace("_"," ")}
															  </div>
														  </div>
														  <div className="btn-evento-register">
															  <span className="popup-map-admin-launcher"
															  onClick={this.onDetalle.bind(this)}
															  id={event.id} name={"right"} >
																  Ver mas
															  </span>
														  </div>
													  </div>
												  </div>
											  );
										  }
										  if(cont === 0){
											  return(
												  <div className="alert alert-light">
														No se encontraron Resultados
												  </div>
											  );
										  }	
										})
  
									  }
										
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
										  	<Link to={"/"} className="nav-link"><span>Home</span></Link>
										  </li>
										  <li className="nav-item">
										  	<Link to={"/login"} className="nav-link"><span>Log In</span></Link>
										  </li>
									  </ul>
								  </div>
							  </div>
						  </nav>
  
						  <div id="register-content-option" className="container-fluid container-options d-flex justify-content-center
							  align-items-start wraper board-work">
							  <FreeMap 
							   onGetCategorias={this.cargaCategorias.bind(this)}
							   onGetEventos={this.cargarEventos.bind(this)} 
							   onActiveSidebarRight={this.onActiveSidebarRight.bind(this)} 
							  />	
						  </div>
  
  
					  </div>
					  
				  </div>
				  <div id="overlayright" className={this.state.controlSidebarRight.overlay}></div>
  
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
										  <h4 className="modal-title lanzador-modal-title">Evento : {this.state.modalDetalle.eventoModal.nombre}</h4>
										  <button type="button" className="close" data-dismiss="modal" name="asociar"
											  aria-hidden="true" onClick={this.closeModalMap.bind(this)}>
										  &times;
										  </button>
									  </div>
									  <div className="modal-body lanzador-modal-body">
											  <div className = "row">
												  <div className = "col-sm-4">
													  Descripción: 
												  </div>
												  <div className ="col"> 
													  {this.state.modalDetalle.eventoModal.descripcion}
												  </div>
											  </div>
  
											  <hr></hr>
  
											  <div className = "row">
												  <div className = "col-sm-4">
													  Ubicación:
												  </div>
												  <div className ="col"> 
													  {this.state.modalDetalle.eventoModal.nombreUbicacion}
												  </div>
											  </div>
  
											  <hr></hr>
  
											  <div className = "row">
												  <div className = "col-sm-4">
													  Fecha:
												  </div>
												  <div className ="col"> 
													  {this.state.modalDetalle.eventoModal.fecha}
												  </div>
											  </div>
  
											  <hr></hr>
  
											  <div className = "row">
												  <div className = "col-sm-4">
													  Creador:
												  </div>
												  <div className ="col"> 
													  {this.state.modalDetalle.creador}
												  </div>
											  </div>
  
											  <hr></hr>
  
											  <div className = "row">
												  <div className = "col-sm-4">
													  Tipo:
												  </div>
												  <div className ="col"> 
													  {this.state.modalDetalle.eventoModal.tipo? this.state.modalDetalle.eventoModal.tipo.replace("_"," "):"?" }
												  </div>
											  </div>
  
											  <hr></hr>
  
											  <div className = "row">
												  <div className = "col-sm-4">
													  Categorias:
												  </div>
												  <div className ="col">
												  {	
													  this.state.modalDetalle.categoria.map((cat, i) => {
														  const len=this.state.modalDetalle.categoria.length-1;
														  return(
															  <span key={i}><small>{cat.nombre}{len === i?"":","}</small></span> 
														  );
													  })
												  }
												  </div>
											  </div>
									  </div>
									  <div className="modal-footer lanzador-modal-footer">
										  <input type="button" className="btn btn-default" data-dismiss="modal" value="Cerrar"
												  onClick={this.closeModalMap.bind(this)} name="asociar" />
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

export default FREE;