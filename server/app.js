const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyparser = require("body-parser");

require("./libs/database");

const tipoUserRoutes = require("./api/routes/tipoUser"); 
const userRoutes = require("./api/routes/user"); 
const loginRoutes = require("./api/routes/login"); 
const locationRoutes = require("./api/routes/ubicacion");
const tipoLocationRoutes = require("./api/routes/tipoUbicacion");


app.use(morgan("dev"));
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());


// CORS
app.use((req, res, next) => {
	console.log(req.params.id);
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers", 
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	res.header(
			"Access-Control-Allow-Methods",
			"GET, POST, PUT, DELETE, PATCH, OPTIONS"
	);
	if("OPTIONS" == req.method) {
		return res.status(200).json({});
	}
	next();
});

// Rutas que deben manejar las solicitudes
app.use("/tipouser", tipoUserRoutes);
app.use("/user", userRoutes);
app.use("/login", loginRoutes);
app.use("/location", locationRoutes);
app.use("/tipolocation", tipoLocationRoutes);

app.use((req, res, next) => {
	const error = new Error("Not found");
	error.status = 404;
	next(error);	
});

app.use((error, req, res, next) => {
	console.log(error);
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

module.exports = app;