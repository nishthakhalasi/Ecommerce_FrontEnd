"use client";

import "./utils/axiosSetup";
import Image from "next/image";
import { useEffect } from "react";
import ProductCard from "./components/ProductCard";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "./components/Spinner";
import { fetchProducts } from "./store/Slices/productsSlice";

export default function HomePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <Spinner />;

  if (error)
    return <p className="text-red-500 text-center mt-6">Error: {error}</p>;

  return (
    <div className="bg-gray-50 text-gray-900">
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
      {/* Categories Section */}
      <section className="py-16 px-6 md:px-16">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Browse Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { name: "Women Tops", img: "/img/Rectangle 19280.png" },
            { name: "One Piece", img: "/img/image-6.png" },
            { name: "Gowns", img: "/img/image-1.png" },
            { name: "Jeans", img: "/img/image 3.png" },
          ].map((cat) => (
            <div
              key={cat.name}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden"
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={cat.img}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-center py-4 font-medium">{cat.name}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Featured Products */}
      <section className="py-16 px-6 md:px-16 bg-gray-100">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
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
