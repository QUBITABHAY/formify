import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import Footer from "../components/common/Footer";

const PrivacyPage: React.FC = () => {
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
            Privacy Policy
          </h1>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto">
            How Formify collects, uses, and protects your information.
          </p>
        </div>

        <div className="max-w-none text-gray-600">
          <p className="text-sm border-b border-gray-100 pb-8 mb-8 text-gray-400 font-medium">
            Last updated: March 18, 2026
          </p>

          <p className="leading-relaxed mb-6">
            This Privacy Policy describes Our policies and procedures on the
            collection, use, and disclosure of Your information when You use
            Formify, a platform for creating forms and collecting responses.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Information We Collect
          </h2>
          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
            Information You Provide to Us
          </h3>
          <ul className="list-disc pl-6 space-y-3 mb-8">
            <li className="leading-relaxed">
              <strong className="text-gray-900">Account Information:</strong>{" "}
              When you sign up using Google OAuth, we collect your email
              address, name, and profile picture provided by Google.
            </li>
            <li className="leading-relaxed">
              <strong className="text-gray-900">
                Form Templates and Structure:
              </strong>{" "}
              We store the configuration, fields, and styling of the forms you
              create.
            </li>
            <li className="leading-relaxed">
              <strong className="text-gray-900">Form Responses:</strong> We act
              as a data processor for the submissions collected through your
              forms. You (the form creator) are the data controller for this
              information.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
            Automatically Collected Information
          </h3>
          <ul className="list-disc pl-6 space-y-3 mb-8">
            <li className="leading-relaxed">
              <strong className="text-gray-900">Usage Data:</strong> We may
              collect data on how the Service is accessed and used, including
              browser type, pages visited, and time spent on the platform.
            </li>
            <li className="leading-relaxed">
              <strong className="text-gray-900">Cookies:</strong> We use
              HttpOnly cookies to securely manage your authentication sessions.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-3 mb-8">
            <li className="leading-relaxed">
              To provide, maintain, and improve the Formify service.
            </li>
            <li className="leading-relaxed">
              To manage your account and authentication sessions securely.
            </li>
            <li className="leading-relaxed">
              To host and display your forms to respondents.
            </li>
            <li className="leading-relaxed">
              To securely store and transmit form submissions on your behalf.
            </li>
            <li className="leading-relaxed">
              To integrate with third-party services you authorize, such as
              Google Sheets.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Third-Party Integrations
          </h2>
          <p className="leading-relaxed mb-6">
            Formify offers optional integrations with third-party services like
            Google Sheets. If you choose to enable the Google Sheets
            integration:
          </p>
          <ul className="list-disc pl-6 space-y-3 mb-8">
            <li className="leading-relaxed">
              We will request access to manage spreadsheets in your Google
              Drive.
            </li>
            <li className="leading-relaxed">
              Form responses will be automatically transmitted to the connected
              Google Sheet.
            </li>
            <li className="leading-relaxed">
              Formify&apos;s use of information received from Google APIs will
              adhere to the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                className="text-indigo-600 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Google User Data Sharing, Transfer, and Disclosure
          </h2>
          <p className="leading-relaxed mb-6">
            We do not sell Google user data. We only share, transfer, or
            disclose Google user data in the following limited cases:
          </p>
          <ul className="list-disc pl-6 space-y-3 mb-8">
            <li className="leading-relaxed">
              <strong className="text-gray-900">With your direction:</strong> If
              you enable Google Sheets integration, form response data is sent
              to the Google Sheet you selected.
            </li>
            <li className="leading-relaxed">
              <strong className="text-gray-900">Service providers:</strong> We
              may process Google user data through trusted subprocessors (such
              as cloud hosting, logging, and security providers) solely to
              operate, secure, and maintain Formify, under contractual
              confidentiality and data protection obligations.
            </li>
            <li className="leading-relaxed">
              <strong className="text-gray-900">Legal requirements:</strong> We
              may disclose data if required to comply with applicable law,
              regulation, legal process, or enforceable governmental request.
            </li>
            <li className="leading-relaxed">
              <strong className="text-gray-900">Business transfers:</strong> If
              Formify is involved in a merger, acquisition, financing due
              diligence, reorganization, bankruptcy, receivership, sale of
              assets, or transition of service to another provider, Google user
              data may be transferred as part of that transaction, subject to
              this Privacy Policy and applicable law.
            </li>
          </ul>
          <p className="leading-relaxed mb-6">
            We do not use Google user data for advertising purposes and do not
            allow humans to read Google user data except: (a) when we have your
            affirmative agreement for specific support or troubleshooting, (b)
            when required for security purposes (such as abuse investigations),
            (c) when required by law, or (d) for internal operations as
            permitted by the Google API Services User Data Policy.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Data Security and Retention
          </h2>
          <p className="leading-relaxed mb-6">
            We prioritize the security of your data. We use standard security
            measures, including HttpOnly cookies for session management to
            prevent XSS attacks, and we store form submissions securely in our
            database. All form responses are encrypted at rest to ensure your
            data remains completely secure and unreadable to unauthorized
            parties. We retain your data and form submissions as long as your
            account is active, or until you choose to delete your forms or
            account.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Contact Us
          </h2>
          <p className="leading-relaxed mb-4">
            If you have any questions about this Privacy Policy, please contact
            us:
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

export default PrivacyPage;
