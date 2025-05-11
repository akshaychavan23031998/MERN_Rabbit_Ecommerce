import React, { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "./FilterSidebar";
import SortOptions from "./SortOptions";
import ProductGrid from "../components/Products/ProductGrid";

const CollectionPage = () => {
  // const [product, setProduct] = useState();
  const [products, setProducts] = useState([]);

  const sidebarRef = useRef(null);
  const buttonRef = useRef(null); // ✅ New ref for filter button
  const [isSidebarIsOpen, setIsSidebarIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarIsOpen(!isSidebarIsOpen);
  };

  const handleClickOutSide = (e) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(e.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(e.target)
    ) {
      setIsSidebarIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const fetchProducts = [
        {
          _id: 1,
          name: "Product 1",
          price: 1200,
          images: [{ url: "https://picsum.photos/500/500?random=10" }],
        },
        {
          _id: 2,
          name: "Product 2",
          price: 1200,
          images: [{ url: "https://picsum.photos/500/500?random=11" }],
        },
        {
          _id: 3,
          name: "Product 3",
          price: 1200,
          images: [{ url: "https://picsum.photos/500/500?random=12" }],
        },
        {
          _id: 4,
          name: "Product 4",
          price: 1200,
          images: [{ url: "https://picsum.photos/500/500?random=13" }],
        },
        {
          _id: 5,
          name: "Product 5",
          price: 1200,
          images: [{ url: "https://picsum.photos/500/500?random=14" }],
        },
        {
          _id: 6,
          name: "Product 6",
          price: 1200,
          images: [{ url: "https://picsum.photos/500/500?random=15" }],
        },
        {
          _id: 7,
          name: "Product 7",
          price: 1200,
          images: [{ url: "https://picsum.photos/500/500?random=16" }],
        },
        {
          _id: 8,
          name: "Product 8",
          price: 1200,
          images: [{ url: "https://picsum.photos/500/500?random=17" }],
        },
      ];
      setProducts(fetchProducts);
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Mobile Filter Button */}
      <button
        ref={buttonRef}
        onClick={toggleSidebar}
        className="lg:hidden border p-2 flex justify-center items-center"
      >
        <FaFilter className="mr-2" />
      </button>

      {/* Filter Side Bar */}
      <div
        ref={sidebarRef}
        className={`${
          isSidebarIsOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}
      >
        <FilterSidebar />
      </div>
      <div className="flex-grow p-4">
          <h2 className="text-2xl uppercase mb-4">
            All Collection
          </h2>
          {/* Sort Options */}
          <SortOptions />

          {/* Product Grid */}
          <ProductGrid products={products}/>
      </div>
    </div>
  );
};

export default CollectionPage;
