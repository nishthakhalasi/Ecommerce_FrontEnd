"use client";

import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="relative bg-pink-400 text-white py-24">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About Fashion Shop
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            We are passionate about bringing the latest fashion trends to your
            doorstep. Our mission is to provide high-quality, stylish apparel
            for everyone.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 md:px-12 py-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <Image
              src="/shop.jpg"
              alt="Fashion Shop"
              width={600}
              height={400}
              className="rounded-xl shadow-lg object-cover"
            />
          </div>
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Who We Are</h2>
            <p className="text-gray-700 text-lg">
              Fashion Shop is your one-stop destination for the latest trends in
              clothing and accessories. We believe fashion is not just about
              clothes, but a way to express yourself. Our team carefully selects
              each product to ensure quality and style.
            </p>
            <p className="text-gray-700 text-lg">
              Whether you're looking for casual wear, office attire, or
              statement pieces, Fashion Shop has something for everyone.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Alice Johnson", role: "CEO", image: "/member1.jpg" },
              {
                name: "Michael Smith",
                role: "Designer",
                image: "/member2.jpg",
              },
              { name: "Sophia Lee", role: "Marketing", image: "/member3.jpg" },
            ].map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150}
                  height={150}
                  className="rounded-full object-cover mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800">
                  {member.name}
                </h3>
                <p className="text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 mb-20 text-center bg-pink-400 text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to upgrade your wardrobe?
        </h2>
        <p className="text-lg md:text-xl mb-6">
          Browse our latest collection and find your perfect style today.
        </p>
        <a
          href="/user/products"
          className="inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Shop Now
        </a>
      </section>
    </div>
  );
}
