const mongoose = require("mongoose");

const orderHighSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	nombre: { type: String, required: true },
	descripcion: String,
	geometria: [],
	tipo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "tipoUbicacion",
		required: true
	},
	count: {typer: Number, default: 0},
	locations: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "orderLow"
		}
	]
});

module.exports = mongoose.model("orderHigh", orderHighSchema);