const mongoose = require("mongoose");

const tipouserSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	nombre: { type: String }
});

module.exports = mongoose.model("tipoUser", tipouserSchema);