"use client";
import LanguageSelector from "@/component/LanguageSelector";
import { detectLanguage } from "@/utils/languageDetector";
import { translateText } from "@/utils/translator";
import { summarize } from "@/utils/summerizer";

import { useState } from "react";

interface DetectedLanguageType {
  language?: { readable: string; code: string };
  confidence?: string;
  error?: string;
}

interface translatedTextType {
  translation?: string;
  error?: string;
}
interface summaryTextType {
  summary?: string | undefined;
  error?: string;
}

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [detectedLanguage, setDetectedLanguage] =
    useState<DetectedLanguageType | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [translatedText, setTranslatedText] =
    useState<translatedTextType | null>(null);

  const [summaryText, setSummeryText] = useState<summaryTextType | null>(null);

  const handleDetectLanguage = async () => {
    const result = await detectLanguage(inputText);
    setDetectedLanguage(result);
  };

  const handleTranslateLanguage = async () => {
    const result = await translateText(inputText, {
      selectedLanguage,
      detectedLanguage: detectedLanguage?.language?.code,
    });
    setTranslatedText(result);
  };

  const handleSummerizer = async () => {
    const result = await summarize(inputText, detectedLanguage?.language?.code);
    setSummeryText(result);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <p>{inputText}</p>
      {detectedLanguage && (
        <p className="mt-2 text-lg text-black">
          {detectedLanguage.error ? (
            <span style={{ color: "red" }}>{detectedLanguage.error}</span>
          ) : (
            `Detected Language: ${detectedLanguage.language?.code} `
          )}
        </p>
      )}
      <LanguageSelector
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />
      <button
        className="mt-2 p-2 bg-blue-500 text-white rounded"
        onClick={handleTranslateLanguage}
      >
        Translate
      </button>
      <p>
        {translatedText?.error ? (
          <span>{translatedText?.error}</span>
        ) : (
          <span>{translatedText?.translation}</span>
        )}
      </p>
      <p>
        {summaryText?.error ? (
          <span>{summaryText?.error}</span>
        ) : (
          <span>{summaryText?.summary}</span>
        )}
      </p>
      <button
        className="mt-2 p-2 bg-blue-500 text-white rounded"
        onClick={handleSummerizer}
      >
        summerize
      </button>
      <textarea
        className="w-full p-2 border border-gray-300 rounded"
        rows={4}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text..."
      />
      <button
        className="mt-2 p-2 bg-blue-500 text-white rounded"
        onClick={handleDetectLanguage}
      >
        Detect Language
      </button>
    </div>
  );
}
