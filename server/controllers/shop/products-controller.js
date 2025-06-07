const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = `data:${req.file.mimetype};base64,${b64}`;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Error occurred",
    });
  }
};

// Add a new product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      genre,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    const newlyCreatedProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      genre,
      price,
      salePrice,
      totalStock,
      averageReview,
    });

    await newlyCreatedProduct.save();

    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

// Fetch all products
const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

// Edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      genre,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    const findProduct = await Product.findById(id);

    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.genre = genre || findProduct.genre;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice = salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.image = image || findProduct.image;
    findProduct.averageReview = averageReview || findProduct.averageReview;

    await findProduct.save();

    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

// Get filtered products
const getFilteredProducts = async (req, res) => {
  try {
    const { category = "", brand = "", genre = "", sortBy = "price-lowtohigh" } = req.query;

    console.log("Received filter params:", { category, brand, genre, sortBy });

    const filters = {};

    // Build filters - handle both string names and ObjectIds
    if (category.length) {
      const categoryValues = category.split(",");
      filters.category = { $in: categoryValues };
    }

    if (brand.length) {
      const brandValues = brand.split(",");
      filters.brand = { $in: brandValues };
    }

    if (genre.length) {
      const genreValues = genre.split(",");
      filters.genre = { $in: genreValues };
    }

    console.log("MongoDB filters:", filters);

    const sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.price = 1;
        break;
    }

    console.log("Sort criteria:", sort);

    const products = await Product.find(filters).sort(sort);

    console.log("Found products:", products.length);
    if (products.length > 0) {
      console.log("Sample product fields:", {
        title: products[0].title,
        category: products[0].category,
        brand: products[0].brand,
        genre: products[0].genre
      });
    } else {
      console.log("No products found with filters:", filters);
      
      // Debug: Let's also check total products without filters
      const totalProducts = await Product.countDocuments({});
      console.log("Total products in database:", totalProducts);
      
      if (totalProducts > 0) {
        const sampleProduct = await Product.findOne({});
        console.log("Sample product from DB:", {
          title: sampleProduct?.title,
          category: sampleProduct?.category,
          brand: sampleProduct?.brand,
          genre: sampleProduct?.genre
        });
      }
    }

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error in getFilteredProducts:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

// Get product details by id
const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
  getFilteredProducts,
  getProductDetails,
};
