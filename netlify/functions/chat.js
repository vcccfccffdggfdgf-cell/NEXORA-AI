
const sleep = ms =>
  new Promise(resolve => setTimeout(resolve, ms));

async function getAvailableModels(apiKey) {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models",
    {
      headers: {
        "x-goog-api-key": apiKey
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error?.message || "Could not list available models."
    );
  }

  return (data.models || [])
    .filter(model =>
      (model.supportedGenerationMethods || [])
        .includes("generateContent")
    )
    .map(model => model.name);
}

async function askGemini(apiKey, model, message) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: message }]
        }]
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.error?.message || "Gemini request failed."
    );
    error.status = response.status;
    throw error;
  }

  const answer = data.candidates?.[0]?.content?.parts
    ?.map(part => part.text || "")
    .join("");

  if (!answer) {
    throw new Error("Gemini returned an empty answer.");
  }

  return answer;
}

exports.handler = async event => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing in Netlify.");
    }

    // Diagnostic: list models available to this API key.
    if (event.httpMethod === "GET") {
      const models = await getAvailableModels(apiKey);

      return {
        statusCode: 200,
        body: JSON.stringify({ models }, null, 2)
      };
    }

    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({
          error: "Method not allowed."
        })
      };
    }

    const body = JSON.parse(event.body || "{}");
    const message = body.message;

    if (!message || typeof message !== "string") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Please enter a message."
        })
      };
    }

    const available = await getAvailableModels(apiKey);

    const preferred = [
      "models/gemini-3.8-flash",
      "models/gemini-3.7-flash",
      "models/gemini-3.6-flash"
    ];

    const models = [
      ...preferred.filter(name => available.includes(name)),
      ...available.filter(name => !preferred.includes(name))
    ].slice(0, 3);

    if (models.length === 0) {
      throw new Error(
        "No models supporting generateContent are available for this API key."
      );
    }

    let lastError;

    for (const model of models) {
      try {
        const answer = await askGemini(
          apiKey,
          model,
          message
        );

        return {
          statusCode: 200,
          body: JSON.stringify({
            answer,
            model
          })
        };

      } catch (error) {
        lastError = error;

        if (
          error.status !== 429 &&
          error.status !== 503
        ) {
          return {
            statusCode: error.status || 500,
            body: JSON.stringify({
              error: error.message,
              model
            })
          };
        }

        await sleep(1000);
      }
    }

    return {
      statusCode: lastError?.status || 503,
      body: JSON.stringify({
        error: lastError?.message || "All models failed.",
        modelsTried: models
      })
    };

  } catch (error) {
    return {
      statusCode: error.status || 500,
      body: JSON.stringify({
        error: error.message || "Internal server error."
      })
    };
  }
};
    
