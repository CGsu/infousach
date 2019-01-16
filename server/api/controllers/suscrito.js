const mongoose = require("mongoose");
const Suscrito = require("./../models/suscrito");

exports.get_suscrito = (req, res, next) => {
	const id = req.params.id;
	Suscrito.find({usuario: id})
	.populate("evento")
	.then(docs => {
		const respuesta = {
			count: docs.length,
			Suscripciones: docs.map(doc => {
				return {
					id: doc._id,
					user: doc.usuario,
					evento: doc.evento
				}
			})	
		}
		res.status(200).json(respuesta);
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({error: err});
	});
};

exports.get_suscrito_by_id = (req, res, next) => {
	const id = req.params.id;
	console.log("", id);
	Suscrito.find({_id: id})
	.populate("evento")
	.populate("user")
	.then(docs => {
		const respuesta = {
			count: docs.length,
			Suscripciones: docs.map(doc => {
				return {
					id: doc._id,
					user: doc.usuario,
					evento: doc.evento
				}
			})	
		}
		res.status(200).json(respuesta);
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({error: err});
	});
};

exports.insert_new_suscrito = (req, res, next) => {
	const suscripcion = new Suscrito({
		_id: mongoose.Types.ObjectId(),
		usuario: req.body.user,
		evento: req.body.evento
	});
	suscripcion.save()
	.then(result => {
		res.status(201).json({
			id: result._id,
			user: result.user,
			evento: result.evento
		})
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({error: err});
	});
};

exports.update_suscrito = (req, res, next) => {
	const id = req.params.id;
	const updateOps = {};
	for ( const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}
	Suscrito.update({_id: id}, {$set: updateOps })
	.then(result => {
		console.log(result);
		res.status(200).json({
			msg: "Suscripción actualizado"
		});
	})
	.catch(err => err => {
		console.log(err);
		res.status(500).json({error: err});
	});
};

exports.delete_suscrito = (req, res, next) => {
	const id = req.params.id;
	Suscrito.deleteOne({_id: id})
	.then(result => {
		res.status(200).json({
			msg: "Suscrito eliminado"
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({error: err});
	});
};
