import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import InputField from "./InputField";
import { Icons } from "./icons";
import {
  linkGoogleSheet,
  createAndLinkGoogleSheet,
  unlinkGoogleSheet,
} from "../../services/api";

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  formId: number;
  initialSheetId?: string | null;
  initialSheetName?: string | null;
}

type Tab = "link" | "create";

export default function GoogleSheetsModal({
  isOpen,
  onClose,
  formId,
  initialSheetId,
  initialSheetName,
}: GoogleSheetsModalProps) {
  const [sheetId, setSheetId] = useState<string | null>(initialSheetId ?? null);
  const [sheetName, setSheetName] = useState<string | null>(
    initialSheetName ?? null,
  );

  const [activeTab, setActiveTab] = useState<Tab>("link");
  const [spreadsheetId, setSpreadsheetId] = useState("");

  const [sheetTitle, setSheetTitle] = useState("");
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(null);

  const [isLinking, setIsLinking] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUnlinking, setIsUnlinking] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const isLinked = !!sheetId;

  const handleLink = async () => {
    if (!spreadsheetId.trim()) {
      setError("Please enter a spreadsheet ID.");
      return;
    }
    setError(null);
    setIsLinking(true);
    try {
      const result = await linkGoogleSheet(formId, {
        spreadsheet_id: spreadsheetId.trim(),
      });
      setSheetId(result.google_sheet_id);
      setSheetName(result.google_sheet_name);
      setSpreadsheetId("");
    } catch (err: any) {
      setError(
        err?.response?.data?.error ??
          "Failed to link sheet. Make sure it is shared with the service account.",
      );
    } finally {
      setIsLinking(false);
    }
  };

  const handleCreate = async () => {
    setError(null);
    setIsCreating(true);
    try {
      const result = await createAndLinkGoogleSheet(formId, {
        title: sheetTitle.trim() || undefined,
      });
      setSheetId(result.form.google_sheet_id);
      setSheetName(result.form.google_sheet_name);
      setSpreadsheetUrl(result.spreadsheet_url);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ??
          "Failed to create sheet. Please try again.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleUnlink = async () => {
    if (!confirm("Unlink this Google Sheet? Existing data is kept.")) return;
    setError(null);
    setIsUnlinking(true);
    try {
      await unlinkGoogleSheet(formId);
      setSheetId(null);
      setSheetName(null);
      setSpreadsheetUrl(null);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "Failed to unlink sheet.");
    } finally {
      setIsUnlinking(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Google Sheets Integration">
      <div className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {isLinked ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 min-w-0">
                <Icons.Sheets />
                <span className="text-sm font-medium text-gray-800 truncate">
                  {sheetName}
                </span>
              </div>
              <a
                href={`https://docs.google.com/spreadsheets/d/${sheetId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                  bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
              >
                Open in Sheets
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <Button
                onClick={handleUnlink}
                disabled={isUnlinking}
                bgColor="bg-transparent"
                textColor="text-red-600 hover:text-red-800 hover:underline"
                title={isUnlinking ? "Unlinking…" : "Unlink Google Sheet"}
                className="p-0! text-sm h-auto"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex border-b border-gray-200">
              {(["link", "create"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setError(null);
                  }}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px
                    ${
                      activeTab === tab
                        ? "border-gray-900 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {tab === "link" ? "Link Existing" : "Create New"}
                </button>
              ))}
            </div>

            {activeTab === "link" ? (
              <div className="space-y-4">
                <InputField
                  title="Spreadsheet ID"
                  value={spreadsheetId}
                  onChange={(e) => setSpreadsheetId(e.target.value)}
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
                />
                <p className="-mt-1 text-xs text-gray-400">
                  Found in the sheet URL: …/spreadsheets/d/
                  <span className="font-mono">ID</span>/edit
                </p>

                <Button
                  onClick={handleLink}
                  disabled={isLinking}
                  title={isLinking ? "Linking…" : "Link Sheet"}
                  fullWidth
                />
              </div>
            ) : (
              <div className="space-y-4">
                <InputField
                  title="Sheet title (optional)"
                  value={sheetTitle}
                  onChange={(e) => setSheetTitle(e.target.value)}
                  placeholder="My Form – Responses"
                />
                <p className="-mt-1 text-xs text-gray-400">
                  Defaults to "Form Name – Responses"
                </p>

                {spreadsheetUrl && (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      ✓ Sheet created!
                    </p>
                    <a
                      href={spreadsheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-700 hover:text-gray-900 hover:underline break-all"
                    >
                      {spreadsheetUrl}
                    </a>
                  </div>
                )}
                <Button
                  onClick={handleCreate}
                  disabled={isCreating}
                  title={isCreating ? "Creating…" : "Create & Link Sheet"}
                  fullWidth
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
