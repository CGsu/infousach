const mongoose = require("mongoose");
const TipoUbicacion = require("./../models/tipoubicacion");
const Ubicacion = require("./../models/ubicacion");
const OrderHigh = require("./../models/orderhigh");
const OrderLow = require("./../models/orderlow");

// Obtiene todos los usuarios del sistema ordenados por rol
exports.locations_get_all = (req, res, next) => {
	Ubicacion.find({}, null, { sort: {rol: 1} })
	.then(docs => {
		const respuesta = {
			count: docs.length,
			locations: docs.map(doc => {
				return {
					_id: doc._id,
					nombre: doc.nombre,
					descripcion: doc.descripcion,
					geometria: doc.geometria,
					count: doc.locations.length, 
					locations: doc.locations
				}
			})
		}
		res.status(200).json(respuesta);
	})
	.catch(err => res.status(500).json({error: err}));
};

// Insertar sector
exports.locations_insert_sector = (req, res, next) => {
	const ubicacion = new Ubicacion({
		_id: new mongoose.Types.ObjectId(),
		nombre: req.body.nombre.toLowerCase(),
		descripcion: req.body.descripcion.toLowerCase(),
		geometria: req.body.geometria,
		count: 0,
		locations: []
	});
	ubicacion.save()
	.then(result => {
		res.status(201).json({
			msg: "Creado satisfactoriamente",
			UbicacionCreado: {
				_id: result._id,
				nombre: result.nombre,
				descripcion: result.descripcion,
				geometria: result.geometria,
				count: result.locations.length,
				locations: result.locations
			}
		});
	})
	.catch(err => res.status(500).json({error: err}));
};

// Devuelve los sectores
exports.locations_get_sector = (req, res, next) => {
	Ubicacion.find({})
	.then(docs => {
		const respuesta = {
			count: docs.length,
			sectores: docs.map(doc => {
				return {
					_id: doc._id,
					nombre: doc.nombre,
					descripcion: doc.descripcion,
					geometria: doc.geometria
				}
			})
		};
		res.status(200).json(respuesta);
	})
	.catch(err => res.status(500).json({error: err}));
};

// Agrega una ubicacion orderHigh a un sector
exports.locations_add_orderhigh = (req, res, next) => {
	const id = req.params.id;
	const newLocation = req.body.idLocation;
	Ubicacion.update({_id: id}, {$push: {locations: newLocation}})
	.then(result => {
		console.log(result);
		res.status(200).json({ message: "Ubicacion Actualizada" });
	})
	.catch(err => { console.log(err); res.status(500).json({ error: err }) });
};

//--------------------------FUNCIONES ASOCIADAS A UBICACACIONES TIPO ORDER HIGH-------------------------
// Devuelve los orderHigh
exports.locations_get_orderhigh = (req, res, next) => {
	OrderHigh.find({})
	.populate("tipo")
	.then(docs => {
		const respuesta = {
			count: docs.length,
			ordershigh: docs.map(doc => {
				return {
					_id: doc._id,
					nombre: doc.nombre,
					descripcion: doc.descripcion,
					geometria: doc.geometria,
					tipo: doc.tipo.nombre,
					count: doc.locations.length,
					locations: doc.locations
				}
			})
		};
		res.status(200).json(respuesta);
	})
	.catch(err => res.status(500).json({error: err}));
};

// Insertar ubicacion de orden high
exports.locations_insert_high = (req, res, next) => {
	const orderhigh = new OrderHigh({
		_id: mongoose.Types.ObjectId(),
		nombre: req.body.nombre.toLowerCase(),
		descripcion: req.body.descripcion.toLowerCase(),
		geometria: req.body.geometria,
		tipo: req.body.tipo,
		count: 0,
		locations: []
	});
	orderhigh.save()
	.then(result => {
		res.status(201).json({
			msg: "Creado satisfactoriamente",
			orderHighCreado: {
				_id: result._id,
				nombre: result.nombre,
				descripcion: result.descripcion,
				geometria: result.geometria,
				tipo: result.tipo,
				count: result.locations.length,
				locations: result.locations
			}
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({error: err});
	});
};

// Agrega ubicaciones de orden Low a una ubicacion OrderHigh
exports.locations_add_orderlow = (req, res, next) => {
	const id = req.params.id;
	const newLocations = req.body.dependencias;
	console.log("Llegue!!");
	console.log(newLocations, "		id: ", id);
	OrderHigh.update({_id: id}, { $addToSet: {locations: newLocations} })
	.then(result => {
		console.log(result);
		res.status(200).json({ message: "Ubicacion Actualizada" });
	})
	.catch(err => { console.log(err); res.status(500).json({ error: err }) });
};

//--------------------------FUNCIONES ASOCIADAS A UBICACACIONES TIPO ORDER LOW-------------------------
// Devuelve los orderlow
exports.locations_get_orderlow = (req, res, next) => {
	OrderLow.find({})
	.populate("tipo")
	.then(docs => {
		const respuesta = {
			count: docs.length,
			orderslow: docs.map(doc => {
				return {
					_id: doc._id,
					nombre: doc.nombre,
					descripcion: doc.descripcion,
					geometria: doc.geometria,
					tipo: doc.tipo.nombre
				}
			})
		};
		res.status(200).json(respuesta);
	})
	.catch(err => res.status(500).json({error: err}));
};

// Insertar ubicacion de orden low
exports.locations_insert_low = (req, res, next) => {
	const orderlow = new OrderLow({
		_id: mongoose.Types.ObjectId(),
		nombre: req.body.nombre.toLowerCase(),
		descripcion: req.body.descripcion.toLowerCase(),
		geometria: req.body.geometria,
		tipo: req.body.tipo
	});
	orderlow.save()
	.then(result => {
		res.status(201).json({
			msg: "Creado satisfactoriamente",
			orderLowCreado: {
				_id: result._id,
				nombre: result.nombre,
				descripcion: result.descripcion,
				geometria: result.geometria,
				tipo: result.tipo
			}
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({error: err});
	});
};