const express = require("express");
const router = express.Router();
/*const checkAuth = require("./../middleware/check-auth");*/
const tipoUbicacionController = require("./../controllers/tipoubicacion");

module.exports = router;

router.get("/", tipoUbicacionController.tipoUbicacion_get_all);
router.post("/", tipoUbicacionController.tipoUbicacion_crear_tipo);