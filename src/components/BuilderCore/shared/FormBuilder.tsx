import { useState } from "react";
import type { FormMode } from "./types";
import FlowFormBuilder from "../Flow/FlowFormBuilder";
import SinglePageFormBuilder from "../Single/SinglePageFormBuilder";
import Button from "../../common/Button";

export default function FormBuilder() {
  const [mode, setMode] = useState<FormMode>("flow");

  return (
    <div className="h-screen flex flex-col relative">
      <div className="absolute top-3 right-80 z-10">
        <div className="flex items-center gap-2">
          <Button
            title="Single Page"
            onClick={() => setMode("single")}
            bgColor={
              mode === "single"
                ? "bg-indigo-500 hover:bg-indigo-600"
                : "bg-white border border-gray-300 hover:bg-gray-50"
            }
            textColor={mode === "single" ? "text-white" : "text-gray-700"}
          />
          <Button
            title="Flow"
            onClick={() => setMode("flow")}
            bgColor={
              mode === "flow"
                ? "bg-indigo-500 hover:bg-indigo-600"
                : "bg-white border border-gray-300 hover:bg-gray-50"
            }
            textColor={mode === "flow" ? "text-white" : "text-gray-700"}
          />
        </div>
      </div>

      <div className="flex-1 h-full">
        {mode === "flow" ? <FlowFormBuilder /> : <SinglePageFormBuilder />}
      </div>
    </div>
  );
}
