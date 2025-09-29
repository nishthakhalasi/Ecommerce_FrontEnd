"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  updateProduct,
  fetchProducts,
} from "../../store/Slices/productsSlice";

export default function ProductForm({ product, onClose }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    tags: product?.tags?.join(",") || "",
    image: null,
  });

  useEffect(() => {
    setFormData({
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || "",
      tags: product?.tags?.join(",") || "",
      image: null,
    });
  }, [product]);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payloadFormData = {
      ...formData,
      tags: formData.tags,
    };

    const payload = { formData: payloadFormData };

    try {
      if (product) {
        await dispatch(
          updateProduct({ ...payload, id: product.id || product._id })
        ).unwrap();
      } else {
        await dispatch(addProduct(payload)).unwrap();
        await dispatch(fetchProducts()).unwrap();
      }

      dispatch(fetchProducts());
      onClose();
    } catch (err) {
      alert(err || "Something went wrong!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {product ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded"
          />
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            value={formData.tags}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          {product?.photo && !formData.image && (
            <div className="mb-2">
              <p className="text-gray-500 mb-1">Current Photo:</p>
              <Image
                src={`http://localhost:3000/uploads/${product.photo}`}
                alt={product.name}
                width={100}
                height={100}
                className="object-cover rounded"
              />
            </div>
          )}

          {formData.image && (
            <div className="mb-2">
              <p className="text-gray-500 mb-1">Selected Photo:</p>
              <Image
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                width={100}
                height={100}
                className="object-cover rounded"
              />
            </div>
          )}

          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="w-full"
            accept="image/*"
          />

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
