import { useState, useEffect } from "react";
import type { FormMode } from "./types";
import FlowFormBuilder from "../Flow/FlowFormBuilder";
import SinglePageFormBuilder from "../Single/SinglePageFormBuilder";
import { getForm } from "../../../services/api";
import type { FormResponse } from "../../../services/apiTypes";

interface FormBuilderProps {
  formId?: number;
}

export default function FormBuilder({ formId }: FormBuilderProps) {
  const [mode, setMode] = useState<FormMode>("flow");
  const [formData, setFormData] = useState<FormResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      if (!formId) {
        setLoading(false);
        return;
      }
      try {
        const data = await getForm(formId);
        setFormData(data);
        if (data.schema && typeof data.schema.type === "string") {
          setMode(data.schema.type as FormMode);
        }
      } catch (error) {
        console.error("Failed to fetch form", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col relative">
      <div className="flex-1 h-full">
        {mode === "flow" ? (
          <FlowFormBuilder
            formId={formId}
            initialFields={formData?.schema?.fields as any}
            initialWelcome={formData?.schema?.welcomeScreen as any}
            initialThankYou={formData?.schema?.thankYouScreen as any}
            initialIsPublished={formData?.status === "published"}
          />
        ) : (
          <SinglePageFormBuilder
            formId={formId}
            initialFields={formData?.schema?.fields as any}
            initialTitle={formData?.name}
            initialDescription={formData?.description}
            initialBanner={formData?.schema?.formBanner as string}
            initialIsPublished={formData?.status === "published"}
          />
        )}
      </div>
    </div>
  );
}
