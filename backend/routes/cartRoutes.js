import express from "express";
import {
  getCartByUser,
  addToCart,
  removeFromCart,
  updateQuantity,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/:userId", getCartByUser);
router.post("/:userId/add", addToCart);
router.delete("/:userId/remove/:productId", removeFromCart);
router.put("/:userId/update", updateQuantity);

export default router;
