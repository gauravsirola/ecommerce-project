import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  total: { type: Number, default: 0 },
  discountPercentage: { type: Number, default: 0 },
  discountedTotal: { type: Number, default: 0 },
  thumbnail: { type: String }
});

const cartSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true, unique: true },
    products: [productSchema],
    total: { type: Number, default: 0 },
    discountedTotal: { type: Number, default: 0 },
    totalProducts: { type: Number, default: 0 },
    totalQuantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
