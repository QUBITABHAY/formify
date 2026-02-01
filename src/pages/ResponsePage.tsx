import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getForm,
  getResponse,
  type FormResponse,
  type FormSubmission,
} from "../services/api";
import type { FormFieldConfig } from "../components/BuilderCore/shared/types";

export default function ResponsePage() {
  const { responseId } = useParams();
  const [response, setResponse] = useState<FormSubmission | null>(null);
  const [form, setForm] = useState<FormResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!responseId) return;
        const resData = await getResponse(parseInt(responseId));
        setResponse(resData);
        const formData = await getForm(resData.form_id);
        setForm(formData);
      } catch (err) {
        console.error(err);
        setError("Failed to load response");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [responseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !response || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Response
          </h2>
          <p className="text-gray-600">{error || "Response not found"}</p>
        </div>
      </div>
    );
  }

  const fields = (form.schema.fields as FormFieldConfig[]) || [];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">{form.name}</h1>
            <p className="mt-2 text-gray-600">{form.description}</p>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full font-medium">
                Submitted
              </span>
              <span className="mx-2">•</span>
              <span>{new Date(response.created_at).toLocaleString()}</span>
            </div>
          </div>

          <div className="px-6 py-6 space-y-8">
            {fields.map((field) => {
              const answer =
                response.data[field.title] ?? response.data[field.id];
              return (
                <div
                  key={field.id}
                  className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {field.title}
                  </h3>
                  {field.subtitle && (
                    <p className="text-sm text-gray-500 mb-3">
                      {field.subtitle}
                    </p>
                  )}
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-800">
                    {Array.isArray(answer) ? (
                      <ul className="list-disc list-inside">
                        {answer.map((val, idx) => (
                          <li key={idx}>{val}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>
                        {answer?.toString() || (
                          <span className="text-gray-400 italic">
                            No answer provided
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
