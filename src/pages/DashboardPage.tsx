import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import { Icons } from "../components/common/icons";
import { createForm, getForms, deleteForm } from "../services/api";
import type { FormResponse } from "../services/apiTypes";
import logo from "../assets/logo.svg";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [forms, setForms] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const data = await getForms();
      setForms(data);
    } catch (error) {
      console.error("Failed to fetch forms", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForm = async (type: "single" | "flow") => {
    try {
      setCreating(true);
      const newForm = await createForm({
        name: `My ${type === "single" ? "Single Page" : "Flow"} Form`,
        user_id: 1,
        schema: { type },
      });
      navigate(`/builder/${newForm.id}`);
    } catch (error) {
      console.error("Failed to create form", error);
    } finally {
      setCreating(false);
      setIsModalOpen(false);
    }
  };

  const handleDeleteForm = async (e: React.MouseEvent, formId: number) => {
    e.stopPropagation();
    if (
      !confirm(
        "Are you sure you want to delete this form? This action cannot be undone.",
      )
    ) {
      return;
    }
    try {
      setDeleting(formId);
      await deleteForm(formId);
      setForms(forms.filter((f) => f.id !== formId));
    } catch (error) {
      console.error("Failed to delete form", error);
      alert("Failed to delete form. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="Formify Logo" className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Formify
            </span>
          </div>
          <Button
            title="+ Create New Form"
            onClick={() => setIsModalOpen(true)}
            bgColor="bg-indigo-600"
            textColor="text-white text-sm"
          />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Forms</h1>
          <p className="text-gray-500 mt-1">
            Manage and edit your existing forms.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : forms.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4 flex items-center justify-center">
                <Icons.Inbox />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No forms yet</h3>
            <p className="mt-1 text-gray-500">
              Get started by creating your first form.
            </p>
            <div className="mt-6 flex items-center justify-center">
              <Button
                title="Create Form"
                onClick={() => setIsModalOpen(true)}
                bgColor="bg-indigo-600"
                textColor="text-white text-sm"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <div
                key={form.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => navigate(`/builder/${form.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 flex items-center justify-center">
                      <Icons.Text />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    {form.schema?.type === "flow" ? "Flow" : "Single"}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {form.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 h-10 mb-4">
                  {form.description || "No description provided."}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm text-gray-500">
                  <span>
                    {new Date(form.created_at).toLocaleDateString("en-IN")}
                  </span>
                  <div className="flex items-center gap-4">
                    <span
                      className="flex items-center text-indigo-600 font-medium hover:underline z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/forms/${form.id}/responses`);
                      }}
                    >
                      View Responses
                    </span>
                    <span
                      className={`flex items-center font-medium z-10 ${deleting === form.id ? "text-gray-400" : "text-red-600 hover:text-red-700 hover:underline"}`}
                      onClick={(e) => handleDeleteForm(e, form.id)}
                    >
                      {deleting === form.id ? "Deleting..." : "Delete"}
                    </span>
                    <span className="flex items-center text-indigo-600 font-medium">
                      Edit <span className="ml-1">&rarr;</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create a new form"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleCreateForm("single")}
            disabled={creating}
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
            disabled={creating}
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
