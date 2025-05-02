import React from "react";
import Header from "../components/Common/Header";
import Footer from "../components/Common/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-2xl font-semibold mb-6">Privacy Policy</h1>

        <p className="mb-4 text-gray-700">
          At CompileTab, we are committed to protecting your personal
          information and your right to privacy. This Privacy Policy explains
          how we collect, use, disclose, and safeguard your information when you
          visit our website or make a purchase.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          1. Information We Collect
        </h2>
        <p className="mb-4 text-gray-700">
          We may collect personal information such as your name, email address,
          shipping address, billing address, payment information, and phone
          number when you place an order or sign up for our newsletter.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          2. How We Use Your Information
        </h2>
        <p className="mb-4 text-gray-700">
          We use your information to:
          <ul className="list-disc pl-5 mt-2">
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about your order status</li>
            <li>Send promotional offers and newsletters (if opted in)</li>
            <li>Improve our website and customer service</li>
            <li>Comply with legal obligations</li>
          </ul>
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          3. Sharing Your Information
        </h2>
        <p className="mb-4 text-gray-700">
          We do not sell, rent, or trade your personal information. We may share
          your data with trusted third parties who help us operate our website,
          conduct business, or serve you, as long as they agree to keep your
          information confidential.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Security</h2>
        <p className="mb-4 text-gray-700">
          We implement a variety of security measures to maintain the safety of
          your personal information when you place an order or enter, submit, or
          access your personal details.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Your Rights</h2>
        <p className="mb-4 text-gray-700">
          You have the right to access, correct, or delete your personal data at
          any time. You can also opt out of receiving marketing emails by
          clicking the unsubscribe link in any of our emails.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          6. Changes to This Policy
        </h2>
        <p className="mb-4 text-gray-700">
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page with an updated effective date.
        </p>

        <p className="mt-8 text-gray-700">
          If you have any questions about this Privacy Policy, please contact us
          at support@compiletab.com.
        </p>
      </div>
      <Footer/>
    </>
  );
};

export default PrivacyPolicy;
