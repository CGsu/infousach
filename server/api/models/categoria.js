const mongoose = require("mongoose");

const categoriaSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	nombre: { type: String, required: true }
});

module.exports = mongoose.model("Categoria", categoriaSchema);