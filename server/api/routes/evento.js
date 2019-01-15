const express = require("express");
const router = express.Router();
/*const checkAuth = require("./../middleware/check-auth");*/
const eventoController = require("./../controllers/evento");

module.exports = router;

router.get("/", eventoController.get_event_enabled);
router.get("/proximo", eventoController.get_event_next);
router.get("/all/:id", eventoController.get_event_by_id);
router.get("/user/:id", eventoController.get_event_by_user_id);
router.post("/", eventoController.insert_new_event);
router.patch("/:id", eventoController.update_event);
router.delete("/:id", eventoController.delete_event);
