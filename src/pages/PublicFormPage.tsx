import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getForm, submitResponse } from "../services/api";
import type { FormResponse } from "../services/apiTypes";
import type { FormFieldConfig } from "../components/BuilderCore/shared/types";
import FlowPage from "../layouts/FlowPage";
import SinglePage from "../layouts/SinglePage";

export default function PublicFormPage() {
  const { formId } = useParams();
  const [form, setForm] = useState<FormResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        if (!formId) return;
        const data = await getForm(parseInt(formId));
        setForm(data);
      } catch (err) {
        console.error(err);
        setError("Form not found or unavailable.");
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [formId]);

  const handleSubmit = async (answers: Record<string, any>) => {
    if (!form || !formId) return;

    const schema = form.schema as any;
    const formFields = (schema.fields as FormFieldConfig[]) || [];
    const fieldIdToTitle = formFields.reduce(
      (acc, field) => {
        acc[field.id] = field.title || field.id;
        return acc;
      },
      {} as Record<string, string>,
    );

    const structuredAnswers = Object.entries(answers).reduce(
      (acc, [fieldId, value]) => {
        const title = fieldIdToTitle[fieldId] || fieldId;
        acc[title] = value;
        return acc;
      },
      {} as Record<string, any>,
    );

    try {
      console.log("Submitting response:", structuredAnswers);
      await submitResponse(parseInt(formId), structuredAnswers, {});
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Failed to submit form. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Form
          </h2>
          <p className="text-gray-600">{error || "Form not found"}</p>
        </div>
      </div>
    );
  }

  if (form.status !== "published") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Form Unavailable
          </h2>
          <p className="text-gray-600">
            This form is no longer accepting responses.
          </p>
        </div>
      </div>
    );
  }

  const schema = form.schema as any;
  const fields = (schema.fields as FormFieldConfig[]) || [];
  const type = schema.type as "single" | "flow";

  if (type === "flow") {
    return (
      <div className="min-h-screen bg-gray-50">
        <FlowPage
          formTitle={form.name}
          formDescription={form.description}
          fields={fields}
          welcomeScreen={
            schema.welcomeScreen || {
              title: "Welcome",
              description: "",
              buttonText: "Start",
            }
          }
          thankYouScreen={
            schema.thankYouScreen || {
              title: "Thank You",
              description: "Your submission has been received.",
              emoji: "🎉",
            }
          }
          onSubmit={handleSubmit}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {submitted ? (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎉</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600">
            Your submission has been received successfully.
          </p>
        </div>
      ) : (
        <SinglePage
          formTitle={form.name}
          formDescription={form.description}
          formBanner={schema.formBanner}
          fields={fields}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
