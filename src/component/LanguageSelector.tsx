import React from "react";

export default function LanguageSelector({
  selectedLanguage,
  setSelectedLanguage,
}: {
  selectedLanguage: string;
  setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>;
}) {
  const languages = [
    { name: "English", code: "en" },
    { name: "Portuguese", code: "pt" },
    { name: "Spanish", code: "es" },
    { name: "Russian", code: "ru" },
    { name: "Turkish", code: "tr" },
    { name: "French", code: "fr" },
  ];


  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <select
        value={selectedLanguage}
        onChange={handleSelect}
        className="px-4 py-2 border rounded-lg cursor-pointer"
      >
        <option value="">Select a language</option>
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name} ({lang.code})
          </option>
        ))}
      </select>
    </div>
  );
}
