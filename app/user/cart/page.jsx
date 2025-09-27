// "use client";

// import { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import Image from "next/image";
// import {
//   fetchCart,
//   removeFromCartAPI,
//   updateCartQuantityAPI,
// } from "../../store/Slices/cartSlice";
// import QuantityButton from "../../components/QuantityButton";
// import Spinner from "../../components/Spinner";

// export default function CartPage() {
//   const dispatch = useDispatch();
//   const token = useSelector((state) => state.auth.token);
//   const {
//     items: cartItems = [],
//     loading,
//     error,
//   } = useSelector((state) => state.cart) || {};
//   useEffect(() => {
//     if (token) dispatch(fetchCart(token));
//   }, [dispatch, token]);

//   if (loading) return <Spinner />;
//   if (error) return <p className="text-red-500 mt-6 text-center">{error}</p>;
//   if (!cartItems.length)
//     return (
//       <p className="text-center mt-6 text-gray-500">Your cart is empty.</p>
//     );

//   // Remove item from cart
//   const handleRemove = (cartId) => {
//     if (!token) return alert("Please login first!");
//     dispatch(removeFromCartAPI({ token, cartId }));
//   };

//   // Update quantity
//   const handleQuantityChange = (cartId, quantity) => {
//     if (!token) return alert("Please login first!");
//     if (quantity < 1) return;
//     dispatch(updateCartQuantityAPI({ token, cartItemId: cartId, quantity }));
//   };

//   return (
//     <div className="p-6 md:p-12 bg-gray-50 min-h-[80vh]">
//       <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
//         My Cart
//       </h2>

//       <div className="flex flex-col gap-6">
//         {cartItems.map((item) => {
//           const product = item.product;

//           return (
//             <div
//               key={item.id}
//               className="flex flex-col sm:flex-row items-center sm:items-start bg-white p-4 rounded-2xl shadow-md gap-4"
//             >
//               <div className="w-28 h-28 relative">
//                 {product ? (
//                   <Image
//                     src={`http://localhost:3000/uploads/${product.photo}`}
//                     alt={product.name}
//                     fill
//                     className="object-contain rounded-lg"
//                   />
//                 ) : (
//                   <div className="w-28 h-28 bg-gray-200 flex items-center justify-center rounded-lg">
//                     No Image
//                   </div>
//                 )}
//               </div>

//               <div className="flex-1 flex flex-col justify-between">
//                 <div>
//                   <h3 className="text-lg font-semibold">{product?.name}</h3>
//                   <p className="text-gray-500 mt-1 text-sm">
//                     ₹{product?.price}
//                   </p>
//                 </div>

//                 <div className="flex items-center justify-between mt-3">
//                   <QuantityButton
//                     value={item.quantity}
//                     onDecrease={() =>
//                       handleQuantityChange(item.id, item.quantity - 1)
//                     }
//                     onIncrease={() =>
//                       handleQuantityChange(item.id, item.quantity + 1)
//                     }
//                   />
//                   <button
//                     onClick={() => handleRemove(item.id)}
//                     className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  fetchCart,
  removeFromCartAPI,
  updateCartQuantityAPI,
} from "../../store/Slices/cartSlice";
import QuantityButton from "../../components/QuantityButton";
import Spinner from "../../components/Spinner";

export default function CartPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);
  const {
    items: cartItems = [],
    loading,
    error,
  } = useSelector((state) => state.cart) || {};

  // Fetch cart on mount
  useEffect(() => {
    if (token) dispatch(fetchCart(token));
  }, [dispatch, token]);

  // Remove item
  const handleRemove = (cartId) => {
    if (!token) return alert("Please login first!");
    dispatch(removeFromCartAPI({ token, cartId }));
  };

  // Update quantity
  const handleQuantityChange = (cartId, quantity) => {
    if (!token) return alert("Please login first!");
    if (quantity < 1) return;
    dispatch(updateCartQuantityAPI({ token, cartItemId: cartId, quantity }));
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.product?.price || 0) * item.quantity,
    0
  );

  // Navigate to checkout page
  const handleCheckout = () => {
    if (!token) return alert("Please login first!");
    router.push("/user/cart/checkout");
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500 mt-6 text-center">{error}</p>;
  if (!cartItems.length)
    return (
      <p className="text-center mt-6 text-gray-500">Your cart is empty.</p>
    );

  return (
    <div className="p-6 md:p-12 bg-gray-50 min-h-[80vh]">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
        My Cart
      </h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Cart Items */}
        <div className="flex-1 flex flex-col gap-4">
          {cartItems.map((item) => {
            const product = item.product;
            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center sm:items-start bg-white p-4 rounded-2xl shadow-md gap-4"
              >
                <div className="w-28 h-28 relative">
                  {product ? (
                    <Image
                      src={`http://localhost:3000/uploads/${product.photo}`}
                      alt={product.name}
                      fill
                      className="object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-28 h-28 bg-gray-200 flex items-center justify-center rounded-lg">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{product?.name}</h3>
                    <p className="text-gray-500 mt-1 text-sm">
                      ₹{product?.price}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <QuantityButton
                      value={item.quantity}
                      onDecrease={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      onIncrease={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                    />
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Payment Card */}
        <div className="lg:w-80 bg-white p-6 rounded-2xl shadow-md flex flex-col gap-6 h-fit sticky top-6 self-start">
          <h3 className="text-xl font-semibold">Price Details</h3>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>₹0</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{subtotal}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="mt-4 w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
