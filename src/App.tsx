import { BrowserRouter, Routes, Route } from "react-router-dom";
import BuilderPage from "./pages/BuilderPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ResponsePage from "./pages/ResponsePage";
import FormResponsesPage from "./pages/FormResponsesPage";
import PublicFormPage from "./pages/PublicFormPage";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/builder/:formId" element={<BuilderPage />} />
        <Route
          path="/forms/:formId/responses"
          element={<FormResponsesPage />}
        />
        <Route path="/responses/:responseId" element={<ResponsePage />} />
        <Route path="/forms/:formId" element={<PublicFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
