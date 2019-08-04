const Category = require('../models/Category');

const createCategory = async (req, res) => {
    try {
        const existingCategory = await Category.findOne({ name: req.body.name });

        if (existingCategory) return res.status(400).json({ msg: 'Category already exists' });

        const { type, name } = req.body;
        const category = new Category({
            name, type,
        });

        await category.save();

        return res.status(200).json({ success: true, category });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err });
    }
};

const getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) return res.status(404).json({ success: false, msg: 'No category found with that ID' });

        return res.status(200).json({ success: true, category });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();

        if (!categories) return res.status(404).json({ success: false, msg: 'No categories found' });

        return res.status(200).json({ success: true, categories });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err });
    }
};

module.exports = {
    createCategory,
    getCategory,
    getCategories,
};
