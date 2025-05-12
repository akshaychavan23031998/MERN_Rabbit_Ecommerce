import React from "react";
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

const App = () => {
  const locomotiveScroll = new LocomotiveScroll();
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatePath: true }}
    >
      <Toaster position="top-right" />
      <Routes>
        {/* User Layout */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="collections/:collection" element={<CollectionPage />} />
          {/*<Route path="product/:id" element={<ProductDetails />}/>*/}
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="checkout" element={<Checkout/>}/>
        </Route>
        <Route>{/* Admin Layout */}</Route>
        <Route path="/privacy-policy" element={<Privacy_Policy_Page />} />
        <Route path="/terms" element={<Terms_of_Service_Page />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
