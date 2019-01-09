const mongoose = require("mongoose");
const TipoUser = require("./../models/tipouser");

// Obtiene todos los tipos de usuarios del sistema por orden alfabético
exports.tipoUser_get_all = (req, res, next) => {
	TipoUser.find({}, null ,{ sort: {nombre: 1} })
	.then(docs => {
		const respuesta = {
			count: docs.length,
			tiposUser: docs.map(doc => {
				return {
					_id: doc._id,
					name: doc.nombre,
					request: {
						type: "GET",
						url: "http://localhost/tipouser"
					}
				}
			})
		}
		res.status(200).json(respuesta);
	})
	.catch(err => res.status(500).json({error: err}));
};

// Crea un tipo de usuario al sistema
exports.tipoUser_crear_tipo = (req, res, next) => {
	const tipouser = new TipoUser({
		_id: new mongoose.Types.ObjectId(),
		nombre: req.body.name
	});
	tipouser.save()
	.then(result => {
		res.status(201).json({
			msg: "Creado satisfactoriamente",
			tipoUserCreado: {
				_id: result._id,
				nombre: result.nombre,
				request: {
					type: "POST",
					url: "http://localhost/tipouser"
				}
			}
		});
	})
	.catch(err => res.status(500).json({error: err}));
};

// Obtiene un tipo de usuario por id
exports.tipoUser_get_tipo = (req, res, next) => {
	const id = req.params.id;
	TipoUser.findById(id)
	.then(doc => {
		console.log("From database ", doc); 
		if (doc) {
			res.status(200).json({
				tipoUser: doc,
				request: {
					type: "GET",
					url: "http://localhost//tipousuario/" + id
				}
			});	
		} else {
			res.status(404).json({
				msg: "No existe el id en la BD"
			});
		}
	})
	.catch(err => res.status(500).json({error: err}));
};

// Actualiza un tipo de usuario por id
exports.tipoUser_actualizar_tipo = (req, res, next) => {
	const id = req.params.id;
	const updateOps = {};
	for ( const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}
	TipoUser.update({_id: id}, {$set: updateOps })
	.then(result => {
		console.log(result);
		res.status(200).json({
			msg: "Tipo de Usuario actualizado",
			request: {
				type: "GET",
				url: "http://localhost/tipousuario/" + id
			}
		});
	})
	.catch(err => res.status(500).json({ error: err }));
};

// Elimina un tipo de usuario por id
exports.tipoUser_borrar_tipo = (req, res, next) => {
	const id = req.params.id;
	TipoUser.remove({_id: id})
	.then(result => {
		res.status(200).json({
			msg: "Tipo de usuario eliminado",
			request: {
				type: "Post",
				url: "http://localhost:/products" + id,
				body: { name: "String" }
			}
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({error: err});
	});
}

// Obtiene el id de un tipo de usuario dado un rol
exports.tipoUser_get_id_tipo = (req, res, next) => {
	const nombre = req.params.rol;
	TipoUser.find({nombre: nombre})
	.then(result => {
		res.status(200).json({idrol: result[0]._id});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({error: err});
	});
}