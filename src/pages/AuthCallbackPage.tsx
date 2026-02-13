import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/slices/authSlice";
import type { AppDispatch } from "../store/store";
import { getCurrentUser } from "../services/api";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        const user = (response as any).user || response;
        dispatch(setAuth({ user }));
        navigate("/dashboard", { replace: true });
      } catch (err) {
        console.error("Failed to fetch user after OAuth:", err);
        setError("Authentication failed. Please try again.");
      }
    };

    fetchUser();
  }, [navigate, dispatch]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <a href="/login" className="text-gray-900 hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}
