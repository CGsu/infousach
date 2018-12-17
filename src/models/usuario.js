var mongoose = require("mongoose");
//require("./tipousuario");
var TipoUsuario = mongoose.model("TipoUser");

const usuarioSchema = new mongoose.Schema({
	nombre: {
		type: String,
		require: [true, "Se requiere nombre"]
	},
	apellido: {
		type: String,
		require: [true, "Se requiere apellido"]
	},
	correo: {
		type: String,
		match: [/@usach.cl$/, "Ingrese un correo válido"],
		unique: true,
		lowercase: true,
		require: "Email es requerido"
	},
	password: {
		type: String,
		select: false,
		require: [true, "Password es necesaria"],
		rol: {
			type: mongoose.Schema.ObjectId,
			ref: "TipoUsuario",
			require: [true, "Debe ingresar una rol"]
		}
	}
});

module.exports = mongoose.model('Usuario', usuarioSchema);