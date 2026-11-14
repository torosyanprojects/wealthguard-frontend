
const API_URL = "https://wealthguard-ai.onrender.com";

export async function analyzeFinances(financialData) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90000);

  try {
    const response = await fetch(`${API_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        financial_data: financialData
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(
        `Financial analysis failed (HTTP ${response.status}).`
      );
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        "The analysis timed out. Please try again."
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
