"use client";

import Image from "next/image";
import { useEffect } from "react";
import ProductCard from "./components/ProductCard";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "./components/Spinner";
import { fetchProducts } from "./store/Slices/productsSlice";

export default function HomePage() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { products, loading, error } = useSelector((state) => state.products);
  useEffect(() => {
    if (token) {
      dispatch(fetchProducts(token));
    }
  }, [token, dispatch]);

  if (loading) return <Spinner />;

  if (error)
    return <p className="text-red-500 text-center mt-6">Error: {error}</p>;

  return (
    <div className="bg-white text-gray-900">
      <section className="w-90 bg-[#FFF6E2] rounded-[36px] pl-6 md:pl-16 pr-0 m-6 h-[40vh]">
        <div className="flex flex-col md:flex-row justify-center items-center h-full">
          <div className="rounded-lg p-2 md:p-4 flex-[2.5] h-full flex items-center">
            <Image
              src="/img/g1.png"
              alt="Woman in Dress"
              width={500}
              height={500}
              className="rounded-lg w-auto h-full object-contain p-10"
            />
          </div>
          <div className="bg-green-200 rounded-lg flex-1 h-full flex items-center justify-center">
            <Image
              src="/img/m2.png"
              alt="Woman in Dress"
              width={500}
              height={500}
              className="rounded-lg w-auto h-full object-contain"
            />
          </div>
          <div className="bg-pink-100 rounded-lg flex-1 h-full flex items-center justify-center">
            <Image
              src="/img/m1.png"
              alt="Woman in Dress"
              width={500}
              height={500}
              className="rounded-lg w-auto h-full object-contain"
            />
          </div>
        </div>
      </section>

      <section className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-6">Browse Categories</h2>
        <div className="flex justify-center gap-6 flex-wrap">
          {["Women Top", "One Piece", "Gown", "Jeans"].map((cat, i) => (
            <button
              key={i}
              className="px-6 py-3 bg-white border rounded-full shadow hover:bg-gray-100 transition"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-16 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          {products && products.length > 0 ? (
            products.map((p, index) => (
              <ProductCard key={p._id || p.id || index} product={p} />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No products found
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
