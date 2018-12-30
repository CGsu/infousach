const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	nombre: { type: String, required: true },
	apellido: { type: String, required: true },
	correo: { 
		type: String, 
		required: true,
		match: /^[\w.+\-]+@usach\.cl$/,
		unique: true
	},
	password: { type: String, required: true },
	rol: { 
		type: mongoose.Schema.Types.ObjectId,
		ref: "tipoUser",
		required: true
	},
	evento_asociado: { type: String, required: true }	
});

module.exports = mongoose.model("User", userSchema);