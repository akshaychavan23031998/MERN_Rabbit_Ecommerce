import React, { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "./FilterSidebar";
import SortOptions from "./SortOptions";
import ProductGrid from "../components/Products/ProductGrid";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productsSlice"; 

const CollectionPage = () => {
  // const [product, setProduct] = useState();
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.products);

  // const queryParams = Object.fromEntries([...searchParams]);
  const rawParams = Object.fromEntries([...searchParams]);

  // Clean up empty or undefined values
  const queryParams = Object.fromEntries(
    Object.entries(rawParams).filter(([_, val]) => val !== "")
  );

  const sidebarRef = useRef(null);
  const buttonRef = useRef(null); // ✅ New ref for filter button
  const [isSidebarIsOpen, setIsSidebarIsOpen] = useState(false);

  // useEffect(() => {
  //   dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  // }, [dispatch, collection, searchParams]);

  useEffect(() => {
    if (!collection) return;

    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  }, [dispatch, collection, searchParams]);

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
        <h2 className="text-2xl uppercase mb-4">All Collection</h2>
        {/* Sort Options */}
        <SortOptions />

        {/* Product Grid */}
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default CollectionPage;
