const express = require("express");
const logger = require("morgan");
const bodyparser = require("body-parser");
const path = require("path");
const indexRoutes = require("./routes/routes");
const erroHandler = require("./_helpers/error-handler");

const app = express();

// Configuración
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

// Rutas del servidor
app.use("/", indexRoutes);

// Personalización página 404
app.use(erroHandler.e404);
app.use(erroHandler.e500);

// Inicio del servidor
const port = process.env.PORT || 3000;
const server = app.listen(port, ()=> {
	console.log("Server listening on Port ", port);
});


