const mongoose = require("mongoose");

const suscritoSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	usuario: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	evento: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Evento",
		required: true
	}
});

module.exports = mongoose.model("Suscrito", suscritoSchema);