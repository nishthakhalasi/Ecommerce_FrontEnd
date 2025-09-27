"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo.png";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 z-10 hover:opacity-90 transition-opacity"
    >
      <div className="relative w-16 h-16 md:w-20 md:h-20">
        <Image
          src={logo}
          alt="Fashion Shop"
          fill
          style={{ objectFit: "contain" }}
          priority
        />
      </div>
      <span className="text-lg md:text-2xl font-bold text-primary-100">
        The Fashion Shop
      </span>
    </Link>
  );
}
