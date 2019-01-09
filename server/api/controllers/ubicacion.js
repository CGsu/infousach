const mongoose = require("mongoose");
const TipoUbicacion = require("./../models/tipoubicacion");
const Ubicacion = require("./../models/ubicacion");

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

// Insertar ubicacion de orden high
exports.locations_insert_high = (req, res, next) => {
	
};