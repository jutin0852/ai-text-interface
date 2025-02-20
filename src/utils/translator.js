async function getTranslator(language) {
  const { selectedLanguage, detectedLanguage } = language;
  try {
    if (!self.ai && !self.ai.translator) {
      throw new error("translator not available");
    }
    // detect current language

    const translatorCapabilities = await self.ai.translator.capabilities();
    const canTranslate = translatorCapabilities.languagePairAvailable(
      detectedLanguage,
      selectedLanguage
    );
    let translator;
    if (canTranslate === "no") {
      // The language translator isn't usable.
      throw new error("The API is supported but can not be used");
    }
    if (canTranslate === "readily") {
      // The language translator can immediately be used.
      translator = await self.ai.translator.create({
        sourceLanguage: detectedLanguage,
        targetLanguage: selectedLanguage,
      });
    } else {
      // The language translator can be used after model download.
      translator = await self.ai.translator.create({
        sourceLanguage: "es",
        targetLanguage: "fr",
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
          });
        },
      });
      await translator.ready;
    }
    return translator;
  } catch (error) {
    console.log(error);
  }
}

export async function translateText(text, language) {
  try {
    if (
      !["en", "pt", "es", "ru", "tr", "fr"].includes(language.detectedLanguage)
    ) {
      throw new Error(
        "Only Translations from english , french ,Turkish , russian ,spanish and Portuguese are supported currently"
      );
    }
    if (language.detectedLanguage === language.selectedLanguage) {
      throw new Error(`Language is currently ${language.selectedLanguage}`);
    }
    const translator = await getTranslator(language);
    if (!translator) {
      throw new Error("Language translator API is not available.");
    }

    const results = await translator.translate(text);
    if (!results) {
      throw new Error("Could not translate");
    }

    return { translation: results };
  } catch (error) {
    return { error: error.message };
  }
}
