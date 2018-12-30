const express = require("express");
const router = express.Router();
/*const checkAuth = require("./../middleware/check-auth");*/
const userController = require("./../controllers/user");

module.exports = router;

router.get("/", userController.user_get_all);

router.post("/", userController.create_user);

router.get("/rol/:id", userController.user_get_rol);

router.get("/:id", userController.get_user);

router.patch("/:id", userController.update_user);

router.delete("/:id", userController.delete_user);

router.get("/permiso/:event", userController.permiso_user);

router.get("/permiso/:event/rol/:rol", userController.rol_permiso_user);
