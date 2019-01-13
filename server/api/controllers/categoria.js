const mongoose = require("mongoose");
const Categoria = require("./../models/categoria");

// Obtiene todos los tipos de usuarios del sistema por orden alfabético
exports.get_all_categorias = (req, res, next) => {
	Categoria.find({}, null ,{ sort: {nombre: 1} })
	.then(docs => {
		const respuesta = {
			count: docs.length,
			Categorias: docs.map(doc => {
				return {
					_id: doc._id,
					name: doc.nombre
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

// Crea un tipo de usuario al sistema
exports.insert_categoria = (req, res, next) => {
	const categoria = new Categoria({
		_id: new mongoose.Types.ObjectId(),
		nombre: req.body.nombre.toLowerCase()
	});
	categoria.save()
	.then(result => {
		res.status(201).json({
			msg: "Creado satisfactoriamente",
			Categoria: {
				_id: result._id,
				nombre: result.nombre
			}
		});
	})
	.catch(err => err => {
		console.log(err);
		res.status(500).json({error: err});
	});
};

// Actualiza un tipo de usuario por id
exports.update_categoria = (req, res, next) => {
	const id = req.params.id;
	const updateOps = {};
	for ( const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}
	Categoria.update({_id: id}, {$set: updateOps })
	.then(result => {
		console.log(result);
		res.status(200).json({
			msg: "Categoria actualizada"
		});
	})
	.catch(err => err => {
		console.log(err);
		res.status(500).json({error: err});
	});
};

// Elimina un tipo de usuario por id
exports.delete_categoria = (req, res, next) => {
	const id = req.params.id;
	Categoria.deleteOne({_id: id})
	.then(result => {
		res.status(200).json({
			msg: "Categoria eliminada"
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({error: err});
	});
}
