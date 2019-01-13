const express = require("express");
const router = express.Router();
const categoriaController = require("./../controllers/categoria");

module.exports = router;

router.get("/", categoriaController.get_all_categorias);
router.post("/", categoriaController.insert_categoria);
router.patch("/:id", categoriaController.update_categoria);
router.delete("/:id", categoriaController.delete_categoria);