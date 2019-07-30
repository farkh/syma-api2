const Category = require('../../models/Category');
const User = require('../../models/User');

module.exports = {
    createCategory: async (args, req) => {
        if (!req.isAuth) throw new Error('Unauthenticated');

        const { type, name } = args.category;
        const existing = await Category.findOne({ name });

        if (existing) throw new Error('Category already exists');

        const category = new Category({
            user_id: req.userId,
            type,
            name,
        });

        try {
            const user = await User.findById(category.user_id);

            if (!user) throw new Error('User not found');

            await category.save();
            user.categories.push(category);
            await user.save();
            
            return {
                ...category._doc,
                user_id: user,
            };
        } catch (err) {
            throw err;
        }
    },
    category: async (args, req) => {
        if (!req.isAuth) throw new Error('Unauthenticated');

        const { _id } = args;

        try {
            const category = await Category.findById(_id);
            const user = await User.findById(req.userId);

            if (!category || category.user_id != req.userId) throw new Error('Category not found');

            return { ...category._doc, user_id: user };
        } catch (err) {
            throw err;
        }
    },
    categories: async (args, req) => {
        if (!req.isAuth) throw new Error('Unauthenticated');

        try {
            const user = await User.findById(req.userId);
            const categories = await Category.find({ user_id: req.userId });

            return categories.map(category => ({
                ...category._doc,
                user_id: user,
            }));
        } catch (err) {
            throw err;
        }
    },
    categoriesByType: async (args, req) => {
        if (!req.isAuth) throw new Error('Unauthenticated');

        const { type } = args;

        try {
            const user = await User.findById(req.userId);
            const categories = await Category.find({ user_id: req.userId, type });

            return categories.map(category => ({
                ...category._doc,
                user_id: user,
            }));
        } catch (err) {
            throw err;
        }
    },
};
