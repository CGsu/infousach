const mongoose = require("mongoose");

const orderLowSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	nombre: { type: String, required: true },
	descripcion: String,
	geometria: [],
	tipo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "tipoUbicacion",
		required: true
	}
});

module.exports = mongoose.model("orderLow", orderLowSchema);