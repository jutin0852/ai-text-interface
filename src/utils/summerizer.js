async function getSummerizer() {
  try {
    if (!self.ai && !self.ai.summerizer) {
      throw new error("summerizer not available");
    }
    const options = {
      sharedContext: "This is a scientific article",
      type: "key-points",
      format: "markdown",
      length: "short",
    };

    const available = (await self.ai.summarizer.capabilities()).available;
    let summarizer;
    if (available === "no") {
      throw new Error("The Summarizer API isnt usable.");
    }
    if (available === "readily") {
      // The Summarizer API can be used immediately .
      summarizer = await self.ai.summarizer.create(options);
    } else {
      // The Summarizer API can be used after the model is downloaded.
      summarizer = await self.ai.summarizer.create(options);
      summarizer.addEventListener("downloadprogress", (e) => {
        console.log(e.loaded, e.total);
      });
      await summarizer.ready;
    }
    return summarizer;
  } catch (error) {
    console.log(error.message);
  }
}

export async function summarize(text, language) {
  try {
    const getSummery = await getSummerizer();
    if (!getSummery) {
      throw new Error("Language summerizer API is not available");
    }
    if (language !== "en") {
      throw new Error("Only English text can be summarized.");
    }
    const summary = await getSummery.summarize(text, {
      context: "This article is intended to simplify.",
    });
    if (!summary) {
      throw new Error("Could not summerize");
    }
    return { summary };
  } catch (error) {
    return { error: error.message };
  }
}
