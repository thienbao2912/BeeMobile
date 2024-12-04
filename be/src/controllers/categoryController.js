const Category = require('../models/Category')
const Transaction = require("../models/Transaction");
class CategoryController {
    static async getAllCategories(req, res) {
        try {
            let userId = req.user.id
            let userRole = req.user.role
            if (userRole === "user") {
                let categories = []
                let adminCategories = []
                const adminCategoriesDb = await Category.find({ status: 'active' }).populate({
                    path: 'userId',
                    select: 'role'
                });
                adminCategoriesDb.forEach(element => {
                    if (element.userId && element.userId.role === "admin") {
                        adminCategories.push(element)
                    }
                });
                let userCategories = await Category.find({ userId }).populate({
                    path: 'userId',
                    select: 'role'
                });
                categories = [...adminCategories, ...userCategories]
                return res.status(200).json({
                    data: categories,
                })
            }
        } catch (error) {
            res.status(500).json({
                message: 'Server error'
            })
        }
    }
    
    
    static async addCategory(req, res) {
        try {
            let userId = req.user.id
            let { name, image, description, type } = req.body
            let data = { userId, name, image, description, type }
            const savedCategory = await Category.create(data)
            res.status(201).json({ message: "Danh mục đã được tạo thành công", savedCategory });
        } catch (error) {
            res.status(500).json({
                message: 'Server error'
            })
        }
    }
    static async getCategoryById(req, res) {
        try {
            let userId = req.user.id
            let id = req.params.id

            let data = await Category.findOne({ userId, _id: id })
            res.status(200).json({ data });
        } catch (error) {
            res.status(500).json({
                message: 'Server error'
            })
        }
    }
    static async editCategory(req, res) {
        try {
            let userId = req.user.id;
            let id = req.params.id;
            let data = { userId, ...req.body };
            console.log('Request data:', data);
    
            let result = await Category.findOneAndUpdate({ userId, _id: id }, data, { new: true });
            
            if (!result) {
                return res.status(404).json({ message: 'Category not found' });
            }
    
            res.status(200).json({ message: 'Đã sửa thành công', data: result });
        } catch (error) {
            console.error('Error during editCategory:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
    
    static async delete(req, res) {
        try {
            let userId = req.user.id
            let id = req.params.id
            const checkidCategory = await Transaction.findOne({ categoryId: id })
            console.log(checkidCategory);
            if (checkidCategory) {
                return res.status(400).json({ message: "Danh mục đang được sử dụng" });
            }
            let data = await Category.findOneAndDelete({ userId, _id: id })

            res.status(200).json({ message: 'Đã xóa thành công', data });
        } catch (error) {
            console.error("Error in delete category:", error); // Log chi tiết lỗi
            res.status(500).json({
                message: 'Server error',
                error: error.message, // Gửi thông tin lỗi chi tiết (chỉ dùng trong môi trường dev)
            });
        }
        

    }
}

module.exports = CategoryController;