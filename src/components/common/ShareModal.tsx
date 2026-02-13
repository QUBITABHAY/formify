import Modal from "./Modal";
import Button from "./Button";
import { useState } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  shareUrl,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const fullShareUrl = `${window.location.origin}/forms/${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullShareUrl);
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
            value={fullShareUrl}
            className="flex-1 p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
          />
          <Button
            title={copied ? "Copied!" : "Copy"}
            onClick={handleCopy}
            bgColor={copied ? "bg-green-600" : "bg-gray-900"}
            textColor="text-white"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            onClick={() => window.open(fullShareUrl, "_blank")}
            className="text-gray-600 hover:text-black font-medium"
          >
            Open in new tab &rarr;
          </button>
        </div>
      </div>
    </Modal>
  );
}
