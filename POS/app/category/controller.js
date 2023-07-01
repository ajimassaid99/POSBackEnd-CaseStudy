const Category = require('./model');

const getCategories = async (req, res, next) => {
  try {
    let categories = await Category.find({});
    return res.json(categories);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    let payload = req.body;
    let category = new Category(payload);
    await category.save();
    return res.json(category);
  } catch (error) {
    next(error);
  }
};

const updateCategoryById = async (req, res, next) => {
  try {
    let { name } = req.body;
    let { id } = req.params;

    let payload = {};
    if (name) payload.name = name;

    let category = await Category.findByIdAndUpdate(
      id,
      payload,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.json(category);
  } catch (error) {
    next(error);
  }
};

const deleteCategoryById = async (req, res, next) => {
  let { id } = req.params;

  try {
    let result = await Category.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategoryById,
  deleteCategoryById
};