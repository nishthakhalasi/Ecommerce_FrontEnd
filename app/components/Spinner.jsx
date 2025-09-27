"use client";

import Image from "next/image";

export default function Spinner({
  gifSrc = "/FastShoppingDelivery.gif",
  size = 150,
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50/70 z-50">
      <Image
        src={gifSrc}
        alt="Loading..."
        width={size}
        height={size}
        quality={100}
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    </div>
  );
}
