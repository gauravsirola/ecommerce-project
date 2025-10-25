import Product from "../model/productModel.js";

// GET /api/products?category=&search=
export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    let filter = {};

    if (category) {
      filter.category = category.toLowerCase();
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" }; // case-insensitive search
    }

    const products = await Product.find(filter);

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
