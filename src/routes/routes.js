const express = require("express");
const route = express.Router();
const mongoose = require("mongoose");

const db = require('./../_helpers/db');
const TipoUser = db.TipoUser;
const User = db.User;

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