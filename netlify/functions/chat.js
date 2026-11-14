
const MODELS = [
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash"
];

const sleep = (ms) =>
  new Promise(resolve => setTimeout(resolve, ms));

async function askGemini(apiKey, model, message) {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await fetch(url, {
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
    });

    const data = await response.json();

    if (response.ok) {
      const answer = data.candidates?.[0]?.content?.parts
        ?.map(part => part.text || "")
        .join("");

      if (answer) return answer;

      throw new Error("The model returned an empty answer.");
    }

    if (response.status === 503 && attempt === 0) {
      await sleep(2000);
      continue;
    }

    const error = new Error(
      data.error?.message || "Gemini request failed."
    );

    error.status = response.status;
    throw error;
  }

  throw new Error("Model unavailable.");
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        error: "Method not allowed."
      })
    };
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing in Netlify.");
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

    let lastError;

    for (const model of MODELS) {
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

        // Do not hide authentication or request errors.
        if (
          error.status &&
          error.status !== 503 &&
          error.status !== 429
        ) {
          throw error;
        }
      }
    }

    return {
      statusCode: 503,
      body: JSON.stringify({
        error:
          "All available Gemini models are currently busy. Please try again shortly.",
        details: lastError?.message || "No model available."
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
      
