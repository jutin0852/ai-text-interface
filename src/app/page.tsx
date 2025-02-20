"use client";
import LanguageSelector from "@/component/LanguageSelector";
import { detectLanguage } from "@/utils/languageDetector";
import { translateText } from "@/utils/translator";
import { summarize } from "@/utils/summerizer";

import { useState, useEffect, useRef } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/16/solid";

interface DetectedLanguageType {
  language?: { readable: string; code: string };
  confidence?: string;
  error?: string;
}

interface TranslatedTextType {
  translation?: string;
  error?: string;
}

interface SummaryTextType {
  summary?: string | undefined;
  error?: string;
}

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [detectedLanguage, setDetectedLanguage] =
    useState<DetectedLanguageType | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [translatedText, setTranslatedText] =
    useState<TranslatedTextType | null>(null);
  const [summaryText, setSummaryText] = useState<SummaryTextType | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const chatOutputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest content
  useEffect(() => {
    if (chatOutputRef.current) {
      chatOutputRef.current.scrollTop = chatOutputRef.current.scrollHeight;
    }
  }, [inputText, detectedLanguage, translatedText, summaryText]);

  const handleDetectLanguage = async () => {
    const result = await detectLanguage(inputText);
    setDetectedLanguage(result);
  };

  const handleTranslateLanguage = async () => {
    setIsTranslating(true);
    const result = await translateText(inputText, {
      selectedLanguage,
      detectedLanguage: detectedLanguage?.language?.code,
    });
    setTranslatedText(result);
    setIsTranslating(false);
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    const result = await summarize(inputText, detectedLanguage?.language?.code);
    setSummaryText(result);
    setIsSummarizing(false);
  };

  // Clear chat and reset all states
  const handleClearChat = () => {
    setInputText("");
    setDetectedLanguage(null);
    setTranslatedText(null);
    setSummaryText(null);
    setIsSummarizing(false);
    setIsTranslating(false);
  };

  // Check if input has 150 characters or more
  const characterCount = inputText.length;
  const isSummaryButtonVisible = characterCount >= 150;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      {/* Chat Output (Messages) */}
      <div className="flex-1 overflow-y-auto space-y-4" ref={chatOutputRef}>
        {/* Input Text */}
        {inputText && (
          <div className="flex justify-end">
            <div className="bg-blue-500 text-white p-3 rounded-lg max-w-[70%] shadow-md">
              <p className="text-sm">{inputText}</p>
            </div>
          </div>
        )}

        {/* Detected Language */}
        {detectedLanguage && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-lg max-w-[70%] shadow-md">
              <p className="text-sm">
                {detectedLanguage.error ? (
                  <span className="text-red-500">{detectedLanguage.error}</span>
                ) : (
                  `Detected Language: ${detectedLanguage.language?.code}`
                )}
              </p>
            </div>
          </div>
        )}

        {/* Translate Button and Dropdown (Below Detected Language) */}
        {detectedLanguage && !detectedLanguage.error && (
          <div className="flex justify-start gap-2">
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              aria-label="Select target language"
            />
            <button
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 shadow-md"
              onClick={handleTranslateLanguage}
              disabled={isTranslating}
              aria-label="Translate text"
            >
              {isTranslating ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                "Translate"
              )}
            </button>
          </div>
        )}

        {/* Translated Text */}
        {translatedText && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-lg max-w-[70%] shadow-md">
              <p className="text-sm">
                {translatedText.error ? (
                  <span className="text-red-500">{translatedText.error}</span>
                ) : (
                  translatedText.translation
                )}
              </p>
            </div>
          </div>
        )}

        {/* Summary Text */}
        {summaryText && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-lg max-w-[70%] shadow-md">
              <p className="text-sm">
                {summaryText.error ? (
                  <span className="text-red-500">{summaryText.error}</span>
                ) : (
                  summaryText.summary
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input and Actions */}
      <div className="mt-4 space-y-2">
        <textarea
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none shadow-sm"
          rows={2}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text..."
          aria-label="Enter text for translation and summarization"
        />

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Clear Chat Button */}
          <button
            className="flex-1 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 shadow-md"
            onClick={handleClearChat}
            aria-label="Clear chat"
          >
            Clear Chat
          </button>
          {/* Detect Language Button */}
          <button
            className="flex-1 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 shadow-md"
            onClick={handleDetectLanguage}
            aria-label="Detect language"
          >
            Detect language
            <PaperAirplaneIcon className="size-7 inline-block" />
          </button>
        </div>

        {/* Summarize Button (Conditional) */}
        {isSummaryButtonVisible &&
          detectedLanguage &&
          !detectedLanguage.error && (
            <button
              className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 shadow-md"
              onClick={handleSummarize}
              disabled={isSummarizing}
              aria-label="Summarize text"
            >
              {isSummarizing ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                "Summarize"
              )}
            </button>
          )}
      </div>
    </div>
  );
}
