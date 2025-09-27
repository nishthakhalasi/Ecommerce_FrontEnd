"use client";

import React from "react";

export default function QuantityButton({ value, onDecrease, onIncrease }) {
  return (
    <div className="flex items-center border rounded-lg overflow-hidden">
      <button
        onClick={onDecrease}
        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition"
      >
        -
      </button>
      <span className="px-4 py-1 font-medium">{value}</span>
      <button
        onClick={onIncrease}
        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition"
      >
        +
      </button>
    </div>
  );
}
