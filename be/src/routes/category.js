const CategoryController = require("../controllers/categoryController");
const middlewareController = require("../middleware/Auth");

const router = require("express").Router();

router.get('', middlewareController.verifyToken, CategoryController.getAllCategories )
router.get('/:id', middlewareController.verifyToken, CategoryController.getCategoryById )
router.post('/', middlewareController.verifyToken, CategoryController.addCategory )
router.patch('/:id', middlewareController.verifyToken, CategoryController.editCategory )
router.delete('/:id', middlewareController.verifyToken, CategoryController.delete )
router.get('/check/:id', CategoryController.check);
module.exports = router