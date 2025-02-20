// import { error } from "console";

export async function getLanguageDetector() {
  try {
    if (!self.ai || !self.ai.languageDetector) {
      throw new error("AI Language Detector API is not available.");
    }
    const languageDetectorCapabilities =
      await self.ai.languageDetector.capabilities();
    const canDetect = languageDetectorCapabilities.available;
    let detector;
    if (canDetect === "no") {
      // The language detector isn't usable.
      throw new error("The API is supported but can not be used");
    }
    if (canDetect === "readily") {
      // The language detector can immediately be used.
      detector = await self.ai.languageDetector.create();
    } else {
      // The language detector can be used after model download.
      detector = await self.ai.languageDetector.create({
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
          });
        },
      });
      await detector.ready;
    }
    return detector;
  } catch (error) {
    console.log(error.message);
  }
}

export async function detectLanguage(text) {
  try {
    if (!text || typeof text !== "string") {
      throw new Error("input needed");
    }

    const detector = await getLanguageDetector();
    if (!detector) {
      throw new Error("Language Detector API is not available.");
    }

    const results = await detector.detect(text);
    if (!Array.isArray(results) || results.length === 0) {
      throw new Error("No language detected. Try entering a different text.");
    }

    // Sort results by confidence and get the top one
    const topResult = results.sort((a, b) => b.confidence - a.confidence)[0];

    const languageTagToHumanReadable = (languageTag, targetLanguage) => {
      const displayNames = new Intl.DisplayNames([targetLanguage], {
        type: "language",
      });
      return displayNames.of(languageTag);
    };

    return {
      language: {
        readable:
          languageTagToHumanReadable(topResult.detectedLanguage, "en") ||
          "Unknown",
        code: topResult.detectedLanguage,
      },
      confidence: topResult.confidence || 0,
    };
  } catch (error) {
    return { error: error.message };
  }
}
