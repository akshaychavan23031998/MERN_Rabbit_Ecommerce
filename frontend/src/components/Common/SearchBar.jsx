// import React, { useState } from "react";
// import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { setFilters } from "../../redux/slices/productsSlice";
// import { fetchProductsByFilters } from "../../redux/slices/productsSlice";

// const SearchBar = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleSearchToggle = () => {
//     setIsOpen(!isOpen);
//   };

//   const handlSearch = (e) => {
//     e.preventDefault();
//     // console.log("Searched Text", searchTerm);
//     dispatch(setFilters({ search: searchTerm }));
//     dispatch(fetchProductsByFilters({ search: searchTerm }));
//     navigate(`/collections/all?search=${searchTerm}`);
//     setIsOpen(false);
//   };

//   return (
//     <div
//       className={`flex items-center justify-center w-full transition-all duration-300
//         ${isOpen ? "absolute top-0 left-0 w-full bg-white h-24 z-50" : "w-auto"}
//         `}
//     >
//       {isOpen ? (
//         <form
//           onSubmit={handlSearch}
//           className="relative flex items-center justify-center w-full"
//         >
//           <div className="relative w-1/2">
//             <input
//               type="text"
//               placeholder="Search"
//               onChange={(e) => setSearchTerm(e.target.value)}
//               value={searchTerm}
//               className="bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700"
//             />
//             {/*Search Icon*/}
//             <button
//               type="submit"
//               className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
//             >
//               <HiMagnifyingGlass />
//             </button>
//           </div>
//           {/*Close Icon*/}
//           <button
//             type="button"
//             onClick={handleSearchToggle}
//             className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
//           >
//             <HiMiniXMark className="h-6 w-6 text-gray-700" />
//           </button>
//         </form>
//       ) : (
//         <button onClick={handleSearchToggle}>
//           <HiMagnifyingGlass className="h-6 w-6 text-gray-700" />
//         </button>
//       )}
//     </div>
//   );
// };

// export default SearchBar;


import React, { useState, useEffect, useRef } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFilters, fetchProductsByFilters } from "../../redux/slices/productsSlice";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchRef = useRef();
  const inputRef = useRef();

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm }));
    dispatch(fetchProductsByFilters({ search: searchTerm }));
    navigate(`/collections/all?search=${searchTerm}`);
    setIsOpen(false);
  };

  // Detect outside click and ESC key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);

      // Auto-focus input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen]);

  return (
    <div
      ref={searchRef}
      className={`flex items-center justify-center w-full transition-all duration-300 ${
        isOpen ? "absolute top-0 left-0 w-full bg-white h-24 z-50" : "w-auto"
      }`}
    >
      {isOpen ? (
        <form
          onSubmit={handleSearch}
          className="relative flex items-center justify-center w-full"
        >
          <div className="relative w-1/2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              className="bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              <HiMagnifyingGlass />
            </button>
          </div>

          <button
            type="button"
            onClick={handleSearchToggle}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
          >
            <HiMiniXMark className="h-6 w-6 text-gray-700" />
          </button>
        </form>
      ) : (
        <button onClick={handleSearchToggle}>
          <HiMagnifyingGlass className="h-6 w-6 text-gray-700" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;


