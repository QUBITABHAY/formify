import { useState } from "react";
import type { FormMode } from "./types";
import FlowFormBuilder from "./FlowFormBuilder";
import SinglePageFormBuilder from "./SinglePageFormBuilder";

export default function FormBuilder() {
  const [mode, setMode] = useState<FormMode>("flow");

  return (
    <div className="h-screen flex flex-col relative">
      <div className="absolute top-3 right-80 z-10">
        <div className="flex items-center bg-gray-100 rounded-lg p-1 shadow-sm border border-gray-200">
          <button
            onClick={() => setMode("single")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              mode === "single"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Single Page
          </button>
          <button
            onClick={() => setMode("flow")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              mode === "flow"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Flow
          </button>
        </div>
      </div>

      <div className="flex-1 h-full">
        {mode === "flow" ? <FlowFormBuilder /> : <SinglePageFormBuilder />}
      </div>
    </div>
  );
}
