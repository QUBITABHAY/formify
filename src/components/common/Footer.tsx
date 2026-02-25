import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 bg-white border-t border-gray-200 mt-20 w-full">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-900 font-bold tracking-tight">
            Formify
          </span>
          <span className="text-gray-400 text-sm">
            © {new Date().getFullYear()}
          </span>
        </div>
        <div className="flex gap-6 text-sm text-gray-500">
          <Link to="/terms" className="hover:text-gray-900 transition-colors">
            Terms & Conditions
          </Link>
          <Link to="/privacy" className="hover:text-gray-900 transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
