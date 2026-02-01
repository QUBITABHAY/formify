import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import logo from "../assets/logo.svg";
import Modal from "../components/common/Modal";
import { createForm } from "../services/api";

function HomePage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStartBuilding = () => {
    setIsModalOpen(true);
  };

  const handleCreateForm = async (type: "single" | "flow") => {
    try {
      setLoading(true);
      const newForm = await createForm({
        name: `My ${type === "single" ? "Single Page" : "Flow"} Form`,
        user_id: 1,
        schema: { type },
      });
      navigate(`/builder/${newForm.id}`);
    } catch (error) {
      console.error("Failed to create form", error);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Formify Logo" className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Formify
          </span>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center text-center px-4 pt-20 pb-32 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
          Build forms that <span className="text-indigo-600">convert</span>.
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Create beautiful, logic-driven forms with our intuitive drag-and-drop
          builder. Just design, share, and analyze.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Button
            title="Start Building Now"
            onClick={handleStartBuilding}
            bgColor="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
            textColor="text-white px-8 py-3 text-lg"
          />
          <button
            className="px-6 py-3 rounded-lg text-gray-600 hover:text-gray-900 font-medium transition-colors"
            onClick={() => {}}
          >
            Learn more &rarr;
          </button>
          <Button
            title="Dashboard"
            onClick={() => navigate("/dashboard")}
            textColor="text-white px-8 py-3 text-lg"
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create a new form"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleCreateForm("single")}
            disabled={loading}
            className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-600 hover:bg-indigo-50 transition-all group disabled:opacity-50"
          >
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Single Page</h3>
            <p className="text-sm text-gray-500 text-center">
              Traditional vertical form layout
            </p>
          </button>

          <button
            onClick={() => handleCreateForm("flow")}
            disabled={loading}
            className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-600 hover:bg-indigo-50 transition-all group disabled:opacity-50"
          >
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Conversational Flow
            </h3>
            <p className="text-sm text-gray-500 text-center">
              One question at a time
            </p>
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default HomePage;
