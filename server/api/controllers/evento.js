const mongoose = require("mongoose");
const Evento = require("./../models/evento");
const Ubicacion = require("./../models/ubicacion");
const User = require("./../models/user");
const Categoria = require("./../models/categoria");

// Devuelve todos los eventos con estado activo
exports.get_event_enabled = (req, res, next) => {
	Evento.find({estado: true}, null, {sort: {fecha: 1} })
	.populate("categoria")
	.populate("creador")
	.populate("ubicacion")
	.then(docs => {
		const respuesta = {
			count: docs.length,
			Eventos: docs.map(doc => {
				return {
					id: result._id,
					nombre: result.nombre,
					descripcion: result.descripcion,
					fecha: result.fecha,
					horaInicio: resul.horaInicio,
					tipo: result.tipo,
					estado: result.estado,
					categoria: result.categoria,
					creador: result.creador,
					ubicacion: result.ubicacion
				}
			})
		};
		res.status(200).json(respuesta);
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({error: err});
	});
};

// Inserta un nuevo evento al sistema
exports.insert_new_event = (req, res, next) => {
	const evento = new Evento ({
		_id: new mongoose.Types.ObjectId(),
		nombre: req.body.nombre.toLowerCase(),
		descripcion: req.body.descripcion.toLowerCase(),
		fecha: req.body.fecha,
		horaInicio: req.body.horaInicio,
		tipo: req.body.tipo.toLowerCase(),
		estado: req.body.estado,
		categoria: req.body.categoria,
		creador: req.body.creador,
		ubicacion: req.body.ubicacion
	});
	evento.save()
	.then(result => {
		res.status(201).json({
			msg: "Creado satisfactoriamente",
			EventoCreado: {
				id: result._id,
				nombre: result.nombre,
				descripcion: result.descripcion,
				fecha: result.fecha,
				horaInicio: result.horaInicio,
				tipo: result.tipo,
				estado: result.estado,
				categoria: result.categoria,
				creador: result.creador,
				ubicacion: result.ubicacion
			}
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({error: err});
	});
};

// Actualiza un evento del sistema
exports.update_event = (req, res, next) => {
	const id = req.params.id;
	console.log(id);
	const updateOps = {};
	for ( const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}
	Evento.update({_id: id}, {$set: updateOps })
	.then(result => {
		console.log(result);
		res.status(200).json({
			msg: "Evento actualizado"
		});
	})
	.catch(err => err => {
		console.log(err);
		res.status(500).json({error: err});
	});
};

// Elimina un evento por id
exports.delete_event = (req, res, next) => {
	const id = req.params.id;
	Evento.deleteOne({_id: id})
	.then(result => {
		res.status(200).json({
			msg: "Evento eliminado"
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({error: err});
	});
}
