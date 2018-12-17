const express = require("express");
const logger = require("morgan");
const bodyparser = require("body-parser");
const path = require("path");
const indexRoutes = require("./routes/routes");

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost/dbusers', {useNewUrlParser: true});

const app = express();

// Configuración
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(logger("dev"));
app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

// Rutas del servidor
app.use("/", indexRoutes);

// Personalización página 404
app.use(function(req, res){
	res.status(404);
	res.render("404");
});

// Personalización página 500
app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500);
	res.render("500");
});

// Escuchador del servidor
app.listen(app.get("port"), ()=> {
	console.log("Server on Port ", app.get("port"));
});


