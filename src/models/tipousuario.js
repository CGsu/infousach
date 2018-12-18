var mongoose = require("mongoose");

var schema = new mongoose.Schema({
	nombre: {
		type: String, 
		unique: true, 
		lowercase: true,
		require: [true, "El nombre del rol es necesario"]
	}
});

module.exports = mongoose.model("TipoUser", schema);