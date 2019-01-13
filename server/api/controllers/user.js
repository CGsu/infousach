const mongoose = require("mongoose");
const TipoUser = require("./../models/tipouser");
const User = require("./../models/user");
const bcrypt = require("bcrypt");

// Obtiene todos los usuarios del sistema ordenados por rol
exports.user_get_all = (req, res, next) => {
	User.find({}, null, { sort: {rol: 1} })
	.populate("rol", {nombre: 1})
	.then(docs => {
		const respuesta = {
			count: docs.length,
			users: docs.map(doc => {
				return {
					_id: doc._id,
					nombre: doc.nombre,
					apellido: doc.apellido,
					correo: doc.correo,
					rol: doc.rol, 
					event_asociado: doc.evento_asociado,
					acceso: doc.acceso
				}
			})
		}
		res.status(200).json(respuesta);
	})
	.catch(err => res.status(500).json({error: err}));
};

// Obtiene todos los usuarios del sistema según rol
exports.user_get_rol = (req, res, next) => {
	User.find({rol: req.params.id}, null, {sort: {nombre: 1} })
	.populate("rol")
	.then(docs => {
		const respuesta = {
			count: docs.length,
			users: docs.map(doc => {
				return {
					_id: doc._id,
					nombre: doc.nombre,
					apellido: doc.apellido,
					correo: doc.correo,
					rol: doc.rol, 
					event_asociado: doc.evento_asociado
				}
			})
		}
		res.status(200).json(respuesta);
	})
	.catch(err => res.status(500).json({error: err}));
};

// Ingresa un nuevo usuario al sistema
exports.create_user = (req, res, next) => {
	console.log(req.body);
	User.find({correo: req.body.correo})
	.then(usuario => {
		if (usuario.length >= 1) {
			return res.status(409).json({
				message: "Ya existe este email"
			});
		} else {
			TipoUser.findById(req.body.rol)
			.then(tipouser => {
				if (!tipouser) {
					return res.status(404).json({ msg: "Tipo de usuario no hallado." });
				}
				const permiso = (tipouser.nombre === "admin" ? " " : "no_oficial");
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					if (err) {
						return res.status(500).json({ error: err });
					}
					else {
						const user = new User({
							_id: mongoose.Types.ObjectId(),
							nombre: req.body.nombre.toLowerCase(),
							apellido: req.body.apellido.toLowerCase(),
							correo: req.body.correo.toLowerCase(),
							password: hash,
							rol: tipouser._id,
							evento_asociado: permiso
						});
						user.save()
						.then(result => {
							res.status(200).json({
								msg: "Usuario creado"
							});
						})
						.catch(err => {
							console.log(err);
							next();
						});
					}
				});
			})
			.catch(err => {
				console.log(err);
				next();
			});
		}
	})
	.catch(err => {
		console.log(err);
		next();
	});
};

// Obtiene un usuario según id
exports.get_user = (req, res, next) => {
	User.findById(req.params.id) 
	.populate("rol")
	.then(usuario => {
		if (!usuario) {
			return res.status(404).json({msg: "Usuario no encontrado."});
		}
		res.status(200).json({
			_id: usuario._id,
			nombre: usuario.nombre,
			apellido: usuario.apellido,
			correo: usuario.correo,
			rol: usuario.rol,
			event_asociado: usuario.evento_asociado,
			acceso: usuario.acceso
		});
	})
	.catch(err=> {
		console.log(err);
		next();
	});
};

// Elimina un usuario por id
exports.delete_user = (req, res, next) => {
	const id = req.params.id;
	User.remove({_id: id})
	.then(result => {
		if (!result) {
			res.status(404).json({msg: "Usuario no hallado"});
		}
		res.status(200).json({ msg: "Usuario eliminado" });
	})
	.catch(err => {
		console.log(err);
		next();
	});
}

// Actualiza un usuario por id
exports.update_user = (req, res, next) => {
	console.log("llega aca: ");
	const id = req.params.id;
	const updateOps = {};
	for ( const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}
	console.log(updateOps);
	User.update({_id: id}, {$set: updateOps })
	.then(result => {
		console.log(result);
		res.status(200).json({ message: "Usuario Update" });
	})
	.catch(err => { res.status(500).json({ error: err }) });
};

// Obtiene todos los usuarios por permiso de evento asociado
exports.permiso_user = (req, res, next) => {
	User.find( {evento_asociado: req.params.event })
	.populate("rol")
	.then(usuarios => {
		if (!usuarios) {
			res.status(404).json({ msg: "Usuarios no encontrados"});
		} 
		const respuesta = {
			count: usuarios.length,
			users: usuarios.map(user => {
				return {
					_id: user._id,
					nombre: user.nombre,
					apellido: user.apellido,
					correo: user.correo,
					rol: user.rol, 
					event_asociado: user.evento_asociado
				}
			})
		};	
		res.status(200).json(respuesta);
	})
	.catch(err => {
		console.log(err);
		next();
	});
};

// Obtiene los usuarios según rol y permiso asociado a eventos.
exports.rol_permiso_user = (req, res, next) => {
	User.find({rol: req.params.rol, evento_asociado: req.params.event})
	.then(usuarios => {
		const respuesta = {
			count: usuarios.length,
			users: usuarios.map(user => {
				return {
					_id: user._id,
					nombre: user.nombre,
					apellido: user.apellido,
					correo: user.correo,
					rol: user.rol, 
					event_asociado: user.evento_asociado
				}
			})
		};
		res.status(200).json({respuesta});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({error: err});
	});
};

// Devuelve un filtro sobre usuarios basado posiblemente en rol, permiso evento y patrón de busqueda.
exports.get_mix_search = (req, res, next) => {
	let args = new Object();
	if(req.params["event"] !== "-") args.evento_asociado = req.params["event"];
	if(req.params["rol"] !== "-") args.rol = req.params["rol"];

	let value = req.params.pattern;
	if (value !== ".*") {
		let p = new RegExp(value, "i");
		args.nombre = {$regex: p};
		args.apellido = {$regex: p};
		args.correo = {$regex: p};
	}

	User.find(args)
	.populate("rol")
	.then(usuarios => {
		const respuesta = {
			count: usuarios.length,
			users: usuarios.map(user => {
				return {
					_id: user._id,
					nombre: user.nombre,
					apellido: user.apellido,
					correo: user.correo,
					rol: user.rol, 
					event_asociado: user.evento_asociado,
					acceso: user.acceso
				}
			})
		};
		res.status(200).json({respuesta});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({error: err});
	});
}