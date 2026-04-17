import type { WelcomeScreenConfig, ThankYouScreenConfig } from "../types";

interface ScreenEditorProps {
  selectedScreen: "WELCOME" | "THANKYOU";
  welcomeScreen: WelcomeScreenConfig;
  onUpdateWelcome: (updates: Partial<WelcomeScreenConfig>) => void;
  thankYouScreen: ThankYouScreenConfig;
  onUpdateThankYou: (updates: Partial<ThankYouScreenConfig>) => void;
  isQuiz?: boolean;
}

export function ScreenEditor({
  selectedScreen,
  welcomeScreen,
  onUpdateWelcome,
  thankYouScreen,
  onUpdateThankYou,
  isQuiz = false,
}: ScreenEditorProps) {
  if (selectedScreen === "WELCOME") {
    return (
      <div className="p-4 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={welcomeScreen.title}
            onChange={(e) => onUpdateWelcome({ title: e.target.value })}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows={3}
            value={welcomeScreen.description}
            onChange={(e) => onUpdateWelcome({ description: e.target.value })}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Button Text
          </label>
          <input
            type="text"
            value={welcomeScreen.buttonText}
            onChange={(e) => onUpdateWelcome({ buttonText: e.target.value })}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {isQuiz ? "Result Title" : "Title"}
        </label>
        <input
          type="text"
          value={thankYouScreen.title}
          onChange={(e) => onUpdateThankYou({ title: e.target.value })}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {isQuiz ? "Result Description" : "Description"}
        </label>
        <textarea
          rows={3}
          value={thankYouScreen.description}
          onChange={(e) => onUpdateThankYou({ description: e.target.value })}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Emoji
        </label>
        <input
          type="text"
          value={thankYouScreen.emoji}
          onChange={(e) => onUpdateThankYou({ emoji: e.target.value })}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all text-2xl"
          placeholder="🎉"
        />
      </div>
    </div>
  );
}
