import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";
import logo from "../assets/logo.svg";
import { getGoogleAuthUrl } from "../services/api";
import { signupUser, clearError } from "../store/slices/authSlice";
import type { AppDispatch, RootState } from "../store/store";

function SignUpPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error: authError } = useSelector(
    (state: RootState) => state.auth,
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!name || !email || !password) {
      setValidationError("Please fill in all fields.");
      return;
    }

    try {
      await dispatch(signupUser({ name, email, password })).unwrap();
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Formify Logo" className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Formify
          </span>
        </Link>
      </nav>

      <div className="flex flex-1 items-center justify-center px-4 pb-20">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/60 border border-gray-100 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
                Create an account
              </h1>
              <p className="text-gray-500">
                Sign up to get started with your dashboard
              </p>
            </div>

            {(validationError || authError) && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
                {validationError || authError}
              </div>
            )}

            <form onSubmit={handleSignUp} className="flex flex-col gap-5">
              <InputField
                title="Full Name"
                type="text"
                name="name"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <InputField
                title="Email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputField
                title="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                type="submit"
                disabled={loading}
                title={loading ? "Signing up..." : "Sign up"}
                bgColor="bg-indigo-600 hover:bg-indigo-700"
                className="mt-2 py-3 shadow-lg shadow-indigo-200"
                fullWidth
              />

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => (window.location.href = getGoogleAuthUrl())}
                bgColor="bg-white hover:bg-gray-50"
                textColor="text-gray-700"
                className="py-3 border border-gray-200 gap-2 font-medium"
                fullWidth
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Sign up with Google
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
