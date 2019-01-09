const mongoose = require("mongoose");

const ubicacionSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	nombre: { type: String, required: true },
	descripcion: String,
	geometria: [],
	count: {typer: Number, default: 0},
	locations: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "orderHigh"
		}
	]
});

module.exports = mongoose.model("Ubicacion", ubicacionSchema);