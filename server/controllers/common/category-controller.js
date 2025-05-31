const Category = require("../../models/Category");

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();

    res.status(201).json({ success: true, data: category });
  } catch (e) {
    res.status(500).json({ success: false, message: "Error adding category" });
  }
};

const getCategories = async (req, res) => {
  try {
    const category = await Category.find();
    res.status(200).json({ success: true, data: category });
  } catch (e) {
    res.status(500).json({ success: false, message: "Error fetching category" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "category deleted" });
  } catch (e) {
    res.status(500).json({ success: false, message: "Error deleting category" });
  }
};

module.exports = { addCategory, getCategories, deleteCategory };
