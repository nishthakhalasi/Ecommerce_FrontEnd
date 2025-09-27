"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../../store/Slices/productsSlice";
import Spinner from "../../components/Spinner";
import ProductCard from "../../components/ProductCard";

export default function UserProductsPage() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchProducts(token));
    }
  }, [dispatch, token]);

  if (loading) return <Spinner />;

  if (error)
    return <p className="text-red-500 text-center mt-6">Error: {error}</p>;

  return (
    <div className="p-6 md:p-12 bg-gray-50 min-h-[70vh]">
      <div className="mb-8 text-center">
        <h2 className="text-4xl md:text-5xl font-serif text-indigo-900 mb-2 relative inline-block tracking-wide">
          Our Products
          <span className="absolute -bottom-2 left-0 w-24 h-1 bg-indigo-600 rounded-full"></span>
        </h2>
        <p className="text-gray-600 text-lg md:text-xl font-light italic">
          Browse our latest collection and find your perfect style!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products && products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))
        ) : (
          <p className="text-center text-gray-500 text-lg col-span-full">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}
