const Category = require('../models/Category');
const DefaultCategory = require('../models/DefaultCategory');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const createCategory = async (req, res) => {
    try {
        const { type, name, isDefault } = req.body;
        const user = await User.findById(req.user.id);
        let existingCategory = null;

        if (typeof isDefault === 'boolean' && isDefault) {
            if (!user.isAdmin) {
                return res.status(401).json({ success: false, msg: 'No access' });
            }
            
            existingCategory = await DefaultCategory.findOne({ name: req.body.name });
        } else {
            existingCategory = await Category.findOne({ name: req.body.name });
        }

        if (existingCategory) {
            return res.status(400).json({
                msg: `${isDefault ? 'Default' : ''}Category already exists`,
            });
        }
        
        if (typeof isDefault === 'boolean' && isDefault) {
            const defaultCategory = new DefaultCategory({ name, type });
            await defaultCategory.save();

            return res.status(200).json({ success: true, category: defaultCategory });
        } else {
            const category = new Category({
                name,
                type,
                user_id: req.user.id,
            });

            await category.save();

            user.categories.push(category);
            user.save();

            return res.status(200).json({ success: true, category });
        }
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
        const defaultCategories = await DefaultCategory.find();

        if (!categories && !defaultCategories) return res.status(404).json({ success: false, msg: 'No categories found' });

        return res.status(200).json({ success: true, categories: defaultCategories.concat(categories) });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err });
    }
};

const getCategoriesByType = async (req, res) => {
    try {
        const categories = await Category.find({ user_id: req.user.id, type: req.body.type });
        const defaultCategories = await DefaultCategory.find({ type: req.body.type });

        if (!categories && !defaultCategories) return res.status(404).json({ success: false, msg: 'No categories found' }); 

        return res.status(200).json({ success: true, categories: defaultCategories.concat(categories) });
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
            const defaultCategory = await DefaultCategory.findById(req.params.id);

            if (!defaultCategory) {
                return res.status(404).json({ success: false, msg: 'Category not found' });
            } else {
                if (user.isAdmin) {
                    await defaultCategory.remove();
                    return res.status(200).json({ success: true });
                } else {
                    return res.status(401).json({ success: false, msg: 'No access' });
                }
            }
        }

        if (!category.isDefault && category.user_id != req.user.id) {
            return res.status(401).json({ success: false, msg: 'No access' });
        }

        const indexOfCategory = user.categories.indexOf(req.params.id);

        if (indexOfCategory > -1) {
            user.categories.splice(indexOfCategory, 1);
        }

        user.save();
        await category.remove();

        const defaultCategory = await DefaultCategory.findOne({ name: 'Without category' });
        
        transactions.map((transaction) => {
            transaction.category_id = defaultCategory.id;
            transaction.save();
        });
        
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
