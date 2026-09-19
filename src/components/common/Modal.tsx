import React, { useEffect, useRef, useId } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog || e.target !== dialog) return;

    const rect = dialog.getBoundingClientRect();
    const isInside =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;

    if (!isInside) {
      onClose();
    }
  };

  const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
    e.preventDefault();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      aria-labelledby={title ? titleId : undefined}
      className="fixed inset-0 m-auto z-50 p-0 rounded-xl bg-transparent max-w-lg w-full max-h-[90vh] overflow-visible outline-none backdrop:bg-gray-900/50 backdrop:backdrop-blur-sm shadow-2xl"
    >
      <div className="relative bg-white rounded-xl shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden text-gray-900">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          {title && (
            <h3 id={titleId} className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-gray-400 hover:text-gray-500 transition-colors p-1.5 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </dialog>
  );
};

export default Modal;
