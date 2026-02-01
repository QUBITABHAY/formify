import { BrowserRouter, Routes, Route } from "react-router-dom";
import BuilderPage from "./pages/BuilderPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ResponsePage from "./pages/ResponsePage";
import FormResponsesPage from "./pages/FormResponsesPage";
import PublicFormPage from "./pages/PublicFormPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/builder/:formId" element={<BuilderPage />} />
        <Route
          path="/forms/:formId/responses"
          element={<FormResponsesPage />}
        />
        <Route path="/responses/:responseId" element={<ResponsePage />} />
        <Route path="/s/:formId" element={<PublicFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
