const mongoose = require("mongoose");
const TipoUser = require("./../models/tipouser");
const User = require("./../models/user");
const bcrypt = require("bcrypt");

// Obtiene todos los usuarios del sistema ordenados por rol
exports.user_get_all = (req, res, next) => {
	User.find({}, null, { sort: {tipoUser: 1} })
	.populate("tipoUser", {_id: 0, nombre: 1})
	.then(docs => {
		const respuesta = {
			count: docs.length,
			users: docs.map(doc => {
				return {
					_id: doc._id,
					nombre: doc.nombre,
					apeliido: doc.apellido,
					correo: doc.correo,
					rol: doc.tipoUser, 
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

// Obtiene todos los usuarios del sistema según rol
exports.user_get_rol = (req, res, next) => {
	User.find({tipoUser: req.params.id}, null, {sort: {nombre: 1} })
	.populate("tipoUser")
	.then(docs => {
		const respuesta = {
			count: docs.length,
			users: docs.map(doc => {
				return {
					_id: doc._id,
					nombre: doc.nombre,
					apeliido: doc.apellido,
					correo: doc.correo,
					rol: doc.tipoUser, 
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

// Ingresa un nuevo usuario al sistema
exports.create_user = (req, res, next) => {
	console.log("Entra a la funcion");
	User.find({correo: req.body.correo})
	.then(usuario => {
		console.log("whatsapp");
		if (usuario.length >= 1) {
			return res.status(409).json({
				message: "Ya existe este email"
			});
		} else {
			TipoUser.findById(req.body.id)
			.then(tipouser => {
				if (!tipouser) {
					return res.status(404).json({ msg: "Tipo de usuario no hallado." });
				}
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					if (err) {
						return res.status(500).json({ error: err });
					}
					else {
						const user = new User({
							_id: mongoose.Types.ObjectId(),
							nombre: req.body.nombre,
							apellido: req.body.apellido,
							correo: req.body.email,
							password: hash,
							rol: tipouser.id
						});
						user.save()
						.then(result => {
							res.status(200).json({
								msg: "Usuario creado"
							});
						})
						.catch(err => console.log(err));
					}
				});
			})
			.catch(err => console.log(err));
		}
	})
	.catch(err => {
		console.log(err);
		console.log("whatsapp");
	});
};

// Obtiene un usuario según id
exports.get_user = (req, res, next) => {
	User.findById(req.params.id) 
	.populate("tipoUser")
	.then(usuario => {
		if (!usuario) {
			return res.status(404).json({msg: "Usuario no encontrado."});
		}
		res.status(200).json({
			_id: usuario._id,
			nombre: usuario.nombre,
			apellido: usuario.apellido,
			correo: usuario.correo,
			rol: usuario.tipoUser
		});
	})
	.catch(err=>console.log(err));
};

// Elimina un usuario por id
exports.delete_user = (req, res, next) => {
	const id = req.params.id;
	User.remove({_id: id})
	.then(result => {
		res.status(200).json({ msg: "Usuario eliminado" });
	})
	.catch(err => console.log(err));
}

// Actualiza un usuario por id
exports.update_user = (req, res, next) => {
	const id = req.params.id;
	const updateOps = {};
	for ( const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}
	User.update({_id: id}, {$set: updateOps })
	.then(result => {
		console.log(result);
		res.status(200).json({ message: "Product Update" });
	})
	.catch(err => { res.status(500).json({ error: err }) });
};