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

const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json({ success: true, data: brands });
  } catch (e) {
    res.status(500).json({ success: false, message: "Error fetching brands" });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Attempting to delete brand with ID:', id);
    
    const deletedBrand = await Brand.findByIdAndDelete(id);
    console.log('Deleted brand:', deletedBrand);
    
    if (!deletedBrand) {
      console.log('Brand not found');
      return res.status(404).json({ success: false, message: "Brand not found" });
    }
    
    res.status(200).json({ success: true, message: "Brand deleted" });
  } catch (e) {
    console.error('Error deleting brand:', e);
    res.status(500).json({ success: false, message: "Error deleting brand" });
  }
};

module.exports = { addBrand, getBrands, deleteBrand };
