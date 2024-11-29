const CategoryController = require("../controllers/categoryController");
const middlewareController = require("../middleware/auth");

const router = require("express").Router();

router.get('', middlewareController.verifyToken, CategoryController.getAllCategories )
router.get('/:id', middlewareController.verifyToken, CategoryController.getCategoryById )
router.post('/', middlewareController.verifyToken, CategoryController.addCategory )
router.patch('/:id', middlewareController.verifyToken, CategoryController.editCategory )
router.delete('/:id', middlewareController.verifyToken, CategoryController.delete )

module.exports = router