const express = require("express");
const route = express.Router();
const fs = require("fs");
const path = require("path");
var mongoose = require("mongoose");

// Solución provisoria a la creación y uso de modelos.
const models = path.join(__dirname, "../models");
// Leemos los modelos a utilizar
fs.readdirSync(models).forEach((file) => {
	if (~file.indexOf(".js")) 
		require(path.join(models, file));
});


// Manejo básico del movimiento a través de las páginas del sitio
route.get("/", (req, res) => {
	let title = "Home";
	res.render("index", {
		title: title
	});
});

route.get("/loggin", (req, res) => {
	let title = "loggin";
	res.render("loggin", {
		title: title
	});
});

route.get("/free/", (req, res) => {
	let title = "Mapa";
	res.render("./free/index", {
		title: title
	})
});

route.get("/register/", (req, res) => {
	let title = "Register";
	res.render("./register/index", {
		title: title
	});
});

route.get("/mod/", (req, res) => {
	let title = "Moderador";
	res.render("./mod/index", {
		title: title
	});
});

route.get("/admin/", (req, res) => {
	let title = "Admin";
	res.render("./admin/index", {
		title: title
	});
});

// Exportamos variable route 
module.exports = route;