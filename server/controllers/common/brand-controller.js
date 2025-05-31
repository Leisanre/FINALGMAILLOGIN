const Brand = require("../../models/Brand");

const addBrand = async (req, res) => {
  try {
    const { name } = req.body;
    const brand = new Brand({ name });
    await brand.save();

    res.status(201).json({ success: true, data: brand });
  } catch (e) {
    res.status(500).json({ success: false, message: "Error adding brand" });
  }
};

const getBrand = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json({ success: true, data: brands });
  } catch (e) {
    res.status(500).json({ success: false, message: "Error fetching brand" });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    await Brand.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Brand deleted" });
  } catch (e) {
    res.status(500).json({ success: false, message: "Error deleting brand" });
  }
};

module.exports = { addBrand, getBrand, deleteBrand};
