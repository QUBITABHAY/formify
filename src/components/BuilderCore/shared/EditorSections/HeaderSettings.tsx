interface HeaderSettingsProps {
  formMetadata: { title: string; description: string; banner?: string };
  onUpdateMetadata: (updates: {
    title?: string;
    description?: string;
    banner?: string;
  }) => void;
}

export function HeaderSettings({
  formMetadata,
  onUpdateMetadata,
}: HeaderSettingsProps) {
  return (
    <div className="p-4 space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Form Title
        </label>
        <input
          type="text"
          value={formMetadata.title}
          onChange={(e) => onUpdateMetadata({ title: e.target.value })}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          rows={3}
          value={formMetadata.description}
          onChange={(e) => onUpdateMetadata({ description: e.target.value })}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Banner Image URL
        </label>
        <input
          type="text"
          value={formMetadata.banner}
          onChange={(e) => onUpdateMetadata({ banner: e.target.value })}
          className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none"
          placeholder="https://example.com/image.jpg"
        />
      </div>
    </div>
  );
}
