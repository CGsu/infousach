const mongoose = require("mongoose");

const eventoSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	nombre: { type: String, required: true },
	descripcion: { type: String, required: true },
	fecha: Date,
	tipo: { type: String, required: true },
	estado: { type: Boolean , default: true },
	categoria: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Categoria"
		}
	],
	creador: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	ubicacion: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Ubicacion",
		required: true
	}
});

module.exports = mongoose.model("Evento", eventoSchema);