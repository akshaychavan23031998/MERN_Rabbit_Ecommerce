import React from "react";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";
import { FiPhoneCall } from "react-icons/fi";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0">
        <div>
          <h3 className="text-lg text-gray-800">Newsletter</h3>
          <p className="text-gray-500 mb-4">
            Be the first to hear about new products, exclusive events, and
            online offers.
          </p>
          <p className="font-medium text-sm text-gray-600 mb-6">
            Sign up and get 10% off your first order.
          </p>

          {/*News Letter Form*/}
          <form className="flex">
            <input
              type="email"
              placeholder="Enter Your Email"
              className="p-3 w-full text-sm border-t border-l border-b border-gray-300 rounded-l-md
                        focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
              required
            />
            <button className="bg-black text-white px-6 py-3 text-sm rounded-r-md hover:bg-gray-800">
              Subscribe
            </button>
          </form>
        </div>
        {/*Shop Links*/}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Shop</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                Men's Top Wear
              </Link>
            </li>

            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                Women's Top Wear
              </Link>
            </li>

            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                Men's Bottom Wear
              </Link>
            </li>

            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                Women's Bottom Wear
              </Link>
            </li>
          </ul>
        </div>
        {/*Support Links*/}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Support</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                Contact Us
              </Link>
            </li>

            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                About Us
              </Link>
            </li>

            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                FAQs
              </Link>
            </li>

            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                Features
              </Link>
            </li>
          </ul>
        </div>
        {/*Follow Links*/}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Follow Us</h3>
          <div className="flex items-center space-x-4 mb-6">
            <a
              className="hover:text-gray-500"
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.facebook.com/"
            >
              <TbBrandMeta className="h-5 w-5" />
            </a>

            <a
              className="hover:text-gray-500"
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.facebook.com/"
            >
              <IoLogoInstagram className="h-5 w-5" />
            </a>

            <a
              className="hover:text-gray-500"
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.facebook.com/"
            >
              <RiTwitterXLine className="h-4 w-4" />
            </a>
          </div>
          <p className="text-gray-500">Call Us</p>
          <p>
            <FiPhoneCall className="inline-block mr-2" />
            +91 8180004924
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto mt-12 px-4 border-t border-gray-200 pt-6 text-center">
        <p className="text-gray-500 text-xs md:text-sm tracking-tighter">
          © {year} Akshay_Ram_Chavan Pvt Ltd. All rights reserved.
        </p>
        <div className="flex justify-center mt-2 space-x-4 text-xs md:text-sm">
          <Link
            to="/privacy-policy"
            rel="noopener noreferrer"
            target="_blank"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-gray-400">|</span>
          <Link
            to="/terms"
            rel="noopener noreferrer"
            target="_blank"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
