const mongoose = require("mongoose");

const tipoubicacionSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	nombre: { type: String, required: true },
	descripcion: {type: String, default: "no posee descripcion."},
	orden: Number
});

module.exports = mongoose.model("tipoUbicacion", tipoubicacionSchema);