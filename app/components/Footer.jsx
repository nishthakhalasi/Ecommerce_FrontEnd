"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white w-full py-10">
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">About Us</h2>
            <p className="text-gray-400 text-sm sm:text-base">
              We are a professional company providing top-notch solutions and
              services to help you grow your business online.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Quick Links</h2>
            <ul className="text-gray-400 space-y-2 text-sm sm:text-base">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-400 text-sm sm:text-base">
              123 Main Street, City, Country
            </p>
            <p className="text-gray-400 text-sm sm:text-base mt-1">
              Email: info@example.com
            </p>
            <p className="text-gray-400 text-sm sm:text-base mt-1">
              Phone: +1 234 567 890
            </p>
          </div>
        </div>

        <hr className="my-8 border-gray-700" />
        <div className="flex flex-col sm:flex-row items-center justify-between text-gray-400 text-sm gap-4 sm:gap-0 w-full">
          <p className="text-center sm:text-left w-full sm:w-auto">
            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
          <div className="flex space-x-4 justify-center sm:justify-end w-full sm:w-auto">
            <a href="#" className="hover:text-white transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Facebook
            </a>
            <a href="#" className="hover:text-white transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
