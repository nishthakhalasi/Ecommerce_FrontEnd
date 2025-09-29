"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import ProductForm from "./ProductForm";
import Spinner from "../../components/Spinner";
import { fetchProducts, deleteProduct } from "../../store/Slices/productsSlice";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    dispatch(deleteProduct(id));
  };

  // Pagination calculations
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <Spinner />;
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-bold text-gray-800 border-l-4 border-blue-600 pl-4 drop-shadow-lg">
          Products Management
        </h2>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          onClick={() => {
            setEditProduct(null);
            setShowForm(true);
          }}
        >
          Add Product
        </button>
      </div>
      {error && (
        <p className="text-red-500 mb-4 text-lg font-medium">{error}</p>
      )}

      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl shadow-md">
            <table className="w-full text-center border-collapse text-xl">
              <thead className="bg-blue-700 text-white text-xl">
                <tr>
                  <th className="p-3 border-b">Photo</th>
                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b">Description</th>
                  <th className="p-3 border-b">Price</th>
                  <th className="p-3 border-b">Tags</th>
                  <th className="p-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.length > 0 ? (
                  currentProducts.map((p, index) => (
                    <tr
                      key={`${p.id}-${index}`}
                      className="hover:bg-gray-100 transition"
                    >
                      <td className="p-3 flex justify-center items-center">
                        {p.photo ? (
                          <Image
                            src={`http://localhost:3000/uploads/${p.photo}`}
                            alt={p.name}
                            width={70}
                            height={70}
                            className="object-contain rounded"
                          />
                        ) : (
                          <span className="text-gray-400">No Image</span>
                        )}
                      </td>
                      <td className="p-3 font-medium">{p.name}</td>
                      <td className="p-3 text-gray-600">{p.description}</td>
                      <td className="p-3 font-semibold text-gray-800">
                        ₹{p.price}
                      </td>
                      <td className="p-3 text-gray-500">
                        {p.tags?.join(", ")}
                      </td>
                      <td className="px-5 py-3 flex gap-2 justify-center items-center">
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="px-5 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition text-xl"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => {
                            setEditProduct(p);
                            setShowForm(true);
                          }}
                          className="px-5 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition text-xl"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-3 text-center text-gray-500 font-medium"
                    >
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {showForm && (
        <ProductForm
          product={editProduct}
          onClose={() => {
            setShowForm(false);
            dispatch(fetchProducts());
          }}
        />
      )}
    </div>
  );
}
