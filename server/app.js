const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyparser = require("body-parser");

require("./libs/database");

const tipoUserRoutes = require("./api/routes/tipoUser"); 
const userRoutes = require("./api/routes/user"); 
/*
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");
*/

app.use(morgan("dev"));
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());


// CORS
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers", 
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if (req.method === "OPTIONS") {
		res.header(
			"Acces-Control-Allow-Methods",
			"PUT, POST, PATCH, DELETE, GET"
		);
		return status(200).json({});
	}
	next();
});


// Rutas que deben manejar las solicitudes
app.use("/tipouser", tipoUserRoutes);
app.use("/user", userRoutes);
/*
app.use("/users", userRoutes);
*/

app.use((req, res, next) => {
	const error = new Error("Not found");
	error.status = 404;
	next(error);	
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

module.exports = app;