const express = require("express");
const router = express.Router();
/*const checkAuth = require("./../middleware/check-auth");*/
const suscritoController = require("./../controllers/suscrito");

module.exports = router;

router.get("/:id", suscritoController.get_suscrito);
router.get("/by/:id", suscritoController.get_suscrito_by_id);
router.post("/", suscritoController.insert_new_suscrito);
router.patch("/:id", suscritoController.update_suscrito);
router.delete("/:id", suscritoController.delete_suscrito);
