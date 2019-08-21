const Category = require('../models/Category');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const createCategory = async (req, res) => {
    try {
        const existingCategory = await Category.findOne({ name: req.body.name });

        if (existingCategory) return res.status(400).json({ msg: 'Category already exists' });

        const { type, name, editable } = req.body;
        const category = new Category({
            name,
            type,
            user_id: req.user.id,
            editable: typeof editable === 'boolean' ? editable : true,
        });

        await category.save();
        const user = await User.findById(req.user.id);

        user.categories.push(category);
        user.save();

        return res.status(200).json({ success: true, category });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err });
    }
};

const getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) return res.status(404).json({ success: false, msg: 'No category found with that ID' });
        if (category.user_id != req.user.id) return res.status(404).json({ success: false, msg: 'No category found with that ID' });

        return res.status(200).json({ success: true, category });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ user_id: req.user.id });

        if (!categories) return res.status(404).json({ success: false, msg: 'No categories found' });

        return res.status(200).json({ success: true, categories });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err });
    }
};

const getCategoriesByType = async (req, res) => {
    try {
        const categories = await Category.find({ user_id: req.user.id, type: req.body.type });

        if (!categories) return res.status(404).json({ success: false, msg: 'No categories found' }); 

        return res.status(200).json({ success: true, categories });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err });
    }
};

const deleteCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        const user = await User.findById(req.user.id);
        const transactions = await Transaction.find({ category_id: req.params.id });
        
        if (!category) {
            return res.status(404).json({ success: false, msg: 'Category not found' });
        }

        if (category.user_id !== req.user.id) {
            return res.status(403).json({ success: false, msg: 'You have no permissions for that' });
        }

        const { editable } = category;
        if (typeof editable === 'boolean' && editable === false) {
            return res.status(403).json({ success: false, msg: 'You have no permissions for that' });
        }
        
        const indexOfCategory = user.categories.indexOf(req.params.id);

        if (indexOfCategory > -1) {
            user.categories.splice(indexOfCategory, 1);
        }

        user.save();
        await category.remove();

        // transactions.map((transaction) => {
        //     transaction.category_id
        // });
        
        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err });
    }
};

module.exports = {
    createCategory,
    getCategory,
    getCategories,
    getCategoriesByType,
    deleteCategoryById,
};
