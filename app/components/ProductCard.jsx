"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCartAPI,
  fetchCart,
  updateCartQuantityAPI,
} from "../store/Slices/cartSlice";
import QuantityButton from "./QuantityButton";
import { useEffect, useState } from "react";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items) || [];
  const [inCart, setInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [cartItemId, setCartItemId] = useState(null);

  useEffect(() => {
    const item = cartItems.find((i) => i.productId === product.id);
    if (item) {
      setInCart(true);
      setQuantity(item.quantity);
      setCartItemId(item.id);
    } else {
      setInCart(false);
      setQuantity(1);
      setCartItemId(null);
    }
  }, [cartItems, product.id]);

  const handleAddToCart = async () => {
    const result = await dispatch(
      addToCartAPI({ productId: product.id, quantity })
    ).unwrap();
    toast.success("Item added to cart!");
    setInCart(true);
    setQuantity(result.quantity);
    setCartItemId(result.id);
  };

  const handleQuantityChange = async (newQty) => {
    setQuantity(newQty);
    await dispatch(updateCartQuantityAPI({ cartItemId, quantity: newQty }));
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:scale-105 overflow-hidden flex flex-col h-[500px]">
      {/* Product Image */}
      <div className="relative w-full h-3/5 mt-10 dark:bg-gray-800 flex items-center justify-center">
        {product.photo ? (
          <Image
            src={`http://localhost:3000/uploads/${product.photo}`}
            alt={product.name}
            fill
            className="object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
            {product.name}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 line-clamp-3">
            {product.description}
          </p>
        </div>

        {/* Price & Add to Cart */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
            ₹{product.price}
          </span>

          {inCart ? (
            <QuantityButton
              value={quantity}
              onDecrease={() =>
                quantity > 1 && handleQuantityChange(quantity - 1)
              }
              onIncrease={() => handleQuantityChange(quantity + 1)}
            />
          ) : (
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition transform hover:-translate-y-1"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
