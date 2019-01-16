const mongoose = require("mongoose");
const Evento = require("./../models/evento");
const Ubicacion = require("./../models/ubicacion");
const User = require("./../models/user");
const Categoria = require("./../models/categoria");

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

// Devuelve todos los eventos con estado activo
exports.get_event_enabled = (req, res, next) => {
	Evento.find({estado: true}, null, {sort: {fecha: -1}, sort: {hora: -1} })
	.populate("categoria")
	.populate("creador")
	.then(docs => {
		const respuesta = {
			count: docs.length,
			Eventos: docs.map(doc => {
				const dia = doc.fecha.getDate();
				const mes = doc.fecha.getMonth() + 1;
				const ano = doc.fecha.getFullYear();
				const fecha = dia+"-"+mes+"-"+ano;
				return {
					id: doc._id,
					nombre: doc.nombre,
					descripcion: doc.descripcion,
					fecha: fecha,
					horaInicio: doc.horaInicio,
					tipo: doc.tipo,
					estado: doc.estado,
					categoria: doc.categoria,
					creador: doc.creador,
					ubicacion: doc.ubicacion,
					ordenUbicacion: doc.ordenUbicacion,
					nombreUbicacion: doc.nombreUbicacion
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

// Devuelve todos los eventos asociados a una ubicacion
exports.get_event_by_id = (req, res, next) => {
	const id = req.params.id;
	Evento.find({ubicacion: id, estado: true}, null, {sort: {fecha: -1}, sort: {hora: -1}})
	.populate("categoria")
	.populate("creador")
	.then(docs => {
		const respuesta = {
			count: docs.length,
			Eventos: docs.map(doc => {
				const dia = doc.fecha.getDate();
				const mes = doc.fecha.getMonth() + 1;
				const ano = doc.fecha.getFullYear();
				const fecha = dia+"-"+mes+"-"+ano;
				return {
					id: doc._id,
					nombre: doc.nombre,
					descripcion: doc.descripcion,
					fecha: fecha,
					horaInicio: doc.horaInicio,
					tipo: doc.tipo,
					estado: doc.estado,
					categoria: doc.categoria,
					creador: doc.creador,
					ubicacion: doc.ubicacion,
					ordenUbicacion: doc.ordenUbicacion,
					nombreUbicacion: doc.nombreUbicacion
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

// Devuelve todos los eventos de un user
exports.get_event_by_user_id = (req, res, next) => {
	const id = req.params.id;
	Evento.find({creador: id, estado: true}, null, {sort: {fecha: -1}, sort: {hora: -1}})
	.populate("categoria")
	.populate("creador")
	.then(docs => {
		const respuesta = {
			count: docs.length,
			Eventos: docs.map(doc => {
				const dia = doc.fecha.getDate();
				const mes = doc.fecha.getMonth() + 1;
				const ano = doc.fecha.getFullYear();
				const fecha = dia+"-"+mes+"-"+ano;
				return {
					id: doc._id,
					nombre: doc.nombre,
					descripcion: doc.descripcion,
					fecha: fecha,
					horaInicio: doc.horaInicio,
					tipo: doc.tipo,
					estado: doc.estado,
					categoria: doc.categoria,
					creador: doc.creador,
					ubicacion: doc.ubicacion,
					ordenUbicacion: doc.ordenUbicacion,
					nombreUbicacion: doc.nombreUbicacion
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

// Devuelve los eventos que ocurriran durante ciertas fechas
exports.get_event_next = (req, res, next) => {
	const days = 1;
	const start_date = new Date();
	const end_date = start_date.addDays(days);
	Evento.find({estado: true, fecha: { "$gte": start_date, "$lt": end_date } }, null, {sort: {fecha: -1}, sort: {hora: -1}})
	.populate("categoria")
	.populate("creador")
	.then(docs => {
		const respuesta = {
			count: docs.length,
			Eventos: docs.map(doc => {
				const dia = doc.fecha.getDate();
				const mes = doc.fecha.getMonth() + 1;
				const ano = doc.fecha.getFullYear();
				const fecha = dia+"-"+mes+"-"+ano;
				return {
					id: doc._id,
					nombre: doc.nombre,
					descripcion: doc.descripcion,
					fecha: fecha,
					horaInicio: doc.horaInicio,
					tipo: doc.tipo,
					estado: doc.estado,
					categoria: doc.categoria,
					creador: doc.creador,
					ubicacion: doc.ubicacion,
					ordenUbicacion: doc.ordenUbicacion,
					nombreUbicacion: doc.nombreUbicacion
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
		ubicacion: req.body.ubicacion,
		ordenUbicacion: req.body.ordenUbicacion,
		nombreUbicacion: req.body.nombreUbicacion
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
				ubicacion: result.ubicacion,
				ordenUbicacion: result.ordenUbicacion,
				nombreUbicacion: result.nombreUbicacion
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
