const express = require("express");
const router = express.Router();
/*const checkAuth = require("./../middleware/check-auth");*/
const ubicacionController = require("./../controllers/ubicacion");

module.exports = router;


router.get("/", ubicacionController.locations_get_all);

//-----SECTOR---
router.post("/sector", ubicacionController.locations_insert_sector);
router.get("/sector", ubicacionController.locations_get_sector);
router.patch("/sector/:id", ubicacionController.locations_add_orderhigh);

//-----ORDER HIGH---
router.get("/orderhigh", ubicacionController.locations_get_orderhigh);
router.post("/orderhigh", ubicacionController.locations_insert_high);
router.get("/orderlow", ubicacionController.locations_get_orderlow);
router.post("/orderlow", ubicacionController.locations_insert_low);