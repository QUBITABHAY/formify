import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import Footer from "../components/common/Footer";

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col relative">
      <div className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none opacity-60"></div>

      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Formify Logo" className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Formify
          </span>
        </Link>
      </nav>

      <main className="relative z-10 grow max-w-4xl mx-auto px-6 py-12 md:py-20 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto">
            The rules and guidelines for using the Formify platform.
          </p>
        </div>

        <div className="max-w-none text-gray-600">
          <p className="text-sm border-b border-gray-100 pb-8 mb-8 text-gray-400 font-medium">
            Last updated: March 03, 2026
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Introduction
          </h2>
          <p className="leading-relaxed mb-6">
            Welcome to Formify. By accessing or using our form building service,
            you agree to be bound by these Terms and Conditions. Formify acts as
            a platform that allows users to create forms, share them, and
            collect responses.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Account and Security
          </h2>
          <p className="leading-relaxed mb-6">
            To use Formify, you must authenticate using your Google Account. You
            are responsible for safeguarding your Google account credentials.
            Formify uses secure HttpOnly cookies to manage your active session
            and does not store your Google password.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            User Content and Acceptable Use
          </h2>
          <p className="leading-relaxed mb-6">
            As a form creator, you retain all ownership rights to the content
            you create (your forms) and the data submitted by your respondents.
            By using Formify, you grant us a license to host, store, and display
            your forms in order to provide the Service.
          </p>
          <p className="leading-relaxed mb-6">
            You agree NOT to use Formify to:
          </p>
          <ul className="list-disc pl-6 space-y-3 mb-8">
            <li className="leading-relaxed">
              Collect sensitive personal information such as passwords, social
              security numbers, or credit card details without utilizing
              appropriate secure fields or obtaining explicit legal consent.
            </li>
            <li className="leading-relaxed">
              Create forms for the purpose of phishing, spamming, or tricking
              respondents.
            </li>
            <li className="leading-relaxed">
              Distribute malware, illegal content, or any material that
              infringes upon the intellectual property rights of others.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Google Sheets Integration
          </h2>
          <p className="leading-relaxed mb-6">
            Formify provides functionality to sync your form responses
            automatically to Google Sheets. By enabling this feature, you
            authorize Formify to view and manage the specific spreadsheets it
            creates in your Google Drive on your behalf. You are responsible for
            the data exported to Google Sheets.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Limitation of Liability
          </h2>
          <p className="leading-relaxed mb-6">
            Formify is provided &quot;as is&quot; and &quot;as available&quot;.
            The Company assumes no responsibility or liability for the content
            of the forms created by users, nor the data collected through those
            forms. We do not guarantee uninterrupted access to the Service.
            Formify shall not be liable for any indirect, incidental, special,
            or consequential damages resulting from your use of the Service.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Termination
          </h2>
          <p className="leading-relaxed mb-6">
            We reserve the right to suspend or terminate your access to the
            Service immediately, without prior notice, if you violate these
            Terms and Conditions (e.g., establishing forms for malicious
            purposes). Upon termination, your right to use the Service will
            cease immediately.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Contact Us
          </h2>
          <p className="leading-relaxed mb-4">
            If you have any questions about these Terms and Conditions, please
            contact us:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li className="leading-relaxed">
              By email: support@formify.software
            </li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;
