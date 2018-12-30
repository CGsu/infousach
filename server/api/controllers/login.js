const mongoose = require("mongoose");
const User = require("./../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.signin = (req, res, next) => {
	const correo = req.body.correo;	
	const pass = req.body.password;
	User.find({correo: correo}) 
	.populate("rol")
	.then(user => {
		if(user < 1) {
			res.status(401).json({msg: "Error de autentificación."});
		} else {
			bcrypt.compare(pass, user[0].password, (err, result) => {
				if (err) {
					return res.status(401).json({msg: "Error de autentificación."});
				}
				if (result) {
					let clave = "";
					if (user[0].rol.nombre == "admin") {
						clave = process.env.JWT_KEY_ADMIN;
					} else if (user[0].rol.nombre == "moderador") {
						clave = process.env.JWT_KEY_MOD;
					} else {
						clave = process.env.JWT_KEY_REGISTER;
					}
					const token = jwt.sign(
						{
							_id: user[0]._id,
							nombre: user[0].nombre,
							apellido: user[0].apellido,
							correo: user[0].correo,
							rol: user[0].rol,
							evento_asociado: user[0].evento_asociado
						},
						clave,
						{ expiresIn: "1h"}
					);
					return res.status(200).json({
						message: "Auth successful",
						token: token
					});
				}
				res.status(401).json({msg: "Error de autentificación."});
			});
		}
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({error: err});
	});
};
