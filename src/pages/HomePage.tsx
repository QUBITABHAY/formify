import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Button from "../components/common/Button";
import logo from "../assets/logo.svg";
import Modal from "../components/common/Modal";
import Footer from "../components/common/Footer";
import { createForm, getGoogleAuthUrl } from "../services/api";
import { Icons } from "../components/common/icons";
import { logoutUser } from "../store/slices/authSlice";
import type { RootState, AppDispatch } from "../store/store";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  className = "",
  children,
}) => (
  <div
    className={`bg-white rounded-3xl p-8 border border-gray-200 hover:border-gray-900 shadow-sm relative overflow-hidden group transition-colors duration-300 ${className}`}
  >
    <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center mb-6 text-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
      {title}
    </h3>
    <p className="text-gray-600 font-medium text-sm leading-relaxed">
      {description}
    </p>
    {children}
  </div>
);

function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStartBuilding = useCallback(() => {
    if (!user?.id) {
      window.location.href = getGoogleAuthUrl();
      return;
    }
    setIsModalOpen(true);
  }, [user?.id]);

  const handleCreateForm = useCallback(
    async (type: "single" | "flow") => {
      if (!user?.id) {
        window.location.href = getGoogleAuthUrl();
        return;
      }
      try {
        setLoading(true);
        const newForm = await createForm({
          name: `My ${type === "single" ? "Single Page" : "Flow"} Form`,
          user_id: user.id,
          schema: { type },
        });
        navigate(`/builder/${newForm.id}`);
      } catch (error) {
        console.error("Failed to create form", error);
      } finally {
        setLoading(false);
        setIsModalOpen(false);
      }
    },
    [user?.id, navigate],
  );

  const handleLogout = useCallback(async () => {
    await dispatch(logoutUser());
    navigate("/");
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 relative">
      <div className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none opacity-60"></div>

      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Formify Logo" className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Formify
          </span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button
                title="Dashboard"
                onClick={() => navigate("/dashboard")}
                bgColor="bg-white hover:bg-gray-50"
                textColor="text-gray-700"
                className="border border-gray-200"
              />
              <Button
                title="Logout"
                onClick={handleLogout}
                bgColor="bg-gray-900 hover:bg-black"
                textColor="text-white"
              />
            </>
          ) : (
            <>
              <Button
                title="Get Started"
                onClick={() => (window.location.href = getGoogleAuthUrl())}
                bgColor="bg-gray-900 hover:bg-black"
                textColor="text-white"
              />
            </>
          )}
        </div>
      </nav>

      <main className="relative z-10 w-full">
        <section className="flex flex-col items-center justify-center text-center px-4 pt-20 pb-32 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
            Build forms that <span className="text-gray-500">convert</span>.
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Create beautiful, logic-driven forms with our intuitive
            drag-and-drop builder. Stop losing leads to ugly form experiences.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
            <Button
              title="Start Building Now"
              onClick={handleStartBuilding}
              bgColor="bg-gray-900 hover:bg-black shadow-lg shadow-gray-400/20"
              textColor="text-white px-8 py-3 text-lg"
            />
            <button
              className="px-6 py-3 rounded-lg text-gray-600 hover:text-gray-900 font-medium transition-colors"
              onClick={() => {
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Learn more &rarr;
            </button>
          </div>
        </section>

        <section
          id="features"
          className="px-6 pb-32 max-w-7xl mx-auto pt-24 mt-8"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Everything you need to capture leads.
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
              Powerful tools disguised as a simple interface. Build exactly what
              you need without wrestling with code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              title="Intuitive Drag & Drop"
              description="Create complex layouts in seconds. Add, reorder, and configure fields with a seamless interface designed for speed."
              icon={<Icons.CursorMove />}
              className="md:col-span-2 md:p-10 md:pb-0 min-h-[400px] flex flex-col justify-between"
            >
              <div className="w-full bg-gray-50/80 rounded-t-xl border border-gray-200 border-b-0 p-5 pt-6 shadow-inner relative transform translate-y-4 group-hover:translate-y-2 transition-transform duration-500">
                <div className="flex gap-4 opacity-90">
                  <div className="w-1/3 md:w-1/4 space-y-3">
                    <div className="h-10 bg-white border border-gray-200 rounded-lg flex items-center px-3 gap-3 shadow-sm transform scale-[1.02]">
                      <span className="w-4 h-4 rounded-full bg-gray-900"></span>
                      <div className="h-2.5 w-16 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-9 bg-white border border-gray-200 rounded-lg flex items-center px-3 gap-3">
                      <span className="w-3.5 h-3.5 rounded-sm bg-gray-300"></span>
                      <div className="h-2 w-20 bg-gray-100 rounded"></div>
                    </div>
                    <div className="h-9 bg-white border border-gray-200 rounded-lg flex items-center px-3 gap-3">
                      <span className="w-3.5 h-3.5 rounded-sm bg-gray-300"></span>
                      <div className="h-2 w-14 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                  <div className="flex-1 bg-white border border-gray-200 rounded-lg p-5 space-y-6 shadow-sm relative">
                    <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-t-lg"></div>
                    <div className="space-y-2 mt-2">
                      <div className="h-3 w-24 bg-gray-300 rounded mb-1"></div>
                      <div className="h-11 w-full bg-gray-50 border border-gray-200 rounded-md"></div>
                    </div>
                    <div className="space-y-2 opacity-60">
                      <div className="h-3 w-32 bg-gray-200 rounded mb-1"></div>
                      <div className="h-11 w-full bg-gray-50 border border-gray-200 rounded-md"></div>
                    </div>
                  </div>
                </div>
              </div>
            </FeatureCard>

            <div className="col-span-1 bg-gray-900 rounded-3xl p-8 md:p-10 border border-black shadow-lg text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-700">
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="w-12 h-12 bg-gray-800 rounded-xl border border-gray-700 flex items-center justify-center mb-6 text-white group-hover:bg-white group-hover:text-gray-900 transition-colors duration-300">
                <Icons.Logic />
              </div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight">
                Smart Logic
              </h3>
              <p className="text-gray-400 font-medium">
                Create dynamic journeys. Show or hide questions based on
                previous answers.
              </p>

              <div className="mt-8 space-y-3 relative z-10">
                <div className="bg-gray-800 border border-gray-700 py-3 px-4 rounded-xl text-sm text-gray-300 flex items-center gap-3">
                  <span className="text-[10px] bg-gray-700 px-2 py-0.5 rounded text-white font-mono font-bold tracking-wider">
                    IF
                  </span>
                  <div>
                    Role is{" "}
                    <strong className="text-white font-semibold">
                      Developer
                    </strong>
                  </div>
                </div>
                <div className="w-0.5 h-4 bg-gray-700 ml-7"></div>
                <div className="bg-gray-800 border-gray-600 border py-3 px-4 rounded-xl text-sm text-gray-100 flex items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.05)] transform group-hover:-translate-y-1 transition-transform duration-300">
                  <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded font-mono font-bold tracking-wider">
                    THEN
                  </span>
                  <div className="font-medium">Show Tech Stack</div>
                </div>
              </div>
            </div>

            <FeatureCard
              title="Conversational"
              description="Ask one question at a time. Ideal for high-converting lead generation and onboarding flows."
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              }
            />

            <FeatureCard
              title="Instant Sync"
              description="Automatically send responses directly to Google Sheets in real-time. Zero Zapier setup required."
              icon={<Icons.Sheets />}
              className="hover:border-green-500"
            />

            <FeatureCard
              title="Analytics Insights"
              description="Track views, submissions, and drop-off points to optimize your forms for maximum lead conversion."
              icon={<Icons.Chart />}
            />
          </div>
        </section>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Choose a starting point"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleCreateForm("single")}
            disabled={loading}
            className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-2xl hover:border-gray-900 hover:bg-gray-50 transition-all group disabled:opacity-50 text-center bg-white text-gray-900"
          >
            <div className="w-10 h-10 bg-white shadow-sm rounded-full border border-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg
                className="w-5 h-5 text-gray-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Single Page</h3>
            <p className="text-sm text-gray-500">
              Traditional vertical form layout
            </p>
          </button>

          <button
            onClick={() => handleCreateForm("flow")}
            disabled={loading}
            className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-2xl hover:border-gray-900 hover:bg-gray-50 transition-all group disabled:opacity-50 text-center bg-white text-gray-900"
          >
            <div className="w-10 h-10 bg-white shadow-sm rounded-full border border-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg
                className="w-5 h-5 text-gray-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Conversational Flow
            </h3>
            <p className="text-sm text-gray-500">One question at a time</p>
          </button>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}

export default HomePage;
