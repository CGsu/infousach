const mongoose = require("mongoose");
const TipoUbicacion = require("./../models/tipoubicacion");

// Obtiene todos los tipos de usuarios del sistema por orden alfabético
exports.tipoUbicacion_get_all = (req, res, next) => {
	TipoUbicacion.find({}, null ,{ sort: {nombre: 1} })
	.then(docs => {
		const respuesta = {
			count: docs.length,
			Ubicaciones: docs.map(doc => {
				return {
					_id: doc._id,
					nombre: doc.nombre,
					descripcion: doc.descripcion,
					ordenSugerido: doc.ordenSugerido
				}
			})
		}
		res.status(200).json(respuesta);
	})
	.catch(err => res.status(500).json({error: err}));
};

// Crea un tipo de ubicación en el sistema
exports.tipoUbicacion_crear_tipo = (req, res, next) => {
	const orden = req.body.orden === null ? "" : req.body.orden;
	const tipoubicacion = new TipoUbicacion({
		_id: new mongoose.Types.ObjectId(),
		nombre: req.body.nombre.toLowerCase(),
		descripcion: req.body.descripcion.toLowerCase(),
		ordenSugerido: orden
	});
	tipoubicacion.save()
	.then(result => {
		res.status(201).json({
			msg: "Creado satisfactoriamente",
			tipoUbicacionCreado: {
				_id: result._id,
				nombre: result.nombre,
				descripcion: result.descripcion,
				ordenSugerido: result.ordenSugerido
			}
		});
	})
	.catch(err => res.status(500).json({error: err}));
};