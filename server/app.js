const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyparser = require("body-parser");

require("./libs/database");

const tipoUserRoutes = require("./api/routes/tipoUser"); 
const userRoutes = require("./api/routes/user"); 
const loginRoutes = require("./api/routes/login"); 


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
	res.header(
			"Acces-Control-Allow-Methods",
			"PUT, POST, PATCH, DELETE, GET"
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