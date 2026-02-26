import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

const HomePage = lazy(() => import("./pages/HomePage"));
const AuthCallbackPage = lazy(() => import("./pages/AuthCallbackPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const BuilderPage = lazy(() => import("./pages/BuilderPage"));
const FormResponsesPage = lazy(() => import("./pages/FormResponsesPage"));
const ResponsePage = lazy(() => import("./pages/ResponsePage"));
const PublicFormPage = lazy(() => import("./pages/PublicFormPage"));

function App() {
  return (
    <BrowserRouter>
      <Suspense>
        <Routes>
          <Route path="/" element={<HomePage />} />
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
