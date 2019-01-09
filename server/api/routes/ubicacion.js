const express = require("express");
const router = express.Router();
/*const checkAuth = require("./../middleware/check-auth");*/
const ubicacionController = require("./../controllers/ubicacion");

module.exports = router;


router.get("/", ubicacionController.locations_get_all);
router.post("/sector", ubicacionController.locations_insert_sector);
router.get("/sector", ubicacionController.locations_get_sector);
router.post("/lugarmax", ubicacionController.locations_insert_high);