import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getForm,
  getFormResponses,
  deleteResponse,
  type FormResponse,
  type FormResponsesResult,
} from "../services/api";
import type { FormFieldConfig } from "../components/BuilderCore/shared/types";
import { Icons } from "../components/common/icons";

export default function FormResponsesPage() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormResponse | null>(null);
  const [responsesData, setResponsesData] =
    useState<FormResponsesResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!formId) return;
        const id = parseInt(formId);
        const [formData, resData] = await Promise.all([
          getForm(id),
          getFormResponses(id),
        ]);
        console.log(formData, resData);
        setForm(formData);
        setResponsesData(resData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [formId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!form || !responsesData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Form not found</p>
      </div>
    );
  }

  const fields = ((form.schema as any).fields as FormFieldConfig[]) || [];
  const responses = responsesData.responses;

  const formatAnswer = (answer: any) => {
    if (
      answer === undefined ||
      answer === null ||
      answer.toString().trim() === ""
    )
      return "Not Available";
    if (Array.isArray(answer) && answer.length === 0) return "Not Available";
    if (Array.isArray(answer)) return answer.join(", ");
    if (typeof answer === "boolean") return answer ? "Yes" : "No";
    return answer.toString();
  };

  const handleDeleteResponse = async (responseId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this response? This action cannot be undone.",
      )
    ) {
      return;
    }
    try {
      setDeleting(responseId);
      await deleteResponse(responseId);
      setResponsesData({
        ...responsesData!,
        count: responsesData!.count - 1,
        responses: responsesData!.responses.filter((r) => r.id !== responseId),
      });
    } catch (error) {
      console.error("Failed to delete response", error);
      alert("Failed to delete response. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back to Dashboard
            </button>
            <div className="h-6 w-px bg-gray-200"></div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              {form.name}{" "}
              <span className="text-gray-400 font-normal">Responses</span>
            </h1>
          </div>
          <div className="text-sm text-gray-500">
            {responsesData.count} response{responsesData.count !== 1 ? "s" : ""}
          </div>
        </div>
      </nav>

      <div className="p-6">
        {responses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4 flex items-center justify-center">
              <Icons.Inbox />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No responses yet
            </h3>
            <p className="mt-1 text-gray-500">
              Share your form to start collecting responses.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sticky left-0 bg-gray-50 z-10"></th>
                    {fields.map((field) => (
                      <th
                        key={field.id}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {field.title}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Submission Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Submission Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {responses.map((response, idx) => (
                    <tr key={response.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                        {idx + 1}
                      </td>
                      {fields.map((field) => {
                        const answer =
                          response.data[field.title] ?? response.data[field.id];
                        return (
                          <td
                            key={field.id}
                            className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate"
                            title={formatAnswer(answer)}
                          >
                            {formatAnswer(answer)}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {new Date(response.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {new Date(response.created_at).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDeleteResponse(response.id)}
                          disabled={deleting === response.id}
                          className={`font-medium ${deleting === response.id ? "text-gray-400" : "text-red-600 hover:text-red-700 hover:underline"}`}
                        >
                          {deleting === response.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
