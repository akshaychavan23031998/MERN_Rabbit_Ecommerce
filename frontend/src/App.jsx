// import React from "react";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import UserLayout from "./components/Layout/UserLayout";
// import Privacy_Policy_Page from "./pages/Privacy_Policy_Page";
// import Terms_of_Service_Page from "./pages/Terms_of_Service_Page";
// import Home from "./pages/Home";
// import { Toaster } from "sonner";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Profile from "./pages/Profile";
// import CollectionPage from "./pages/CollectionPage";
// import LocomotiveScroll from "locomotive-scroll";
// import ProductDetails from "./components/Products/ProductDetails";
// import Checkout from "./components/Cart/Checkout";
// import OrderConfirmationPage from "./pages/OrderConfirmationPage";
// import OrderDetailsPage from "./pages/OrderDetailsPage";
// import MyOrderPage from "./pages/MyOrderPage";
// import AdminLayout from "./components/Admin/AdminLayout";
// import AdminHomePage from "./pages/AdminHomePage";
// import UserManagment from "./components/Admin/UserManagment";
// import ProductManagement from "./components/Admin/ProductManagement";
// import EditProductPage from "./components/Admin/EditProductPage";
// import OrderManagement from "./components/Admin/OrderManagement";

// import { Provider } from "react-redux";
// import store from "./redux/store";

// const App = () => {
//   const locomotiveScroll = new LocomotiveScroll();
//   return (
//     <Provider store={store}>
//       <BrowserRouter
//         future={{ v7_startTransition: true, v7_relativeSplatePath: true }}
//       >
//         <Toaster position="top-right" />
//         <Routes>
//           {/* User Layout */}
//           <Route path="/" element={<UserLayout />}>
//             <Route index element={<Home />} />
//             <Route path="login" element={<Login />} />
//             <Route path="register" element={<Register />} />
//             <Route path="profile" element={<Profile />} />
//             <Route
//               path="collections/:collection"
//               element={<CollectionPage />}
//             />
//             {/*<Route path="product/:id" element={<ProductDetails />}/>*/}
//             <Route path="product/:id" element={<ProductDetails />} />
//             <Route path="checkout" element={<Checkout />} />
//             <Route
//               path="order-confirmation"
//               element={<OrderConfirmationPage />}
//             />
//             <Route path="order/:id" element={<OrderDetailsPage />} />
//             <Route path="my-orders" element={<MyOrderPage />} />
//           </Route>

//           {/* Admin Layout */}
//           <Route path="/admin" element={<AdminLayout />}>
//             <Route index element={<AdminHomePage />} />
//             <Route path="users" element={<UserManagment />} />
//             <Route path="products" element={<ProductManagement />} />
//             <Route path="products/:id/edit" element={<EditProductPage />} />
//             <Route path="orders" element={<OrderManagement />} />
//           </Route>

//           {/* Policy page routes*/}
//           <Route path="/privacy-policy" element={<Privacy_Policy_Page />} />
//           <Route path="/terms" element={<Terms_of_Service_Page />} />
//         </Routes>
//       </BrowserRouter>
//     </Provider>
//   );
// };

// export default App;

// App.js
import React, { useEffect, useRef } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import Privacy_Policy_Page from "./pages/Privacy_Policy_Page";
import Terms_of_Service_Page from "./pages/Terms_of_Service_Page";
import Home from "./pages/Home";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CollectionPage from "./pages/CollectionPage";
import LocomotiveScroll from "locomotive-scroll";
import ProductDetails from "./components/Products/ProductDetails";
import Checkout from "./components/Cart/Checkout";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import MyOrderPage from "./pages/MyOrderPage";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHomePage from "./pages/AdminHomePage";
import UserManagment from "./components/Admin/UserManagment";
import ProductManagement from "./components/Admin/ProductManagement";
import EditProductPage from "./components/Admin/EditProductPage";
import OrderManagement from "./components/Admin/OrderManagement";
import ProtectedRoutes from "./components/Common/ProtectedRoutes";

const App = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      smartphone: {
        smooth: true,
      },
      tablet: {
        smooth: true,
      },
    });

    return () => {
      if (scroll) scroll.destroy();
    };
  }, []);

  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatePath: true }}
    >
      <Toaster position="top-right" />
      {/* This is the required scroll container for locomotive-scroll */}
      <div data-scroll-container ref={scrollRef}>
        <Routes>
          {/* User Layout */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route
              path="collections/:collection"
              element={<CollectionPage />}
            />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="checkout" element={<Checkout />} />
            <Route
              path="order-confirmation"
              element={<OrderConfirmationPage />}
            />
            <Route path="order/:id" element={<OrderDetailsPage />} />
            <Route path="my-orders" element={<MyOrderPage />} />
          </Route>

          {/* Admin Layout */}
          <Route
            path="/admin"
            element={
              <ProtectedRoutes role="admin">
                <AdminLayout />
              </ProtectedRoutes>
            }
          >
            <Route index element={<AdminHomePage />} />
            <Route path="users" element={<UserManagment />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/:id/edit" element={<EditProductPage />} />
            <Route path="orders" element={<OrderManagement />} />
          </Route>

          {/* Policy pages */}
          <Route path="/privacy-policy" element={<Privacy_Policy_Page />} />
          <Route path="/terms" element={<Terms_of_Service_Page />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
