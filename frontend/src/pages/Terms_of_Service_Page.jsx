import React from "react";
import Header from "../components/Common/Header";
import Footer from "../components/Common/Footer";

const TermsOfService = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-2xl font-semibold mb-6">Terms of Service</h1>

        <p className="mb-4 text-gray-700">
          Welcome to CompileTab. By accessing or using our website, you agree to
          be bound by these Terms of Service. Please read them carefully.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          1. Use of Our Website
        </h2>
        <p className="mb-4 text-gray-700">
          You agree to use our website only for lawful purposes. You must not
          use it in a way that breaches any law or regulation or is fraudulent
          or harmful.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          2. Orders and Payments
        </h2>
        <p className="mb-4 text-gray-700">
          All orders placed through our website are subject to availability and
          acceptance. We reserve the right to refuse or cancel any order for any
          reason. Prices are subject to change without notice.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          3. Shipping & Delivery
        </h2>
        <p className="mb-4 text-gray-700">
          We aim to deliver your orders within the estimated timeframes but
          cannot guarantee delivery dates. Delays may occur due to unforeseen
          circumstances.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          4. Returns & Refunds
        </h2>
        <p className="mb-4 text-gray-700">
          Please review our Returns & Refunds Policy for information on how to
          return items and receive a refund.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          5. Intellectual Property
        </h2>
        <p className="mb-4 text-gray-700">
          All content on this website, including text, graphics, logos, and
          images, is the property of CompileTab and is protected by copyright
          laws. You may not use our content without our written permission.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          6. Limitation of Liability
        </h2>
        <p className="mb-4 text-gray-700">
          We are not liable for any direct, indirect, incidental, or
          consequential damages arising from your use of our website or
          products.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          7. Changes to These Terms
        </h2>
        <p className="mb-4 text-gray-700">
          We reserve the right to modify these Terms of Service at any time.
          Changes will be effective immediately upon posting.
        </p>

        <p className="mt-8 text-gray-700">
          If you have any questions about these Terms of Service, please contact
          us at support@compiletab.com.
        </p>
      </div>
      <Footer/>
    </>
  );
};

export default TermsOfService;
