import { useParams } from "react-router-dom";
import FormBuilder from "../components/BuilderCore/shared/FormBuilder";

export default function BuilderPage() {
  const { formId } = useParams();
  const parsedId = formId ? parseInt(formId, 10) : undefined;

  return <FormBuilder formId={parsedId} />;
}
