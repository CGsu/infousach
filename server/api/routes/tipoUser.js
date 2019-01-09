const express = require("express");
const router = express.Router();
/*const checkAuth = require("./../middleware/check-auth");*/
const tipoUserController = require("./../controllers/tipouser");

module.exports = router;

router.get("/", tipoUserController.tipoUser_get_all);

router.post("/", tipoUserController.tipoUser_crear_tipo);

router.get("/:id", tipoUserController.tipoUser_get_tipo);

router.patch("/:id", tipoUserController.tipoUser_actualizar_tipo);

router.delete("/:id", tipoUserController.tipoUser_borrar_tipo);

router.get("/rol/:rol", tipoUserController.tipoUser_get_id_tipo);
