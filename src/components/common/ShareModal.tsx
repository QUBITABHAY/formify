import Modal from "./Modal";
import Button from "./Button";
import { useState } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  formId: number;
}

export default function ShareModal({
  isOpen,
  onClose,
  formId,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/s/${formId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share your form">
      <div className="space-y-4">
        <p className="text-gray-600">
          Your form is now published! Share this link to start collecting
          responses.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
          />
          <Button
            title={copied ? "Copied!" : "Copy"}
            onClick={handleCopy}
            bgColor={copied ? "bg-green-600" : "bg-indigo-600"}
            textColor="text-white"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            onClick={() => window.open(shareUrl, "_blank")}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Open in new tab &rarr;
          </button>
        </div>
      </div>
    </Modal>
  );
}
